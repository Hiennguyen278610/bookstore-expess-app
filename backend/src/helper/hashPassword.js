import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // round
export async function hashPassword(password){
    const salt = await bcrypt.genSalt(SALT_ROUNDS); // random string 10 ký tự để thêm vào password
    return bcrypt.hash(password, salt);
}
export async function comparePassword(password, hashedPassword){
    return bcrypt.compare(password, hashedPassword);
}