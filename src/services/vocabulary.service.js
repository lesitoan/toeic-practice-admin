import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';
import { CATEGORIES, DIFFICULTY_LEVELS, PARTS_OF_SPEECH } from '@/constants/vocabulary';

class VocabularyService {
  // Get all vocabularies
  async getAllVocabularies(params = {}) {
    try {
      // Build query parameters, only including non-empty values
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
      };
      
      // Only add filter parameters if they have values
      if (params.search && typeof params.search === 'string' && params.search.trim()) {
        queryParams.search = params.search.trim();
      }
      if (params.category && typeof params.category === 'string' && params.category.trim()) {
        queryParams.category = params.category.trim();
      }
      if (params.difficulty && typeof params.difficulty === 'string' && params.difficulty.trim()) {
        queryParams.difficulty = params.difficulty.trim();
      }
      if (params.partOfSpeech && typeof params.partOfSpeech === 'string' && params.partOfSpeech.trim()) {
        queryParams.partOfSpeech = params.partOfSpeech.trim();
      }

      const response = await apiClient.get(API_ENDPOINTS.VOCABULARY, {
        params: queryParams
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      throw error;
    }
  }

  // Get vocabulary by ID
  async getVocabularyById(id) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  }

  // Create new vocabulary
  async createVocabulary(vocabularyData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.VOCABULARY, vocabularyData);
      return response.data;
    } catch (error) {
      console.error('Error creating vocabulary:', error);
      throw error;
    }
  }

  // Create multiple vocabularies (bulk create)
  // API endpoint: POST /api/v1/vocabulary
  // Request body: { list: [{ word, definition, example, image_url, audio_url, part_of_speech, level, category_name }] }
  // Response: 200 with string message
  async createVocabularyList(vocabularyList) {
    try {
      // Format the vocabulary list according to API specification
      const formattedList = vocabularyList.map(item => ({
        word: item.word || '',
        definition: item.definition || '',
        example: item.example || '',
        image_url: item.image_url || item.imageUrl || '',
        audio_url: item.audio_url || item.audioUrl || '',
        part_of_speech: item.part_of_speech !== undefined ? item.part_of_speech : (item.partOfSpeech || 0),
        level: item.level !== undefined ? item.level : 0,
        category_name: item.category_name || item.categoryName || item.category || ''
      }));

      const requestBody = {
        list: formattedList
      };

      const response = await apiClient.post(API_ENDPOINTS.VOCABULARY, requestBody);
      // API returns 200 with a string response
      return response.data;
    } catch (error) {
      console.error('Error creating vocabulary list:', error);
      throw error;
    }
  }

  // Update vocabulary
  async updateVocabulary(id, vocabularyData) {
    try {
      const response = await apiClient.put(`${API_ENDPOINTS.VOCABULARY}/${id}`, vocabularyData);
      return response.data;
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      throw error;
    }
  }

  // Delete vocabulary
  async deleteVocabulary(id) {
    try {
      await apiClient.delete(`${API_ENDPOINTS.VOCABULARY}/${id}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      throw error;
    }
  }

  // Get vocabulary categories
  async getCategories() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/categories`);
      return response.data;
    } catch (error) {
      // Silently use fallback data if API endpoint is not available
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.warn('Categories endpoint not available, using fallback data');
      } else {
        console.error('Error fetching categories, using fallback data:', error);
      }
      return CATEGORIES;
    }
  }

  // Get difficulty levels
  async getDifficultyLevels() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/difficulty-levels`);
      return response.data;
    } catch (error) {
      // Silently use fallback data if API endpoint is not available
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.warn('Difficulty levels endpoint not available, using fallback data');
      } else {
        console.error('Error fetching difficulty levels, using fallback data:', error);
      }
      return DIFFICULTY_LEVELS;
    }
  }

  // Get parts of speech
  async getPartsOfSpeech() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/parts-of-speech`);
      return response.data;
    } catch (error) {
      // Silently use fallback data if API endpoint is not available
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.warn('Parts of speech endpoint not available, using fallback data');
      } else {
        console.error('Error fetching parts of speech, using fallback data:', error);
      }
      return PARTS_OF_SPEECH;
    }
  }
}

export default new VocabularyService();
