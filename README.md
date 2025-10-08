# 📚 Bookstore Management System

> Hệ thống quản lý cửa hàng sách trực tuyến - Dự án môn Phân tích và Thiết kế Hướng đối tượng

## 🎯 Giới thiệu

Dự án xây dựng hệ thống quản lý cửa hàng sách trực tuyến với đầy đủ các chức năng: quản lý sản phẩm, đơn hàng, khách hàng, và phân quyền người dùng.

**Công nghệ sử dụng:**
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Frontend**: React.js (upcoming)

## 👥 Thành viên nhóm (Cho có thôi)

| Thành viên | Vai trò | Trách nhiệm |
|------------|---------|-------------|
| **Thanh Hiền** | Team Lead / Backend Lead | Quản lý dự án, Backend chính |
| **Quý** | Backend Developer | Hỗ trợ Backend |
| **Dũng** | Backend Developer | Hỗ trợ Backend |
| **Long** | Frontend Lead | Phát triển Frontend |
| **Phong** | Frontend Developer | Hỗ trợ Frontend |

## 📁 Cấu trúc dự án

```
bookstore-express-app/
├── backend/                # Backend API (Express.js)
│   ├── src/
│   │   ├── config/        # Cấu hình database
│   │   ├── controllers/   # Business logic
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middlewares/   # Middleware functions
│   │   └── server.js       # Entry point
│   ├── .env               # Environment variables (không commit)
│   └── package.json
│
├── frontend/              # Frontend (React - upcoming)
│
├── documents/             # Tài liệu dự án
│   ├── bookstore-function.md
│   ├── bookstore-project-plan.md
│   └── classDiagram.puml
│
└── README.md
```

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.x
- MongoDB >= 6.x
- npm hoặc yarn

### Backend Setup

1. **Clone repository:**
```bash
git clone git@github.com:Hiennguyen278610/bookstore-expess-app.git
cd bookstore-express-app
```

2. **Cài đặt dependencies:**
```bash
cd backend
npm install
```

3. **Cấu hình môi trường:**
```bash
# Tạo file .env từ example.env
cp example.env .env
```

4. **Chạy server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

### Frontend Setup
*(Coming soon)*

## 📝 API Documentation

### Users Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/users` | Lấy danh sách người dùng |
| POST | `/api/users` | Tạo người dùng mới |
| GET | `/api/users/:id` | Lấy thông tin người dùng |
| PUT | `/api/users/:id` | Cập nhật người dùng |
| DELETE | `/api/users/:id` | Xóa người dùng |

## 🔧 Công nghệ & Thư viện

### Backend
- **express**: ^5.1.0 - Web framework
- **mongoose**: ^8.18.0 - MongoDB ODM
- **dotenv**: ^16.6.1 - Environment variables
- **nodemon**: ^3.1.0 - Auto-reload trong development

### Frontend
*(Coming soon)*

## 📊 Database Schema

### Collections chính:
- **Users**: Quản lý người dùng
- **Books**: Quản lý sách
- **Categories**: Danh mục sách
- **Orders**: Đơn hàng
- **Reviews**: Đánh giá sách

Chi tiết xem tại: [documents/classDiagram.puml](documents/classDiagram.puml)

## 🎯 Tính năng chính

Chi tiết xem tại: [documents/classDiagram.puml](documents/bookstore-function.md)
## 📅 Lộ trình phát triển

- [x] **Tuần 1**: Setup dự án & thiết kế database
- [ ] **Tuần 2**: Xây dựng Backend API cơ bản
- [ ] **Tuần 3**: Authentication & Authorization
- [ ] **Tuần 4**: Frontend cơ bản
- [ ] **Tuần 5**: Tích hợp & Testing
- [ ] **Tuần 6**: Hoàn thiện & Deploy

Chi tiết xem tại: [documents/bookstore-project-plan.md](documents/bookstore-project-plan.md)

## 🤝 Đóng góp

1. Fork dự án
2. Tạo branch mới (`git checkout -b <tên nhánh của ae>`)
3. Commit changes (`git commit -m '36 36 36'`)
4. Push to branch (`git push origin <nhánh cần push>`)
5. Tạo Pull Request
