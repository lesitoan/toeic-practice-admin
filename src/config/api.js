const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtoiecpracticeproduction.up.railway.app/';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}api/v1/authentication/login`,
    REGISTER: `${API_BASE_URL}/v1/register`,
    LOGOUT: `${API_BASE_URL}/v1/authentication/logout`,
    REFRESH: `${API_BASE_URL}/v1/authentication/token`,
    GOOGLE_LOGIN: `${API_BASE_URL}/v1/authentication/login/google`,
  },
  USERS: {
    LIST: `${API_BASE_URL}/v1/users/information`,
    BASE: `${API_BASE_URL}/users`,
  },
  VOCABULARY: `${API_BASE_URL}/vocabulary`,
  TESTS: `${API_BASE_URL}/tests`,
  ANALYTICS: `${API_BASE_URL}/analytics`,
};

export default API_BASE_URL;    