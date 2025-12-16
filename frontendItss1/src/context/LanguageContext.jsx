// src/context/LanguageContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
    vi: {
        // Header
        appTitle: 'JP ↔️ VN AI Translator',
        logout: 'Đăng xuất',

        // Profile Dropdown
        language: 'Ngôn ngữ',
        theme: 'Chế độ',
        lightMode: 'Sáng',
        darkMode: 'Tối',
        changePassword: 'Đổi mật khẩu',

        // Login
        login: 'Đăng nhập',
        email: 'Email',
        password: 'Mật khẩu',
        loginButton: 'Đăng nhập',
        noAccount: 'Chưa có tài khoản?',
        signupNow: 'Đăng ký ngay',
        or: 'HOẶC',
        loginWithGoogle: 'Đăng nhập với Google',
        loginWithFacebook: 'Đăng nhập với Facebook',

        // Signup
        signup: 'Đăng ký',
        signupButton: 'Đăng ký',
        haveAccount: 'Đã có tài khoản?',
        loginNow: 'Đăng nhập ngay',

        // Translate
        japanese: 'Tiếng Nhật',
        vietnamese: 'Tiếng Việt',
        translate: 'Dịch',
        translating: 'Đang dịch...',
        inputPlaceholder: 'こんにちは、元気ですか？',
        outputPlaceholder: 'Kết quả dịch sẽ hiển thị ở đây...',

        // Home
        homeTitle: 'Dịch Nhật - Việt với AI',
        homeSubtitle: 'Công cụ dịch thuật thông minh, nhanh chóng và chính xác',
        homeDescription: 'Ứng dụng dịch thuật tiếng Nhật - Tiếng Việt sử dụng công nghệ AI tiên tiến, giúp bạn dịch văn bản một cách nhanh chóng và chính xác nhất.',
        features: 'Tính năng nổi bật',
        feature1Title: '🤖 AI Thông minh',
        feature1Desc: 'Sử dụng Google Gemini AI để dịch chính xác',
        feature2Title: '⚡ Nhanh chóng',
        feature2Desc: 'Kết quả dịch xuất hiện trong tích tắc',
        feature3Title: '🔒 Bảo mật',
        feature3Desc: 'Thông tin của bạn được bảo vệ an toàn',
        getStarted: 'Bắt đầu ngay',

        // Password Modal
        changePasswordTitle: 'Đổi mật khẩu',
        backendRequired: 'Tính năng này yêu cầu backend server đang chạy.',
        currentPassword: 'Mật khẩu hiện tại',
        newPassword: 'Mật khẩu mới',
        confirmPassword: 'Xác nhận mật khẩu',
        cancel: 'Hủy',
        save: 'Lưu',
    },
    ja: {
        // Header
        appTitle: 'JP ↔️ VN AI 翻訳',
        logout: 'ログアウト',

        // Profile Dropdown
        language: '言語',
        theme: 'テーマ',
        lightMode: 'ライト',
        darkMode: 'ダーク',
        changePassword: 'パスワード変更',

        // Login
        login: 'ログイン',
        email: 'メール',
        password: 'パスワード',
        loginButton: 'ログイン',
        noAccount: 'アカウントをお持ちでないですか？',
        signupNow: '今すぐ登録',
        or: 'または',
        loginWithGoogle: 'Googleでログイン',
        loginWithFacebook: 'Facebookでログイン',

        // Signup
        signup: '登録',
        signupButton: '登録',
        haveAccount: 'アカウントをお持ちですか？',
        loginNow: '今すぐログイン',

        // Translate
        japanese: '日本語',
        vietnamese: 'ベトナム語',
        translate: '翻訳',
        translating: '翻訳中...',
        inputPlaceholder: 'こんにちは、元気ですか？',
        outputPlaceholder: '翻訳結果がここに表示されます...',

        // Home
        homeTitle: '日本語 - ベトナム語 AI翻訳',
        homeSubtitle: 'スマートで高速かつ正確な翻訳ツール',
        homeDescription: '最先端のAI技術を使用した日本語 - ベトナム語翻訳アプリケーション。迅速かつ正確にテキストを翻訳します。',
        features: '主な機能',
        feature1Title: '🤖 スマートAI',
        feature1Desc: 'Google Gemini AIで正確な翻訳',
        feature2Title: '⚡ 高速',
        feature2Desc: '瞬時に翻訳結果を表示',
        feature3Title: '🔒 セキュア',
        feature3Desc: 'あなたの情報は安全に保護されます',
        getStarted: '始める',

        // Password Modal
        changePasswordTitle: 'パスワード変更',
        backendRequired: 'この機能にはバックエンドサーバーが必要です。',
        currentPassword: '現在のパスワード',
        newPassword: '新しいパスワード',
        confirmPassword: 'パスワード確認',
        cancel: 'キャンセル',
        save: '保存',
    },
    en: {
        // Header
        appTitle: 'JP ↔️ VN AI Translator',
        logout: 'Logout',

        // Profile Dropdown
        language: 'Language',
        theme: 'Theme',
        lightMode: 'Light',
        darkMode: 'Dark',
        changePassword: 'Change Password',

        // Login
        login: 'Login',
        email: 'Email',
        password: 'Password',
        loginButton: 'Login',
        noAccount: "Don't have an account?",
        signupNow: 'Sign up now',
        or: 'OR',
        loginWithGoogle: 'Login with Google',
        loginWithFacebook: 'Login with Facebook',

        // Signup
        signup: 'Sign Up',
        signupButton: 'Sign Up',
        haveAccount: 'Already have an account?',
        loginNow: 'Login now',

        // Translate
        japanese: 'Japanese',
        vietnamese: 'Vietnamese',
        translate: 'Translate',
        translating: 'Translating...',
        inputPlaceholder: 'こんにちは、元気ですか？',
        outputPlaceholder: 'Translation result will appear here...',

        // Home
        homeTitle: 'Japanese - Vietnamese AI Translation',
        homeSubtitle: 'Smart, fast and accurate translation tool',
        homeDescription: 'A Japanese - Vietnamese translation application using advanced AI technology, helping you translate text quickly and accurately.',
        features: 'Key Features',
        feature1Title: '🤖 Smart AI',
        feature1Desc: 'Accurate translation with Google Gemini AI',
        feature2Title: '⚡ Fast',
        feature2Desc: 'Translation results appear instantly',
        feature3Title: '🔒 Secure',
        feature3Desc: 'Your information is safely protected',
        getStarted: 'Get Started',

        // Password Modal
        changePasswordTitle: 'Change Password',
        backendRequired: 'This feature requires the backend server to be running.',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        cancel: 'Cancel',
        save: 'Save',
    },
};

// eslint-disable-next-line react/prop-types
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('language') || 'vi';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    const t = (key) => {
        return translations[language][key] || key;
    };

    const value = {
        language,
        setLanguage,
        t,
    };

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
