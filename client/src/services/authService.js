import api from './api';

const TOKEN_KEY = 'auth_token';

const authService = {
  // Login user
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    this.setToken(response.data.token);
    return response.data;
  },

  // Register user
  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    this.setToken(response.data.token);
    return response.data;
  },

  // Logout user
  async logout() {
    this.removeToken();
    return { success: true };
  },

  // Check authentication status
  async checkAuthStatus() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      this.removeToken();
      throw error;
    }
  },

  // Get token from local storage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token in local storage
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token from local storage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export default authService;