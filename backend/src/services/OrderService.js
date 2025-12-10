import Order from "../models/Order.js";
import OrderDetail from "../models/OrderDetail.js";
import Book from "../models/Book.js";
import mongoose from "mongoose";

//CREATE
export async function createOrderService(customerId, paymentMethod, details, receiverName, receiverPhone, receiverAddress) {
  const order = await Order.create({
    customerId: customerId,
    paymentMethod: paymentMethod,
    receiverName: receiverName,
    receiverPhone: receiverPhone,
    receiverAddress: receiverAddress,
  });
  if (details && details.length > 0) {
    await Promise.all(
      details.map(async (item) => {
        const book = await Book.findById(item.bookId);
        if (!book) {
          throw new Error(`Book with id ${item.bookId} not found`);
        }
        if (item.quantity <= 0) {
          throw new Error("Quantity > 0");
        }
        if (book.quantity < item.quantity) {
          throw new Error("Out of stock");
        }
        return await OrderDetail.create({
          orderId: order._id,
          bookId: book._id,
          quantity: item.quantity,
          price: book.price,
        });
      })
    );
  }
  const populatedOrders = await Order.findById(order._id)
    .populate("customerId", "fullName email")
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: order._id });
  return populatedOrders;
}

// DELETE - DELETE order
export async function deleteOrderService(orderId, customerId) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if (order.customerId.toString() === customerId.toString()) {
    throw new Error(`You are not authorize to delete this order`);
  }
  await OrderDetail.deleteMany({ orderId: order._id });
  await Order.findByIdAndDelete(order._id);
  return order;
}

export async function updateOrderService(
  orderId,
  customerId,
  purchaseStatus,
  paymentStatus
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      throw new Error(`Không tìm thấy đơn hàng với ID ${orderId}`);
    }

    const oldStatus = order.purchaseStatus;

    // 3. Xử lý thay đổi purchaseStatus
    if (purchaseStatus && purchaseStatus !== oldStatus) {
      // Validate status transition
      const validTransitions = {
        pending: ["processing", "canceled"],
        processing: ["delivery", "canceled"],
        delivery: ["completed", "canceled"],
        completed: [],
        canceled: [],
      };

      if (!validTransitions[oldStatus]?.includes(purchaseStatus)) {
        throw new Error(
          `Không thể chuyển từ "${oldStatus}" sang "${purchaseStatus}"`
        );
      }

      // Handle inventory
      const details = await OrderDetail.find({ orderId }).session(session);

      if (oldStatus === "pending" && purchaseStatus === "processing") {
        // Giảm inventory
        for (const item of details) {
          const book = await Book.findById(item.bookId).session(session);
          if (book.quantity < item.quantity) {
            throw new Error(`Sách "${book.name}" không đủ hàng`);
          }
          book.quantity -= item.quantity;
          await book.save({ session });
        }
      } else if (oldStatus === "processing" && purchaseStatus === "canceled") {
        // Tăng inventory
        for (const item of details) {
          const book = await Book.findById(item.bookId).session(session);
          book.quantity += item.quantity;
          await book.save({ session });
        }
      }

      order.purchaseStatus = purchaseStatus;
    }

    // 4. Xử lý thay đổi paymentStatus
    if (paymentStatus && paymentStatus !== order.paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    // 5. Lưu order
    await order.save({ session });

    // 6. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 7. Trả về kết quả
    const updatedOrder = await Order.findById(orderId).populate(
      "customerId",
      "fullName email"
    );

    return {
      success: true,
      message: "Cập nhật thành công",
      data: updatedOrder,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

// GET - Get order detail by order id
export async function getOrderDetailByIdService(orderId) {
  try {
    const order = await Order.findById(orderId)
      .populate("customerId", "fullName email")
      .populate({
        path: "details",
        populate: {
          path: "bookId",
          select: "name imageUrl"
        }
      })
      .lean();

    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }

    // Format lại dữ liệu
    const result = {
      ...order,
      _id: order._id.toString(),
      customerId: order.customerId?._id.toString(),
      receiverName: order.receiverName,
      receiverPhone: order.receiverPhone,
      receiverAddress: order.receiverAddress,
      details: order.details?.map(detail => ({
        ...detail,
        _id: detail._id.toString(),
        bookId: detail.bookId?._id.toString(),
        bookName: detail.bookId?.name,
        bookImage: detail.bookId?.imageUrl?.[0],
        quantity: detail.quantity,
        price: detail.price,
        total: detail.price * detail.quantity
      })) || []
    };

    return result;
  } catch (error) {
    console.error("Error in getOrderDetailByIdService:", error);
    throw error;
  }
}

//GET - GET orders by customer id
export async function getAllOrdersByCustomerIdService(customerId, query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const status = query.paymentStatus || "";
  const skip = (page - 1) * limit;

  const filter = {customerId: customerId};

  if (status && status !== "ALL" && status !== "") {
    filter.paymentStatus = status.toLowerCase();
  }

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("customerId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments({ customerId: customerId }),
  ]);

  return {
    data: orders,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit: limit,
    },
  };
}

// GET - GET all orders
export async function getAllOrdersService(query) {
  // 1. Lấy tham số phân trang
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  // 2. Tạo bộ lọc (Filter)
  const filter = {};

  // Lọc theo trạng thái đơn hàng (VD: ?purchaseStatus=pending)
  if (query.purchaseStatus) {
    filter.purchaseStatus = query.purchaseStatus;
  }

  // Lọc theo ID khách hàng (dành cho Admin muốn xem đơn của 1 người cụ thể)
  if (query.customerId) {
    filter.customerId = query.customerId;
  }

  // Lọc theo phương thức thanh toán
  if (query.paymentMethod) {
    filter.paymentMethod = query.paymentMethod;
  }

  const startDate = query.startDate;
  const endDate = query.endDate;

  if (startDate || endDate) {
    filter.purchaseDate = {};

    if (startDate) {
      // Start of day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter.purchaseDate.$gte = start;
    }

    if (endDate) {
      // End of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.purchaseDate.$lte = end;
    }
  }

  const skip = (page - 1) * limit;

  // 3. Chạy song song: Lấy danh sách Order và Đếm tổng
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("customerId", "fullName email phone") // Lấy thông tin khách hàng
      .sort({ createdAt: -1 }) // Sắp xếp đơn mới nhất lên đầu
      .skip(skip)
      .limit(limit)
      .lean(), // Chuyển sang object thường để gắn details
    Order.countDocuments(filter),
  ]);

  // 4. Trả về kết quả
  return {
    data: orders,
    pagination: {
      totalOrders: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit: limit,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
}

//==========================================================================

// GET - GET order by status & customer ID
export async function getOrderByStatusAndCustomerId(
  customerId,
  purchaseStatus
) {
  const orders = await Order.find({
    customerId: customerId,
    purchaseStatus: purchaseStatus,
  })
    .populate("customerId", "fullName email")
    .sort({ createdAt: -1 })
    .lean();
  const ordersWithDetails = await Promise.all(
    orders.map(async (order) => {
      const details = await OrderDetail.find({ orderId: order._id });
      return { ...order, details };
    })
  );

  return ordersWithDetails;
}
