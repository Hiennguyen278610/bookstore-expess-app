# Hướng dẫn lấy dữ liệu từ file test.json

Trong dự án Express.js này, có hai cách chính để lấy dữ liệu từ file `test.json`:

## 1. Trực tiếp trong mã JavaScript

Trong mã nguồn của dự án, chúng ta đã sử dụng cú pháp import JSON với tính năng mới của JavaScript (sử dụng `with { type: "json" }`):

```javascript
import seafood from "./test.json" with { type: "json" };
```

Đây là cách hiện đại để import dữ liệu JSON trong ES Modules (lưu ý dự án được cấu hình với `"type": "module"` trong package.json). Sau khi import, biến `seafood` sẽ chứa mảng dữ liệu từ file test.json.

## 2. Thông qua API

Dự án đã thiết lập một API endpoint để truy xuất dữ liệu từ file test.json:

```javascript
app.get("/api/seafood", (req, res) => {
  return res.json(seafood);
});
```

Bạn có thể truy cập API này tại đường dẫn `http://localhost:PORTBE/api/seafood`, trong đó PORTBE là giá trị của biến môi trường (mặc định là 3001 nếu không được cấu hình trong file .env).

## Cấu trúc dữ liệu

File `test.json` chứa một mảng các đối tượng thủy hải sản với cấu trúc:
```json
[
    {"name": "Cá thu", "price": 20000},
    {"name": "Cá trích", "price": 2000},
    {"name": "Cá ngừ", "price": 312000}
]
```

## Chạy dự án

Để chạy dự án và sử dụng API:

1. Tạo file `.env` từ `example.env` và đặt giá trị cho PORTBE (nếu muốn)
2. Chạy lệnh `npm run dev` để khởi động server với nodemon (tự động khởi động lại khi có thay đổi)
3. Truy cập API tại `http://localhost:PORTBE/api/seafood`

## Lưu ý

- Dự án sử dụng Express.js phiên bản 5.1.0
- Phụ thuộc vào dotenv để quản lý biến môi trường
- Sử dụng ES Modules thay vì CommonJS
- Cú pháp import JSON với `with { type: "json" }` yêu cầu phiên bản Node.js mới (≥ 20.10.0)
