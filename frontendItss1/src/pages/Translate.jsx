// src/pages/Translate.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeftRight, Maximize2, X, Eye, EyeOff } from 'lucide-react';
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
  const [noticeDismissed, setNoticeDismissed] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();

  // Hàm làm sạch text từ markdown code blocks và JSON thừa
  const cleanTranslationText = (text) => {
    if (!text) return '';

    let cleaned = text;

    // Loại bỏ markdown code blocks (```vietnamese, ```text, ```json, v.v.)
    cleaned = cleaned.replace(/```[a-z]*\n?/gi, '');
    cleaned = cleaned.replace(/```/g, '');

    // Thử parse JSON nếu text có dạng JSON object
    cleaned = cleaned.trim();
    if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
      try {
        const jsonObj = JSON.parse(cleaned);
        // Tìm trường chứa nội dung dịch hoặc phân tích (cả camelCase và snake_case)
        if (jsonObj.translation) {
          cleaned = jsonObj.translation;
        } else if (jsonObj.translated) {
          cleaned = jsonObj.translated;
        } else if (jsonObj.contextAnalysis) {
          cleaned = jsonObj.contextAnalysis;
        } else if (jsonObj.context_analysis) {
          cleaned = jsonObj.context_analysis;
        } else if (jsonObj.analysis) {
          cleaned = jsonObj.analysis;
        } else if (jsonObj.text) {
          cleaned = jsonObj.text;
        } else if (jsonObj.content) {
          cleaned = jsonObj.content;
        }
      } catch (e) {
        // Không phải JSON hợp lệ, giữ nguyên text
      }
    }

    // Xử lý trường hợp có nhiều trường JSON trong response
    // Ví dụ: {"translation": "...", "contextAnalysis": "..."}
    // Loại bỏ các pattern JSON phổ biến bằng regex nếu vẫn còn (cả camelCase và snake_case)
    cleaned = cleaned.replace(/^\s*\{\s*"(translation|translated|contextAnalysis|context_analysis|analysis|text|content)"\s*:\s*"/i, '');
    cleaned = cleaned.replace(/"\s*\}\s*$/i, '');
    cleaned = cleaned.replace(/",\s*"(contextAnalysis|context_analysis)"\s*:\s*"[^"]*"\s*\}$/i, '');

    // Xử lý trường hợp text bắt đầu bằng key JSON không hoàn chỉnh (ví dụ: context_analysis": ")
    cleaned = cleaned.replace(/^(context_analysis|contextAnalysis|translation|translated|analysis|text|content)"\s*:\s*"/i, '');

    cleaned = cleaned.replace(/^\s*"/, '');
    cleaned = cleaned.replace(/"\s*$/, '');

    // Unescape các ký tự JSON
    cleaned = cleaned.replace(/\\n/g, '\n');
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\\\/g, '\\');

    // Trim whitespace ở đầu và cuối
    cleaned = cleaned.trim();

    return cleaned;
  };

  const loadHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Không có token, bỏ qua load history');
      return;
    }

    try {
      setLoadingHistory(true);
      const response = await translationAPI.getHistory(0, 10); // Lấy 10 bản ghi gần nhất
      console.log('History response:', response);
      console.log('History data:', response.data);
      // Paginated response có dạng { content: [...], totalPages, ... }
      const historyData = response.data?.content || (Array.isArray(response.data) ? response.data : []);
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

      // Làm sạch kết quả dịch và phân tích
      setVietnameseText(cleanTranslationText(translated));
      setAnalysis(cleanTranslationText(contextAnalysis || ''));

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

  const handleHistoryItemClick = (item) => {
    setJapaneseText(item.originalText || '');
    setVietnameseText(cleanTranslationText(item.translatedText || ''));
    setContext(item.userContext || '');
    setAnalysis(cleanTranslationText(item.contextAnalysis || ''));
    // Scroll to top để người dùng thấy nội dung đã được điền
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="translate-container">
      {/* Header */}
      <header className="translate-header">
        <div className="header-content">
          <div className="header-left">
            <h1>JP ↔️ VN AI Translator</h1>
          </div>
          <div className="header-right">
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="translate-main">
        <div className="translator-box">
          <div className="translator-grid">
            {/* Left Side - Japanese Input */}
            <div className="input-group">
              <TextBoxWithExpand
                label={t('japanese')}
                value={japaneseText}
                onChange={(e) => setJapaneseText(e.target.value)}
                placeholder={t('inputPlaceholder')}
                className="textarea-input"
                onExpand={() => setExpandedBox('japanese')}
              />

              <TextBoxWithExpand
                label={t('context')}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={t('contextPlaceholder')}
                className="textarea-input textarea-context"
                onExpand={() => setExpandedBox('context')}
              />
            </div>

            {/* Translate Button - Between columns */}
            <div className="translate-button-desktop">
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !japaneseText.trim()}
                className="btn-translate"
              >
                {isTranslating ? (
                  <>
                    <div className="spinner-small" />
                    <span>{t('translating')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('translate')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Translate Button */}
            <div className="translate-button-mobile">
              <button
                onClick={handleTranslate}
                disabled={isTranslating || !japaneseText.trim()}
                className="btn-translate btn-translate-mobile"
              >
                {isTranslating ? (
                  <>
                    <div className="spinner-small" />
                    <span>{t('translating')}</span>
                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="translate-icon" />
                    <span>{t('translate')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Side - Vietnamese Output */}
            <div className="output-group">
              <TextBoxWithExpand
                label={t('vietnamese')}
                value={vietnameseText}
                onChange={() => { }}
                placeholder={t('outputPlaceholder')}
                className="textarea-output"
                readOnly={true}
                onExpand={() => setExpandedBox('vietnamese')}
              />

              <TextBoxWithExpand
                label={t('analysis')}
                value={analysis}
                onChange={() => { }}
                placeholder={t('analysisPlaceholder')}
                className="textarea-output textarea-context"
                readOnly={true}
                onExpand={() => setExpandedBox('analysis')}
              />
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="history-section">
          <div className="history-header">
            <h2>{t('translationHistory')}</h2>
            <button
              className="btn-history-toggle"
              onClick={() => setHistoryHidden(!historyHidden)}
            >
              {historyHidden ? (
                <>
                  <Eye className="toggle-icon" />
                  <span>{t('show')}</span>
                </>
              ) : (
                <>
                  <EyeOff className="toggle-icon" />
                  <span>{t('hide')}</span>
                </>
              )}
            </button>
          </div>

          {!historyHidden && (
            <>
              {/* Auto-delete notice */}
              {!noticeDismissed && (
                <div className="history-auto-delete-notice">
                  <span className="notice-text">{t('historyAutoDeleteNotice')}</span>
                  <button
                    className="notice-close-btn"
                    onClick={() => setNoticeDismissed(true)}
                    title="Đóng"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {loadingHistory ? (
                <div className="history-loading">{t('loadingHistory')}</div>
              ) : history.length === 0 ? (
                <div className="history-empty">{t('noHistory')}</div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="history-item"
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <div className="history-content">
                        <div className="history-original">
                          <span className="history-label">🇯🇵 JP:</span>
                          <span className="history-text">{item.originalText}</span>
                        </div>
                        <div className="history-translated">
                          <span className="history-label">🇻🇳 VN:</span>
                          <span className="history-text">{cleanTranslationText(item.translatedText)}</span>
                        </div>
                        {item.userContext && (
                          <div className="history-context">
                            <span className="history-label">📝 Context:</span>
                            <span className="history-text">{item.userContext.substring(0, 50)}{item.userContext.length > 50 ? '...' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Expand Popup Modal */}
      {expandedBox === 'japanese' && (
        <ExpandPopup
          title={t('japanese')}
          value={japaneseText}
          onChange={(e) => setJapaneseText(e.target.value)}
          onClose={() => setExpandedBox(null)}
        />
      )}
      {expandedBox === 'context' && (
        <ExpandPopup
          title={t('context')}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          onClose={() => setExpandedBox(null)}
        />
      )}
      {expandedBox === 'vietnamese' && (
        <ExpandPopup
          title={t('vietnamese')}
          value={vietnameseText}
          onChange={() => { }}
          onClose={() => setExpandedBox(null)}
          readOnly={true}
        />
      )}
      {expandedBox === 'analysis' && (
        <ExpandPopup
          title={t('analysis')}
          value={analysis}
          onChange={() => { }}
          onClose={() => setExpandedBox(null)}
          readOnly={true}
        />
      )}
    </div>
  );
}

export default Translate;