import api from './api';

export const requestTempPassword = async (email) => {
  try {
    const response = await api.post('/api/v1/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'An error occurred while requesting temporary password' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/api/v1/auth/login', credentials);
    if (response.data.status === 'success') {
      // Store tokens
      localStorage.setItem('accessToken', response.data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('isAuthenticated', 'true');
    }
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'An error occurred while logging in' };
  }
};

export const resetPassword = async (password) => {
  try {
    const response = await api.post('/api/v1/auth/reset-password', { password });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: 'An error occurred while resetting password' };
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
}; 