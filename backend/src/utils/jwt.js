import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

export function generateToken(UserResponse) {
  return jwt.sign(
    {
      username: UserResponse.username,
      role: UserResponse.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return null;
  }
}
export function generateEmailVerificationToken(user){
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      type: "email_verification"
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
export function generatePasswordResetToken(user){
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      type: "password_reset"
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}
export function verifyEmailToken(token){
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== "email_verification"){
      return null
    }
    return decoded;
  }catch (err){
    console.log("Email token verification failed: " + err.message);
    return null
  }
}

export function verifyPasswordResetToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return null;
    }
    return decoded;
  } catch (err) {
    console.error('Password reset token verification failed:', err.message);
    return null;
  }
}