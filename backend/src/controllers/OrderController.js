import {
  createOrderService,
  deleteOrderService,
  getAllOrdersByCustomerIdService,
  updateOrderService,
} from "../services/OrderService.js";
import { getAllOrdersService } from "../services/OrderService.js";


//Get orders by customerId
export async function getOrdersByCustomerId(req, res) {
  try {
    const order = await getAllOrdersByCustomerIdService(req.user.id, req.query);
    if (!order) {
      return res.status(400).send({ message: "Error getting all orders" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Get all orders ( ADMIN )
export const getAllOrders = async (req, res) => {
  try {
    // req.query chứa: page, limit, purchaseStatus, customerId...
    const result = await getAllOrdersService(req.query);

    res.status(200).json({
      message: "Get all orders successfully",
      data: result.data,
      pagination: result.pagination,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Order Details by order Id
export async function getOrderDetailById(req, res) {
  try {
    const order = getOrderByIdService(req.params.id);
    if (!order) {
      return res.status(400).send({ message: "Error deleting order" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

//Create order(customer purchase)
export async function createOrder(req, res) {
  try {
    const { details, paymentMethod } = req.body;
    const order = await createOrderService(req.user.id, paymentMethod, details);
    if (!order) {
      return res.status(400).send({ message: "Error creating Order" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

//Update Order Status ( ADMIN )
export async function updateOrder(req, res) {
  try {
    const { purchaseStatus, paymentStatus } = req.body;
    const order = await updateOrderService(
      req.params.id,
      req.user.id,
      purchaseStatus,
      paymentStatus,
    );
    console.log(order);
    if (!order) {
      return res.status(400).send({ message: "Error updating order" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// Delete Order (ADMIN)  -- ko cần lắm
export async function deleteOrder(req, res) {
  try {
    const order = await deleteOrderService(req.params.id, req.user.id);
    if (!order) {
      return res.status(400).send({ message: "Error deleting order" });
    }
    return res.status(200).json(order);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
}

// export async function updateStatus(req, res) {
//   try {
//     const { purchaseStatus } = req.body;
//     const order = await updatePurchaseStatusService(
//       req.params.id,
//       req.user.id,
//       purchaseStatus
//     );
//     if (!order) {
//       return res.status(400).send({ message: "Update Purchase Status Failed" });
//     }
//     return res.status(200).json(order);
//   } catch (err) {
//     res.status(400).send({ message: err.message });
//   }
// }

// export async function getOrdersByStatus(req, res) {
//   try {
//     const { purchaseStatus } = req.body;
//     const order = await getOrderByStatusAndCustomerId(
//       req.user.id,
//       purchaseStatus
//     );
//     if (!order) {
//       return res.status(400).send({ message: "Get Order By Status Failed" });
//     }
//     return res.status(200).json(order);
//   } catch (err) {
//     res.status(400).send({ message: err.message });
//   }
// }

//[ lum cai id xong tim order xem cai status do co dang delivery khong thi khong cho cancel
// export async function cancelOrder(req, res) {
//   try {
//     const {purchaseStatus} = req.body;
//     if (purchaseStatus.toString() === "delivery") {
//       return res.status(400).send({message: 'Cannot cancel Order, Delivering'});
//     }
//     const order = await updatePurchaseStatusService(req.params.id, req.user.id, purchaseStatus);
//     if (!order) {
//       return res.status(400).send({message: 'Update Purchase Status Failed'});
//     }
//     return res.status(200).json(order);
//   }catch (err){
//     res.status(400).send({message: err.message});
//   }
// }
