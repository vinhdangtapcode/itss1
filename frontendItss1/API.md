# 📚 API Documentation

**Base URL:** `http://localhost:8080`

---

## 📋 Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/signup` | ❌ | Đăng ký user mới |
| POST | `/api/auth/login` | ❌ | Đăng nhập → nhận JWT token |
| GET | `/oauth2/authorize/google` | ❌ | Đăng nhập Google |
| GET | `/oauth2/authorize/facebook` | ❌ | Đăng nhập Facebook |
| POST | `/api/translate` | ✅ | Dịch tiếng Nhật → Tiếng Việt |

---

## 🔐 1. Đăng ký

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{ "message": "User registered successfully!" }
```

---

## 🔐 2. Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "roles": ["ROLE_USER"]
}
```

---

## 🌐 3. Dịch văn bản

```http
POST /api/translate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "text": "こんにちは"
}
```

**Response:**
```json
{
  "success": true,
  "original": "こんにちは",
  "translated": "Xin chào",
  "username": "user@example.com",
  "message": "Dịch thành công"
}
```

---
## 🔑 4. OAuth2 Login
**Google:**
```
GET /oauth2/authorize/google
```
**Facebook:**
```
GET /oauth2/authorize/facebook
```

**Sau khi login thành công:**
- Backend redirect về: `http://localhost:3000/oauth2/redirect?token=<JWT_TOKEN>`
- Frontend parse token từ URL và lưu vào localStorage
---











