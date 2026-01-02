// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './Home.css';

function Home() {
    const { t, language, setLanguage } = useLanguage();

    return (
        <div className="home-container">
            {/* Header with language controls */}
            <header className="home-header">
                <div className="header-controls">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="lang-select"
                    >
                        <option value="vi">🇻🇳 Tiếng Việt</option>
                        <option value="ja">🇯🇵 日本語</option>
                    </select>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">{t('homeTitle')}</h1>
                    <p className="hero-subtitle">{t('homeSubtitle')}</p>
                    <p className="hero-description">{t('homeDescription')}</p>

                    <div className="cta-buttons">
                        <Link to="/login" className="btn-primary">
                            {t('login')}
                        </Link>
                        <Link to="/signup" className="btn-secondary">
                            {t('signup')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="features-title">{t('features')}</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>{t('feature1Title')}</h3>
                        <p>{t('feature1Desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⚡</div>
                        <h3>{t('feature2Title')}</h3>
                        <p>{t('feature2Desc')}</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3>{t('feature3Title')}</h3>
                        <p>{t('feature3Desc')}</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>©2025 JP ↔️ VN AI Translator</p>
            </footer>
        </div>
    );
}

export default Home;
