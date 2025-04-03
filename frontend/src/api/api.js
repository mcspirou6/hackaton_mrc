/**
 * API Service pour communiquer avec le backend Laravel
 * Ce fichier contient toutes les fonctions nécessaires pour interagir avec l'API
 */

// URL de base de l'API, à configurer dans .env.local
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Fonction utilitaire pour effectuer des requêtes API
 * @param {string} endpoint - Point de terminaison API
 * @param {Object} options - Options de la requête fetch
 * @param {boolean} withAuth - Inclure le token d'authentification
 * @returns {Promise<any>} - Données de réponse
 */
async function fetchAPI(endpoint, options = {}, withAuth = false) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // Ajouter le token d'authentification si nécessaire
  if (withAuth && typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  console.log('Fetching URL:', url, { ...defaultOptions, ...options });
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', error);
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('API Response:', data);
  return data;
}

// ===== AUTHENTIFICATION =====

/**
 * Connecte un utilisateur
 * @param {Object} credentials - Identifiants (email, password)
 * @returns {Promise<Object>} Données de l'utilisateur et token
 */
export async function login(credentials) {
  // Obtenir le CSRF token d'abord
  const baseUrl = API_BASE_URL.replace('/api', '');
  console.log('Fetching CSRF cookie from:', `${baseUrl}/sanctum/csrf-cookie`);
  
  try {
    await fetch(`${baseUrl}/sanctum/csrf-cookie`, {
      credentials: 'include'
    });
    
    // Ensuite faire la requête de login
    console.log('Making login request to:', `${API_BASE_URL}/login`);
    const response = await fetchAPI('login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    
    if (response.success && response.token) {
      // Stocker le token dans localStorage
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Déconnecte l'utilisateur
 * @returns {Promise<Object>} Message de confirmation
 */
export async function logout() {
  try {
    const response = await fetchAPI('logout', {
      method: 'POST',
    }, true);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    
    return response;
  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    throw error;
  }
}

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object>} Données de l'utilisateur
 */
export async function getCurrentUser() {
  return fetchAPI('user', {}, true);
}

/**
 * Change le mot de passe de l'utilisateur connecté
 * @param {Object} passwordData - Données du mot de passe
 * @returns {Promise<Object>} Message de confirmation
 */
export async function changePassword(passwordData) {
  return fetchAPI('change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }, true);
}

// ===== MÉDECINS =====


/**
 * Récupère la liste des médecins
 * @returns {Promise<{success: boolean, message?: string, data?: Doctor[]}>}
 */
export async function getDoctors() {
  return fetchAPI('doctors', {}, true);
}


/**
 * Récupère les détails d'un médecin
 * @param {number} id - ID du médecin
 * @returns {Promise<Object>} Détails du médecin
 */
export async function getDoctorById(id) {
  return fetchAPI(`users/${id}`, {}, true);
}

/**
 * Enregistre un nouveau médecin
 * @param {Object} doctorData - Données du médecin
 * @returns {Promise<Object>} Médecin créé
 */
export async function createDoctor(doctorData) {
  return fetchAPI('users', {
    method: 'POST',
    body: JSON.stringify(doctorData),
  }, true);
}

/**
 * Met à jour les données d'un médecin
 * @param {number} id - ID du médecin
 * @param {Object} doctorData - Nouvelles données du médecin
 * @returns {Promise<Object>} Médecin mis à jour
 */
  export async function updateDoctor(id, doctorData) {
    try {
      console.log('Envoi au backend:', { id, doctorData }); // Debug
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(doctorData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Erreur updateDoctor:', error);
      throw error;
    }
  }
/**
 * Supprime un médecin
 * @param {number} id - ID du médecin
 * @returns {Promise<Object>} Message de confirmation
 */
export async function deleteDoctor(id) {
  return fetchAPI(`users/${id}`, {
    method: 'DELETE',
  }, true);
}

/**
 * Réinitialise le mot de passe d'un médecin
 * @param {number} id - ID du médecin
 * @param {Object} passwordData - Nouveau mot de passe
 * @returns {Promise<Object>} Message de confirmation
 */
export async function resetDoctorPassword(id, passwordData) {
  return fetchAPI(`users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }, true);
}

/**
 * Récupère les statistiques des médecins
 */
/**
 * @returns {Promise<{
*   success: boolean,
*   message?: string,
*   data?: {
*     total_doctors: number,
*     active_doctors: number,
*     desactive_doctors: number,
*     suspendu_doctors: number,
*     total_patients: number,
*     average_patients_per_doctor: number
*   }
* }>}
*/
export async function getDoctorStatistics() {
 return fetchAPI('doctors/statistics', {}, true);
}

// ===== PATIENTS =====

/**
 * Récupère la liste des patients
 * @returns {Promise<Array>} Liste des patients
 */
export async function getPatients() {
  return fetchAPI('patients', {}, true);
}

/**
 * Récupère les détails d'un patient
 * @param {number} id - ID du patient
 * @returns {Promise<Object>} Détails du patient
 */
export async function getPatientById(id) {
  return fetchAPI(`patients/${id}`, {}, true);
}

/**
 * Enregistre un nouveau patient
 * @param {Object} patientData - Données du patient
 * @returns {Promise<Object>} Patient créé
 */
export async function createPatient(patientData) {
  return fetchAPI('patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  }, true);
}

/**
 * Met à jour les données d'un patient
 * @param {number} id - ID du patient
 * @param {Object} patientData - Nouvelles données du patient
 * @returns {Promise<Object>} Patient mis à jour
 */
export async function updatePatient(id, patientData) {
  return fetchAPI(`patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patientData),
  }, true);
}

/**
 * Supprime un patient
 * @param {number} id - ID du patient
 * @returns {Promise<Object>} Message de confirmation
 */
export async function deletePatient(id) {
  return fetchAPI(`patients/${id}`, {
    method: 'DELETE',
  }, true);
}

// ===== RENDEZ-VOUS =====

/**
 * Récupère la liste des rendez-vous
 * @param {Object} filters - Filtres (doctor_id, patient_id, date, status)
 * @returns {Promise<Array>} Liste des rendez-vous
 */
export async function getAppointments(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `appointments?${queryParams}` : 'appointments';
  return fetchAPI(endpoint, {}, true);
}

/**
 * Récupère les détails d'un rendez-vous
 * @param {number} id - ID du rendez-vous
 * @returns {Promise<Object>} Détails du rendez-vous
 */
export async function getAppointmentById(id) {
  return fetchAPI(`appointments/${id}`, {}, true);
}

/**
 * Crée un nouveau rendez-vous
 * @param {Object} appointmentData - Données du rendez-vous
 * @returns {Promise<Object>} Rendez-vous créé
 */
export async function createAppointment(appointmentData) {
  return fetchAPI('appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  }, true);
}

/**
 * Met à jour un rendez-vous
 * @param {number} id - ID du rendez-vous
 * @param {Object} appointmentData - Nouvelles données du rendez-vous
 * @returns {Promise<Object>} Rendez-vous mis à jour
 */
export async function updateAppointment(id, appointmentData) {
  return fetchAPI(`appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData),
  }, true);
}

/**
 * Supprime un rendez-vous
 * @param {number} id - ID du rendez-vous
 * @returns {Promise<Object>} Message de confirmation
 */
export async function deleteAppointment(id) {
  return fetchAPI(`appointments/${id}`, {
    method: 'DELETE',
  }, true);
}

/**
 * Récupère les statistiques des rendez-vous
 * @returns {Promise<Object>} Statistiques
 */
export async function getAppointmentStatistics() {
  return fetchAPI('appointments/statistics', {}, true);
}

// ===== CONSULTATIONS =====

/**
 * Récupère la liste des consultations
 * @param {Object} filters - Filtres (user_id, patient_id, date)
 * @returns {Promise<Array>} Liste des consultations
 */
export async function getConsultations(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `consultations?${queryParams}` : 'consultations';
  return fetchAPI(endpoint, {}, true);
}

/**
 * Récupère les détails d'une consultation
 * @param {number} id - ID de la consultation
 * @returns {Promise<Object>} Détails de la consultation
 */
export async function getConsultationById(id) {
  return fetchAPI(`consultations/${id}`, {}, true);
}

/**
 * Crée une nouvelle consultation
 * @param {Object} consultationData - Données de la consultation
 * @returns {Promise<Object>} Consultation créée
 */
export async function createConsultation(consultationData) {
  return fetchAPI('consultations', {
    method: 'POST',
    body: JSON.stringify(consultationData),
  }, true);
}

/**
 * Met à jour une consultation
 * @param {number} id - ID de la consultation
 * @param {Object} consultationData - Nouvelles données de la consultation
 * @returns {Promise<Object>} Consultation mise à jour
 */
export async function updateConsultation(id, consultationData) {
  return fetchAPI(`consultations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(consultationData),
  }, true);
}

/**
 * Supprime une consultation
 * @param {number} id - ID de la consultation
 * @returns {Promise<Object>} Message de confirmation
 */
export async function deleteConsultation(id) {
  return fetchAPI(`consultations/${id}`, {
    method: 'DELETE',
  }, true);
}

/**
 * Récupère l'historique des consultations d'un patient
 * @param {number} patientId - ID du patient
 * @returns {Promise<Object>} Historique des consultations
 */
export async function getPatientConsultationHistory(patientId) {
  return fetchAPI(`patients/${patientId}/consultations`, {}, true);
}

/**
 * Récupère les statistiques des consultations
 * @returns {Promise<Object>} Statistiques
 */
export async function getConsultationStatistics() {
  return fetchAPI('consultations/statistics', {}, true);
}

// ===== DOSSIERS MÉDICAUX =====

/**
 * Récupère la liste des dossiers médicaux
 * @param {Object} filters - Filtres (patient_id, user_id, kidney_disease_stage_id)
 * @returns {Promise<Array>} Liste des dossiers médicaux
 */
export async function getPatientRecords(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  const endpoint = queryParams ? `patient-records?${queryParams}` : 'patient-records';
  return fetchAPI(endpoint, {}, true);
}

/**
 * Récupère les détails d'un dossier médical
 * @param {number} id - ID du dossier médical
 * @returns {Promise<Object>} Détails du dossier médical
 */
export async function getPatientRecordById(id) {
  return fetchAPI(`patient-records/${id}`, {}, true);
}

/**
 * Crée un nouveau dossier médical
 * @param {Object} recordData - Données du dossier médical
 * @returns {Promise<Object>} Dossier médical créé
 */
export async function createPatientRecord(recordData) {
  return fetchAPI('patient-records', {
    method: 'POST',
    body: JSON.stringify(recordData),
  }, true);
}

/**
 * Met à jour un dossier médical
 * @param {number} id - ID du dossier médical
 * @param {Object} recordData - Nouvelles données du dossier médical
 * @returns {Promise<Object>} Dossier médical mis à jour
 */
export async function updatePatientRecord(id, recordData) {
  return fetchAPI(`patient-records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(recordData),
  }, true);
}

/**
 * Supprime un dossier médical
 * @param {number} id - ID du dossier médical
 * @returns {Promise<Object>} Message de confirmation
 */
export async function deletePatientRecord(id) {
  return fetchAPI(`patient-records/${id}`, {
    method: 'DELETE',
  }, true);
}

/**
 * Récupère le dernier dossier médical d'un patient
 * @param {number} patientId - ID du patient
 * @returns {Promise<Object>} Dernier dossier médical
 */
export async function getLatestPatientRecord(patientId) {
  return fetchAPI(`patients/${patientId}/latest-record`, {}, true);
}

/**
 * Récupère les statistiques des dossiers médicaux
 * @returns {Promise<Object>} Statistiques
 */
export async function getPatientRecordStatistics() {
  return fetchAPI('patient-records/statistics', {}, true);
}

// ===== STADES DE MALADIE RÉNALE =====

/**
 * Récupère la liste des stades de maladie rénale
 * @returns {Promise<Array>} Liste des stades
 */
export async function getKidneyDiseaseStages() {
  return fetchAPI('kidney-disease-stages', {}, true);
}

/**
 * Récupère les détails d'un stade de maladie rénale
 * @param {number} id - ID du stade
 * @returns {Promise<Object>} Détails du stade
 */
export async function getKidneyDiseaseStageById(id) {
  return fetchAPI(`kidney-disease-stages/${id}`, {}, true);
}

/**
 * Détermine le stade de maladie rénale en fonction du DFG
 * @param {number} gfr - Débit de filtration glomérulaire
 * @returns {Promise<Object>} Stade correspondant
 */
export async function determineKidneyDiseaseStage(gfr) {
  return fetchAPI('determine-stage', {
    method: 'POST',
    body: JSON.stringify({ gfr }),
  }, true);
}

/**
 * Soumet les données pour l'analyse de maladie rénale
 * @param {Object} data - Données médicales du patient
 * @returns {Promise<Object>} Résultat de l'analyse
 */
export async function analyzeKidneyDisease(data) {
  return fetchAPI('analyze', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
