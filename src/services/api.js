import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    // Debug log
    console.log('Current token:', token ? 'Token exists' : 'No token found');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No access token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Only handle auth errors if:
    // 1. It's a 401/403 error AND
    // 2. We're not already on the login page AND
    // 3. The request wasn't for fetching doctor details AND
    // 4. We've tried refreshing the token (to be implemented)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !window.location.pathname.includes('/login') &&
      !error.config.url.includes('/api/v1/doctors/') &&
      !error.config.url.includes('/api/v1/auth/refresh-token')
    ) {
      // Log the error for debugging
      console.error(`Auth error (${error.response.status}):`, error.response.data);
      
      // TODO: Implement token refresh logic here
      // For now, we'll just clear auth data and redirect if necessary
      const isAuthEndpoint = error.config.url.includes('/api/v1/auth/');
      
      if (isAuthEndpoint) {
        // Clear auth data only for auth-related endpoints
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
      } else {
        // For non-auth endpoints, let the component handle the error
        return Promise.reject({
          ...error,
          isAuthError: true,
          message: 'Your session has expired. Please refresh the page or log in again.'
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 