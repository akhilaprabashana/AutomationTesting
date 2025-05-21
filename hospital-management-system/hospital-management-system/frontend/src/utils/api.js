import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with base URL
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear localStorage and redirect to login if unauthorized
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/auth/users'),
    getDoctors: () => api.get('/auth/users?role=doctor'),
    createDoctor: (doctorData) => api.post('/auth/doctors', doctorData),
    deleteUser: (id) => api.delete(`/auth/users/${id}`),
};

// Patients API
export const patientsAPI = {
    getAll: () => api.get('/patients'),
    getById: (id) => api.get(`/patients/${id}`),
    create: (patientData) => api.post('/patients', patientData),
    update: (id, patientData) => api.put(`/patients/${id}`, patientData),
    delete: (id) => api.delete(`/patients/${id}`),
};

// Appointments API
export const appointmentsAPI = {
    getAll: () => api.get('/appointments'),
    getById: (id) => api.get(`/appointments/${id}`),
    create: (appointmentData) => api.post('/appointments', appointmentData),
    update: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
    delete: (id) => api.delete(`/appointments/${id}`),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getRecentAppointments: () => api.get('/appointments/recent'),
    getRecentLabReports: () => api.get('/dashboard/recent-lab-reports'),
};

// Lab Reports API
export const labReportsAPI = {
    getAll: () => api.get('/lab-reports'),
    getById: (id) => api.get(`/lab-reports/${id}`),
    create: (data) => api.post('/lab-reports', data),
    update: (id, data) => api.put(`/lab-reports/${id}`, data),
    delete: (id) => api.delete(`/lab-reports/${id}`),
    getByPatient: (patientId) => api.get(`/lab-reports/patient/${patientId}`),
};

export default api; 