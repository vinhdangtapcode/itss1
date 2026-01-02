// src/pages/OAuth2Redirect.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OAuth2Redirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      alert('Đăng nhập thất bại: ' + error);
      navigate('/login');
      return;
    }

    if (token) {
      // Lấy email từ URL parameter
      const email = searchParams.get('email');
      let displayName = email || 'Người dùng';

      // Xác định provider dựa trên email
      let provider = 'email'; // default
      if (email && email.includes('@facebook.com')) {
        displayName = email.split('@')[0];
        provider = 'facebook';
      } else if (email && email.includes('@gmail.com')) {
        provider = 'google';
      }

      const userData = {
        email: displayName,
        id: null,
        roles: ['ROLE_USER'],
        provider: provider // Thêm provider để frontend biết loại tài khoản
      };

      // Lưu loginMethod để dễ kiểm tra
      localStorage.setItem('loginMethod', provider);

      login(userData, token);
      navigate('/translate');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner"></div>
      <p>Đang xử lý đăng nhập...</p>
    </div>
  );
}

export default OAuth2Redirect;

