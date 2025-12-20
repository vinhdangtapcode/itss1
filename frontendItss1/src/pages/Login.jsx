// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [showResetPasswordForm, setShowResetPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();

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

      // Đợi một chút để đảm bảo state được update
      setTimeout(() => {
        // Chuyển đến trang dịch
        navigate('/translate');
      }, 100);
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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      const response = await authAPI.checkEmail(forgotPasswordEmail);
      if (response.data.exists) {
        // Email tồn tại, hiển thị form nhập mật khẩu mới
        setShowResetPasswordForm(true);
        setForgotPasswordMessage('');
      } else {
        setForgotPasswordMessage('Email không tồn tại trong hệ thống.');
      }
    } catch (err) {
      setForgotPasswordMessage(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setForgotPasswordMessage('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotPasswordMessage('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setResetPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      const response = await authAPI.resetPassword(forgotPasswordEmail, newPassword, confirmPassword);
      setForgotPasswordMessage(response.data.message || 'Đặt lại mật khẩu thành công!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowResetPasswordForm(false);
        setForgotPasswordMessage('');
        setForgotPasswordEmail('');
      }, 2000);
    } catch (err) {
      setForgotPasswordMessage(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>

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

        <div className="forgot-password-container">
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </button>
        </div>

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

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Quên mật khẩu</h2>
              <button
                className="modal-close-btn"
                onClick={() => {
                  setShowForgotPassword(false);
                  setShowResetPasswordForm(false);
                  setForgotPasswordMessage('');
                  setForgotPasswordEmail('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                aria-label="Đóng"
              >
                ×
              </button>
            </div>
            {!showResetPasswordForm ? (
              <form onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <label htmlFor="forgot-email">Email</label>
                  <input
                    type="email"
                    id="forgot-email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                    disabled={forgotPasswordLoading}
                  />
                </div>
                {forgotPasswordMessage && (
                  <div className={`forgot-message ${forgotPasswordMessage.includes('lỗi') || forgotPasswordMessage.includes('Lỗi') || forgotPasswordMessage.includes('không tồn tại') ? 'error' : 'success'}`}>
                    {forgotPasswordMessage}
                  </div>
                )}
                <button type="submit" className="btn-primary" disabled={forgotPasswordLoading}>
                  {forgotPasswordLoading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="new-password">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    required
                    disabled={resetPasswordLoading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    disabled={resetPasswordLoading}
                  />
                </div>
                {forgotPasswordMessage && (
                  <div className={`forgot-message ${forgotPasswordMessage.includes('lỗi') || forgotPasswordMessage.includes('Lỗi') ? 'error' : 'success'}`}>
                    {forgotPasswordMessage}
                  </div>
                )}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setShowResetPasswordForm(false);
                      setNewPassword('');
                      setConfirmPassword('');
                      setForgotPasswordMessage('');
                    }}
                    disabled={resetPasswordLoading}
                  >
                    Quay lại
                  </button>
                  <button type="submit" className="btn-primary" disabled={resetPasswordLoading}>
                    {resetPasswordLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
