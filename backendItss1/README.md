# ITSS1 - Backend API

## ✨ Tính năng
- ✅ Đăng ký với **email + password**
- ✅ Đăng nhập với **email + password** → Trả về JWT token
- ✅ Đăng nhập qua **Google OAuth2**
- ✅ Đăng nhập qua **Facebook OAuth2**
- ✅ Đổi mật khẩu
- ✅ Lưu lịch sử dịch của người dùng
- ✅ Password encryption với BCrypt
- ✅ JWT token (24h expiration)

---

## 🚀 Quick Start

```bash
# 1. Clone & Build
git clone <repository-url>
cd backendItss1

# 2. Cấu hình database và OAuth2
cp src/main/resources/application-example.properties src/main/resources/application.properties
# Sửa các giá trị trong application.properties

# 3. Build và chạy
./mvnw clean install
./mvnw spring-boot:run
```

Ứng dụng chạy tại: **http://localhost:8080**

---

## 📁 Cấu trúc Project

```
src/main/java/com/hust/itss1/
├── config/
│   └── SecurityConfig.java              # JWT + OAuth2 config
├── controller/
│   ├── AuthController.java              # POST /signup, /login, /change-password
│   └── TranslationController.java       # POST /translate
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java            # email, password
│   │   ├── SignupRequest.java           # email, password
│   │   ├── ChangePasswordRequest.java   # currentPassword, newPassword
│   │   └── TranslationRequest.java      # text, sourceLang, targetLang
│   └── response/
│       ├── JwtResponse.java             # token, id, email, roles
│       └── MessageResponse.java
├── entity/
│   ├── User.java                        # id, email, password, providerId
│   └── TranslationHistory.java          # id, user, originalText, translatedText, ...
├── repository/
│   ├── UserRepository.java
│   └── TranslationHistoryRepository.java
├── security/
│   ├── JwtUtils.java
│   ├── JwtAuthenticationFilter.java
│   ├── JwtAuthenticationEntryPoint.java
│   ├── UserDetailsImpl.java
│   └── oauth2/                          # OAuth2 handlers
│       ├── CustomOAuth2UserService.java
│       ├── OAuth2AuthenticationSuccessHandler.java
│       ├── OAuth2AuthenticationFailureHandler.java
│       ├── OAuth2UserInfo.java
│       ├── OAuth2UserInfoFactory.java
│       ├── GoogleOAuth2UserInfo.java
│       └── FacebookOAuth2UserInfo.java
├── service/
│   ├── AuthService.java
│   ├── GeminiService.java
│   ├── TranslationHistoryService.java
│   └── impl/
│       ├── AuthServiceImpl.java
│       └── UserDetailsServiceImpl.java
└── exception/
    └── OAuth2AuthenticationProcessingException.java
```

---

## 🎯 API Endpoints

### 1. Đăng ký

```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "message": "User registered successfully!"
}
```

**Response 400:**
```json
{
  "message": "Error: Email is already in use!"
}
```

### 2. Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": 1,
  "email": "user@example.com",
  "roles": ["ROLE_USER"]
}
```

### 3. Đổi mật khẩu

```http
POST /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response 200:**
```json
{
  "message": "Đổi mật khẩu thành công!"
}
```

**Response 400:**
```json
{
  "message": "Error: Mật khẩu hiện tại không đúng."
}
// hoặc
{
  "message": "Error: Mật khẩu mới và xác nhận mật khẩu không khớp."
}
// hoặc
{
  "message": "Error: Mật khẩu mới phải khác với mật khẩu hiện tại."
}
// hoặc
{
  "message": "Error: Tài khoản đăng nhập qua Google/Facebook không thể đổi mật khẩu."
}
```

**Response 401:**
```json
{
  "message": "Error: Vui lòng đăng nhập để đổi mật khẩu."
}
```

**⚠️ Lưu ý:** Tài khoản đăng nhập qua Google/Facebook không thể đổi mật khẩu.

### 3.1. Quên mật khẩu - Kiểm tra Email

```http
POST /api/auth/check-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response 200 (Email tồn tại và là tài khoản thường):**
```json
{
  "exists": true,
  "message": "Email tồn tại trong hệ thống."
}
```

**Response 200 (Email là tài khoản OAuth2):**
```json
{
  "exists": false,
  "message": "Tài khoản này đăng nhập qua Google/Facebook, không thể đặt lại mật khẩu."
}
```

**Response 200 (Email không tồn tại):**
```json
{
  "exists": false,
  "message": "Email không tồn tại trong hệ thống."
}
```

### 3.2. Đặt lại mật khẩu

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

**Response 200:**
```json
{
  "message": "Đặt lại mật khẩu thành công!"
}
```

**Response 400:**
```json
{
  "message": "Error: Email không tồn tại trong hệ thống."
}
// hoặc
{
  "message": "Error: Tài khoản đăng nhập qua Google/Facebook không thể đặt lại mật khẩu."
}
// hoặc
{
  "message": "Error: Mật khẩu mới và xác nhận mật khẩu không khớp."
}
```

**⚠️ Lưu ý:** Tài khoản đăng nhập qua Google/Facebook không thể đặt lại mật khẩu.

### 4. OAuth2 Login

- **Google**: `GET /oauth2/authorize/google`
- **Facebook**: `GET /oauth2/authorize/facebook`

Sau khi đăng nhập thành công, người dùng sẽ được redirect về:
```
http://localhost:3000/oauth2/redirect?token=JWT_TOKEN&email=user@example.com
```

### 5. Dịch văn bản (Protected)

```http
POST /api/translate
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "text": "こんにちは",
  "context": "Đây là lời chào trong email công việc"
}
```

**Response 200:**
```json
{
  "success": true,
  "original": "こんにちは",
  "translated": "Xin chào",
  "contextAnalysis": "Đây là một lời chào phổ biến trong tiếng Nhật, thích hợp cho cả giao tiếp chính thức và thân mật. Trong ngữ cảnh email công việc, nên dùng 'おはようございます' (Ohayou gozaimasu) buổi sáng hoặc 'こんにちは' (Konnichiwa) buổi chiều để thể hiện sự lịch sự.",
  "username": "user@example.com",
  "message": "Dịch thành công"
}
```

### 6. Lấy lịch sử dịch (Protected)

```http
GET /api/translate/history?page=0&size=10
Authorization: Bearer <your-jwt-token>
```

**Response 200:**
```json
{
  "content": [
    {
      "id": 1,
      "originalText": "こんにちは",
      "translatedText": "Xin chào",
      "userContext": "Đây là lời chào trong email công việc",
      "contextAnalysis": "Đây là một lời chào phổ biến...",
      "sourceLanguage": "ja",
      "targetLanguage": "vi",
      "createdAt": "2025-12-20T10:30:00"
    }
  ],
  "totalElements": 50,
  "totalPages": 5,
  "size": 10,
  "number": 0
}
```

### 7. Xóa lịch sử dịch (Protected)

```http
DELETE /api/translate/history
Authorization: Bearer <your-jwt-token>
```

**Response 200:**
```
Đã xóa lịch sử dịch thành công
```

---

## 🛠️ Tech Stack

- **Java 17** + **Maven**
- **Spring Boot 3.x** (Web, Security, Data JPA, Validation, OAuth2 Client)
- **JWT** (jjwt 0.11.5)
- **PostgreSQL** (Database)
- **Lombok**
- **Google Gemini AI** (Translation)

---

## ⚙️ Cấu hình

### 1. Database - PostgreSQL

#### Cài đặt PostgreSQL
- **Windows**: https://www.postgresql.org/download/windows/
- **Linux**: `sudo apt install postgresql postgresql-contrib`
- **macOS**: `brew install postgresql`

#### Tạo Database
```sql
CREATE DATABASE itss1;
```

### 2. File cấu hình

Copy file example và sửa các giá trị:
```bash
cp src/main/resources/application-example.properties src/main/resources/application.properties
```

Cập nhật các giá trị trong `application.properties`:
- Database username/password
- Google OAuth2 client-id/client-secret
- Facebook OAuth2 client-id/client-secret
- Gemini API key
- JWT secret key

### 3. JWT Configuration

```properties
# Secret key (change in production!)
app.jwt.secret=your-secret-key-base64-encoded

# Expiration: 24 hours (86400000 ms)
app.jwt.expiration=86400000
```

Tạo JWT secret key mới (khuyến nghị):
```bash
openssl rand -base64 64
```

### 4. OAuth2 Setup

#### Google OAuth2
1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo OAuth 2.0 Client ID
3. Redirect URI: `http://localhost:8080/oauth2/callback/google`
4. Update `application.properties`

#### Facebook OAuth2
1. Vào [Facebook Developers](https://developers.facebook.com/)
2. Tạo App → Settings → Basic
3. Valid OAuth Redirect URIs: `http://localhost:8080/oauth2/callback/facebook`
4. **Quan trọng**: Xóa Server IP Allowlist nếu có (Settings → Basic)
5. Update `application.properties`

### 5. Gemini API
1. Vào [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API Key
3. Update `application.properties`:
```properties
gemini.api.key=your-gemini-api-key
```

### 6. Build và Run

**Lưu ý quan trọng**: Dự án yêu cầu Java 17 trở lên.

```bash
# Kiểm tra Java version
java -version

# Set JAVA_HOME (nếu cần)
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%

# Linux/Mac
export JAVA_HOME=/path/to/java17
export PATH=$JAVA_HOME/bin:$PATH

# Build
./mvnw clean install

# Run
./mvnw spring-boot:run
```

Hoặc sử dụng IDE (IntelliJ IDEA, Eclipse):
- Import project as Maven project
- Chạy `Itss1Application.java`

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

---

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

### Lỗi OAuth2: "redirect_uri_mismatch"
- Đảm bảo redirect URI trong Google/Facebook console phải là: `http://localhost:8080/oauth2/callback/{provider}`

### Lỗi Facebook: "This IP can't make requests for that application"
- Vào Facebook Developer Console → Settings → Basic
- Xóa tất cả IP trong "Server IP Allowlist"

---

## 📝 Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key, auto increment |
| email | VARCHAR | Unique, not null |
| password | VARCHAR | BCrypt encoded |
| provider_id | VARCHAR | OAuth2 provider ID (Google/Facebook) |

### Translation History Table
| Column | Type | Description |
|--------|------|-------------|
| id | BIGINT | Primary key, auto increment |
| user_id | BIGINT | Foreign key to users |
| original_text | TEXT | Original text |
| translated_text | TEXT | Translated text |
| user_context | TEXT | Context provided by user |
| context_analysis | TEXT | AI analysis of context |
| source_language | VARCHAR(10) | e.g., "ja" |
| target_language | VARCHAR(10) | e.g., "vi" |
| created_at | TIMESTAMP | Auto set on create |

---

## License

This project is licensed under the MIT License.
