/**
 * Service d'email pour l'envoi de notifications aux patients
 * Ce service gère l'envoi d'emails pour les rendez-vous et les rappels
 */

import { fetchAPI } from './api';

/**
 * Envoie un email de confirmation de rendez-vous au patient
 * @param {number} appointmentId - ID du rendez-vous
 * @param {string} patientEmail - Email du patient
 * @param {Object} appointmentDetails - Détails du rendez-vous
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export async function sendAppointmentConfirmationEmail(appointmentId, patientEmail, appointmentDetails) {
  try {
    const response = await fetchAPI('appointments/send-confirmation', {
      method: 'POST',
      body: JSON.stringify({
        appointment_id: appointmentId,
        patient_email: patientEmail,
        details: appointmentDetails
      }),
    }, true);
    
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
    throw error;
  }
}

/**
 * Planifie l'envoi d'emails de rappel pour un rendez-vous
 * @param {number} appointmentId - ID du rendez-vous
 * @param {string} patientEmail - Email du patient
 * @param {Object} appointmentDetails - Détails du rendez-vous
 * @param {Array} reminderTimes - Moments des rappels (24h, 1h, 30min avant)
 * @returns {Promise<Object>} Résultat de la planification
 */
export async function scheduleAppointmentReminders(appointmentId, patientEmail, appointmentDetails, reminderTimes = []) {
  try {
    // Si aucun temps de rappel n'est spécifié, utiliser les valeurs par défaut
    const defaultReminderTimes = reminderTimes.length > 0 ? reminderTimes : [
      { hours: 24, minutes: 0 },  // 24h avant
      { hours: 1, minutes: 0 },   // 1h avant
      { hours: 0, minutes: 30 }   // 30min avant
    ];

    const response = await fetchAPI('appointments/schedule-reminders', {
      method: 'POST',
      body: JSON.stringify({
        appointment_id: appointmentId,
        patient_email: patientEmail,
        details: appointmentDetails,
        reminder_times: defaultReminderTimes
      }),
    }, true);
    
    return response;
  } catch (error) {
    console.error('Erreur lors de la planification des rappels:', error);
    throw error;
  }
}

/**
 * Annule les rappels programmés pour un rendez-vous
 * @param {number} appointmentId - ID du rendez-vous
 * @returns {Promise<Object>} Résultat de l'annulation
 */
export async function cancelAppointmentReminders(appointmentId) {
  try {
    const response = await fetchAPI(`appointments/${appointmentId}/cancel-reminders`, {
      method: 'POST',
    }, true);
    
    return response;
  } catch (error) {
    console.error('Erreur lors de l\'annulation des rappels:', error);
    throw error;
  }
}

/**
 * Récupère les notifications de rappel de rendez-vous pour un médecin
 * @returns {Promise<Array>} Liste des notifications
 */
export async function getDoctorAppointmentNotifications() {
  try {
    const response = await fetchAPI('appointments/notifications', {}, true);
    return response.data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    return [];
  }
}

/**
 * Marque une notification comme lue
 * @param {number} notificationId - ID de la notification
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function markNotificationAsRead(notificationId) {
  try {
    const response = await fetchAPI(`notifications/${notificationId}/mark-as-read`, {
      method: 'POST',
    }, true);
    
    return response;
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error);
    throw error;
  }
}