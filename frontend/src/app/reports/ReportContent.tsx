"use client";

import React from 'react';

interface ReportContentProps {
  report: any;
}

const ReportContent: React.FC<ReportContentProps> = ({ report }) => {
  // Analyser le contenu JSON du rapport
  let content;
  try {
    content = typeof report.content === 'string' 
      ? JSON.parse(report.content) 
      : report.content;
  } catch (error) {
    console.error("Erreur lors du parsing du contenu du rapport:", error);
    content = {};
  }

  const { patient, medicalInfo, medicalHistory, imagingTests, tnmClassification } = content || {};

  if (!patient) {
    return <div className="text-center text-red-500">Données du patient non disponibles</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Rapport médical - {patient.first_name} {patient.last_name}
        </h1>
        <p className="text-sm text-gray-600">
          Généré le {report.date} par {report.author}
        </p>
      </div>

      {/* Informations du patient */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Informations personnelles</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Nom:</span> {patient.last_name}</p>
            <p><span className="font-medium">Prénom:</span> {patient.first_name}</p>
            <p><span className="font-medium">Date de naissance:</span> {patient.birth_date}</p>
            <p><span className="font-medium">Genre:</span> {patient.gender === 'male' ? 'Homme' : 'Femme'}</p>
          </div>
          <div>
            <p><span className="font-medium">Adresse:</span> {patient.address || 'Non renseignée'}</p>
            <p><span className="font-medium">Téléphone:</span> {patient.phone || 'Non renseigné'}</p>
            <p><span className="font-medium">Contact d'urgence:</span> {patient.emergency_contact || 'Non renseigné'}</p>
          </div>
        </div>
      </div>

      {/* Informations médicales */}
      {medicalInfo && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Informations médicales</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Stade de maladie rénale:</span> {medicalInfo.kidney_disease_stage_id ? `Stade ${medicalInfo.kidney_disease_stage_id}` : 'Non déterminé'}</p>
                <p><span className="font-medium">Créatinine:</span> {medicalInfo.creatinine_level ? `${medicalInfo.creatinine_level} mg/dL` : 'Non mesurée'}</p>
                <p><span className="font-medium">DFG (GFR):</span> {medicalInfo.gfr ? `${medicalInfo.gfr} mL/min/1.73m²` : 'Non calculé'}</p>
              </div>
              <div>
                <p><span className="font-medium">Dialyse:</span> {medicalInfo.on_dialysis ? 'Oui' : 'Non'}</p>
                {medicalInfo.on_dialysis && (
                  <>
                    <p><span className="font-medium">Type de dialyse:</span> {medicalInfo.dialysis_type || 'Non spécifié'}</p>
                    <p><span className="font-medium">Date de début:</span> {medicalInfo.dialysis_start_date || 'Non spécifiée'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Antécédents médicaux */}
      {medicalHistory && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Antécédents médicaux</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><span className="font-medium">Diabète:</span> {medicalHistory.diabetes ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Hypertension:</span> {medicalHistory.hypertension ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Maladie cardiaque:</span> {medicalHistory.heart_disease ? 'Oui' : 'Non'}</p>
              </div>
              <div>
                <p><span className="font-medium">Tabagisme:</span> {medicalHistory.smoking ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Antécédents familiaux:</span> {medicalHistory.family_history ? 'Oui' : 'Non'}</p>
                <p><span className="font-medium">Notes:</span> {medicalHistory.notes || 'Aucune'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examens d'imagerie */}
      {imagingTests && imagingTests.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Examens d'imagerie</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultats</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {imagingTests.map((test: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{test.test_date}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{test.test_type}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{test.results}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Classification TNM */}
      {tnmClassification && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Classification TNM</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">T (Tumeur primaire):</p>
                <p className="text-lg font-bold">{tnmClassification.t_stage || 'Non déterminé'}</p>
                <p className="text-sm text-gray-500">{getTDescription(tnmClassification.t_stage)}</p>
              </div>
              <div>
                <p className="font-medium">N (Ganglions lymphatiques):</p>
                <p className="text-lg font-bold">{tnmClassification.n_stage || 'Non déterminé'}</p>
                <p className="text-sm text-gray-500">{getNDescription(tnmClassification.n_stage)}</p>
              </div>
              <div>
                <p className="font-medium">M (Métastases):</p>
                <p className="text-lg font-bold">{tnmClassification.m_stage || 'Non déterminé'}</p>
                <p className="text-sm text-gray-500">{getMDescription(tnmClassification.m_stage)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium">Stade global:</p>
              <p className="text-lg font-bold">{getOverallStage(tnmClassification)}</p>
              <p className="text-sm text-gray-500">Date d'évaluation: {tnmClassification.evaluation_date || 'Non spécifiée'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommandations */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Recommandations</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p>
            {getRecommendations(medicalInfo, medicalHistory)}
          </p>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-10 pt-4 border-t">
        <p className="text-right text-sm text-gray-600">
          Signature du médecin: {report.author}
        </p>
      </div>
    </div>
  );
};

// Fonctions utilitaires pour les descriptions TNM
function getTDescription(tStage: string): string {
  const descriptions: {[key: string]: string} = {
    'T1': 'Tumeur limitée au rein, ≤ 7 cm',
    'T1a': 'Tumeur ≤ 4 cm',
    'T1b': 'Tumeur > 4 cm mais ≤ 7 cm',
    'T2': 'Tumeur > 7 cm, limitée au rein',
    'T2a': 'Tumeur > 7 cm mais ≤ 10 cm',
    'T2b': 'Tumeur > 10 cm, limitée au rein',
    'T3': 'Extension aux veines majeures ou aux tissus périrénaux',
    'T3a': 'Extension à la veine rénale ou aux tissus périrénaux',
    'T3b': 'Extension à la veine cave sous le diaphragme',
    'T3c': 'Extension à la veine cave au-dessus du diaphragme',
    'T4': 'Invasion au-delà du fascia de Gerota'
  };
  return descriptions[tStage] || 'Description non disponible';
}

function getNDescription(nStage: string): string {
  const descriptions: {[key: string]: string} = {
    'N0': 'Pas de métastase ganglionnaire régionale',
    'N1': 'Métastase dans un ganglion régional',
    'N2': 'Métastases dans plus d\'un ganglion régional'
  };
  return descriptions[nStage] || 'Description non disponible';
}

function getMDescription(mStage: string): string {
  const descriptions: {[key: string]: string} = {
    'M0': 'Pas de métastase à distance',
    'M1': 'Présence de métastase(s) à distance'
  };
  return descriptions[mStage] || 'Description non disponible';
}

function getOverallStage(tnm: any): string {
  if (!tnm) return 'Non déterminé';
  
  // Logique simplifiée pour déterminer le stade global
  if (tnm.m_stage === 'M1') return 'Stade IV';
  if (tnm.t_stage === 'T4') return 'Stade III ou IV';
  if (tnm.n_stage === 'N1' || tnm.n_stage === 'N2') return 'Stade III';
  if (tnm.t_stage === 'T3') return 'Stade III';
  if (tnm.t_stage === 'T2') return 'Stade II';
  if (tnm.t_stage === 'T1') return 'Stade I';
  
  return 'Non déterminé';
}

function getRecommendations(medicalInfo: any, medicalHistory: any): string {
  if (!medicalInfo) return 'Aucune recommandation disponible en l\'absence d\'informations médicales.';
  
  let recommendations = [];
  
  // Recommandations basées sur le stade de la maladie rénale
  if (medicalInfo.kidney_disease_stage_id) {
    const stage = medicalInfo.kidney_disease_stage_id;
    
    if (stage >= 4) {
      recommendations.push('Consultation urgente avec un néphrologue pour évaluation de la préparation à la thérapie de remplacement rénal.');
    } else if (stage >= 3) {
      recommendations.push('Suivi régulier avec un néphrologue tous les 3 mois.');
      recommendations.push('Contrôle strict de la pression artérielle et de la glycémie.');
    } else if (stage >= 2) {
      recommendations.push('Suivi avec un néphrologue tous les 6 mois.');
      recommendations.push('Adopter un régime pauvre en sel et modéré en protéines.');
    } else {
      recommendations.push('Suivi annuel avec analyses sanguines et urinaires.');
    }
  }
  
  // Recommandations basées sur le DFG
  if (medicalInfo.gfr) {
    const gfr = medicalInfo.gfr;
    
    if (gfr < 15) {
      recommendations.push('Préparation à la dialyse ou à la transplantation rénale.');
    } else if (gfr < 30) {
      recommendations.push('Restriction hydrique et diététique sous supervision médicale.');
      recommendations.push('Évaluation pour une préparation éventuelle à la dialyse.');
    } else if (gfr < 60) {
      recommendations.push('Éviter les médicaments néphrotoxiques.');
      recommendations.push('Maintenir une hydratation adéquate.');
    }
  }
  
  // Recommandations basées sur les facteurs de risque
  if (medicalHistory) {
    if (medicalHistory.diabetes) {
      recommendations.push('Contrôle glycémique strict avec HbA1c cible < 7%.');
    }
    
    if (medicalHistory.hypertension) {
      recommendations.push('Maintenir une pression artérielle < 130/80 mmHg.');
    }
    
    if (medicalHistory.smoking) {
      recommendations.push('Arrêt du tabac fortement recommandé.');
    }
  }
  
  // Recommandations générales
  recommendations.push('Activité physique régulière adaptée à la condition du patient.');
  recommendations.push('Suivi régulier des analyses biologiques (créatinine, DFG, protéinurie).');
  
  return recommendations.join('\n• ');
}

export default ReportContent;
