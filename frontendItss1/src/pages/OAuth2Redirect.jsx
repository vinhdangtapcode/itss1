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
      // Lưu token vào localStorage
      // Lưu ý: Backend cần trả về thêm thông tin user hoặc decode từ JWT
      const userData = { email: 'oauth-user', id: null, roles: ['ROLE_USER'] };
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

