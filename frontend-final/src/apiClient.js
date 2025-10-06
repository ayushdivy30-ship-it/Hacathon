import axios from 'axios';

// Create a new instance of axios with a custom configuration
const apiClient = axios.create({
    // Default to backend API root. If you set VITE_API_BASE_URL in your env, it can override this.
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', // Fallback for local dev includes /api
    headers: {
        'Content-Type': 'application/json',
    },
});

// This interceptor adds the auth token to every request
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;

