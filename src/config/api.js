const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtoiecpracticeproduction.up.railway.app/';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}api/v1/authentication/login`,
    REGISTER: `${API_BASE_URL}api/v1/register`,
    LOGOUT: `${API_BASE_URL}api/v1/authentication/logout`,
    REFRESH: `${API_BASE_URL}api/v1/authentication/token`,
    GOOGLE_LOGIN: `${API_BASE_URL}api/v1/authentication/login/google`,
    CURRENT_USER: `${API_BASE_URL}api/v1/authentication/information/me`,
  },
  USERS: {
    LIST: `${API_BASE_URL}api/v1/users/information`,
    BASE: `${API_BASE_URL}api/v1/users`,
  },
  VOCABULARY: `${API_BASE_URL}api/v1/vocabulary`,
  TESTS: `${API_BASE_URL}api/v1/tests`,
  ANALYTICS: `${API_BASE_URL}api/v1/analytics`,
};

export default API_BASE_URL;    