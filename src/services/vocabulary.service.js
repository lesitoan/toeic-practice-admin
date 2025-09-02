import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
      // For now, return mock data
      // In production, this would be: const response = await axios.get(`${API_BASE_URL}/vocabularies`, { params });
      
      let filteredData = [...mockVocabularies];
      
      // Apply filters
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredData = filteredData.filter(vocab => 
          vocab.word.toLowerCase().includes(searchTerm) ||
          vocab.definition.toLowerCase().includes(searchTerm) ||
          vocab.example.toLowerCase().includes(searchTerm)
        );
      }
      
      if (params.difficulty) {
        filteredData = filteredData.filter(vocab => vocab.difficulty === params.difficulty);
      }
      
      if (params.category) {
        filteredData = filteredData.filter(vocab => vocab.category === params.category);
      }
      
      if (params.partOfSpeech) {
        filteredData = filteredData.filter(vocab => vocab.partOfSpeech === params.partOfSpeech);
      }
      
      return {
        data: filteredData,
        total: filteredData.length,
        page: params.page || 1,
        limit: params.limit || 10
      };
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      throw error;
    }
  }

  // Get vocabulary by ID
  async getVocabularyById(id) {
    try {
      // For now, return mock data
      // In production, this would be: const response = await axios.get(`${API_BASE_URL}/vocabularies/${id}`);
      
      const vocabulary = mockVocabularies.find(vocab => vocab.id === parseInt(id));
      if (!vocabulary) {
        throw new Error('Vocabulary not found');
      }
      
      return vocabulary;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      throw error;
    }
  }

  // Create new vocabulary
  async createVocabulary(vocabularyData) {
    try {
      // For now, add to mock data
      // In production, this would be: const response = await axios.post(`${API_BASE_URL}/vocabularies`, vocabularyData);
      
      const newVocabulary = {
        id: nextId++,
        ...vocabularyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockVocabularies.push(newVocabulary);
      
      return newVocabulary;
    } catch (error) {
      console.error('Error creating vocabulary:', error);
      throw error;
    }
  }

  // Update vocabulary
  async updateVocabulary(id, vocabularyData) {
    try {
      // For now, update mock data
      // In production, this would be: const response = await axios.put(`${API_BASE_URL}/vocabularies/${id}`, vocabularyData);
      
      const index = mockVocabularies.findIndex(vocab => vocab.id === parseInt(id));
      if (index === -1) {
        throw new Error('Vocabulary not found');
      }
      
      mockVocabularies[index] = {
        ...mockVocabularies[index],
        ...vocabularyData,
        updatedAt: new Date().toISOString()
      };
      
      return mockVocabularies[index];
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      throw error;
    }
  }

  // Delete vocabulary
  async deleteVocabulary(id) {
    try {
      // For now, remove from mock data
      // In production, this would be: const response = await axios.delete(`${API_BASE_URL}/vocabularies/${id}`);
      
      const index = mockVocabularies.findIndex(vocab => vocab.id === parseInt(id));
      if (index === -1) {
        throw new Error('Vocabulary not found');
      }
      
      const deletedVocabulary = mockVocabularies.splice(index, 1)[0];
      return deletedVocabulary;
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      throw error;
    }
  }

  // Get vocabulary categories
  async getCategories() {
    try {
      // Mock categories
      return [
        { value: 'general', label: 'General' },
        { value: 'business', label: 'Business' },
        { value: 'academic', label: 'Academic' },
        { value: 'travel', label: 'Travel' },
        { value: 'technology', label: 'Technology' },
        { value: 'health', label: 'Health' },
        { value: 'education', label: 'Education' }
      ];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get difficulty levels
  async getDifficultyLevels() {
    try {
      return [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
      ];
    } catch (error) {
      console.error('Error fetching difficulty levels:', error);
      throw error;
    }
  }

  // Get parts of speech
  async getPartsOfSpeech() {
    try {
      return [
        { value: 'noun', label: 'Noun' },
        { value: 'verb', label: 'Verb' },
        { value: 'adjective', label: 'Adjective' },
        { value: 'adverb', label: 'Adverb' },
        { value: 'preposition', label: 'Preposition' },
        { value: 'conjunction', label: 'Conjunction' },
        { value: 'pronoun', label: 'Pronoun' },
        { value: 'interjection', label: 'Interjection' }
      ];
    } catch (error) {
      console.error('Error fetching parts of speech:', error);
      throw error;
    }
  }
}

export default new VocabularyService();
