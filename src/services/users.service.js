import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';

// Users service for user management operations
class UsersService {
  constructor() {
    this.baseURL = API_ENDPOINTS.USERS.LIST;
    this.deleteURL = API_ENDPOINTS.USERS.DELETE;
  }

  // Get users list with pagination and filters
  async getUsers(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        no_pagination = false,
        sort_by = null,
        sort_type = -1,
        name = null,
        role_id = null,
        is_fetch_all = false
      } = params;

      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (is_fetch_all) {
        queryParams.append('is_fetch_all', 'true');
      } else {
        queryParams.append('is_fetch_all', 'false');
        queryParams.append('page', page.toString());
        queryParams.append('limit', limit.toString());
        queryParams.append('no_pagination', no_pagination.toString());
      }

      if (sort_by) queryParams.append('sort_by', sort_by);
      if (sort_type !== null) queryParams.append('sort_type', sort_type.toString());
      if (name) queryParams.append('name', name);
      if (role_id !== null) queryParams.append('role_id', role_id.toString());
      

      const url = `${this.baseURL}?${queryParams.toString()}`;
      console.log('Fetching users from:', url);
      console.log('🧩 Params sent:', params);
      console.log('🌐 Base URL:', this.baseURL);
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        console.error('Authentication failed - user may need to login again');
        // Don't throw error immediately, let the axios interceptor handle it
      } else if (error.response?.status === 403) {
        console.error('Access forbidden - insufficient permissions');
      } else if (error.response?.status === 422) {
        console.error('Validation error:', error.response.data);
      }
      
      throw error;
    }
  }


  // Get all users (no pagination)
  async getAllUsers() {
    return this.getUsers({ is_fetch_all: true });
  }

  // Get users with pagination
  async getUsersPaginated(page = 1, limit = 20) {
    return this.getUsers({ page, limit, is_fetch_all: false });
  }

  // Search users by name
  async searchUsers(name, page = 1, limit = 20) {
    return this.getUsers({ name, page, limit, is_fetch_all: false });
  }

  // Filter users by role
  async getUsersByRole(role_id, page = 1, limit = 20) {
    return this.getUsers({ role_id, page, limit, is_fetch_all: false });
  }

  // Get users with custom sorting
  async getUsersSorted(sort_by, sort_type = -1, page = 1, limit = 20) {
    return this.getUsers({ sort_by, sort_type, page, limit, is_fetch_all: false });
  }

  // Get user by ID - uses /api/v1/users/information/{id}
  async getUserById(id) {
    try {
      // Use the correct endpoint: /api/v1/users/information/{id}
      const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  // Create new user (if this endpoint exists)
  async createUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.BASE, userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  // Update user - uses /api/v1/users/information/{id}
  async updateUser(id, userData) {
    try {
      // Use the correct endpoint: /api/v1/users/information/{id}
      const response = await apiClient.put(`${API_ENDPOINTS.USERS.LIST}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  // Delete user (if this endpoint exists)
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.USERS.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  // Restore user (undelete user - cancel delete)
  // Uses PUT /api/v1/users/account/{id}
  async restoreUser(id) {
    try {
      // Use the correct endpoint: /api/v1/users/account/{id}
      const response = await apiClient.patch(`${API_ENDPOINTS.USERS.DELETE}/${id}`);
      return response.data;
    } catch (error) {
      //console.error('Restore user error:', error);
      throw error;
    }
  }
}

export default new UsersService();
