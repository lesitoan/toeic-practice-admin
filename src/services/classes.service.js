import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';

class ClassesService {
  // Get all classes with pagination
  async getAllClasses(page = 1, limit = 20) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASSES.BASE, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get all classes error:', error);
      throw error;
    }
  }

  // Get class by ID with pagination
  async getClassById(classId, page = 1, limit = 20) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CLASSES.BASE}/${classId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get class by ID error:', error);
      throw error;
    }
  }

  // Create new class
  async createClass(classData) {
    try {
      // API expects: { name: string, student_ids: number[] }
      const response = await apiClient.post(API_ENDPOINTS.CLASSES.BASE, {
        name: classData.name,
        student_ids: classData.student_ids || [],
      });
      return response.data;
    } catch (error) {
      console.error('Create class error:', error);
      throw error;
    }
  }

  // Update class
  async updateClass(classId, classData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.CLASSES.BASE}/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error('Update class error:', error);
      throw error;
    }
  }

  // Delete class
  async deleteClass(classId) {
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.CLASSES.BASE}/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Delete class error:', error);
      throw error;
    }
  }

  // Get class members (students)
  async getClassMembers(classId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CLASSES.MEMBERS(classId));
      return response.data;
    } catch (error) {
      console.error('Get class members error:', error);
      throw error;
    }
  }

  // Add members to class
  async addMembers(classId, memberIds) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CLASSES.MEMBERS(classId), {
        user_ids: memberIds,
      });
      return response.data;
    } catch (error) {
      console.error('Add members error:', error);
      throw error;
    }
  }

  // Remove members from class
  async removeMembers(classId, memberIds) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CLASSES.MEMBERS(classId), {
        data: { user_ids: memberIds },
      });
      return response.data;
    } catch (error) {
      console.error('Remove members error:', error);
      throw error;
    }
  }
}

export default new ClassesService();

