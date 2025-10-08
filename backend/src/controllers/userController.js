import { registerService, loginService } from '../services/AuthService.js';

export const getAll = (req, res) => {
  res.status(200).send("Đây là trang user");
};

export const getById = (req, res) => {
    res.status(200).send("Nhân viên 1");
};
export const registerUser = async (req, res) => {
  try {
    const { UserResponse, token } = await registerService(req.body);
    res.status(201).json({ UserResponse, token });
  } catch (err) {
    res.status(err.statusCode || 400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { UserResponse, token } = await loginService(username, password);
    console.log("User logged in:", UserResponse);
    res.status(200).json({ UserResponse, token });
  } catch (err) {
    res.status(err.statusCode || 401).json({ message: err.message });
  }
};
