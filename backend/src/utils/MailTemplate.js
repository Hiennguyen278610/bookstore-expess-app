import OrderDetail from '../models/OrderDetail.js';
import Book from '../models/Book.js';
import dotenv from 'dotenv'
dotenv.config()
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

export async function buildOrderSuccessMail(order) {
  const items = await getItems(order._id);
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top;">
        <div style="font-weight: 500; color: #333;">${item.name}</div>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: center; vertical-align: top;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right; vertical-align: top;">
        ${item.price.toLocaleString()} VND
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right; vertical-align: top; font-weight: 600;">
        ${item.total.toLocaleString()} VND
      </td>
    </tr>
  `).join('');

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return {
    subject: `✅ Đơn hàng #${order.payosOrderId} thanh toán thành công`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🎉 Thanh toán thành công</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 18px;">Thông tin đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Mã đơn hàng:</td>
                <td style="padding: 8px 0; font-weight: 600;">#${order.payosOrderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Tổng tiền:</td>
                <td style="padding: 8px 0; font-weight: 600; color: #2e7d32; font-size: 18px;">${order.totalAmount.toLocaleString()} VND</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Trạng thái:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                    ${order.purchaseStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Thời gian:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString('vi-VN')}</td>
              </tr>
            </table>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 18px; margin-bottom: 16px;">Chi tiết sản phẩm</h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden;">
              <thead>
                <tr style="background: #e8f5e9;">
                  <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #2e7d32;">Sản phẩm</th>
                  <th style="padding: 12px 8px; text-align: center; font-weight: 600; color: #2e7d32; width: 80px;">SL</th>
                  <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #2e7d32; width: 100px;">Đơn giá</th>
                  <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #2e7d32; width: 120px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px 8px; text-align: right; font-weight: 600; border-top: 2px solid #2e7d32;">Tạm tính:</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: 600; border-top: 2px solid #2e7d32;">${subtotal.toLocaleString()} VND</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right; font-weight: 600; color: #2e7d32;">Tổng cộng:</td>
                  <td style="padding: 8px; text-align: right; font-weight: 600; color: #2e7d32; font-size: 18px;">${order.totalAmount.toLocaleString()} VND</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="text-align: center; padding: 16px; background: #f1f8e9; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #33691e; font-size: 16px;">
              <strong>Cảm ơn bạn đã mua hàng tại BookStore!</strong>
            </p>
            <p style="margin: 8px 0 0 0; color: #558b2f;">
              Đơn hàng của bạn sẽ được xử lý và giao đến bạn trong thời gian sớm nhất.
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
            <p style="color: #757575; font-size: 14px; margin: 0;">
              Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

export async function buildOrderCanceledMail(order) {
  const items = await getItems(order._id);
  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; vertical-align: top;">
        <div style="font-weight: 500; color: #333;">${item.name}</div>
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: center; vertical-align: top;">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right; vertical-align: top;">
        ${item.price.toLocaleString()} VND
      </td>
      <td style="padding: 12px 8px; border-bottom: 1px solid #e0e0e0; text-align: right; vertical-align: top; font-weight: 600;">
        ${item.total.toLocaleString()} VND
      </td>
    </tr>
  `).join('');

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);

  return {
    subject: `🚫 Đơn hàng #${order.payosOrderId} đã bị hủy`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🚫 Đơn hàng đã hủy</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="background: #fff3e0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #e65100; margin-top: 0; font-size: 18px;">Chi tiết đơn hàng đã hủy</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 120px;">Mã đơn hàng:</td>
                <td style="padding: 8px 0; font-weight: 600;">#${order.payosOrderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Tổng tiền:</td>
                <td style="padding: 8px 0; font-weight: 600;">${order.totalAmount.toLocaleString()} VND</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Trạng thái:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #ffe0b2; color: #e65100; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                    Đã hủy
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #fffaf2; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #e65100; margin-top: 0; font-size: 18px; margin-bottom: 16px;">Sản phẩm trong đơn hàng</h3>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden;">
              <thead>
                <tr style="background: #ffe0b2;">
                  <th style="padding: 12px 8px; text-align: left; font-weight: 600; color: #e65100;">Sản phẩm</th>
                  <th style="padding: 12px 8px; text-align: center; font-weight: 600; color: #e65100; width: 80px;">SL</th>
                  <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #e65100; width: 100px;">Đơn giá</th>
                  <th style="padding: 12px 8px; text-align: right; font-weight: 600; color: #e65100; width: 120px;">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 12px 8px; text-align: right; font-weight: 600; border-top: 2px solid #ff9800;">Tạm tính:</td>
                  <td style="padding: 12px 8px; text-align: right; font-weight: 600; border-top: 2px solid #ff9800;">${subtotal.toLocaleString()} VND</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px; text-align: right; font-weight: 600; color: #e65100;">Tổng cộng:</td>
                  <td style="padding: 8px; text-align: right; font-weight: 600; color: #e65100; font-size: 18px;">${order.totalAmount.toLocaleString()} VND</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="text-align: center; padding: 20px; background: #fff8e1; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; color: #e65100; font-size: 16px;">
              <strong>Nếu đây là nhầm lẫn, đừng lo lắng!</strong>
            </p>
            <p style="margin: 8px 0 0 0; color: #666;">
              Bạn có thể dễ dàng đặt lại đơn hàng trên website của chúng tôi.
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: #ff9800; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; margin-bottom: 16px;">
              Đặt lại đơn hàng
            </a>
            <p style="color: #757575; font-size: 14px; margin: 0;">
              Cảm ơn bạn đã quan tâm đến <strong>BookStore</strong>!
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

export function buildOrderFailedMail(order) {
  return {
    subject: `❌ Thanh toán thất bại cho đơn hàng #${order.payosOrderId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #d32f2f, #f44336); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">❌ Thanh toán thất bại</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #ffebee; border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px;">⚠️</span>
            </div>
            <h2 style="color: #d32f2f; margin: 16px 0 8px 0;">Giao dịch không thành công</h2>
            <p style="color: #666; margin: 0;">
              Rất tiếc, thanh toán cho đơn hàng <strong>#${order.payosOrderId}</strong> đã thất bại.
            </p>
          </div>

          <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <h3 style="color: #e65100; margin: 0 0 8px 0; font-size: 16px;">Bạn có thể:</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px;">
              <li>Thử thanh toán lại sau ít phút</li>
              <li>Kiểm tra lại thông tin thẻ/tài khoản</li>
              <li>Liên hệ ngân hàng để được hỗ trợ</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.FRONTEND_URL}" 
               style="background: #d32f2f; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Thử thanh toán lại
            </a>
          </div>
        </div>
      </div>
    `,
  };
}
export function buildVerificationEmail(user, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  return {
    subject: `📧 Xác thực email - BookStore`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1976d2, #42a5f5); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔐 Xác thực Email</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #e3f2fd; border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px;">✉️</span>
            </div>
            <h2 style="color: #1976d2; margin: 16px 0 8px 0;">Chào mừng ${user.fullName}!</h2>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Cảm ơn bạn đã đăng ký tài khoản tại <strong>BookStore</strong>. 
              Vui lòng xác thực email để hoàn tất đăng ký.
            </p>
          </div>

          <div style="background: #f3f8fe; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 16px 0; color: #1565c0; font-weight: 600;">
              Nhấn vào nút bên dưới để xác thực email của bạn
            </p>
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #1976d2, #42a5f5); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              Xác thực Email
            </a>
          </div>

          <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <h3 style="color: #e65100; margin: 0 0 8px 0; font-size: 16px;">⚠️ Lưu ý quan trọng</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Liên kết xác thực sẽ hết hạn sau 24 giờ</li>
              <li>Nếu bạn không thực hiện xác thực, tài khoản có thể bị xóa</li>
              <li>Nếu không phải bạn đăng ký, vui lòng bỏ qua email này</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
            <p style="color: #757575; font-size: 14px; margin: 0 0 8px 0;">
              Nếu nút không hoạt động, hãy sao chép và dán đường link sau vào trình duyệt:
            </p>
            <p style="background: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 12px; color: #666; margin: 0;">
              ${verificationUrl}
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(user, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return {
    subject: `🔒 Đặt lại mật khẩu - BookStore`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #d32f2f, #f44336); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔐 Đặt lại Mật khẩu</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #ffebee; border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px;">🔒</span>
            </div>
            <h2 style="color: #d32f2f; margin: 16px 0 8px 0;">Yêu cầu đặt lại mật khẩu</h2>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${user.email}</strong>.
            </p>
          </div>

          <div style="background: #ffebee; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <p style="margin: 0 0 16px 0; color: #c62828; font-weight: 600;">
              Nhấn vào nút bên dưới để đặt lại mật khẩu
            </p>
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #d32f2f, #f44336); color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
              Đặt lại Mật khẩu
            </a>
          </div>

          <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <h3 style="color: #e65100; margin: 0 0 8px 0; font-size: 16px;">🛡️ Bảo mật tài khoản</h3>
            <ul style="color: #666; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Liên kết đặt lại mật khẩu sẽ hết hạn sau 1 giờ</li>
              <li>Không chia sẻ liên kết này với bất kỳ ai</li>
              <li>Nếu không phải bạn yêu cầu, vui lòng bỏ qua email này</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e0e0e0;">
            <p style="color: #757575; font-size: 14px; margin: 0 0 8px 0;">
              Nếu nút không hoạt động, hãy sao chép và dán đường link sau vào trình duyệt:
            </p>
            <p style="background: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; font-size: 12px; color: #666; margin: 0;">
              ${resetUrl}
            </p>
          </div>
        </div>
      </div>
    `,
  };
}

export function buildPasswordResetSuccessEmail(user) {
  return {
    subject: `✅ Mật khẩu đã được đặt lại - BookStore`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #2e7d32, #4caf50); padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">✅ Mật khẩu Đã Được Đặt lại</h1>
        </div>
        
        <div style="padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #e8f5e9; border-radius: 50%; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px;">🔐</span>
            </div>
            <h2 style="color: #2e7d32; margin: 16px 0 8px 0;">Thành công!</h2>
            <p style="color: #666; margin: 0; line-height: 1.6;">
              Mật khẩu cho tài khoản <strong>${user.email}</strong> đã được đặt lại thành công.
            </p>
          </div>

          <div style="background: #f1f8e9; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="color: #2e7d32; margin-top: 0; font-size: 18px;">Thông tin bảo mật</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 140px;">Tài khoản:</td>
                <td style="padding: 8px 0; font-weight: 600;">${user.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Thời gian:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString('vi-VN')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;">Trạng thái:</td>
                <td style="padding: 8px 0;">
                  <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                    Đã đặt lại thành công
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="background: #fff3e0; border-left: 4px solid #ff9800; padding: 16px; border-radius: 4px; margin: 24px 0;">
            <h3 style="color: #e65100; margin: 0 0 8px 0; font-size: 16px;">📞 Cần hỗ trợ?</h3>
            <p style="color: #666; margin: 0; font-size: 14px;">
              Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với bộ phận hỗ <trợ></trợ> của chúng tôi.
            </p>
          </div>

          <div style="text-align: center; margin-top: 32px;">
            <a href="${process.env.FRONTEND_URL}/login" 
               style="background: #2e7d32; color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
              Đăng nhập ngay
            </a>
          </div>
        </div>
      </div>
    `,
  };
}