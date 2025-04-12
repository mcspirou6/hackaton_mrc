/**
 * Service de gestion des rapports
 * Ce service permet de générer, télécharger et envoyer des rapports PDF
 */

import { fetchAPI } from './api';

/**
 * Génère un rapport PDF pour un patient
 * @param {number} patientId - ID du patient
 * @param {string} reportType - Type de rapport ("Personnalisé")
 * @param {Object} options - Options supplémentaires pour le rapport
 * @returns {Promise<Object>} Rapport généré
 */
export async function generatePatientReport(patientId, reportType, options = {}) {
  try {
    console.log("Génération de rapport pour le patient ID:", patientId);
    
    // Importer les fonctions API nécessaires
    const { 
      getPatientById, 
      getMedicalInfo, 
      getMedicalHistory, 
      getImagingTests,
      getTNMClassification,
      createReport
    } = await import('./api');
    
    // Récupérer les données complètes du patient
    const patientResponse = await getPatientById(patientId);
    if (!patientResponse.success) {
      throw new Error(`Impossible de récupérer les données du patient: ${patientResponse.message}`);
    }
    const patient = patientResponse.data;
    console.log("Données patient récupérées:", patient);
    
    // Récupérer les informations médicales détaillées
    const medicalInfoResponse = await getMedicalInfo(patientId);
    const medicalInfo = medicalInfoResponse.success ? medicalInfoResponse.data : null;
    console.log("Informations médicales récupérées:", medicalInfo);
    
    // Récupérer l'historique médical complet
    const medicalHistoryResponse = await getMedicalHistory(patientId);
    const medicalHistory = medicalHistoryResponse.success ? medicalHistoryResponse.data : null;
    
    // Récupérer les examens d'imagerie
    const imagingTestsResponse = await getImagingTests(patientId);
    const imagingTests = imagingTestsResponse.success ? imagingTestsResponse.data : null;
    
    // Récupérer la classification TNM si disponible
    const tnmResponse = await getTNMClassification(patientId);
    const tnmClassification = tnmResponse.success ? tnmResponse.data : null;
    
    // Générer un titre de rapport significatif
    let title = `Rapport médical - ${patient.first_name} ${patient.last_name}`;
    if (medicalInfo && medicalInfo.kidney_disease_stage_id) {
      title += ` (Stade ${medicalInfo.kidney_disease_stage_id})`;
    }
    
    // Ajouter la date actuelle
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    
    // Créer un objet avec toutes les données du patient pour le rapport
    const reportData = {
      title,
      type: reportType || "Personnalisé",
      category: "Patients",
      date: formattedDate,
      author: options.author || "Dr. Système",
      status: "Généré",
      format: "PDF",
      patient_id: patientId,
      user_id: options.user_id || 1,
      content: JSON.stringify({
        patient: {
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          birth_date: patient.birth_date,
          gender: patient.gender,
          address: patient.address,
          phone: patient.phone,
          emergency_contact: patient.emergency_contact
        },
        medicalInfo: medicalInfo ? {
          id: medicalInfo.id,
          patient_id: medicalInfo.patient_id,
          kidney_disease_stage_id: medicalInfo.kidney_disease_stage_id,
          creatinine_level: medicalInfo.creatinine_level,
          gfr: medicalInfo.gfr,
          on_dialysis: medicalInfo.on_dialysis,
          dialysis_type: medicalInfo.dialysis_type,
          dialysis_start_date: medicalInfo.dialysis_start_date
        } : null,
        medicalHistory: medicalHistory,
        imagingTests: imagingTests,
        tnmClassification: tnmClassification
      })
    };
    
    console.log("Données du rapport à enregistrer:", reportData);
    
    // Enregistrer le rapport dans la base de données
    const saveResponse = await createReport(reportData);
    console.log("Réponse de l'API createReport:", saveResponse);
    
    if (!saveResponse.success) {
      throw new Error(`Impossible d'enregistrer le rapport: ${saveResponse.message}`);
    }
    
    return {
      success: true,
      data: saveResponse.data,
      message: "Rapport généré et enregistré avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de la génération du rapport'
    };
  }
}

/**
 * Récupère la liste des rapports disponibles
 * @param {Object} filters - Filtres (type, category, status, date)
 * @returns {Promise<Array>} Liste des rapports
 */
export async function getReports(filters = {}) {
  try {
    // Importer fetchAPI depuis api.js
    const { fetchAPI } = await import('./api');
    
    // Construire les paramètres de requête pour les filtres
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.author) queryParams.append('author', filters.author);
    if (filters.search) queryParams.append('search', filters.search);
    
    // Essayer d'appeler l'API, sinon utiliser des données simulées
    try {
      // Appeler l'API pour récupérer les rapports avec les filtres
      const response = await fetchAPI(`reports?${queryParams.toString()}`, {}, true);
      
      if (response.success) {
        return response;
      }
      
      // Si l'API échoue, passer aux données simulées
      console.warn('API indisponible, utilisation de données simulées');
    } catch (apiError) {
      console.warn('Erreur API, utilisation de données simulées:', apiError);
    }
    
    // Simuler des données de rapports
    const reports = [
      { id: 1, title: "Rapport mensuel - Avril 2025", type: "Mensuel", category: "Patients", status: "Généré", date: "2025-04-01", author: "Dr. Martin", size: "1.2 MB" },
      { id: 2, title: "Suivi des patients critiques", type: "Spécial", category: "Patients", status: "Généré", date: "2025-03-15", author: "Dr. Dupont", size: "0.8 MB" },
      { id: 3, title: "Analyse trimestrielle - Q1 2025", type: "Trimestriel", category: "Performance", status: "Généré", date: "2025-03-31", author: "Dr. Martin", size: "2.5 MB" },
      { id: 4, title: "Rapport des nouveaux patients", type: "Mensuel", category: "Patients", status: "Généré", date: "2025-03-01", author: "Dr. Dupont", size: "1.1 MB" },
      { id: 5, title: "Analyse des médicaments", type: "Spécial", category: "Médicaments", status: "Généré", date: "2025-02-15", author: "Dr. Martin", size: "1.7 MB" },
      { id: 6, title: "Rapport annuel 2024", type: "Annuel", category: "Performance", status: "Généré", date: "2025-01-15", author: "Dr. Dupont", size: "4.2 MB" },
    ];
    
    // Appliquer les filtres si fournis
    let filteredReports = [...reports];
    
    if (filters.type) {
      filteredReports = filteredReports.filter(report => report.type === filters.type);
    }
    
    if (filters.category) {
      filteredReports = filteredReports.filter(report => report.category === filters.category);
    }
    
    if (filters.status) {
      filteredReports = filteredReports.filter(report => report.status === filters.status);
    }
    
    if (filters.date) {
      // Filtrer par date (format YYYY-MM-DD)
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.date);
        const filterDate = new Date(filters.date);
        return reportDate.getFullYear() === filterDate.getFullYear() && 
               reportDate.getMonth() === filterDate.getMonth() && 
               reportDate.getDate() === filterDate.getDate();
      });
    }
    
    if (filters.author) {
      filteredReports = filteredReports.filter(report => report.author === filters.author);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredReports = filteredReports.filter(report => 
        report.title.toLowerCase().includes(searchLower) || 
        report.category.toLowerCase().includes(searchLower) || 
        report.author.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      success: true,
      data: filteredReports,
      message: "Rapports récupérés avec succès (données simulées)"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de la récupération des rapports',
      data: []
    };
  }
}

/**
 * Télécharge un rapport au format PDF
 * @param {number} reportId - ID du rapport
 * @returns {Promise<Blob>} Fichier PDF
 */
export async function downloadReport(reportId) {
  try {
    // Dans un environnement réel, cette fonction appellerait l'API backend pour télécharger le fichier
    // Ici, nous simulons le téléchargement
    
    // Simuler un délai de téléchargement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simuler un succès de téléchargement
    return {
      success: true,
      message: "Rapport téléchargé avec succès"
    };
  } catch (error) {
    console.error('Erreur lors du téléchargement du rapport:', error);
    throw error;
  }
}

/**
 * Envoie un rapport par email avec des options de personnalisation
 * @param {number} reportId - ID du rapport
 * @param {string} email - Email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} message - Message personnalisé
 * @param {Object} options - Options d'envoi supplémentaires
 * @returns {Promise<Object>} Résultat de l'envoi
 */
export async function sendReportByEmail(reportId, email, subject, message, options = {}) {
  try {
    // Récupérer les informations du rapport
    const { fetchAPI } = await import('./api');
    
    // Préparer les données d'envoi
    const emailData = {
      report_id: reportId,
      recipient_email: email,
      subject: subject,
      message: message,
      options: {
        cc: options.cc || [],
        bcc: options.bcc || [],
        priority: options.priority || 'normal',
        notification: options.notification || false,
        template: options.template || 'default',
        attachments: options.attachments || [],
        format: options.format || 'PDF'
      }
    };
    
    // Envoyer la requête au backend
    const response = await fetchAPI('reports/send-email', {
      method: 'POST',
      body: JSON.stringify(emailData),
    }, true);
    
    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de l\'envoi du rapport');
    }
    
    return {
      success: true,
      data: response.data,
      message: `Rapport envoyé avec succès à ${email}${options.cc?.length ? ' et en copie' : ''}`
    };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du rapport par email:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de l\'envoi du rapport'
    };
  }
}

/**
 * Récupère les détails d'un patient pour le rapport
 * @param {number} patientId - ID du patient
 * @returns {Promise<Object>} Détails du patient
 */
export async function getPatientDetailsForReport(patientId) {
  try {
    // Importer les fonctions API nécessaires
    const { 
      getPatientById, 
      getMedicalInfo, 
      getMedicalHistory, 
      getAppointments, 
      getPatientConsultationHistory,
      getLatestPatientRecord
    } = await import('./api');
    
    // Récupérer les données de base du patient
    const patientResponse = await getPatientById(patientId);
    if (!patientResponse.success) {
      throw new Error(`Impossible de récupérer les données du patient: ${patientResponse.message}`);
    }
    
    const patient = patientResponse.data;
    
    // Récupérer les informations médicales
    const medicalInfoResponse = await getMedicalInfo(patientId);
    const medicalInfo = medicalInfoResponse.success ? medicalInfoResponse.data : null;
    
    // Récupérer l'historique médical
    const medicalHistoryResponse = await getMedicalHistory(patientId);
    const medicalHistory = medicalHistoryResponse.success ? medicalHistoryResponse.data : null;
    
    // Récupérer les rendez-vous
    const appointmentsResponse = await getAppointments({ patient_id: patientId });
    const appointments = appointmentsResponse.success ? appointmentsResponse.data : [];
    
    // Récupérer l'historique des consultations
    const consultationsResponse = await getPatientConsultationHistory(patientId);
    const consultations = consultationsResponse.success ? consultationsResponse.data : [];
    
    // Récupérer le dernier dossier médical
    const latestRecordResponse = await getLatestPatientRecord(patientId);
    const latestRecord = latestRecordResponse.success ? latestRecordResponse.data : null;
    
    // Construire les résultats de laboratoire à partir des consultations ou du dernier dossier
    let labResults = [];
    if (consultations && consultations.length > 0) {
      // Extraire les résultats de laboratoire des consultations
      consultations.forEach(consultation => {
        if (consultation.lab_results) {
          const consultationDate = consultation.date;
          Object.entries(consultation.lab_results).forEach(([test, value]) => {
            // Déterminer le statut en fonction des valeurs normales
            let status = "Normal";
            if (test === "creatinine" && value > 1.3) status = "Élevé";
            if (test === "gfr" && value < 60) status = "Réduit";
            if (test === "potassium" && (value < 3.5 || value > 5.0)) status = "Anormal";
            if (test === "hemoglobin" && value < 12) status = "Bas";
            
            labResults.push({
              date: consultationDate,
              test: test.charAt(0).toUpperCase() + test.slice(1).replace('_', ' '),
              value: `${value} ${getUnitForTest(test)}`,
              status: status
            });
          });
        }
      });
    } else if (latestRecord && latestRecord.lab_results) {
      // Utiliser les résultats du dernier dossier médical
      Object.entries(latestRecord.lab_results).forEach(([test, value]) => {
        let status = "Normal";
        if (test === "creatinine" && value > 1.3) status = "Élevé";
        if (test === "gfr" && value < 60) status = "Réduit";
        if (test === "potassium" && (value < 3.5 || value > 5.0)) status = "Anormal";
        if (test === "hemoglobin" && value < 12) status = "Bas";
        
        labResults.push({
          date: latestRecord.date,
          test: test.charAt(0).toUpperCase() + test.slice(1).replace('_', ' '),
          value: `${value} ${getUnitForTest(test)}`,
          status: status
        });
      });
    }
    
    // Construire les traitements à partir des consultations ou du dernier dossier
    let treatments = [];
    if (consultations && consultations.length > 0) {
      // Extraire les traitements des consultations
      consultations.forEach(consultation => {
        if (consultation.treatments) {
          consultation.treatments.forEach(treatment => {
            treatments.push({
              name: treatment.name,
              dosage: treatment.dosage,
              frequency: treatment.frequency,
              startDate: treatment.start_date || consultation.date
            });
          });
        }
      });
    } else if (medicalInfo && medicalInfo.current_treatment) {
      // Utiliser le traitement actuel des informations médicales
      const treatmentsList = medicalInfo.current_treatment.split(',');
      treatmentsList.forEach(treatment => {
        treatments.push({
          name: treatment.trim(),
          dosage: "N/A",
          frequency: "N/A",
          startDate: medicalInfo.diagnosis_date || "N/A"
        });
      });
    }
    
    // Construire l'évolution du DFG et de la créatinine
    let evolution = [];
    if (consultations && consultations.length > 0) {
      // Trier les consultations par date
      const sortedConsultations = [...consultations].sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Extraire les valeurs de DFG et créatinine
      sortedConsultations.forEach(consultation => {
        if (consultation.lab_results) {
          const { gfr, creatinine } = consultation.lab_results;
          if (gfr !== undefined || creatinine !== undefined) {
            evolution.push({
              date: consultation.date,
              gfr: gfr !== undefined ? gfr : null,
              creatinine: creatinine !== undefined ? creatinine : null
            });
          }
        }
      });
    }
    
    // Fonction utilitaire pour obtenir l'unité de mesure d'un test
    function getUnitForTest(test) {
      const units = {
        creatinine: "mg/dL",
        gfr: "mL/min",
        potassium: "mmol/L",
        hemoglobin: "g/dL",
        albuminuria: "mg/g",
        blood_pressure_systolic: "mmHg",
        blood_pressure_diastolic: "mmHg"
      };
      return units[test] || "";
    }
    
    // Construire l'objet de réponse complet
    return {
      success: true,
      data: {
        ...patient,
        status: patient.status || (medicalInfo ? determineStatus(medicalInfo) : "Stable"),
        stade: patient.stade || (medicalInfo ? determineStage(medicalInfo) : "N/A"),
        medicalInfo: medicalInfo || {},
        medicalHistory: medicalHistory || {},
        appointments: appointments,
        labResults: labResults,
        treatments: treatments,
        evolution: evolution
      },
      message: "Détails du patient récupérés avec succès"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du patient:', error);
    
    // En cas d'erreur, retourner un message d'erreur
    return {
      success: false,
      message: `Erreur lors de la récupération des détails du patient: ${error.message}`
    };
  }
}

// Fonction pour déterminer le statut du patient en fonction de ses informations médicales
function determineStatus(medicalInfo) {
  if (!medicalInfo) return "Stable";
  
  // Déterminer le statut en fonction du DFG et d'autres paramètres
  if (medicalInfo.on_dialysis) return "Critique";
  if (medicalInfo.gfr < 30) return "Critique";
  if (medicalInfo.gfr < 45) return "Attention";
  if (medicalInfo.creatinine_level > 2.0) return "Attention";
  
  return "Stable";
}

// Fonction pour déterminer le stade de la maladie rénale en fonction du DFG
function determineStage(medicalInfo) {
  if (!medicalInfo || medicalInfo.gfr === undefined) return "N/A";
  
  if (medicalInfo.gfr >= 90) return "Stade 1";
  if (medicalInfo.gfr >= 60) return "Stade 2";
  if (medicalInfo.gfr >= 30) return "Stade 3";
  if (medicalInfo.gfr >= 15) return "Stade 4";
  return "Stade 5";
}

/**
 * Récupère les modèles de rapports disponibles
 * @returns {Promise<Array>} Liste des modèles de rapports
 */
export async function getReportTemplates() {
  try {
    // Importer fetchAPI depuis api.js
    const { fetchAPI } = await import('./api');
    
    // Essayer d'appeler l'API, sinon utiliser des données simulées
    // Récupérer les modèles de rapports depuis l'API
    const response = await fetchAPI('reports/templates', {}, true).catch(error => {
      console.warn('Erreur API, utilisation de données simulées pour les modèles de rapports:', error);
      return { success: false };
    });
    
    // Si l'API a réussi et retourné des données valides, les utiliser
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      return response;
    }
    
    // Sinon, utiliser les données simulées
    console.warn('API indisponible ou données invalides, utilisation de données simulées pour les modèles de rapports');
    
    // Simuler une liste de modèles
    const templates = [
      { id: 1, title: "Rapport mensuel des patients", description: "Vue d'ensemble des patients, nouveaux patients, et statuts", category: "Patients", icon: "Users" },
      { id: 2, title: "Suivi des traitements", description: "Analyse des traitements administrés et leur efficacité", category: "Traitements", icon: "Activity" },
      { id: 3, title: "Analyse des médicaments", description: "Consommation et efficacité des médicaments", category: "Médicaments", icon: "Pill" },
      { id: 4, title: "Rapport de performance", description: "Métriques de performance du service", category: "Performance", icon: "BarChart2" },
      { id: 5, title: "Patients à risque", description: "Liste et analyse des patients à haut risque", category: "Patients", icon: "AlertTriangle" },
      { id: 6, title: "Rapport personnalisé", description: "Créez un rapport sur mesure", category: "Personnalisé", icon: "FileText" },
    ];
    
    return {
      success: true,
      data: templates,
      message: "Modèles de rapports récupérés avec succès (données simulées)"
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des modèles de rapports:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de la récupération des modèles de rapports',
      data: []
    };
  }
}