import Supplier from '../models/Supplier.js';



export async function getAllSuppliersService() {
  return Supplier.find();
} 


export async function createSupplierService(name, phone, email, address) {
  const isAvailable = await Supplier.findOne({name: name});
  if (isAvailable) {
    throw new Error("Supplier already exists");
  }
  const newSupplier = await Supplier.create({name: name, phone: phone, email: email, address: address});
  await newSupplier.save();
  return newSupplier;
}
export async function updateSupplierService(_id, newName, newPhone, newEmail, newAddress) {
  const isAvailable = await Supplier.findOne({name: newName});
  if (!isAvailable) {
    throw new Error("Supplier not found");
  }
  return Supplier.findByIdAndUpdate(
    _id,
    { name: newName, phone: newPhone, email: newEmail, address: newAddress },
    { new: true }
  );
}
export async function deleteSupplierService(_id) {
  return Supplier.findByIdAndDelete(_id);
}
export async function getSupplierByIdService(_id) {
  return Supplier.findById(_id);
}