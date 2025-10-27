import apiClient from '@/utils/axios';
import { API_ENDPOINTS, default as API_BASE_URL } from '@/config/api';

// Auth service for authentication operations
class AuthService {
  constructor() {
    // Keep reference to base URL if needed by consumers
    this.baseURL = API_BASE_URL;
  }

  // Login user
  async login(credentials) {
    try {
      // Validate credentials parameter
      if (!credentials) {
        throw new Error('No credentials provided');
      }
      
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }
      
      console.log('Attempting login with credentials:', credentials.email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password
      });

      const { access_token, refresh_token, type } = response.data;
      
      // Validate response data
      if (!access_token) {
        throw new Error('No access token received from server');
      }
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      // Fetch user data after successful login (optional)
      let user = null;
      try {
        user = await this.getCurrentUserFromAPI();
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (userError) {
        console.warn('Could not fetch user data after login:', userError.message);
        
        // Try to create user object from JWT token
        user = this.createUserFromToken(access_token);
        
        // If JWT decode fails, create minimal user object
        if (!user) {
          user = {
            email: credentials.email,
            // Add other fields as needed when they become available
          };
        }
        
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      console.log('Login successful, tokens stored');
      
      return {
        access_token,
        refresh_token,
        user
      };
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        code: error.code,
        responseData: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
        url: error.config ? error.config.url : null,
        credentials: credentials ? { email: credentials.email } : 'No credentials provided'
      });
      
      // Provide more specific error messages
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 401) {
          throw new Error('Invalid email or password');
        } else if (status === 422) {
          throw new Error(data?.message || 'Invalid input data');
        } else if (status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data?.message || 'Login failed');
        }
      } else if (error.message.includes('No access token') || error.message.includes('No user data')) {
        throw error; // Re-throw our validation errors
      } else {
        throw new Error('Network error. Please check your connection.');
      }
    }
  }

  // Google login
  async googleLogin() {
    try {
      // Redirect to Google OAuth endpoint
      window.location.href = API_ENDPOINTS.AUTH.GOOGLE_LOGIN;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        role_id: userData.role_id || 1,
        name: userData.name,
        email: userData.email,
        gender: userData.gender || 3,
        age: userData.age || new Date().toISOString().split('T')[0],
        avatar: userData.avatar || "",
        password: userData.password,
        extra_fields: userData.extra_fields || {}
      });

      return response.data;
    } catch (error) {
      console.error('Register error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error;
    }
  }

  // Decode JWT token to get user information
  decodeJWT(token) {
    try {
      if (!token) return null;
      
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      // Decode the payload (second part)
      const payload = parts[1];
      // Add padding if needed
      const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
      const decoded = atob(paddedPayload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }

  // Create user object from JWT token
  createUserFromToken(accessToken) {
    try {
      const decoded = this.decodeJWT(accessToken);
      if (!decoded) return null;
      
      return {
        id: decoded.subID,
        email: decoded.subEmail,
        name: decoded.subName,
        roleID: decoded.roleID,
        // Add other fields as needed
      };
    } catch (error) {
      console.error('Create user from token error:', error);
      return null;
    }
  }

  // Clean up invalid localStorage data
  cleanupInvalidData() {
    try {
      const keys = ['access_token', 'refresh_token', 'user'];
      
      keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value === 'undefined' || value === 'null') {
          localStorage.removeItem(key);
          console.log(`Cleaned up invalid ${key} from localStorage`);
        }
      });
    } catch (error) {
      console.error('Cleanup invalid data error:', error);
    }
  }

  // Clear all authentication data
  clearAuthData() {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      // Clear any cookies if using them
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      console.log('Authentication data cleared');
    } catch (error) {
      console.error('Clear auth data error:', error);
    }
  }

  // Logout user
  async logout() {
    try {
      // Call the logout API endpoint
      try {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        console.log('Logout API call successful');
      } catch (apiError) {
        // If API call fails, still proceed with local cleanup
        console.warn('Logout API call failed, proceeding with local cleanup:', apiError.message);
      }
      
      // Clear all stored data
      this.clearAuthData();
      
      console.log('Local logout cleanup completed');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      this.clearAuthData();
      throw error;
    }
  }

  // Get current user from API
  async getCurrentUserFromAPI() {
    try {
      // Try the users information endpoint first
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST);
      return response.data;
    } catch (error) {
      console.error('Get current user from API error:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      
      // If 403, the endpoint might not be accessible or might not exist
      if (error.response?.status === 403) {
        console.warn('User information endpoint returned 403 - endpoint might not be available or accessible');
      }
      
      throw error;
    }
  }

  // Refresh user data from API and update localStorage
  async refreshUserData() {
    try {
      const user = await this.getCurrentUserFromAPI();
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      return null;
    } catch (error) {
      console.error('Refresh user data error:', error);
      throw error;
    }
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      
      // Handle cases where localStorage contains 'undefined' or 'null' strings
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      
      return JSON.parse(user);
    } catch (error) {
      console.error('Get current user error:', error);
      // Clear invalid data from localStorage
      localStorage.removeItem('user');
      return null;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    try {
      const token = localStorage.getItem('access_token');
      const user = this.getCurrentUser();
      
      // Check if token exists and is not 'undefined' or 'null' string
      if (!token || token === 'undefined' || token === 'null') {
        return false;
      }
      
      return !!(token && user);
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  }

  // Get access token
  getAccessToken() {
    try {
      const token = localStorage.getItem('access_token');
      
      // Return null if token is 'undefined' or 'null' string
      if (!token || token === 'undefined' || token === 'null') {
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Get access token error:', error);
      return null;
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Use query parameter format as specified in the API documentation
      const response = await apiClient.post(`${API_ENDPOINTS.AUTH.REFRESH}?refresh_token=${refreshToken}`);

      const { access_token } = response.data;
      localStorage.setItem('access_token', access_token);
      
      console.log('Token refreshed successfully');
      return access_token;
    } catch (error) {
      console.error('Refresh token error:', error);
      // If refresh fails, clear all auth data
      this.clearAuthData();
      throw error;
    }
  }
}

export default new AuthService();
