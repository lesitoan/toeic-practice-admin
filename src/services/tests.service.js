import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';

class TestsService {
  async createDraftTest(name = 'default') {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TESTS.CREATE_DRAFT, {
        params: { name },
      });
      return response.data;
    } catch (error) {
      console.error('Create draft test error:', error);
      throw error;
    }
  }

  async getCloudinarySignature(testTemplateId) {
    if (!testTemplateId) {
      throw new Error('Test template ID is required');
    }

    try {
      const response = await apiClient.get(
        `${API_ENDPOINTS.TESTS.SIGN_UPLOAD}/${testTemplateId}`
      );
      return response.data;
    } catch (error) {
      console.error('Get Cloudinary signature error:', error);
      throw error;
    }
  }

  async enqueueTemplateImport(testTemplateId, payload) {
    if (!testTemplateId) {
      throw new Error('Test template ID is required');
    }

    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.TESTS.ENQUEUE_TEMPLATE}/${testTemplateId}`,
        payload
      );
      return response.data;
    } catch (error) {
      console.error('Enqueue template import error:', error);
      throw error;
    }
  }
}

export default new TestsService();

