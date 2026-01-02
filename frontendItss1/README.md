## Yêu cầu
- Node.js >= 14.x
- Backend Spring Boot chạy ở `http://localhost:8080`

## Cách chạy
```bash
# Cài đặt
npm install

# Chạy dev server
npm run dev
```
Project chạy tại: **http://localhost:5173**

## Cấu trúc
```
src/
├── components/      # PrivateRoute
├── context/        # AuthContext
├── pages/          # Login, Signup, Translate
├── services/       # API calls
└── App.jsx         # Main routing
```

## Tính năng
- ✅ Đăng ký/Đăng nhập (Email + OAuth2)
- ✅ Dịch tiếng Nhật → Tiếng Việt
- ✅ JWT authentication
- ✅ Protected routes

## API
Xem chi tiết: API.md
**Base URL:** `http://localhost:8080`
- `POST /api/auth/signup` - Đăng ký
- `POST /api/auth/login` - Đăng nhập  
- `POST /api/translate` - Dịch văn bản (cần token)

## Routes
| URL | Mô tả | Protected |
|-----|-------|-----------|
| `/login` | Đăng nhập | ❌ |
| `/signup` | Đăng ký | ❌ |
| `/translate` | Dịch văn bản | ✅ |

## Technologies
- React 18.2
- React Router 6.x
- Axios
- Vite

## Troubleshooting
**Lỗi CORS:** Backend cần config `@CrossOrigin(origins = "http://localhost:5173")`
**Lỗi 401:** Đăng xuất và đăng nhập lại
**Lỗi "Missing script: start":** Dùng `npm run dev` (không phải `npm start`)
---
**ITSS1 Project - 2025**

