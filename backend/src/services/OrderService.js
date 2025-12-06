import Order from '../models/Order.js';
import OrderDetail from '../models/OrderDetail.js';
import Book from '../models/Book.js';

export async function createOrderService(customerId, paymentMethod, details) {
  const order = await Order.create({
    customerId: customerId,
    paymentMethod: paymentMethod
  });
  if (details && details.length > 0) {
    await Promise.all(
      details.map(async item => {
          const book = await Book.findById(item.bookId);
          if (!book) {
            throw new Error(`Book with id ${item.bookId} not found`);
          }
          if (item.quantity <= 0){
            throw new Error("Quantity > 0")
          }
          if(book.quantity < item.quantity ){
            throw new Error("Out of stock")
          }
          return await OrderDetail.create({
            orderId: order._id,
            bookId: book._id,
            quantity: item.quantity,
            price: book.price
          });
        }
      )
    );
  }
  const populatedOrders = await Order.findById(order._id)
    .populate('customerId', 'fullName email')
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: order._id });
  return populatedOrders;
}

export async function updateOrderService(orderId, customerId, paymentMethod, purchaseStatus, purchaseDate, details) {
  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      customerId: customerId,
      paymentMethod: paymentMethod,
      purchaseStatus: purchaseStatus,
      purchaseDate: purchaseDate
    },
    { new: true }
  );
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if(Array.isArray(details)) {
    await OrderDetail.deleteMany({ orderId: order._id });
    // xu ly quantity theo paymentStatus ==> co ham duoi sua roi luoi vai l
    if (details.length > 0) {
      const newDetails = []
      for (const item of details) {
        const book = await Book.findById(item.bookId);
        if (!book) {
          throw new Error(`Book with id ${item.bookId} not found`);
        }
        newDetails.push({
          orderId: order._id,
          bookId: book._id,
          quantity: item.quantity,
          price: book.price
        })
      }
      await OrderDetail.insertMany(newDetails);
    }
  }
  const populatedOrders = await Order.findById(order._id)
    .populate('customerId', 'fullName email')
    .lean();
  populatedOrders.details = await OrderDetail.find({ orderId: order._id });
  return populatedOrders;
}

export async function getAllOrdersByCustomerId(customerId) {
  // Lấy danh sách order (Mảng)
  const orders = await Order.find({ customerId: customerId })
    .populate('customerId', 'fullName email')
    .sort({ createdAt: -1 }) // Nên sort ngày mới nhất
    .lean();

  // Phải dùng Promise.all và map để lấy detail cho TỪNG order
  const ordersWithDetails = await Promise.all(orders.map(async (order) => {
    const details = await OrderDetail.find({ orderId: order._id });
    return { ...order, details };
  }));

  return ordersWithDetails;
}

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

export async function getOrderByIdService(orderId) {
  const order = await Order.findById(orderId)
    .populate('customerId', 'fullName email')
    .lean()
  if (!order){
    throw new Error(`Order with id ${orderId} not found`);
  }
  order.details = await OrderDetail.find({ orderId: order._id });
  return order;
}

export async function updatePurchaseStatusService(orderId,customerId, purchaseStatus) {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order with id ${orderId} not found`);
  }
  if (order.customerId.toString() !== customerId.toString()) {
    throw new Error(`You are not authorize to delete this order`);
  }
  if (order.purchaseStatus.toString() === "pending" && purchaseStatus.toString() === "processing"){
    const orderDetail = await OrderDetail.find({orderId: order._id});
    if (orderDetail.length === 0){
      throw new Error(`Order details not found`);
    }
    for (const item of orderDetail) {
      const book = await Book.findById(item.bookId);
      book.quantity -= item.quantity
      await book.save()
    }
  }
  if (order.purchaseStatus.toString() === "processing" && purchaseStatus.toString() === "canceled"){
    const orderDetail = await OrderDetail.find({orderId: order._id});
    if(orderDetail.length === 0){
      throw new Error(`Order details not found`);
    }
    for (const item of orderDetail) {
      const book = await Book.findById(item.bookId);
      book.quantity += item.quantity
      await book.save()
    }
  }
  order.purchaseStatus = purchaseStatus;
  await order.save();
  return order;
}
export async function getOrderByStatusAndCustomerId(customerId, purchaseStatus) {
  const orders = await Order.find({customerId: customerId, purchaseStatus: purchaseStatus})
    .populate('customerId', 'fullName email')
    .sort({ createdAt: -1 })
    .lean();
  const ordersWithDetails = await Promise.all(orders.map(async (order) => {
    const details = await OrderDetail.find({ orderId: order._id });
    return { ...order, details };
  }));

  return ordersWithDetails;
}

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

  const skip = (page - 1) * limit;

  // 3. Chạy song song: Lấy danh sách Order và Đếm tổng
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('customerId', 'fullName email phone') // Lấy thông tin khách hàng
      .sort({ createdAt: -1 }) // Sắp xếp đơn mới nhất lên đầu
      .skip(skip)
      .limit(limit)
      .lean(), // Chuyển sang object thường để gắn details
    Order.countDocuments(filter)
  ]);

  // 4. Lấy chi tiết (OrderDetail) cho từng đơn hàng
  // Vì orders là một mảng, ta phải map qua từng cái để lấy detail tương ứng
  const ordersWithDetails = await Promise.all(orders.map(async (order) => {
    const details = await OrderDetail.find({ orderId: order._id })
      .populate('bookId', 'name price imageUrl'); // (Optional) Lấy luôn tên sách để hiển thị cho tiện

    return {
      ...order,
      details: details
    };
  }));

  // 5. Trả về kết quả
  return {
    data: ordersWithDetails,
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit: limit
    }
  };
}