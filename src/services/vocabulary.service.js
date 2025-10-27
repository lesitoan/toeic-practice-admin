import apiClient from '@/utils/axios';
import { API_ENDPOINTS } from '@/config/api';

// Mock data for development
const mockVocabularies = [
  {
    id: 1,
    word: 'abundant',
    definition: 'existing in large quantities; plentiful',
    pronunciation: '/əˈbʌndənt/',
    partOfSpeech: 'adjective',
    example: 'The region has abundant natural resources.',
    difficulty: 'intermediate',
    category: 'general',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    word: 'accomplish',
    definition: 'to achieve or complete successfully',
    pronunciation: '/əˈkʌmplɪʃ/',
    partOfSpeech: 'verb',
    example: 'She accomplished her goal of learning English.',
    difficulty: 'intermediate',
    category: 'general',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    word: 'acquire',
    definition: 'to gain or obtain something',
    pronunciation: '/əˈkwaɪər/',
    partOfSpeech: 'verb',
    example: 'He acquired new skills through practice.',
    difficulty: 'intermediate',
    category: 'business',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z'
  },
  {
    id: 4,
    word: 'adequate',
    definition: 'satisfactory or acceptable in quality or quantity',
    pronunciation: '/ˈædɪkwət/',
    partOfSpeech: 'adjective',
    example: 'The salary is adequate for my needs.',
    difficulty: 'intermediate',
    category: 'general',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z'
  },
  {
    id: 5,
    word: 'analyze',
    definition: 'to examine in detail to understand structure',
    pronunciation: '/ˈænəlaɪz/',
    partOfSpeech: 'verb',
    example: 'We need to analyze the data carefully.',
    difficulty: 'intermediate',
    category: 'academic',
    createdAt: '2024-01-19T11:30:00Z',
    updatedAt: '2024-01-19T11:30:00Z'
  }
];

let nextId = 6;

class VocabularyService {
  // Get all vocabularies
  async getAllVocabularies(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.VOCABULARY, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          category: params.category,
          difficulty: params.difficulty,
          partOfSpeech: params.partOfSpeech
        }
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
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get difficulty levels
  async getDifficultyLevels() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/difficulty-levels`);
      return response.data;
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
      throw error;
    }
  }

  // Get parts of speech
  async getPartsOfSpeech() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.VOCABULARY}/parts-of-speech`);
      return response.data;
    } catch (error) {
      console.error('Error fetching parts of speech:', error);
      throw error;
    }
  }
}

export default new VocabularyService();
