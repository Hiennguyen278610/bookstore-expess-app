import { hashPassword } from '../helper/hashPassword.js';
import User from '../models/User.js';
export async function seedAdmin(){
  const username = "admin";
  const password = await hashPassword("admin36");
  const email = process.env.MAIL_ADMIN;
  const phone = "0329997881";
  const existingAdmin = await User.findOne({ username: username });
  if (existingAdmin) {
    return;
  }
  const admin = await User.create({
    fullName: "admin",
    username: username,
    password: password,
    email: email,
    phone: phone,
    role: 'admin',
    isVerified: true
  })
}