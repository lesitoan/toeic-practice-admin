import axios from 'axios';
import { API_ENDPOINTS, default as API_BASE_URL } from '@/config/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
//console.log(' API Base URL:', API_BASE_URL);
//console.log(' Register Endpoint:', API_ENDPOINTS.AUTH.REGISTER);


// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('Axios request interceptor - Making request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: config.url.startsWith('http') ? config.url : `${config.baseURL}${config.url}`,
      originalURL: config.url
    });
    
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to request');
    } else {
      console.log('No auth token found for request');
    }
    return config;
  },
  (error) => {
    console.log('Axios request interceptor - Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('Axios response interceptor - Success:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('Axios response interceptor - Error caught:', {
      message: error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url,
      method: error?.config?.method,
      data: error?.response?.data
    });
    
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          // Use query parameter format as specified in the API documentation
          const response = await axios.post(`${API_ENDPOINTS.AUTH.REFRESH}?refresh_token=${refreshToken}`);

          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
