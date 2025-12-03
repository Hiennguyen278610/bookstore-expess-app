import OrderDetail from '../models/OrderDetail.js';
import Book from '../models/Book.js';
import dotenv from 'dotenv'
dotenv.config()

// Helper: Style chung cho container để tái sử dụng
const containerStyle = `
  max-width: 600px; 
  margin: 0 auto; 
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
  background-color: #ffffff; 
  padding: 40px 20px;
  border: 1px solid #eebb;
  border-radius: 8px;
`;

// Helper: Style cho nút bấm
const btnStyle = (color) => `
  display: inline-block; 
  background-color: ${color}; 
  color: #ffffff; 
  padding: 12px 30px; 
  text-decoration: none; 
  border-radius: 6px; 
  font-weight: bold; 
  font-size: 16px;
  margin-top: 20px;
`;

async function getItems(orderId) {
  const items = [];
  const orderDetails = await OrderDetail.find({ orderId: orderId });
  for (const orderDetail of orderDetails) {
    const book = await Book.findOne({ _id: orderDetail.bookId });
    items.push({
      name: book.name,
      price: orderDetail.price,
      quantity: orderDetail.quantity,
      total: orderDetail.price * orderDetail.quantity
    });
  }
  return items;
}

// ===================== 1. ORDER SUCCESS =====================
export async function buildOrderSuccessMail(order) {
  const items = await getItems(order._id);

  // Table row đơn giản, chỉ có border dưới mờ
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #333;">
        ${item.name} <span style="font-size: 12px; color: #888;">x${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-weight: 500;">
        ${item.total.toLocaleString()} đ
      </td>
    </tr>
  `).join('');

  return {
    subject: `Xác nhận đơn hàng #${order.payosOrderId}`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}; border: 1px solid #e0e0e0;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2e7d32; margin: 0; font-size: 24px;">Đặt hàng thành công!</h1>
            <p style="color: #666; margin-top: 10px;">Cảm ơn bạn đã mua sắm tại BookStore.</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${order.payosOrderId}</p>
            <p style="margin: 5px 0;"><strong>Ngày đặt:</strong> ${new Date().toLocaleString('vi-VN')}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="text-align: left; padding-bottom: 10px; color: #888; border-bottom: 2px solid #eee;">Sản phẩm</th>
                <th style="text-align: right; padding-bottom: 10px; color: #888; border-bottom: 2px solid #eee;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding-top: 15px; text-align: right; font-weight: bold;">Tổng cộng:</td>
                <td style="padding-top: 15px; text-align: right; font-weight: bold; color: #2e7d32; font-size: 18px;">
                  ${order.totalAmount.toLocaleString()} VND
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="text-align: center; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="font-size: 13px; color: #999;">Mọi thắc mắc xin vui lòng liên hệ hotline của chúng tôi.</p>
          </div>
        </div>
      </div>
    `,
  };
}

// ===================== 2. ORDER CANCELED =====================
export async function buildOrderCanceledMail(order) {
  const items = await getItems(order._id);
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #777;">
        ${item.name} <span style="font-size: 12px;">x${item.quantity}</span>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; color: #777;">
        ${item.total.toLocaleString()} đ
      </td>
    </tr>
  `).join('');

  return {
    subject: `Đơn hàng #${order.payosOrderId} đã hủy`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}; border-top: 4px solid #757575;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin: 0; font-size: 24px;">Đơn hàng đã hủy</h1>
            <p style="color: #666; margin-top: 10px;">Đơn hàng #${order.payosOrderId} đã được hủy theo yêu cầu.</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
             <tbody>${itemsHtml}</tbody>
          </table>
          
          <div style="text-align: right; margin-bottom: 30px;">
             <strong>Tổng tiền: ${order.totalAmount.toLocaleString()} VND</strong>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL}" style="${btnStyle('#333')}">Mua lại đơn hàng</a>
          </div>
        </div>
      </div>
    `,
  };
}

// ===================== 3. ORDER FAILED =====================
export function buildOrderFailedMail(order) {
  return {
    subject: `Thanh toán thất bại - Đơn hàng #${order.payosOrderId}`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}; border-top: 4px solid #d32f2f;">
          <div style="text-align: center;">
            <div style="font-size: 40px; margin-bottom: 10px;">❌</div>
            <h1 style="color: #d32f2f; margin: 0; font-size: 22px;">Thanh toán chưa thành công</h1>
            <p style="color: #555; margin: 20px 0;">
              Giao dịch cho đơn hàng <strong>#${order.payosOrderId}</strong> không thể thực hiện được lúc này.
            </p>
            
            <a href="${process.env.FRONTEND_URL}" style="${btnStyle('#d32f2f')}">Thử thanh toán lại</a>
            
            <p style="font-size: 13px; color: #888; margin-top: 30px;">
              Nếu bạn gặp vấn đề, vui lòng liên hệ ngân hàng phát hành thẻ.
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

// ===================== 4. VERIFY EMAIL =====================
export function buildVerificationEmail(user, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  return {
    subject: `Xác thực tài khoản BookStore`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}">
          <div style="text-align: center;">
            <h2 style="color: #1976d2; margin-top: 0;">Chào mừng, ${user.fullName}!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">
              Cảm ơn bạn đã đăng ký. Để bắt đầu sử dụng tài khoản, vui lòng xác thực email của bạn bằng cách nhấn nút bên dưới.
            </p>
            
            <a href="${verificationUrl}" style="${btnStyle('#1976d2')}">Xác thực Email ngay</a>
            
            <p style="margin-top: 30px; font-size: 13px; color: #888;">
              Link xác thực có hiệu lực trong 24 giờ.<br/>Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua.
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

// ===================== 5. RESET PASSWORD (Sửa kỹ phần này) =====================
export function buildPasswordResetEmail(user, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return {
    subject: `Yêu cầu đặt lại mật khẩu`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}">
          <div style="text-align: center;">
            
            <div style="margin-bottom: 20px;">
              <span style="font-size: 48px;">🔒</span>
            </div>

            <h2 style="color: #333; margin: 0 0 15px 0;">Đặt lại mật khẩu</h2>
            
            <p style="color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
              Chúng tôi nhận được yêu cầu thay đổi mật khẩu cho tài khoản <strong>${user.email}</strong>.<br>
              Nhấn vào nút bên dưới để tạo mật khẩu mới.
            </p>

            <a href="${resetUrl}" style="${btnStyle('#d32f2f')}">Đổi mật khẩu</a>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 13px; color: #999;">
              Nếu bạn không yêu cầu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

// ===================== 6. RESET PASSWORD SUCCESS =====================
export function buildPasswordResetSuccessEmail(user) {
  return {
    subject: `Mật khẩu đã được thay đổi`,
    html: `
      <div style="background-color: #f9f9f9; padding: 40px 0; width: 100%;">
        <div style="${containerStyle}; border-top: 4px solid #2e7d32;">
          <div style="text-align: center;">
            <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
            <h2 style="color: #2e7d32; margin: 0;">Thành công!</h2>
            <p style="color: #555; margin: 20px 0;">
              Mật khẩu cho tài khoản <strong>${user.email}</strong> đã được cập nhật thành công.
            </p>
            
            <a href="${process.env.FRONTEND_URL}/login" style="${btnStyle('#2e7d32')}">Đăng nhập ngay</a>
          </div>
        </div>
      </div>
    `,
  };
}