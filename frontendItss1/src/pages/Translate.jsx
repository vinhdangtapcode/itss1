// src/pages/Translate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Translate.css';

function Translate() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      alert('Vui lòng nhập văn bản cần dịch');
      return;
    }

    setIsLoading(true);
    setTranslatedText('');

    try {
      // DEBUG: Log token và request
      const token = localStorage.getItem('token');
      console.log('🔍 DEBUG - Token trong localStorage:', token);
      console.log('🔍 DEBUG - User từ context:', user);

      if (!token) {
        setTranslatedText('⚠️ Lỗi: Chưa đăng nhập. Vui lòng đăng nhập lại.');
        return;
      }

      console.log('🔍 DEBUG - Gọi API translate với text:', inputText);
      const response = await translationAPI.translate(inputText);
      console.log('🔍 DEBUG - Response từ API:', response);

      const { translated, message } = response.data;
      console.log('🔍 DEBUG - Translated text:', translated);

      setTranslatedText(translated);

      if (message) {
        console.log('🔍 DEBUG - Message:', message);
      }
    } catch (error) {
      console.error('❌ DEBUG - Lỗi khi dịch:', error);
      console.error('❌ DEBUG - Error response:', error.response);
      console.error('❌ DEBUG - Error status:', error.response?.status);
      console.error('❌ DEBUG - Error data:', error.response?.data);

      if (error.response?.status === 401) {
        setTranslatedText('⚠️ Lỗi: Token không hợp lệ. Vui lòng đăng nhập lại.');
      } else if (error.response?.status === 403) {
        setTranslatedText('⚠️ Lỗi: Không có quyền truy cập.');
      } else {
        setTranslatedText(`⚠️ Lỗi dịch: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="translate-container">
      <header className="translate-header">
        <h1>JP ↔️ VN AI Translator</h1>
        <div className="user-info">
          <span>👤 {user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Đăng xuất
          </button>
        </div>
      </header>

      <div className="translator-box">
        <div className="input-section">
          <div className="section-header">
            <h3>Tiếng Nhật</h3>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="こんにちは、元気ですか？"
            rows="8"
          />
        </div>

        <div className="translate-button-wrapper">
          <button
            onClick={handleTranslate}
            disabled={isLoading}
            className="btn-translate"
          >
            {isLoading ? '⏳ Đang dịch...' : 'Dịch'}
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h3>Tiếng Việt</h3>
          </div>
          <textarea
            value={translatedText}
            readOnly
            placeholder="Kết quả dịch sẽ hiển thị ở đây..."
            rows="8"
          />
        </div>
      </div>
    </div>
  );
}

export default Translate;
