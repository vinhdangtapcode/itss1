// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Không xóa error ngay lập tức, chỉ set loading
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, email: userEmail, id, roles } = response.data;

      // Xóa error khi đăng nhập thành công
      setError('');

      // Lưu thông tin user và token
      login({ id, email: userEmail, roles }, token);

      // Chuyển đến trang dịch
      navigate('/translate');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authAPI.googleLogin();
  };

  const handleFacebookLogin = () => {
    authAPI.facebookLogin();
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🔐 Đăng nhập</h1>
        <p className="subtitle">JP ↔️ VN AI Translator</p>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button
              type="button"
              className="error-close-btn"
              onClick={() => setError('')}
              aria-label="Đóng thông báo lỗi"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="divider">
          <span>HOẶC</span>
        </div>

        <div className="oauth-buttons">
          <button onClick={handleGoogleLogin} className="btn-google">
            <span>🔍</span> Đăng nhập với Google
          </button>
          <button onClick={handleFacebookLogin} className="btn-facebook">
            <span>📘</span> Đăng nhập với Facebook
          </button>
        </div>

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/signup">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
