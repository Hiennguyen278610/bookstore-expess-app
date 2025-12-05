import Order from '../models/Order.js';
import Book from '../models/Book.js';
import SupplyReceipt from '../models/SupplyReceipt.js';
import SupplyDetail from '../models/SupplyDetail.js';

export async function createSupplyReceiptService(adminId, supplierId, details) {
  const receipt = await SupplyReceipt.create({
    adminId: adminId,
    supplierId: supplierId
  });
  if (details && details.length > 0) {
    await Promise.all(
      details.map(async item => {
          const book = await Book.findById(item.bookId);
          if (!book) {
            throw new Error(`Book with id ${item.bookId} not found`);
          }
          if (item.quantity <= 0) {
            throw new Error('Quantity > 0');
          }
          if (book.quantity < item.quantity) {
            throw new Error('Out of stock');
          }
          return await SupplyDetail.create({
            receiptId: receipt._id,
            bookId: book._id,
            quantity: item.quantity,
            importPrice: book.price
          });
        }
      )
    );
  }
  const populatedReceipt = await SupplyReceipt.findById(receipt._id)
    .populate('adminId', 'fullName email')
    .populate('supplierId', 'name phone')
    .lean();
  populatedReceipt.details = await SupplyDetail.find({ receiptId: receipt._id });
  return populatedReceipt;
}

export async function updateSupplyReceiptService(receiptId, adminId, supplierId, purchaseStatus, supplyDate, details) {
  const receipt = await SupplyReceipt.findByIdAndUpdate(
    receiptId,
    {
      adminId: adminId,
      supplierId: supplierId,
      purchaseStatus: purchaseStatus,
      supplyDate: supplyDate
    },
    { new: true }
  );
  if (!receipt) {
    throw new Error(`Supply Receipt with id ${receiptId} not found`);
  }
  if (Array.isArray(details)) {
    await SupplyDetail.deleteMany({ receiptId: receipt._id });
    // xu ly quantity theo paymentStatus ==> co ham duoi sua roi luoi vai l
    if (details.length > 0) {
      const newDetails = [];
      for (const item of details) {
        const book = await Book.findById(item.bookId);
        if (!book) {
          throw new Error(`Book with id ${item.bookId} not found`);
        }
        newDetails.push({
          receiptId: receipt._id,
          bookId: book._id,
          quantity: item.quantity,
          importPrice: book.price
        });
      }
      await SupplyDetail.insertMany(newDetails);
    }
  }
  const populatedReceipt = await SupplyReceipt.findById(receipt._id)
    .populate('adminId', 'fullName email')
    .populate('supplierId', 'name phone')
    .lean();
  populatedReceipt.details = await SupplyDetail.find({ receiptId: receipt._id });
  return populatedReceipt;
}

export async function getAllReceiptsByAdminId(adminId) {
  const populatedReceipt = await Order.find({ adminId: adminId })
    .populate('adminId', 'fullName email')
    .populate('supplierId', 'name phone')
    .lean();
  populatedReceipt.details = await SupplyDetail.find({ orderId: populatedReceipt._id });
  return populatedReceipt;
}

export async function deleteReceiptService(receiptId) {
  const receipt = await SupplyReceipt.findById(receiptId);
  if (!receipt) {
    throw new Error(`Supply Receipt with id ${receiptId} not found`);
  }
  await SupplyDetail.deleteMany({ receiptId: receipt._id });
  await SupplyReceipt.findByIdAndDelete(receipt._id);
  return receipt;
}

export async function getReceiptByIdService(receiptId) {
  const receipt = await Order.findById(receiptId)
    .populate('customerId', 'fullName email')
    .populate('supplierId', 'name phone')
    .lean();
  if (!receipt) {
    throw new Error(`Supply Receipt with id ${receiptId} not found`);
  }
  receipt.details = await SupplyDetail.find({ orderId: receipt._id });
  return receipt;
}

export async function updatePurchaseStatusService(receiptId, adminId, purchaseStatus) {
  const receipt = await SupplyReceipt.findById(receiptId);
  if (!receipt) {
    throw new Error(`Supply Receipt with id ${receiptId} not found`);
  }
  if (receipt.purchaseStatus.toString() === 'processing' && purchaseStatus.toString() === 'pending') {
    throw new Error("Can't change purchase status");
  }
  if (receipt.purchaseStatus.toString() === 'delivery' && (purchaseStatus.toString() === 'processing' || purchaseStatus.toString() === 'pending')) {
    throw new Error("Can't change purchase status");
  }
  if (receipt.purchaseStatus.toString() !== 'canceled' && purchaseStatus.toString() === 'completed') {
    const supplyDetails = await SupplyDetail.find({ receiptId: receipt._id });
    if (supplyDetails.length === 0) {
      throw new Error(`Supply details not found`);
    }
    for (const item of supplyDetails) {
      const book = await Book.findById(item.bookId);
      book.quantity += item.quantity;
      await book.save();
    }
  }
  receipt.purchaseStatus = purchaseStatus;
  await receipt.save();
  return receipt;
}