import {
  createUserService,
  deleteUserService, getAllUsersService,
  getUserByIdService,
  updateUserService
} from '../services/UserService.js';

export async function createUser(req, res) {
  try {
    const result = await createUserService(req.body)
    res.status(201).json({
      success: true,
      message: 'Create User successful',
      data: result
    });
    } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
export async function updateUser(req, res) {
  try {
    const result = await updateUserService(req.params.id,req.body,req.user.id)
    res.status(200).json({
      success: true,
      message: 'Update User successful',
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
export async function deleteUser(req, res) {
  try {
    const result = await deleteUserService(req.params.id, req.user.id)
    res.status(200).json({
      success: true,
      message: 'Delete User successful',
      data: result
    });
  }catch (err){
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
export async function getUserById(req, res) {
  try {
    const result = await getUserByIdService(req.params.id)
    res.status(200).json({
      success: true,
      message: 'Get User successful',
      data: result
    });
  }catch (err){
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}
export async function getAllUsers(req, res) {
  try {
    const result = await getAllUsersService()
    res.status(200).json({
      success: true,
      message: 'Get All User successful',
      data: result
    });
  }catch (err){
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
}