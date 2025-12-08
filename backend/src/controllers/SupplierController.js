import {
  createPublisherService,
  deletePublisherService, getPublisherByIdService,
  updatePublisherService,
  
} from '../services/PublisherService.js';
import {
  createSupplierService,
  deleteSupplierService,
  getSupplierByIdService,
  updateSupplierService,
  getAllSuppliersService
} from '../services/SupplierService.js';
import supplier from '../models/Supplier.js';


export async function getAllSuppliers(req, res) {
  try {
    const suppliers = await getAllSuppliersService();

    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}




export async function createSupplier(req, res) {
  try {
    const {name, phone, email, address} = req.body;
    const supplier = await createSupplierService(name, phone, email, address);
    if (!supplier) {
      res.status(404).json({message:"Supplier not found"})
    }
    res.status(201).json(supplier);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function updateSupplier(req, res) {
  try {
    const {name, phone, email, address} = req.body;
    const supplier = await updateSupplierService(req.params.id, name, phone, email, address);
    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
    }
    res.status(201).json(supplier);
  }catch (err) {
    res.status(400).json({ message: err.message });
  }
}
export async function deleteSupplier(req, res) {
  try {
    const supplier = await deleteSupplierService(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
    }
    res.status(201).json(supplier);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}
export async function getSupplierById(req, res) {
  try {
    const supplier = await getSupplierByIdService(req.params.id);
    if (!supplier) {
      res.status(404).json({ message: "Supplier not found" });
    }
    res.status(200).json(supplier);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
}