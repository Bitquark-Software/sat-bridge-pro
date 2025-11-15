import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      navigate('/login');
    } else {
      navigate('/home'); //xd aqui hay mano negra
    }
  }, [navigate]);

  return <p className="text-white text-center">Iniciando sesión con Google...</p>;
};

export default OAuthSuccess;
