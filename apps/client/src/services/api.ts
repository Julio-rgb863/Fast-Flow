import axios from 'axios';

// Determina a baseURL correta mesmo se a variável de ambiente VITE_API_URL não estiver configurada no build da Vercel
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const defaultBaseURL = isProduction ? 'https://fast-flow.onrender.com' : 'http://localhost:3000';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend retornar 401 (token expirado ou inválido)
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/users/login') || url.includes('/users/register');

      // Apenas limpa a sessão se for uma requisição que falhou por token inválido numa rota protegida
      if (!isAuthEndpoint && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Usar replace em vez de reload forçado se não estiver na página de login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
