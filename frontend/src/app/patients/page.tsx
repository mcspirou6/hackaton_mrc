"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  Settings, 
  MessageSquare, 
  Search, 
  Filter,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  X,
  Folder,
  Heart,
  Droplets,
  Activity,
  Thermometer,
  Pill,
  Cigarette,
  Weight,
  Stethoscope,
  FileImage,
  FileCheck,
  Dna,
  Microscope,
  Clipboard,
  AlertTriangle,
  Home,
  Target,
  LogOut,
  CheckCircle
} from "lucide-react";
import PatientMedicalGraph from '@/components/PatientMedicalGraph';

// Types pour les patients (informations personnelles)
interface Patient {
  id: number;
  identifiant: string; // Identifiant unique patient
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: "male" | "female";
  address: string;
  phone: string;
  email?: string; // Ajout du champ email
  emergency_contact: string;
  referring_doctor_id: number; // ID du médecin référent
  photo_url?: string;
  status: "Stable" | "Attention" | "Critique";
  
  // Champs pour l'affichage dans l'interface
  url_photo?: string;
  
  // Relations avec les autres tables
  medicalInfo?: MedicalInfo;
  medicalHistory?: MedicalHistory;
  imagingTests?: ImagingTests;
  tnmClassification?: TNMClassification;
  
  // Champs virtuels pour la rétrocompatibilité (à supprimer plus tard)
  stade?: string;
  bloodType?: string;
  creatinine?: number;
  gfr?: number;
  lastVisit?: string;
  nextVisit?: string;
}

// Types pour les informations médicales
interface MedicalInfo {
  id?: number;
  patient_id: number;
  user_id: number; // ID du médecin
  kidney_disease_stage_id: number;
  diagnosis_date: string;
  notes?: string;
  on_dialysis: boolean;
  dialysis_start_date?: string | null;
  current_treatment?: string;
  blood_type?: string;
  creatinine_level?: number | null;
  gfr?: number | null;
  albuminuria?: number | null;
  blood_pressure_systolic?: number | null;
  blood_pressure_diastolic?: number | null;
  potassium_level?: number | null;
  hemoglobin_level?: number | null;
}

// Types pour les antécédents et facteurs de risque
interface MedicalHistory {
  id?: number;
  patient_id: number;
  diabetes: boolean;
  hypertension: boolean;
  heart_disease: boolean;
  liver_disease: boolean;
  autoimmune_disease: boolean;
  smoking_status: string; // 'non-fumeur', 'occasionnel', 'régulier'
  bmi_status: string; // 'sous-poids', 'normal', 'surpoids', 'obèse'
  alcohol_consumption: string; // 'occasionnel', 'modéré', 'élevé'
  sedentary: boolean;
  other_factors?: string;
}

// Types pour les examens d'imagerie
interface ImagingTests {
  id?: number;
  patient_id: number;
  has_ultrasound: boolean;
  ultrasound_date?: string;
  ultrasound_results?: string;
  has_ct_scan: boolean;
  ct_scan_date?: string;
  ct_scan_results?: string;
  has_mri: boolean;
  mri_date?: string;
  mri_results?: string;
  has_other_imaging: boolean;
  other_imaging_type?: string;
  other_imaging_date?: string;
  other_imaging_results?: string;
}

// Types pour la classification TNM
interface TNMClassification {
  id?: number;
  patient_id: number;
  t_stage: string; // 'T1', 'T2', 'T3', 'T4'
  n_stage: string; // 'N0', 'N1', 'N2', 'N3'
  m_stage: string; // 'M0', 'M1'
  overall_stage: string; // 'I', 'II', 'III', 'IV'
  grade: string; // 'G1', 'G2', 'G3', 'G4'
  notes?: string;
  classification_date: string;
}

// Types pour les médecins (Users)
interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  license_number: string; // Numéro de licence médicale
  specialization: string; // Néphrologie, médecine générale, etc.
  role: "medecin" | "admin";
  status: "actif" | "suspendu" | "desactive";
}

// Fonction pour créer un patient via l'API
const createPatient = async (patientData: Partial<Patient>) => {
  try {
    // Importer la fonction createPatient de l'API
    const { createPatient } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createPatient(patientData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création du patient:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création du patient.' };
  }
};

// Fonction pour mettre à jour un patient via l'API
const updatePatient = async (id: number, patientData: Partial<Patient>) => {
  try {
    // Importer la fonction updatePatient de l'API
    const { updatePatient } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await updatePatient(id, patientData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du patient:', error);
    return { success: false, message: 'Une erreur est survenue lors de la mise à jour du patient.' };
  }
};

// Fonction pour créer un dossier médical via l'API
const createPatientRecord = async (patientRecordData: Partial<MedicalInfo>) => {
  try {
    // Importer la fonction createPatientRecord de l'API
    const { createPatientRecord } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createPatientRecord(patientRecordData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création du dossier médical:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création du dossier médical.' };
  }
};

// Fonction pour créer un dossier médical via l'API
const createMedicalInfo = async (medicalInfoData: Partial<MedicalInfo>) => {
  try {
    // Importer la fonction createMedicalInfo de l'API
    const { createMedicalInfo } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createMedicalInfo(medicalInfoData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création des informations médicales:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création des informations médicales.' };
  }
};

// Fonction pour créer un enregistrement d'antécédents médicaux via l'API
const createMedicalHistory = async (medicalHistoryData: Partial<MedicalHistory>) => {
  try {
    // Importer la fonction createMedicalHistory de l'API
    const { createMedicalHistory } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createMedicalHistory(medicalHistoryData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création des antécédents médicaux:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création des antécédents médicaux.' };
  }
};

// Fonction pour créer un enregistrement d'examens d'imagerie via l'API
const createImagingTests = async (imagingTestsData: Partial<ImagingTests>) => {
  try {
    // Importer la fonction createImagingTests de l'API
    const { createImagingTests } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createImagingTests(imagingTestsData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création des examens d\'imagerie:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création des examens d\'imagerie.' };
  }
};

// Fonction pour créer un enregistrement de classification TNM via l'API
const createTNMClassification = async (tnmClassificationData: Partial<TNMClassification>) => {
  try {
    // Importer la fonction createTNMClassification de l'API
    const { createTNMClassification } = await import('@/api/api');
    
    // Utiliser la fonction importée
    const response = await createTNMClassification(tnmClassificationData);
    return response;
  } catch (error) {
    console.error('Erreur lors de la création de la classification TNM:', error);
    return { success: false, message: 'Une erreur est survenue lors de la création de la classification TNM.' };
  }
};

export default function Patients() {
  const router = useRouter();
  // États
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // État pour les notifications
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Liste des médecins disponibles
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 1,
      first_name: "Richard",
      last_name: "Martin",
      email: "richard.martin@nephro.fr",
      phone: "06 11 22 33 44",
      password: "********",
      license_number: "MED-12345",
      specialization: "Néphrologie",
      role: "medecin",
      status: "actif"
    },
    {
      id: 2,
      first_name: "Sophie",
      last_name: "Legrand",
      email: "sophie.legrand@nephro.fr",
      phone: "06 22 33 44 55",
      password: "********",
      license_number: "MED-23456",
      specialization: "Néphrologie",
      role: "medecin",
      status: "actif"
    },
    {
      id: 3,
      first_name: "Marc",
      last_name: "Petit",
      email: "marc.petit@nephro.fr",
      phone: "06 33 44 55 66",
      password: "********",
      license_number: "MED-34567",
      specialization: "Médecine générale",
      role: "medecin",
      status: "actif"
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [filterStade, setFilterStade] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // État pour gérer les sections actives
  const [activeSection, setActiveSection] = useState('personal');
  
  // État pour gérer les étapes du formulaire
  const [formStep, setFormStep] = useState(0);
  
  // État pour gérer le mode d'édition
  const [isEditMode, setIsEditMode] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    identifiant: `PAT-001-2025`,
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "male",
    address: "",
    phone: "",
    email: "", // Ajout du champ email
    emergency_contact: "",
    referring_doctor_id: 1, // ID de l'administrateur connecté
    status: "Stable",
    lastVisit: new Date().toLocaleDateString('fr-FR'),
    nextVisit: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR'),
    bloodType: "",
    creatinine: undefined,
    gfr: undefined
  });

  // État pour suivre le chargement lors de l'ajout ou de la modification d'un patient
  const [isLoading, setIsLoading] = useState(false);

  // États pour les antécédents médicaux et facteurs de risque
  const [medicalHistory, setMedicalHistory] = useState({
    diabetes: false,
    hypertension: false,
    heartDisease: false,
    liverDisease: false,
    autoimmune: false
  });
  
  const [riskFactors, setRiskFactors] = useState({
    smoking: 'non-fumeur',
    bmi: 'normal',
    alcohol: 'occasionnel',
    sedentary: false
  });

  // État initial pour les informations médicales avec des valeurs par défaut correctes
  const [medicalInfo, setMedicalInfo] = useState<Partial<MedicalInfo>>({
    kidney_disease_stage_id: 1,
    diagnosis_date: new Date().toISOString().split('T')[0],
    notes: "",
    on_dialysis: false,
    dialysis_start_date: null,
    current_treatment: "",
    blood_type: "",
    creatinine_level: null,
    gfr: null,
    albuminuria: null,
    blood_pressure_systolic: null,
    blood_pressure_diastolic: null,
    potassium_level: null,
    hemoglobin_level: null
  });

  // Fonction pour gérer les changements dans le formulaire des informations médicales
  const handleMedicalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean | null = value;

    if (type === 'number') {
      finalValue = value === '' ? null : Number(value);
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }

    console.log(`Champ ${name} mis à jour avec la valeur:`, finalValue); // Debug

    setMedicalInfo(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  // États pour les examens d'imagerie
  const [imagingTests, setImagingTests] = useState({
    has_ultrasound: false,
    ultrasound_date: "",
    ultrasound_results: "",
    has_ct_scan: false,
    ct_scan_date: "",
    ct_scan_results: "",
    has_mri: false,
    mri_date: "",
    mri_results: "",
    has_other_imaging: false,
    other_imaging_type: "",
    other_imaging_date: "",
    other_imaging_results: ""
  });

  // États pour la classification TNM
  const [tnmClassification, setTnmClassification] = useState({
    t_stage: "T1",
    n_stage: "N0",
    m_stage: "M0",
    overall_stage: "I",
    grade: "G1",
    notes: "",
    classification_date: new Date().toISOString().split('T')[0]
  });

  // Fonction pour passer à l'étape suivante
  const nextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Empêcher la soumission du formulaire
    setFormStep(formStep + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const prevStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Empêcher la soumission du formulaire
    setFormStep(formStep - 1);
  };
  
  // Filtrer les patients en fonction des critères
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || 
                          patient.identifiant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStade = filterStade ? patient.stade === filterStade : true;
    const matchesStatus = filterStatus ? patient.status === filterStatus : true;
    
    return matchesSearch && matchesStade && matchesStatus;
  });
  
  // Fonction pour afficher les détails d'un patient
  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };
  
  // Fonction pour fermer la modal des détails
  const closePatientDetails = () => {
    setShowPatientDetails(false);
  };
  
  // Fonction pour supprimer un patient
  const deletePatient = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      try {
        // Importer la fonction deletePatient de l'API
        const { deletePatient: deletePatientAPI } = await import('@/api/api');
        
        // Appeler l'API pour supprimer le patient de la base de données
        const response = await deletePatientAPI(id);
        
        if (response.success) {
          // Supprimer le patient de l'état local uniquement si la suppression en base a réussi
          setPatients(patients.filter(patient => patient.id !== id));
          // Afficher un message de succès
          setNotification({
            message: "Le patient a bien été supprimé.",
            type: 'success'
          });
          
          // Faire disparaître la notification après 3 secondes
          setTimeout(() => {
            setNotification(null);
          }, 3000);
        } else {
          alert("Erreur lors de la suppression du patient: " + response.message);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du patient:', error);
        alert("Une erreur est survenue lors de la suppression du patient.");
      }
    }
  };
  
  // Charger les données de l'utilisateur connecté
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { getCurrentUser } = await import('@/api/api');
        const userResponse = await getCurrentUser();
        if (userResponse.success) {
          setCurrentUser(userResponse.user);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Fonction pour ouvrir le formulaire d'ajout de patient
  const openAddPatientForm = () => {
    setIsEditMode(false);
    setPatientToEdit(null);
    setFormStep(0);
    setActiveSection('personal');
    setNewPatient({
      identifiant: `PAT-001-2025`,
      first_name: "",
      last_name: "",
      birth_date: "",
      gender: "male",
      address: "",
      phone: "",
      email: "", // Ajout du champ email
      emergency_contact: "",
      referring_doctor_id: 1, // ID de l'administrateur connecté
      status: "Stable",
      lastVisit: new Date().toLocaleDateString('fr-FR'),
      nextVisit: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR'),
    });
    
    // Réinitialiser les antécédents médicaux et facteurs de risque
    setMedicalHistory({
      diabetes: false,
      hypertension: false,
      heartDisease: false,
      liverDisease: false,
      autoimmune: false
    });
    
    setRiskFactors({
      smoking: 'non-fumeur',
      bmi: 'normal',
      alcohol: 'occasionnel',
      sedentary: false
    });

    setMedicalInfo({
      kidney_disease_stage_id: 1,
      diagnosis_date: new Date().toISOString().split('T')[0],
      notes: "",
      on_dialysis: false,
      dialysis_start_date: null,
      current_treatment: "",
      blood_type: "",
      creatinine_level: null,
      gfr: null,
      albuminuria: null,
      blood_pressure_systolic: null,
      blood_pressure_diastolic: null,
      potassium_level: null,
      hemoglobin_level: null
    });

    setImagingTests({
      has_ultrasound: false,
      ultrasound_date: "",
      ultrasound_results: "",
      has_ct_scan: false,
      ct_scan_date: "",
      ct_scan_results: "",
      has_mri: false,
      mri_date: "",
      mri_results: "",
      has_other_imaging: false,
      other_imaging_type: "",
      other_imaging_date: "",
      other_imaging_results: ""
    });

    setTnmClassification({
      t_stage: "T1",
      n_stage: "N0",
      m_stage: "M0",
      overall_stage: "I",
      grade: "G1",
      notes: "",
      classification_date: new Date().toISOString().split('T')[0]
    });
    
    setShowAddPatientForm(true);
  };
  
  // Fonction pour ouvrir le formulaire d'édition de patient
  const openEditPatientForm = (patient: Patient) => {
    setIsEditMode(true);
    setPatientToEdit(patient);
    setFormStep(0);
    setActiveSection('personal');
    setNewPatient({
      ...patient
    });
    
    // Si le patient a des antécédents médicaux enregistrés, les charger
    try {
      // Récupérer le dossier médical du patient
      // Note: Dans un cas réel, cela devrait être fait via une API
      const patientRecord = { medical_history: "{}" }; // Simuler un dossier médical vide par défaut
      
      if (patientRecord.medical_history) {
        const medicalHistoryData = JSON.parse(patientRecord.medical_history);
        setMedicalHistory({
          diabetes: medicalHistoryData.diabetes || false,
          hypertension: medicalHistoryData.hypertension || false,
          heartDisease: medicalHistoryData.heartDisease || false,
          liverDisease: medicalHistoryData.liverDisease || false,
          autoimmune: medicalHistoryData.autoimmune || false
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des antécédents médicaux:", error);
      // En cas d'erreur, réinitialiser les antécédents
      setMedicalHistory({
        diabetes: false,
        hypertension: false,
        heartDisease: false,
        liverDisease: false,
        autoimmune: false
      });
    }
    
    // Réinitialiser les facteurs de risque (dans un cas réel, cela serait également chargé depuis l'API)
    setRiskFactors({
      smoking: 'non-fumeur',
      bmi: 'normal',
      alcohol: 'occasionnel',
      sedentary: false
    });

    setMedicalInfo({
      kidney_disease_stage_id: 1,
      diagnosis_date: new Date().toISOString().split('T')[0],
      notes: "",
      on_dialysis: false,
      dialysis_start_date: null,
      current_treatment: "",
      blood_type: "",
      creatinine_level: null,
      gfr: null,
      albuminuria: null,
      blood_pressure_systolic: null,
      blood_pressure_diastolic: null,
      potassium_level: null,
      hemoglobin_level: null
    });

    setImagingTests({
      has_ultrasound: false,
      ultrasound_date: "",
      ultrasound_results: "",
      has_ct_scan: false,
      ct_scan_date: "",
      ct_scan_results: "",
      has_mri: false,
      mri_date: "",
      mri_results: "",
      has_other_imaging: false,
      other_imaging_type: "",
      other_imaging_date: "",
      other_imaging_results: ""
    });

    setTnmClassification({
      t_stage: "T1",
      n_stage: "N0",
      m_stage: "M0",
      overall_stage: "I",
      grade: "G1",
      notes: "",
      classification_date: new Date().toISOString().split('T')[0]
    });
    
    setShowAddPatientForm(true);
  };
  
  // Fonction pour fermer le formulaire d'ajout de patient
  const closeAddPatientForm = () => {
    setShowAddPatientForm(false);
    setIsEditMode(false);
    setPatientToEdit(null);
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value
    });
  };

  // Fonction pour gérer les changements dans les antécédents médicaux
  const handleMedicalHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setMedicalHistory({
      ...medicalHistory,
      [name]: checked
    });
  };

  // Fonction pour gérer les changements dans les facteurs de risque
  const handleRiskFactorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setRiskFactors({
      ...riskFactors,
      [name]: newValue
    });
  };

  // Fonction pour valider les données du patient à chaque étape
  const validateCurrentStep = (): boolean => {
    // Validation pour l'étape 1: Informations personnelles
    if (formStep === 0) {
      if (!newPatient.first_name || newPatient.first_name.trim() === '') {
        setNotification({ message: "Le prénom est obligatoire", type: 'error' });
        return false;
      }
      if (!newPatient.last_name || newPatient.last_name.trim() === '') {
        setNotification({ message: "Le nom est obligatoire", type: 'error' });
        return false;
      }
      if (!newPatient.birth_date) {
        setNotification({ message: "La date de naissance est obligatoire", type: 'error' });
        return false;
      }
      // Validation du format de téléphone (format français)
      if (newPatient.phone && !/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(newPatient.phone)) {
        setNotification({ message: "Le format du numéro de téléphone est invalide", type: 'error' });
        return false;
      }
      // Validation de l'email si fourni
      if (newPatient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newPatient.email)) {
        setNotification({ message: "Le format de l'email est invalide", type: 'error' });
        return false;
      }
    }
    
    // Validation pour l'étape 2: Informations médicales
    else if (formStep === 1) {
      if (!medicalInfo.kidney_disease_stage_id) {
        setNotification({ message: "Le stade de la maladie rénale est obligatoire", type: 'error' });
        return false;
      }
      if (!medicalInfo.diagnosis_date) {
        setNotification({ message: "La date de diagnostic est obligatoire", type: 'error' });
        return false;
      }
      // Validation des valeurs numériques
      if (medicalInfo.creatinine_level && (medicalInfo.creatinine_level < 0 || medicalInfo.creatinine_level > 2000)) {
        setNotification({ message: "La valeur de créatinine doit être entre 0 et 2000 μmol/L", type: 'error' });
        return false;
      }
      if (medicalInfo.gfr && (medicalInfo.gfr < 0 || medicalInfo.gfr > 200)) {
        setNotification({ message: "La valeur de DFG doit être entre 0 et 200 mL/min", type: 'error' });
        return false;
      }
    }
    
    // Validation pour l'étape 3: Antécédents & Facteurs de risque
    // Pas de validation spécifique requise, ce sont des cases à cocher et des sélections
    
    // Validation pour l'étape 4: Examens d'imagerie
    else if (formStep === 3) {
      // Vérifier que les dates d'examens sont valides si les examens sont cochés
      if (imagingTests.has_ultrasound && !imagingTests.ultrasound_date) {
        setNotification({ message: "La date de l'échographie est obligatoire", type: 'error' });
        return false;
      }
      if (imagingTests.has_ct_scan && !imagingTests.ct_scan_date) {
        setNotification({ message: "La date du scanner est obligatoire", type: 'error' });
        return false;
      }
      if (imagingTests.has_mri && !imagingTests.mri_date) {
        setNotification({ message: "La date de l'IRM est obligatoire", type: 'error' });
        return false;
      }
      if (imagingTests.has_other_imaging && (!imagingTests.other_imaging_type || !imagingTests.other_imaging_date)) {
        setNotification({ message: "Le type et la date de l'autre examen sont obligatoires", type: 'error' });
        return false;
      }
    }
    
    // Validation pour l'étape 5: Classification TNM
    else if (formStep === 4) {
      if (!tnmClassification.classification_date) {
        setNotification({ message: "La date de classification est obligatoire", type: 'error' });
        return false;
      }
    }
    
    // Si toutes les validations sont passées
    return true;
  };

  // Fonction pour ajouter un nouveau patient
  const addNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Effacer les notifications précédentes
    setNotification(null);
    
    // Valider l'étape actuelle
    if (!validateCurrentStep()) {
      return;
    }
    
    // Vérifier si nous sommes à la dernière étape
    if (formStep < 4) {
      // Si nous ne sommes pas à la dernière étape, passer à l'étape suivante
      setFormStep(formStep + 1);
      return;
    }
    
    try {
      // Vérifier si l'utilisateur est authentifié
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setNotification({ message: "Vous devez être connecté pour ajouter un patient", type: 'error' });
        return;
      }
      
      // Préparation des données pour la table patients (informations personnelles)
      const patientData: Partial<Patient> = {
        identifiant: newPatient.identifiant || `PAT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`,
        first_name: newPatient.first_name || "",
        last_name: newPatient.last_name || "",
        birth_date: newPatient.birth_date || "",
        gender: newPatient.gender as "male" | "female" || "male",
        address: newPatient.address || "",
        phone: newPatient.phone || "",
        email: newPatient.email || "", // Ajout du champ email
        emergency_contact: newPatient.emergency_contact || "",
        referring_doctor_id: Number(newPatient.referring_doctor_id) || 1,
        status: newPatient.status as "Stable" | "Attention" | "Critique" || "Stable",
        photo_url: newPatient.url_photo || "",
      };

      // Préparation des informations médicales
      const medicalInfoToSend = {
        patient_id: 0,
        user_id: 1,
        kidney_disease_stage_id: Number(medicalInfo.kidney_disease_stage_id),
        diagnosis_date: medicalInfo.diagnosis_date || new Date().toISOString().split('T')[0],
        notes: medicalInfo.notes || "",
        on_dialysis: Boolean(medicalInfo.on_dialysis),
        dialysis_start_date: medicalInfo.dialysis_start_date || null,
        current_treatment: medicalInfo.current_treatment || "",
        blood_type: medicalInfo.blood_type || "",
        creatinine_level: medicalInfo.creatinine_level === '' ? null : Number(medicalInfo.creatinine_level),
        gfr: medicalInfo.gfr === '' ? null : Number(medicalInfo.gfr),
        albuminuria: medicalInfo.albuminuria === '' ? null : Number(medicalInfo.albuminuria),
        blood_pressure_systolic: medicalInfo.blood_pressure_systolic === '' ? null : Number(medicalInfo.blood_pressure_systolic),
        blood_pressure_diastolic: medicalInfo.blood_pressure_diastolic === '' ? null : Number(medicalInfo.blood_pressure_diastolic),
        potassium_level: medicalInfo.potassium_level === '' ? null : Number(medicalInfo.potassium_level),
        hemoglobin_level: medicalInfo.hemoglobin_level === '' ? null : Number(medicalInfo.hemoglobin_level)
      };

      console.log('Données médicales à envoyer:', medicalInfoToSend); // Debug

      setIsLoading(true);

      if (isEditMode && patientToEdit) {
        // Mise à jour du patient existant
        try {
          // Appel à l'API pour mettre à jour le patient
          const response = await updatePatient(patientToEdit.id, patientData);
          
          if (response && typeof response === 'object' && ('success' in response) && response.success) {
            // Mise à jour de la liste des patients en local
            const updatedPatients = patients.map(p => 
              p.id === patientToEdit.id ? { ...p, ...patientData, id: patientToEdit.id } : p
            );
            setPatients(updatedPatients);
            setShowAddPatientForm(false);
            setIsEditMode(false);
            setPatientToEdit(null);
            alert("Patient mis à jour avec succès !");
          } else {
            alert("Erreur lors de la mise à jour du patient : " + (response && typeof response === 'object' && 'message' in response ? response.message : "Une erreur est survenue"));
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour du patient :", error);
          alert("Une erreur est survenue lors de la mise à jour du patient. Veuillez réessayer.");
        }
      } else {
        // Ajout d'un nouveau patient
        try {
          // Afficher un message de chargement plus informatif
          setIsLoading(true);
          console.log("Début du processus d'ajout d'un nouveau patient...");
          
          // 1. Création du patient (table patients)
          console.log("Étape 1: Envoi des données du patient à l'API...");
          const patientResponse = await createPatient(patientData);
          
          if (!patientResponse || typeof patientResponse !== 'object' || !('success' in patientResponse) || !patientResponse.success) {
            throw new Error(patientResponse && typeof patientResponse === 'object' && 'message' in patientResponse ? 
              patientResponse.message as string : "Échec de la création du patient");
          }
          
          if (!('data' in patientResponse) || !patientResponse.data || typeof patientResponse.data !== 'object' || !('id' in patientResponse.data)) {
            throw new Error("La réponse de l'API ne contient pas l'ID du patient créé");
          }
          
          const patientId = patientResponse.data.id as number;
          console.log(`Patient créé avec succès (ID: ${patientId}). Poursuite du processus...`);
          
          // 2. Création des informations médicales (table medical_info)
          console.log("Étape 2: Envoi des informations médicales...");
          medicalInfoToSend.patient_id = patientId;
          const medicalInfoResponse = await createMedicalInfo(medicalInfoToSend);
          
          if (!medicalInfoResponse || typeof medicalInfoResponse !== 'object' || !('success' in medicalInfoResponse) || !medicalInfoResponse.success) {
            throw new Error(medicalInfoResponse && typeof medicalInfoResponse === 'object' && 'message' in medicalInfoResponse ? 
              medicalInfoResponse.message as string : "Échec de la création des informations médicales");
          }
          
          // 3. Création des antécédents médicaux (table medical_history)
          console.log("Étape 3: Envoi des antécédents médicaux...");
          const medicalHistoryData: Partial<MedicalHistory> = {
            patient_id: patientId,
            diabetes: medicalHistory.diabetes,
            hypertension: medicalHistory.hypertension,
            heart_disease: medicalHistory.heartDisease,
            liver_disease: medicalHistory.liverDisease,
            autoimmune_disease: medicalHistory.autoimmune,
            smoking_status: riskFactors.smoking,
            bmi_status: riskFactors.bmi,
            alcohol_consumption: riskFactors.alcohol,
            sedentary: riskFactors.sedentary,
            other_factors: ""
          };
          const medicalHistoryResponse = await createMedicalHistory(medicalHistoryData);
          
          if (!medicalHistoryResponse || typeof medicalHistoryResponse !== 'object' || !('success' in medicalHistoryResponse) || !medicalHistoryResponse.success) {
            throw new Error(medicalHistoryResponse && typeof medicalHistoryResponse === 'object' && 'message' in medicalHistoryResponse ? 
              medicalHistoryResponse.message as string : "Échec de la création des antécédents médicaux");
          }
          
          // 4. Création des examens d'imagerie (table imaging_tests)
          console.log("Étape 4: Envoi des examens d'imagerie...");
          const imagingTestsData: Partial<ImagingTests> = {
            patient_id: patientId,
            has_ultrasound: imagingTests.has_ultrasound,
            ultrasound_date: imagingTests.ultrasound_date || null,
            ultrasound_results: imagingTests.ultrasound_results,
            has_ct_scan: imagingTests.has_ct_scan,
            ct_scan_date: imagingTests.ct_scan_date || null,
            ct_scan_results: imagingTests.ct_scan_results,
            has_mri: imagingTests.has_mri,
            mri_date: imagingTests.mri_date || null,
            mri_results: imagingTests.mri_results,
            has_other_imaging: imagingTests.has_other_imaging,
            other_imaging_type: imagingTests.other_imaging_type,
            other_imaging_date: imagingTests.other_imaging_date || null,
            other_imaging_results: imagingTests.other_imaging_results
          };
          const imagingTestsResponse = await createImagingTests(imagingTestsData);
          
          if (!imagingTestsResponse || typeof imagingTestsResponse !== 'object' || !('success' in imagingTestsResponse) || !imagingTestsResponse.success) {
            throw new Error(imagingTestsResponse && typeof imagingTestsResponse === 'object' && 'message' in imagingTestsResponse ? 
              imagingTestsResponse.message as string : "Échec de la création des examens d'imagerie");
          }
          
          // 5. Création de la classification TNM (table tnm_classification)
          console.log("Étape 5: Envoi de la classification TNM...");
          const tnmClassificationData: Partial<TNMClassification> = {
            patient_id: patientId,
            t_stage: tnmClassification.t_stage,
            n_stage: tnmClassification.n_stage,
            m_stage: tnmClassification.m_stage,
            overall_stage: tnmClassification.overall_stage,
            grade: tnmClassification.grade,
            notes: tnmClassification.notes,
            classification_date: tnmClassification.classification_date
          };
          const tnmResponse = await createTNMClassification(tnmClassificationData);
          
          if (!tnmResponse || typeof tnmResponse !== 'object' || !('success' in tnmResponse) || !tnmResponse.success) {
            throw new Error(tnmResponse && typeof tnmResponse === 'object' && 'message' in tnmResponse ? 
              tnmResponse.message as string : "Échec de la création de la classification TNM");
          }
          
          console.log("Toutes les données ont été enregistrées avec succès!");
          
          // Ajouter le nouveau patient à la liste locale avec les champs d'affichage
          const newPatientWithDisplayFields: Patient = {
            ...patientData as Patient,
            id: patientId,
            stade: medicalInfoToSend.kidney_disease_stage_id === 1 ? "Stade 1" : 
                   medicalInfoToSend.kidney_disease_stage_id === 2 ? "Stade 2" : 
                   medicalInfoToSend.kidney_disease_stage_id === 3 ? "Stade 3" : 
                   medicalInfoToSend.kidney_disease_stage_id === 4 ? "Stade 4" : "Stade 5",
            bloodType: medicalInfoToSend.blood_type,
            creatinine: medicalInfoToSend.creatinine_level,
            gfr: medicalInfoToSend.gfr,
            lastVisit: new Date().toLocaleDateString('fr-FR'),
            nextVisit: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR'),
            medicalInfo: 'data' in medicalInfoResponse ? (medicalInfoResponse.data as MedicalInfo) : undefined,
            medicalHistory: 'data' in medicalHistoryResponse ? (medicalHistoryResponse.data as MedicalHistory) : undefined,
            imagingTests: 'data' in imagingTestsResponse ? (imagingTestsResponse.data as ImagingTests) : undefined,
            tnmClassification: 'data' in tnmResponse ? (tnmResponse.data as TNMClassification) : undefined
          };
          
          setPatients([...patients, newPatientWithDisplayFields]);
          setShowAddPatientForm(false);
          alert("Patient et toutes ses données associées ont été ajoutés avec succès!");
        } catch (error: any) {
          console.error("Erreur lors de l'ajout du patient:", error);
          
          // Afficher un message d'erreur détaillé avec les données de débogage
          console.log('Données du patient:', patientData);
          console.log('Données médicales:', medicalInfoToSend);
          console.log('Antécédents médicaux:', medicalHistoryData);
          console.log('Examens d\'imagerie:', imagingTestsData);
          console.log('Classification TNM:', tnmClassificationData);
          
          alert(`Erreur: ${error.message || "Une erreur est survenue lors de l'ajout du patient."}`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des patients depuis la base de données au démarrage
  useEffect(() => {
    const loadPatients = async () => {
      try {
        // Importer les fonctions API nécessaires
        const { getPatients, getMedicalInfo, getMedicalHistory, getImagingTests, getTNMClassification } = await import('@/api/api');
        
        // Appeler l'API pour récupérer les patients
        const response = await getPatients();
        
        // Vérifier si la réponse contient des données
        if (response && typeof response === 'object' && ('success' in response) && response.success && ('data' in response) && Array.isArray(response.data)) {
          // Transformer les données pour correspondre à notre interface Patient
          const patientsData = await Promise.all((response.data as any[]).map(async (patient: any) => {
            // Créer un objet patient avec les propriétés de base
            const patientObj: Patient = {
              id: patient.id,
              identifiant: patient.identifiant || `PAT-${patient.id}-2025`,
              first_name: patient.first_name,
              last_name: patient.last_name,
              birth_date: patient.birth_date,
              gender: patient.gender as "male" | "female",
              address: patient.address,
              phone: patient.phone,
              email: patient.email || "", // Ajout du champ email
              emergency_contact: patient.emergency_contact,
              referring_doctor_id: patient.referring_doctor_id,
              photo_url: patient.photo_url,
              status: patient.status as "Stable" | "Attention" | "Critique",
              url_photo: patient.photo_url
            };
            
            // Récupérer les informations médicales
            try {
              const medicalInfoResponse = await getMedicalInfo(patient.id);
              if (medicalInfoResponse && medicalInfoResponse.success && medicalInfoResponse.data) {
                const medicalInfo = medicalInfoResponse.data;
                patientObj.medicalInfo = medicalInfo;
                patientObj.stade = medicalInfo.kidney_disease_stage_id === 1 ? "Stade 1" : 
                                   medicalInfo.kidney_disease_stage_id === 2 ? "Stade 2" : 
                                   medicalInfo.kidney_disease_stage_id === 3 ? "Stade 3" : 
                                   medicalInfo.kidney_disease_stage_id === 4 ? "Stade 4" : "Stade 5";
                patientObj.bloodType = medicalInfo.blood_type || "Non spécifié";
                patientObj.creatinine = medicalInfo.creatinine_level;
                patientObj.gfr = medicalInfo.gfr;
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération des informations médicales pour le patient ${patient.id}:`, error);
            }
            
            // Récupérer les antécédents médicaux
            try {
              const medicalHistoryResponse = await getMedicalHistory(patient.id);
              if (medicalHistoryResponse && medicalHistoryResponse.success && medicalHistoryResponse.data) {
                patientObj.medicalHistory = medicalHistoryResponse.data;
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération des antécédents médicaux pour le patient ${patient.id}:`, error);
            }
            
            // Récupérer les examens d'imagerie
            try {
              const imagingTestsResponse = await getImagingTests(patient.id);
              if (imagingTestsResponse && imagingTestsResponse.success && imagingTestsResponse.data) {
                patientObj.imagingTests = imagingTestsResponse.data;
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération des examens d'imagerie pour le patient ${patient.id}:`, error);
            }
            
            // Récupérer la classification TNM
            try {
              const tnmResponse = await getTNMClassification(patient.id);
              if (tnmResponse && tnmResponse.success && tnmResponse.data) {
                patientObj.tnmClassification = tnmResponse.data;
              }
            } catch (error) {
              console.error(`Erreur lors de la récupération de la classification TNM pour le patient ${patient.id}:`, error);
            }
            
            return patientObj;
          }));
          
          setPatients(patientsData);
        } else {
          console.error('Erreur lors du chargement des patients:', response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des patients:', error);
      }
    };
    
    loadPatients();
  }, []);

  // Chargement des médecins depuis la base de données au démarrage
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        // Importer la fonction getDoctors de l'API
        const { getDoctors } = await import('@/api/api');
        
        // Appeler l'API pour récupérer les médecins
        const response = await getDoctors();
        
        // Vérifier si la réponse contient des données
        if (response && typeof response === 'object' && ('success' in response) && response.success && ('data' in response)) {
          if (Array.isArray(response.data)) {
            setDoctors(response.data as Doctor[]);
          } else {
            console.error('Erreur lors du chargement des médecins:', response);
          }
        } else {
          console.error('Erreur lors du chargement des médecins:', response);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des médecins:', error);
      }
    };
    
    loadDoctors();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <div className="bg-cyan-500 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">NéphroSuivi</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link href="/patients" className="flex items-center p-3 bg-indigo-800 rounded-lg">
                <Users className="mr-3 h-5 w-5" />
                <span>Patients</span>
              </Link>
            </li>
            <li>
              <Link href="/appointments" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <Calendar className="mr-3 h-5 w-5" />
                <span>Rendez-vous</span>
              </Link>
            </li>
            <li>
              <Link href="/reports" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <FileText className="mr-3 h-5 w-5" />
                <span>Rapports</span>
              </Link>
            </li>
            <li>
              <Link href="/messages" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <MessageSquare className="mr-3 h-5 w-5" />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link href="/alerts" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <Bell className="mr-3 h-5 w-5" />
                <span>Alertes</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <Link href="/settings" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
            <Settings className="mr-3 h-5 w-5" />
            <span>Paramètres</span>
          </Link>
          <div className="flex items-center mt-6 p-3 bg-indigo-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
              <span className="font-bold">{currentUser ? currentUser.first_name.charAt(0) + currentUser.last_name.charAt(0) : 'DR'}</span>
            </div>
            <div>
              <p className="font-medium">{currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Chargement...'}</p>
              <p className="text-xs text-gray-300">{currentUser ? currentUser.specialization || currentUser.role : ''}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        {/* Notification */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            <p>{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        <header className="bg-white p-6 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Patients</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input 
                type="text" 
                placeholder="Rechercher un patient..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        {/* Patients Content */}
        <main className="p-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <h2 className="text-lg font-bold text-gray-800">Liste des patients</h2>
                <div className="flex items-center">
                  <div className="relative">
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm">
                      <Filter className="h-4 w-4" />
                      <span>Stade</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                      <div className="p-2">
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade(null)}>Tous</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade("Stade 1")}>Stade 1</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade("Stade 2")}>Stade 2</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade("Stade 3")}>Stade 3</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade("Stade 4")}>Stade 4</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStade("Stade 5")}>Stade 5</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative ml-2">
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm">
                      <Filter className="h-4 w-4" />
                      <span>Statut</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
                      <div className="p-2">
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStatus(null)}>Tous</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStatus("Stable")}>Stable</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStatus("Attention")}>Attention</button>
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-md" onClick={() => setFilterStatus("Critique")}>Critique</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={openAddPatientForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau patient
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de naissance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stade MRC
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100">
                            {patient.url_photo ? (
                              <img 
                                src={patient.url_photo} 
                                alt={`${patient.first_name} ${patient.last_name}`} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // En cas d'erreur de chargement de l'image, afficher les initiales
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="h-full w-full flex items-center justify-center font-medium text-indigo-800">${patient.first_name[0]}${patient.last_name[0]}</div>`;
                                  }
                                }}
                              />
                            ) : (
                              <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                                <span className="font-medium text-indigo-800">
                                  {patient.first_name[0]}{patient.last_name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.first_name} {patient.last_name}</div>
                            <div className="text-sm text-gray-500">{patient.phone}</div>
                            <div className="text-sm text-gray-500">{patient.email}</div> {/* Ajout du champ email */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.birth_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.stade === "Stade 1" ? "bg-green-100 text-green-800" :
                          patient.stade === "Stade 2" ? "bg-green-100 text-green-800" :
                          patient.stade === "Stade 3" ? "bg-yellow-100 text-yellow-800" :
                          patient.stade === "Stade 4" ? "bg-orange-100 text-orange-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {patient.stade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          patient.status === "Stable" ? "bg-green-100 text-green-800" :
                          patient.status === "Attention" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => viewPatientDetails(patient)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Voir les détails"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => openEditPatientForm(patient)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => deletePatient(patient.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      
      {/* Modal de détails du patient */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-100 mr-4">
                    {selectedPatient.url_photo ? (
                      <img 
                        src={selectedPatient.url_photo} 
                        alt={`${selectedPatient.first_name} ${selectedPatient.last_name}`} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          // En cas d'erreur de chargement de l'image, afficher les initiales
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="h-full w-full flex items-center justify-center font-medium text-indigo-800">${selectedPatient.first_name[0]}${selectedPatient.last_name[0]}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                        <span className="font-medium text-indigo-800">
                          {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedPatient.first_name} {selectedPatient.last_name}</h2>
                    <p className="text-gray-500">ID: {selectedPatient.identifiant}</p>
                    <p className="text-gray-500">Email: {selectedPatient.email}</p> {/* Ajout du champ email */}
                  </div>
                </div>
                <button 
                  onClick={closePatientDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Navigation des sections */}
              <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-2 overflow-x-auto">
                <button 
                  onClick={() => setActiveSection('personal')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'personal' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Users className="mr-2 h-5 w-5" />
                  Informations personnelles
                </button>
                <button 
                  onClick={() => setActiveSection('medical')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'medical' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Activity className="mr-2 h-5 w-5" />
                  Informations médicales
                </button>
                <button 
                  onClick={() => setActiveSection('history')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'history' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <FileCheck className="mr-2 h-5 w-5" />
                  Antécédents & Facteurs
                </button>
                <button 
                  onClick={() => setActiveSection('imaging')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'imaging' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <FileImage className="mr-2 h-5 w-5" />
                  Examens d'imagerie
                </button>
                <button 
                  onClick={() => setActiveSection('tnm')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    activeSection === 'tnm' ? 'bg-amber-100 text-amber-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <Clipboard className="mr-2 h-5 w-5" />
                  Classification TNM
                </button>
              </div>
              
              {/* Contenu défilant */}
              <div className="overflow-y-auto max-h-[calc(90vh-200px)] pr-2">
                {/* Section Informations personnelles */}
                {activeSection === 'personal' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 space-y-6">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <Users className="mr-2 h-6 w-6" />
                      Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Date de naissance</p>
                          <p className="font-medium flex items-center">
                            <Calendar className="h-4 w-4 text-indigo-500 mr-2" />
                            {selectedPatient.birth_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Genre</p>
                          <p className="font-medium flex items-center">
                            <Users className="h-4 w-4 text-indigo-500 mr-2" />
                            {selectedPatient.gender === 'male' ? 'Masculin' : 'Féminin'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {selectedPatient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {selectedPatient.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium flex items-center">
                            <Home className="h-4 w-4 text-indigo-500 mr-2" />
                            {selectedPatient.address}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact d'urgence</p>
                          <p className="font-medium flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                            {selectedPatient.emergency_contact}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Médecin référent</p>
                          <p className="font-medium flex items-center">
                            <Stethoscope className="h-4 w-4 text-green-500 mr-2" />
                            {doctors.find(d => d.id === selectedPatient.referring_doctor_id)?.first_name} {doctors.find(d => d.id === selectedPatient.referring_doctor_id)?.last_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Informations médicales */}
                {activeSection === 'medical' && (
                  <div className="space-y-6 bg-white p-6 rounded-xl border border-blue-100">
                    <h3 className="text-xl font-semibold text-blue-700 flex items-center">
                      <Activity className="mr-2 h-6 w-6" />
                      Informations médicales
                    </h3>
                    
                    <div className="space-y-6 p-4">
                      {/* Informations médicales de base */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Stade de la maladie</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.kidney_disease_stage_id || 'Non défini'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Groupe sanguin</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.blood_type || 'Non défini'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Date de diagnostic</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.diagnosis_date || 'Non définie'}</p>
                        </div>
                      </div>

                      {/* Paramètres biologiques */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Créatinine</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.creatinine_level || 'Non définie'} µmol/L</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">DFG</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.gfr || 'Non défini'} mL/min</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Albuminurie</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.albuminuria || 'Non définie'} mg/24h</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Tension artérielle</h4>
                          <p className="text-lg">
                            {selectedPatient.medicalInfo?.blood_pressure_systolic || '---'}/
                            {selectedPatient.medicalInfo?.blood_pressure_diastolic || '---'} mmHg
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Potassium</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.potassium_level || 'Non défini'} mmol/L</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                          <h4 className="font-medium text-gray-700 mb-2">Hémoglobine</h4>
                          <p className="text-lg">{selectedPatient.medicalInfo?.hemoglobin_level || 'Non définie'} g/dL</p>
                        </div>
                      </div>

                      {/* Graphique et visualisation */}
                      <div className="mt-6">
                        <h4 className="font-medium text-blue-700 mb-4">Visualisation des données</h4>
                        {selectedPatient.medicalInfo && (
                          <PatientMedicalGraph medicalInfo={selectedPatient.medicalInfo} />
                        )}
                      </div>

                      {/* Dialyse */}
                      <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Dialyse</h4>
                        <div className="space-y-2">
                          <p>Status: {selectedPatient.medicalInfo?.on_dialysis ? 'Oui' : 'Non'}</p>
                          {selectedPatient.medicalInfo?.on_dialysis && selectedPatient.medicalInfo?.dialysis_start_date && (
                            <p>Date de début: {selectedPatient.medicalInfo.dialysis_start_date}</p>
                          )}
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Notes médicales</h4>
                        <p className="text-gray-600">{selectedPatient.medicalInfo?.notes || 'Aucune note'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Antécédents & Facteurs */}
                {activeSection === 'history' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 space-y-6">
                    <h3 className="text-xl font-semibold text-green-700 flex items-center">
                      <FileCheck className="mr-2 h-6 w-6" />
                      Antécédents & Facteurs de risque
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-700 mb-4 flex items-center">
                          <Dna className="mr-2 h-4 w-4" />
                          Antécédents médicaux
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-green-100">
                            <span className="font-medium">Diabète</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.medicalHistory?.diabetes ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatient.medicalHistory?.diabetes ? 'Oui' : 'Non'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-green-100">
                            <span className="font-medium">Hypertension</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.medicalHistory?.hypertension ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatient.medicalHistory?.hypertension ? 'Oui' : 'Non'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-green-100">
                            <span className="font-medium">Maladie cardiaque</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.medicalHistory?.heart_disease ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatient.medicalHistory?.heart_disease ? 'Oui' : 'Non'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-green-100">
                            <span className="font-medium">Maladie du foie</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.medicalHistory?.liver_disease ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatient.medicalHistory?.liver_disease ? 'Oui' : 'Non'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-green-100">
                            <span className="font-medium">Maladie auto-immune</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              selectedPatient.medicalHistory?.autoimmune_disease ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedPatient.medicalHistory?.autoimmune_disease ? 'Oui' : 'Non'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-700 mb-4 flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Facteurs de risque
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Tabagisme</p>
                            <p className="font-medium">{selectedPatient.medicalHistory?.smoking_status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">IMC</p>
                            <p className="font-medium">{selectedPatient.medicalHistory?.bmi_status}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Consommation d'alcool</p>
                            <p className="font-medium">{selectedPatient.medicalHistory?.alcohol_consumption}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Sédentaire</p>
                            <p className="font-medium">{selectedPatient.medicalHistory?.sedentary ? 'Oui' : 'Non'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Section Examens d'imagerie */}
                {activeSection === 'imaging' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-200 space-y-6">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <FileImage className="mr-2 h-6 w-6" />
                      Examens d'imagerie
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Échographie rénale</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Date de l'examen</p>
                            <p className="font-medium">{selectedPatient.imagingTests?.ultrasound_date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Résultats</p>
                            <p className="font-medium">{selectedPatient.imagingTests?.ultrasound_results}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Scanner / IRM</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Date de l'examen</p>
                            <p className="font-medium">{selectedPatient.imagingTests?.ct_scan_date}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Résultats</p>
                            <p className="font-medium">{selectedPatient.imagingTests?.ct_scan_results}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IRM: Imagerie par Résonance Magnétique</p>
                  </div>
                )}

                {/* Section Classification TNM */}
                {activeSection === 'tnm' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 space-y-6">
                    <h3 className="text-xl font-semibold text-red-700 flex items-center">
                      <Target className="mr-2 h-6 w-6" />
                      Classification TNM
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-red-700 mb-4">Tumeur (T)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-red-100">
                            <span className="font-medium">Stade T</span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              {selectedPatient.tnmClassification?.t_stage || 'Non spu00e9cifiu00e9'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>T1</strong>: Tumeur &lt; 4cm<br />
                              <strong>T2</strong>: Tumeur &gt; 4cm mais &lt; 10cm<br />
                              <strong>T3</strong>: Tumeur &gt; 10cm ou extension aux veines ru00e9nales<br />
                              <strong>T4</strong>: Extension au-delu00e0 du fascia de Gerota
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-700 mb-4">Ganglions (N)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-red-100">
                            <span className="font-medium">Stade N</span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              {selectedPatient.tnmClassification?.n_stage || 'Non spu00e9cifiu00e9'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>N0</strong>: Pas de mu00e9tastase ganglionnaire<br />
                              <strong>N1</strong>: Mu00e9tastase dans un ganglion ru00e9gional<br />
                              <strong>N2</strong>: Mu00e9tastases dans plus d'un ganglion ru00e9gional
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-700 mb-4">Métastases (M)</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center py-2 border-b border-red-100">
                            <span className="font-medium">Stade M</span>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              {selectedPatient.tnmClassification?.m_stage || 'Non spu00e9cifiu00e9'}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>M0</strong>: Pas de mu00e9tastase u00e0 distance<br />
                              <strong>M1</strong>: Pru00e9sence de mu00e9tastase(s) u00e0 distance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-6">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium text-red-700 mb-4">Stade global</h4>
                        <div className="flex justify-between items-center py-2 border-b border-red-100">
                          <span className="font-medium">Stade</span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            {selectedPatient.tnmClassification?.overall_stage || 'Non spu00e9cifiu00e9'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-red-100">
                          <span className="font-medium">Grade</span>
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            {selectedPatient.tnmClassification?.grade || 'Non spu00e9cifiu00e9'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium text-red-700 mb-4">Informations compu00e9lmentaires</h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Date de classification</p>
                            <p className="font-medium">{selectedPatient.tnmClassification?.classification_date || 'Non spu00e9cifiu00e9e'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Notes</p>
                            <p className="font-medium">{selectedPatient.tnmClassification?.notes || 'Aucune note'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Formulaire d'ajout de patient */}
      {showAddPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? "Éditer le patient" : "Ajouter un patient"}</h2>
                <button 
                  onClick={closeAddPatientForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Indicateur de progression */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  {[
                    { step: 0, icon: <Users className="h-5 w-5" />, label: "Informations personnelles", color: "indigo" },
                    { step: 1, icon: <Activity className="h-5 w-5" />, label: "Informations médicales", color: "indigo" },
                    { step: 2, icon: <FileCheck className="h-5 w-5" />, label: "Antécédents & Facteurs", color: "indigo" },
                    { step: 3, icon: <FileImage className="h-5 w-5" />, label: "Examens d'imagerie", color: "indigo" },
                    { step: 4, icon: <Clipboard className="h-5 w-5" />, label: "Classification TNM", color: "indigo" }
                  ].map((item) => (
                    <div key={item.step} className="flex flex-col items-center">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${formStep >= item.step ? `bg-indigo-900 text-white` : 'bg-gray-200 text-gray-500'}`}
                        onClick={() => formStep > item.step && setFormStep(item.step)}
                      >
                        {item.icon}
                      </div>
                      <span className={`text-xs mt-1 ${formStep === item.step ? `text-indigo-900 font-medium` : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-indigo-900 transition-all duration-300"
                    style={{ width: `${(formStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <form onSubmit={addNewPatient}>
                {/* Étape 1: Informations personnelles */}
                {formStep === 0 && (
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <Users className="mr-2 h-6 w-6" />
                      Informations personnelles
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-500">Identifiant</label>
                        <input 
                          type="text" 
                          name="identifiant" 
                          value={newPatient.identifiant} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Nom</label>
                        <input 
                          type="text" 
                          name="last_name" 
                          value={newPatient.last_name} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Prénom</label>
                        <input 
                          type="text" 
                          name="first_name" 
                          value={newPatient.first_name} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Date de naissance</label>
                        <input 
                          type="date" 
                          name="birth_date" 
                          value={newPatient.birth_date} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Genre</label>
                        <select 
                          name="gender" 
                          value={newPatient.gender} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="male">Masculin</option>
                          <option value="female">Féminin</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Adresse</label>
                        <input 
                          type="text" 
                          name="address" 
                          value={newPatient.address} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Téléphone</label>
                        <input 
                          type="text" 
                          name="phone" 
                          value={newPatient.phone} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <input 
                          type="email" 
                          name="email" 
                          value={newPatient.email} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Contact d'urgence</label>
                        <input 
                          type="text" 
                          name="emergency_contact" 
                          value={newPatient.emergency_contact} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Photo du patient</label>
                        <div className="flex items-center">
                          <input 
                            type="file" 
                            name="photo" 
                            accept="image/*"
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                // Dans une application réelle, vous utiliseriez un service de stockage
                                // Ici, nous simulons juste l'URL de la photo
                                setNewPatient({
                                  ...newPatient,
                                  url_photo: URL.createObjectURL(e.target.files[0])
                                });
                              }
                            }}
                          />
                          {newPatient.url_photo && (
                            <div className="ml-2 h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                              <img 
                                src={newPatient.url_photo} 
                                alt="Aperçu" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // En cas d'erreur de chargement de l'image, afficher les initiales
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="h-full w-full flex items-center justify-center font-medium text-indigo-800">${newPatient.first_name[0]}${newPatient.last_name[0]}</div>`;
                                  }
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Étape 2: Informations médicales */}
                {formStep === 1 && (
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <Activity className="mr-2 h-6 w-6" />
                      Informations médicales
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-500">Médecin référent</label>
                        <select 
                          name="referring_doctor_id" 
                          value={newPatient.referring_doctor_id} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>{doctor.first_name} {doctor.last_name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Stade MRC</label>
                        <select 
                          name="kidney_disease_stage" 
                          value={medicalInfo.kidney_disease_stage_id} 
                          onChange={handleMedicalInfoChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="1">Stade 1</option>
                          <option value="2">Stade 2</option>
                          <option value="3">Stade 3</option>
                          <option value="4">Stade 4</option>
                          <option value="5">Stade 5</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">MRC: Maladie Rénale Chronique, DFG: Débit de Filtration Glomérulaire</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Statut</label>
                        <select 
                          name="status" 
                          value={newPatient.status} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="Stable">Stable</option>
                          <option value="Attention">Attention</option>
                          <option value="Critique">Critique</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Groupe sanguin</label>
                        <select 
                          name="bloodType" 
                          value={newPatient.bloodType} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Sélectionner</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">Créatinine (μmol/L)</label>
                        <input 
                          type="number" 
                          name="creatinine" 
                          value={newPatient.creatinine || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ex: 90"
                        />
                        <p className="text-xs text-gray-500 mt-1">Valeurs normales: 60-120 μmol/L (homme), 45-105 μmol/L (femme)</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-500">DFG (mL/min/1.73m²)</label>
                        <input 
                          type="number" 
                          name="gfr" 
                          value={newPatient.gfr || ''} 
                          onChange={handleInputChange} 
                          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Ex: 90"
                        />
                        <p className="text-xs text-gray-500 mt-1">DFG: Débit de Filtration Glomérulaire - Valeur normale ≥ 90 mL/min</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Étape 3: Antécédents & Facteurs de risque */}
                {formStep === 2 && (
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <FileCheck className="mr-2 h-6 w-6" />
                      Antécédents & Facteurs de risque
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4 flex items-center">
                          <Dna className="mr-2 h-4 w-4" />
                          Antécédents médicaux
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input type="checkbox" checked={medicalHistory.diabetes} onChange={handleMedicalHistoryChange} name="diabetes" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Diabète</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" checked={medicalHistory.hypertension} onChange={handleMedicalHistoryChange} name="hypertension" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Hypertension</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" checked={medicalHistory.heartDisease} onChange={handleMedicalHistoryChange} name="heartDisease" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Maladie cardiaque</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" checked={medicalHistory.liverDisease} onChange={handleMedicalHistoryChange} name="liverDisease" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Maladie du foie</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" checked={medicalHistory.autoimmune} onChange={handleMedicalHistoryChange} name="autoimmune" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Maladie auto-immune</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4 flex items-center">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Facteurs de risque
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-500">Tabagisme</label>
                            <select 
                              name="smoking" 
                              value={riskFactors.smoking} 
                              onChange={handleRiskFactorChange} 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="non-fumeur">Non-fumeur</option>
                              <option value="fumeur">Ancien fumeur</option>
                              <option value="occasionnel"> occasionnel</option>
                             
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">IMC</label>
                            <select 
                              name="bmi" 
                              value={riskFactors.bmi} 
                              onChange={handleRiskFactorChange} 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="sous-poids">Sous-poids (IMC &lt; 18.5)</option>
                              <option value="normal">Normal (IMC 18.5-24.9)</option>
                              <option value="surpoids">Surpoids (IMC 25-29.9)</option>
                              <option value="obèse">Obèse (IMC ≥ 30)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">IMC: Indice de Masse Corporelle - Poids(kg)/Taille(m)²</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Consommation d'alcool</label>
                            <select 
                              name="alcohol" 
                              value={riskFactors.alcohol} 
                              onChange={handleRiskFactorChange} 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="occasionnel">Occasionnel</option>
                              <option value="modéré">Modéré</option>
                              <option value="élevé">Élevé</option>
                            </select>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" checked={riskFactors.sedentary} onChange={handleRiskFactorChange} name="sedentary" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                            <span>Sédentaire</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Étape 4: Examens d'imagerie */}
                {formStep === 3 && (
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <FileImage className="mr-2 h-6 w-6" />
                      Examens d'imagerie
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Échographie rénale</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-500">Date de l'examen</label>
                            <input 
                              type="date" 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Résultats</label>
                            <select 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="normal">Normal</option>
                              <option value="anormal">Anormal</option>
                              <option value="en-attente">En attente</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Scanner / IRM</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-500">Date de l'examen</label>
                            <input 
                              type="date" 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-500">Résultats</label>
                            <select 
                              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="normal">Normal</option>
                              <option value="anormal">Anormal</option>
                              <option value="en-attente">En attente</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">IRM: Imagerie par Résonance Magnétique</p>
                  </div>
                )}
                
                {/* Étape 5: Classification TNM */}
                {formStep === 4 && (
                  <div className="space-y-6 bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h3 className="text-xl font-semibold text-indigo-900 flex items-center">
                      <Clipboard className="mr-2 h-6 w-6" />
                      Classification TNM
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">TNM: Tumeur, Nodes (Ganglions), Métastases - Système international de classification des cancers</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Tumeur (T)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" name="tumeur" value="T1a" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>T1a (&lt;4cm)</span>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="tumeur" value="T1b" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>T1b (&gt;4cm, &lt;7cm)</span>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="tumeur" value="T2a" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>T2a (&gt;7cm, &lt;10cm)</span>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="tumeur" value="T2b" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>T2b (&gt;10cm)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Ganglions (N)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" name="ganglions" value="N0" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>N0 (Aucun)</span>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="ganglions" value="N1" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>N1 (Métastase dans un ganglion)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-4">Métastases (M)</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="radio" name="metastases" value="M0" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>M0 (Aucune)</span>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="metastases" value="M1" className="h-5 w-5 text-indigo-600 mr-2" />
                            <span>M1 (Métastases à distance)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Navigation entre les étapes */}
                <div className="flex justify-between mt-6">
                  {formStep > 0 && (
                    <button 
                      type="button" 
                      onClick={prevStep}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Précédent
                    </button>
                  )}
                  
                  {formStep < 4 ? (
                    <button 
                      type="button" 
                      onClick={nextStep}
                      className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105"
                    >
                      Suivant
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {isEditMode ? "Mise à jour en cours..." : "Ajout en cours..."}
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 mr-2" />
                          {isEditMode ? "Mettre à jour le patient" : "Ajouter le patient"}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
