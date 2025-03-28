/**
 * API Service pour communiquer avec le backend Laravel
 * Ce fichier contient toutes les fonctions nécessaires pour interagir avec l'API
 */

// URL de base de l'API, à configurer dans .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Fonction utilitaire pour effectuer des requêtes API
 * @param {string} endpoint - Point de terminaison API
 * @param {Object} options - Options de la requête fetch
 * @returns {Promise<any>} - Données de réponse
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erreur API: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Récupère la liste des patients
 * @returns {Promise<Array>} Liste des patients
 */
export async function getPatients() {
  return fetchAPI('patients');
}

/**
 * Récupère les détails d'un patient
 * @param {number} id - ID du patient
 * @returns {Promise<Object>} Détails du patient
 */
export async function getPatientById(id) {
  return fetchAPI(`patients/${id}`);
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

/**
 * Enregistre un nouveau patient
 * @param {Object} patientData - Données du patient
 * @returns {Promise<Object>} Patient créé
 */
export async function createPatient(patientData) {
  return fetchAPI('patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  });
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
  });
}

/**
 * Supprime un patient
 * @param {number} id - ID du patient
 * @returns {Promise<void>}
 */
export async function deletePatient(id) {
  return fetchAPI(`patients/${id}`, {
    method: 'DELETE',
  });
}
