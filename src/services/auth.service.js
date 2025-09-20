// Auth service for authentication operations
class AuthService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  // Login user
  async login(credentials) {
    try {
      // Mock login for now - replace with actual API call
      if (credentials.email === 'admin@toeic.com' && credentials.password === 'admin123') {
        const mockResponse = {
          access_token: 'mock_access_token_' + Date.now(),
          refresh_token: 'mock_refresh_token_' + Date.now(),
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@toeic.com',
            role: 'admin'
          }
        };
        
        // Store tokens in localStorage
        localStorage.setItem('access_token', mockResponse.access_token);
        localStorage.setItem('refresh_token', mockResponse.refresh_token);
        localStorage.setItem('user', JSON.stringify(mockResponse.user));
        
        return mockResponse;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      // Clear all stored data
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Clear any cookies if using them
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Refresh token (mock implementation)
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Mock refresh - replace with actual API call
      const newAccessToken = 'refreshed_access_token_' + Date.now();
      localStorage.setItem('access_token', newAccessToken);
      
      return newAccessToken;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }
}

export default new AuthService();
