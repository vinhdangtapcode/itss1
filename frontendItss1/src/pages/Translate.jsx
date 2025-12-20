// src/pages/Translate.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, LogOut, Maximize2, X, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { translationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ProfileDropdown from '../components/ProfileDropdown';
import './Translate.css';

// Popup Modal Component
function ExpandPopup({ title, value, onChange, onClose, readOnly = false }) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h3 className="popup-title">{title}</h3>
          <button className="popup-close-btn" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="popup-body">
          <textarea
            className={`popup-textarea ${readOnly ? 'readonly' : ''}`}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}

// Text Box with Expand Button Component
function TextBoxWithExpand({ label, value, onChange, placeholder, className, readOnly = false, onExpand }) {
  const textareaRef = useRef(null);
  const wrapperRef = useRef(null);

  // Use ResizeObserver to sync wrapper size with textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    const wrapper = wrapperRef.current;
    if (!textarea || !wrapper) return;

    const observer = new ResizeObserver(() => {
      wrapper.style.width = `${textarea.offsetWidth}px`;
      wrapper.style.height = `${textarea.offsetHeight}px`;
    });

    observer.observe(textarea);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="input-field">
      <label className="field-label">{label}</label>
      <div className="text-box-wrapper" ref={wrapperRef}>
        <button className="expand-btn" onClick={onExpand} title="Mở rộng">
          <Maximize2 />
        </button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

function Translate() {
  const [japaneseText, setJapaneseText] = useState('');
  const [context, setContext] = useState('');
  const [vietnameseText, setVietnameseText] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedBox, setExpandedBox] = useState(null); // 'japanese' | 'context' | 'vietnamese' | 'analysis' | null
  const [historyHidden, setHistoryHidden] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const loadHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Không có token, bỏ qua load history');
      return;
    }

    try {
      setLoadingHistory(true);
      const response = await translationAPI.getHistory();
      console.log('History response:', response);
      console.log('History data:', response.data);
      const historyData = Array.isArray(response.data) ? response.data : [];
      console.log('History array:', historyData);
      setHistory(historyData);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử:', error);
      console.error('Error response:', error.response);
      // Nếu lỗi 401, không redirect (để tránh loop)
      if (error.response?.status === 401) {
        console.log('Token không hợp lệ, bỏ qua load history');
      }
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    // Chỉ load history khi user đã được set
    if (user) {
      loadHistory();
    }
  }, [user]);

  const handleTranslate = async () => {
    if (!japaneseText.trim()) {
      return;
    }

    setIsTranslating(true);
    setVietnameseText('');
    setAnalysis('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setVietnameseText('⚠️ Lỗi: Chưa đăng nhập. Vui lòng đăng nhập lại.');
        setIsTranslating(false);
        return;
      }

      const response = await translationAPI.translate(japaneseText, context);
      const { translated, contextAnalysis } = response.data;

      setVietnameseText(translated);
      setAnalysis(contextAnalysis || '');

      // Reload history after successful translation
      loadHistory();
    } catch (error) {
      console.error('Lỗi khi dịch:', error);

      if (error.response?.status === 401) {
        setVietnameseText('⚠️ Lỗi: Token không hợp lệ. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        setVietnameseText('⚠️ Lỗi: Không có quyền truy cập.');
      } else {
        setVietnameseText(`⚠️ Lỗi dịch: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHistoryItemClick = (item) => {
    setJapaneseText(item.originalText || '');
    setVietnameseText(item.translatedText || '');
    // Scroll to top để người dùng thấy nội dung đã được điền
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="translate-container">
      <ProfileDropdown />

      <header className="translate-header">
        <h1>{t('appTitle')}</h1>
        <div className="user-info">
          <span>👤 {user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            {t('logout')}
          </button>
        </div>
      </header>

      <div className="translator-box">
        <div className="input-section">
          <div className="section-header">
            <h3>{t('japanese')}</h3>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('inputPlaceholder')}
            rows="8"
          />
        </div>

        <div className="translate-button-wrapper">
          <button
            onClick={handleTranslate}
            disabled={isLoading}
            className="btn-translate"
          >
            {isLoading ? t('translating') : t('translate')}
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>{t('vietnamese')}</h3>
          </div>
          <textarea
            value={translatedText}
            readOnly
            placeholder={t('outputPlaceholder')}
            rows="8"
          />
        </div>
      </main>

      {/* Expand Popup Modal */}
      {expandedBox === 'japanese' && (
        <ExpandPopup
          title="Tiếng Nhật"
          value={japaneseText}
          onChange={(e) => setJapaneseText(e.target.value)}
          onClose={() => setExpandedBox(null)}
        />
      )}
      {expandedBox === 'context' && (
        <ExpandPopup
          title="Ngữ cảnh"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onClose={() => setExpandedBox(null)}
        />
      )}
      {expandedBox === 'vietnamese' && (
        <ExpandPopup
          title="Tiếng Việt"
          value={vietnameseText}
          onChange={() => { }}
          onClose={() => setExpandedBox(null)}
          readOnly={true}
        />
      )}
      {expandedBox === 'analysis' && (
        <ExpandPopup
          title="Phân tích"
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          onClose={() => setExpandedBox(null)}
        />
      )}
    </div>
  );
}

export default Translate;