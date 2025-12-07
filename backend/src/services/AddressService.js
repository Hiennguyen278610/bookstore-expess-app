import Address from '../models/Address.js';

export async function createAddressService(data, userId){
  if(data.isDefault){
    await Address.updateMany({userId: userId}, {isDefault: false})
  }
  return await Address.create({...data, userId: userId})
}

export async function getAllAddressService(userId){
  return Address.find({userId: userId})
}

export async function updateAddressService(id, data, userId){
  const address = await Address.findById(id)
  if(!address){
    throw new Error("Address not found")
  }
  if (address.userId.toString() !== userId.toString()){
    throw new Error("Unauthorized")
  }
  if (data.isDefault) {
    await Address.updateMany(
      { userId, _id: { $ne: id } },
      { isDefault: false }
    )
  }
  return Address.findByIdAndUpdate(id, data, {new: true})
}

export async function deleteAddressByIdService(id, userId){
  const address = await Address.findById(id)
  if(!address){
    throw new Error("Address not found")
  }
  if (address.userId.toString() !== userId.toString()){
    throw new Error("Unauthorized")
  }
  return Address.deleteOne({ _id: id})
}