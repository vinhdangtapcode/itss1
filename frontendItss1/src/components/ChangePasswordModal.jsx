// src/components/ChangePasswordModal.jsx
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './ChangePasswordModal.css';

// eslint-disable-next-line react/prop-types
function ChangePasswordModal({ onClose }) {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    // Kiểm tra OAuth2 account
    const loginMethod = localStorage.getItem('loginMethod') || user?.provider || 'email';
    const isOAuth2Account = loginMethod === 'google' || loginMethod === 'facebook';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Kiểm tra OAuth2 account
        if (isOAuth2Account) {
            setError('Tài khoản đăng nhập qua Google/Facebook không thể đổi mật khẩu.');
            return;
        }

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            // Gọi API đổi mật khẩu
            await authAPI.changePassword(currentPassword, newPassword, confirmPassword);

            setSuccess('Đổi mật khẩu thành công!');
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('changePasswordTitle')}</h2>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {/* OAuth2 Account Warning */}
                        {isOAuth2Account && (
                            <div className="info-message">
                                ℹ️ Tài khoản đăng nhập qua {loginMethod === 'google' ? 'Google' : 'Facebook'} được quản lý bởi {loginMethod === 'google' ? 'Google' : 'Facebook'}. Bạn không thể đổi mật khẩu tại đây.
                            </div>
                        )}

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-message">
                                ✅ {success}
                            </div>
                        )}

                        <div className="form-group">
                            <label>{t('currentPassword')}</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                disabled={loading || isOAuth2Account}
                                required={!isOAuth2Account}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('newPassword')}</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                disabled={loading || isOAuth2Account}
                                minLength={6}
                                required={!isOAuth2Account}
                            />
                        </div>

                        <div className="form-group">
                            <label>{t('confirmPassword')}</label>
                            <input
                                type="password"
                                placeholder="••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading || isOAuth2Account}
                                minLength={6}
                                required={!isOAuth2Account}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="btn-save"
                            disabled={loading || isOAuth2Account}
                        >
                            {loading ? 'Đang xử lý...' : t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;
