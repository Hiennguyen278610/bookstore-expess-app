import User from '../models/User.js';
import {
  createSupplyReceiptService, deleteReceiptService,
  getAllReceiptsByAdminId, getReceiptByIdService,
  updateSupplyReceiptService, updatePurchaseStatusService
} from '../services/ReceiptService.js';

export async function createReceipt(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {details, supplierId, } = req.body;
    const receipt = await createSupplyReceiptService(user._id, supplierId, details);
    if (!receipt) {
      return res.status(400).send({message: 'Error creating Suplly Receipt'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function getAllReceipts(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const receipt = await getAllReceiptsByAdminId(user._id);
    if (!receipt) {
      return res.status(400).send({message: 'Error getting all receipts'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function updateReceipt(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {supplierId,paymentStatus, supplyDate, details} = req.body;
    const receipt = await updateSupplyReceiptService(req.params.id, user._id, supplierId,paymentStatus, supplyDate, details);
    if (!receipt) {
      return res.status(400).send({message: 'Error updating receipt'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function deleteReceipt(req, res) {
  try {
    const receipt = await deleteReceiptService(req.params.id);
    if (!receipt) {
      return res.status(400).send({message: 'Error deleting receipt'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function getReceiptById(req, res) {
  try {
    const receipt = getReceiptByIdService(req.params.id);
    if (!receipt) {
      return res.status(400).send({message: 'Error deleting receipt'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}
export async function updateStatus(req, res) {
  try {
    const dataUser = req.user;
    const user = await User.findOne({ username: dataUser.username });
    const {purchaseStatus} = req.body;
    const receipt = await updatePurchaseStatusService(req.params.id, user._id, purchaseStatus);
    if (!receipt) {
      return res.status(400).send({message: 'Update Purchase Status Failed'});
    }
    return res.status(200).json(receipt);
  }catch (err){
    res.status(400).send({message: err.message});
  }
}