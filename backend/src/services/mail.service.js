import { mailTransporter } from '../config/mail.config.js';
import {
  buildPasswordResetEmail,
  buildPasswordResetSuccessEmail,
  buildVerificationEmail
} from '../utils/MailTemplate.js';
export async function sendMail(to, subject, html){
  const mailOptions = {
    from: `"Book Store" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html
  }
  await mailTransporter.sendMail(mailOptions)
  console.log(`Email send to ${to}`);
}
export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const mailContent = buildVerificationEmail(user, verificationToken);
    return await sendMail(user.email, mailContent.subject, mailContent.html);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
};
export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const mailContent = buildPasswordResetEmail(user, resetToken);
    return await sendMail(user.email, mailContent.subject, mailContent.html);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};
export const sendPasswordResetSuccessEmail = async (user) => {
  try {
    const mailContent = buildPasswordResetSuccessEmail(user);
    return await sendMail(user.email, mailContent.subject, mailContent.html);
  } catch (error) {
    console.error('Failed to send password reset success email:', error);
    throw error;
  }
};