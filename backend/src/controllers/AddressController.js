import {
  createAddressService,
  deleteAddressByIdService,
  getAllAddressService,
  updateAddressService
} from '../services/AddressService.js';

export async function createAddress(req, res) {
  try {
    const address = await createAddressService(req.body, req.user.id);
    if (!address) {
      res.status(404).json({ message: 'Address not found' });
    }
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getAllAddress(req, res) {
  try {
    const address = await getAllAddressService(req.user.id);
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateAddress(req, res) {
  try {
    const address = await updateAddressService(req.params.id, req.body, req.user.id);
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteAddress(req, res) {
  try {
    const address = await deleteAddressByIdService(req.params.id, req.user.id);
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}