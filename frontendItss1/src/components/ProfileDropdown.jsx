// src/components/ProfileDropdown.jsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import ChangePasswordModal from './ChangePasswordModal';
import './ProfileDropdown.css';

function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const dropdownRef = useRef(null);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { language, setLanguage, t } = useLanguage();

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

    return (
        <>
            <div className="profile-dropdown" ref={dropdownRef}>
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
                        <div className="dropdown-header">
                            <div className="user-email">{user?.email}</div>
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Language Selector */}
                        <div className="dropdown-section">
                            <div className="section-title">{t('language')}</div>
                            <div className="language-options">
                                <button
                                    className={`lang-btn ${language === 'vi' ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange('vi')}
                                >
                                    🇻🇳 Tiếng Việt
                                </button>
                                <button
                                    className={`lang-btn ${language === 'ja' ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange('ja')}
                                >
                                    🇯🇵 日本語
                                </button>
                                <button
                                    className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange('en')}
                                >
                                    🇬🇧 English
                                </button>
                            </div>
                        </div>

                        <div className="dropdown-divider"></div>

                        {/* Theme Toggle */}
                        <button className="dropdown-item" onClick={toggleTheme}>
                            <span className="item-icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                            <span className="item-text">
                                {theme === 'light' ? t('darkMode') : t('lightMode')}
                            </span>
                        </button>

                        <div className="dropdown-divider"></div>

                        {/* Change Password */}
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                setShowPasswordModal(true);
                                setIsOpen(false);
                            }}
                        >
                            <span className="item-icon">🔑</span>
                            <span className="item-text">{t('changePassword')}</span>
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
