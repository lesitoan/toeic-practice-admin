const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
  },
  USERS: `${API_BASE_URL}/users`,
  VOCABULARY: `${API_BASE_URL}/vocabulary`,
  TESTS: `${API_BASE_URL}/tests`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
};

export default API_BASE_URL;