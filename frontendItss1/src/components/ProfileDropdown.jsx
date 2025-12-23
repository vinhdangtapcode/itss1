// src/components/ProfileDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ChangePasswordModal from './ChangePasswordModal';
import './ProfileDropdown.css';

function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();

    // Kiểm tra xem có phải tài khoản OAuth2 không
    const loginMethod = localStorage.getItem('loginMethod') || user?.provider || 'email';
    const isOAuth2Account = loginMethod === 'google' || loginMethod === 'facebook';

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
    };

    const handleLogout = () => {
        setIsOpen(false); // Đóng menu vì sẽ chuyển trang
        logout();
        navigate('/login');
    };

    return (
        <>
            <div className="profile-dropdown" ref={dropdownRef}>
                {/* User email bên trái menu */}
                <span className="user-email-display">{user?.email}</span>

                <button
                    className="hamburger-menu"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {isOpen && (
                    <div className="dropdown-menu">

                        {/* Language Selector */}
                        <div className="dropdown-section">
                            <div className="section-title">{t('language')}</div>
                            <div className="language-options">
                                <button
                                    className={`lang-btn ${language === 'vi' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLanguageChange('vi');
                                    }}
                                >
                                    🇻🇳 Tiếng Việt
                                </button>
                                <button
                                    className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLanguageChange('ja');
                                    }}
                                >
                                    🇯🇵 日本語
                                </button>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Theme Toggle */}
                        <button
                            className="dropdown-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleTheme();
                            }}
                        >
                            <span className="item-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                            <span className="item-text">
                                {theme === 'light' ? t('darkMode') : t('lightMode')}
                            </span>
                        </button>

                        <div className="dropdown-divider"></div>

                        {/* Change Password - Chỉ hiển thị cho tài khoản email/password */}
                        {!isOAuth2Account && (
                            <>
                                <button
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowPasswordModal(true);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="item-icon">🔑</span>
                                    <span className="item-text">{t('changePassword')}</span>
                                </button>

                                <div className="dropdown-divider"></div>
                            </>
                        )}

                        {/* Logout */}
                        <button
                            className="dropdown-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                            }}
                        >
                            <span className="item-icon">🚪</span>
                            <span className="item-text">{t('logout')}</span>
                        </button>
                    </div>
                )}
            </div>

            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </>
    );
}

export default ProfileDropdown;
