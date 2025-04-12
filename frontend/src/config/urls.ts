// Configuration des URLs de l'API
const config = {
  development: {
    API_URL: 'http://localhost:8000/api',
    BASE_URL: 'http://localhost:3000'
  },
  production: {
    API_URL: 'https://nephrosuivi-api.up.railway.app/api',
    BASE_URL: 'https://nephrosuivi.vercel.app'
  }
};

const env = process.env.NODE_ENV || 'development';
export const API_URL = config[env].API_URL;
export const BASE_URL = config[env].BASE_URL;

// Endpoints spécifiques
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Patients
  PATIENTS: '/patients',
  PATIENT_DETAILS: (id: number) => `/patients/${id}`,
  PATIENT_MEDICAL_INFO: (id: number) => `/patients/${id}/medical-info`,
  PATIENT_HISTORY: (id: number) => `/patients/${id}/history`,
  
  // Rapports
  REPORTS: '/reports',
  REPORT_DETAILS: (id: number) => `/reports/${id}`,
  REPORT_DOWNLOAD: (id: number) => `/reports/${id}/download`,
  REPORT_SEND: (id: number) => `/reports/${id}/send`,
  
  // Rendez-vous
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAILS: (id: number) => `/appointments/${id}`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  
  // Utilisateurs
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  USER_SETTINGS: '/users/settings'
};

export default { API_URL, BASE_URL, ENDPOINTS };
