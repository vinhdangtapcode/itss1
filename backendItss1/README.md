## ✨ Tính năng
- ✅ Đăng ký với **email + password**
- ✅ Đăng nhập với **email + password** → Trả về JWT token
- ✅ Đăng nhập qua **Google OAuth2**
- ✅ Đăng nhập qua **Facebook OAuth2**
- ✅ Password encryption với BCrypt
- ✅ JWT token (24h expiration)
---
## 🚀 Quick Start
```bash
# 1. Clone & Build
git clone <repository-url>
cd itss1
mvn clean install
mvn spring-boot:run

Ứng dụng chạy tại: **http://localhost:8080**
---

## 📁 Cấu trúc Project
```
src/main/java/com/hust/itss1/
├── config/
│   └── SecurityConfig.java              # JWT + OAuth2 config
├── controller/
│   └── AuthController.java              # POST /signup, /login
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java            # email, password
│   │   └── SignupRequest.java           # email, password
│   └── response/
│       ├── JwtResponse.java             # token, id, email, roles
│       └── MessageResponse.java
├── entity/
│   └── User.java                        # id, email, password, providerId
├── repository/
│   └── UserRepository.java
├── security/
│   ├── JwtUtils.java
│   ├── JwtAuthenticationFilter.java
│   ├── UserDetailsImpl.java
│   └── oauth2/                          # OAuth2 handlers
└── service/
    ├── AuthService.java
    └── impl/
        ├── AuthServiceImpl.java
        └── UserDetailsServiceImpl.java
```
## 🎯 API Endpoints
```
### 1. Đăng ký
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "message": "User registered successfully!"
}

Response 400:
{
  "message": "Error: Email is already in use!"
}
```

### 2. Đăng nhập
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "roles": ["ROLE_USER"]
}
```

### 3. OAuth2 Login
- **Google**: `GET /oauth2/authorize/google`
- **Facebook**: `GET /oauth2/authorize/facebook`

### 4. Protected API (Example)
```http
GET /api/protected
Authorization: Bearer <your-jwt-token>
```

---

## 🛠️ Tech Stack
- **Java 17** + **Maven**
- **Spring Boot 3.5.7** (Web, Security, Data JPA, Validation, OAuth2 Client)
- **JWT** (jjwt 0.11.5)
- **PostgreSQL** (Database)
- **Lombok**

---
## ⚙️ Cấu hình

### 1. Database - PostgreSQL
#### Cài đặt PostgreSQL
- **Windows**: https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **macOS**: `brew install postgresql`

#### Tạo Database tên là:itss1

#### Cấu hình 
Cấu hình file `application.properties`

**⚠️ Lưu ý:** 
- Nếu username/password PostgreSQL khác → update trong `application.properties`

### 2. JWT Configuration
```properties
# Secret key (change in production!)
app.jwt.secret=YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGZhc2RmYXNkZmFzZGY=

# Expiration: 24 hours (86400000 ms)
app.jwt.expiration=86400000
```

### 3. OAuth2 Setup

#### Google OAuth2
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo OAuth 2.0 Client ID
3. Redirect URI: `http://localhost:8080/oauth2/callback/google`
4. Update `application.properties`:
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_SECRET
```

#### Facebook OAuth2
1. Vào [Facebook Developers](https://developers.facebook.com/)
2. Tạo App → Settings → Basic
3. Valid OAuth Redirect URIs: `http://localhost:8080/oauth2/callback/facebook`
4. Update `application.properties`:
```properties
spring.security.oauth2.client.registration.facebook.client-id=YOUR_FACEBOOK_APP_ID
spring.security.oauth2.client.registration.facebook.client-secret=YOUR_FACEBOOK_SECRET
```

---

## 🔒 Bảo mật

- ✅ Password encryption: **BCrypt** (strength 10)
- ✅ JWT token expiration: **24 giờ**
- ✅ Stateless sessions (không lưu session server)
- ✅ CSRF disabled (dùng JWT)
- ✅ OAuth2 users không có password
- ✅ Unauthorized handler trả 401
- ✅ CORS enabled (development: allow all)

---

## 🧪 Test APIs với Postman
Import file `postman_collection.json` để test nhanh

## 🔧 Troubleshooting

### Build failed
```bash
mvn clean install -U
```

### Port 8080 đã được sử dụng
Update `application.properties`:
```properties
server.port=8081
```

### JWT token invalid
- Token đã hết hạn (24h) → login lại
- Secret key không đúng
- Token format sai → phải là `Bearer <token>`
---

### 3. Cấu hình JWT Secret

Tạo JWT secret key mới (khuyến nghị):
```bash
openssl rand -base64 64
```

Cập nhật trong `application.properties`:
```properties
app.jwt.secret=YOUR_GENERATED_SECRET_KEY
```

### 5. Build và Run

**Lưu ý quan trọng**: Dự án yêu cầu Java 17 trở lên. Nếu gặp lỗi về phiên bản Java, vui lòng:
1. Kiểm tra phiên bản Java:
```bash
java -version
```

2. Nếu đang dùng Java 8, cần nâng cấp lên Java 17 hoặc cao hơn.

3. Sau khi cài đặt Java 17, set JAVA_HOME:
```bash
# Windows
set JAVA_HOME=C:\Path\To\Java17
set PATH=%JAVA_HOME%\bin;%PATH%

# Linux/Mac
export JAVA_HOME=/path/to/java17
export PATH=$JAVA_HOME/bin:$PATH
```

Build project:
```bash
./mvnw clean install
```

Run application:
```bash
./mvnw spring-boot:run
```

Hoặc sử dụng IDE (IntelliJ IDEA, Eclipse):
- Import project as Maven project
- Chạy `Itss1Application.java`

## API Endpoints

### Authentication APIs

#### 1. Đăng ký (Register)

```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "phoneNumber": "0123456789"
}
```

**Response:**
```json
{
  "message": "User registered successfully!"
}
```

#### 2. Đăng nhập (Login)

```http
POST /api/auth/login
Content-Type: application/json

{
  "usernameOrEmail": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "roles": ["ROLE_USER"]
}
```

#### 3. OAuth2 Login

##### Google Login
```
GET /oauth2/authorize/google
```

##### Facebook Login
```
GET /oauth2/authorize/facebook
```

Sau khi đăng nhập thành công, người dùng sẽ được redirect về:
```
http://localhost:3000/oauth2/redirect?token=JWT_TOKEN
```

### Protected APIs (Yêu cầu Authentication)

#### Test User Access
```http
GET /api/test/user
Authorization: Bearer {jwt_token}
```

#### Test Moderator Access
```http
GET /api/test/mod
Authorization: Bearer {jwt_token}
```

#### Test Admin Access
```http
GET /api/test/admin
Authorization: Bearer {jwt_token}
```

### Public APIs

#### Test Public Access
```http
GET /api/test/all
```

## Sử dụng JWT Token

Sau khi đăng nhập thành công, bạn sẽ nhận được JWT token. Sử dụng token này trong header của các request tiếp theo:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting


### Lỗi OAuth2: "redirect_uri_mismatch"

**Nguyên nhân**: Redirect URI trong OAuth2 provider config không khớp với application config.

**Giải pháp**:
- Đảm bảo redirect URI trong Google/Facebook console phải là: `http://localhost:8080/oauth2/callback/{provider}`
- Provider là `google` hoặc `facebook`

## Security Notes
⚠️ **Quan trọng**:

1. **Đổi JWT Secret**: Không sử dụng secret mặc định trong production
2. **HTTPS**: Luôn sử dụng HTTPS trong production
3. **Token Expiration**: Mặc định token có thời hạn 24 giờ (86400000ms), có thể điều chỉnh trong `application.properties`
4. **CORS**: Cấu hình CORS phù hợp với domain của frontend
5. **Database Password**: Không commit database password vào git

## License
This project is licensed under the MIT License.

