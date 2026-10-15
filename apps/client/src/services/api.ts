import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
      const isLoginOrRegister =
        error.config?.url?.includes('/users/login') ||
        error.config?.url?.includes('/users/register');

      // Se for uma requisição autenticada com token inválido/expirado, limpa e redireciona
      if (!isLoginOrRegister && localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
