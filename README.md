# Capstone NextJS - Airbnb Clone

Dự án Capstone NextJS - Ứng dụng đặt phòng trực tuyến tương tự Airbnb

## Tác giả
**Sơn Lê**

## Phiên bản
**1.0.0**

## Công nghệ sử dụng
- **React 19.1.0** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Redux Toolkit** - State Management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client

## Tính năng chính
- ✅ Đăng nhập/Đăng ký người dùng
- ✅ Tìm kiếm và lọc phòng
- ✅ Chi tiết phòng
- ✅ Đặt phòng
- ✅ Quản lý profile
- ✅ Responsive Design

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build cho production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## Cấu trúc dự án
```
src/
├── pages/           # Các trang chính
│   ├── Users/       # Trang người dùng
│   └── Admin/       # Trang quản trị
├── services/        # API services
├── router/          # Routing configuration
├── utils/           # Utility functions
└── assets/          # Static assets
```

## API Configuration
Dự án sử dụng API từ Cybersoft:
- Base URL: `https://airbnbnew.cybersoft.edu.vn/api`
- Authentication: JWT Token

## Deployment
Dự án được tối ưu cho deployment với:
- Code splitting
- Tree shaking
- Minification
- Environment variables support

## Changelog

### v1.0.0 (2024-12-19)
- ✅ Khởi tạo dự án
- ✅ Cấu hình Vite và TypeScript
- ✅ Setup Redux Toolkit
- ✅ Implement authentication
- ✅ Tối ưu hóa cho deployment
- ✅ Cải thiện error handling
