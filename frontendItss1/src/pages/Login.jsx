// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
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
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Không xóa error ngay lập tức, chỉ set loading
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      const { token, email: userEmail, id, roles } = response.data;

      // Xóa error khi đăng nhập thành công
      setError('');

      // Lưu loginMethod để phân biệt với OAuth2
      localStorage.setItem('loginMethod', 'email');

      // Lưu thông tin user và token với provider
      login({ id, email: userEmail, roles, provider: 'email' }, token);

      // Đợi một chút để đảm bảo state được update
      setTimeout(() => {
        // Chuyển đến trang dịch
        navigate('/translate');
      }, 100);
    } catch (err) {
      setError(err.response?.data?.message || t('loginError'));

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
        setForgotPasswordMessage(t('emailNotExist'));
      }
    } catch (err) {
      setForgotPasswordMessage(err.response?.data?.message || t('errorOccurred'));

    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setForgotPasswordMessage(t('passwordMismatch'));

      return;
    }

    if (newPassword.length < 6) {

      setForgotPasswordMessage(t('passwordMinLength'));

      return;
    }

    setResetPasswordLoading(true);
    setForgotPasswordMessage('');

    try {
      const response = await authAPI.resetPassword(forgotPasswordEmail, newPassword, confirmPassword);
      setForgotPasswordMessage(response.data.message || t('resetPasswordSuccess'));

      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setShowResetPasswordForm(false);
        setForgotPasswordMessage('');
        setForgotPasswordEmail('');
      }, 2000);
    } catch (err) {
      setForgotPasswordMessage(err.response?.data?.message || t('errorOccurred'));

    } finally {
      setResetPasswordLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? t('darkMode') : t('lightMode')}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>

      <div className="auth-box">
        <h1>🔐 {t('login')}</h1>
        <p className="subtitle">{t('appTitle')}</p>

        {error && (
          <div className="error-message">
            <span>{error}</span>
            <button
              type="button"
              className="error-close-btn"
              onClick={() => setError('')}
              aria-label={t('cancel')}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('email')}</label>
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
            <label htmlFor="password">{t('password')}</label>
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
            {loading ? t('loggingIn') : t('loginButton')}
          </button>
        </form>

        <div className="forgot-password-container">
          <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowForgotPassword(true)}
          >
            {t('forgotPassword')}
          </button>
        </div>

        <div className="divider">
          <span>{t('or')}</span>
        </div>

        <div className="oauth-buttons">
          <button onClick={handleGoogleLogin} className="btn-google">
            <span>🔍</span> {t('loginWithGoogle')}
          </button>
          <button onClick={handleFacebookLogin} className="btn-facebook">
            <span>📘</span> {t('loginWithFacebook')}
          </button>
        </div>

        <p className="auth-link">
          {t('noAccount')} <Link to="/signup">{t('signupNow')}</Link>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('forgotPasswordTitle')}</h2>

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
                aria-label={t('close')}

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
                    placeholder={t('enterYourEmail')}

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
                  {forgotPasswordLoading ? t('checking') : t('continue')}

                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="new-password">{t('newPasswordLabel')}</label>

                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}

                    placeholder={t('enterNewPassword')}

                    required
                    disabled={resetPasswordLoading}
                  />
                </div>
                <div className="form-group">

                  <label htmlFor="confirm-password">{t('confirmPasswordLabel')}</label>

                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('reenterNewPassword')}

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
                    {t('goBack')}
                  </button>
                  <button type="submit" className="btn-primary" disabled={resetPasswordLoading}>
                    {resetPasswordLoading ? t('processing') : t('resetPassword')}

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
