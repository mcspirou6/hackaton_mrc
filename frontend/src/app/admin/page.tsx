"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, 
  PieChart, 
  Activity, 
  Settings, 
  Search, 
  UserPlus, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  Edit, 
  Trash2, 
  XCircle, 
  AlertCircle,
  CheckCircle,
  Clock,
  LayoutDashboard,
  LogOut
} from 'lucide-react';
import { 
  getCurrentUser, 
  getDoctors, 
  createDoctor, 
  updateDoctor, 
  deleteDoctor, 
  resetDoctorPassword, 
  getDoctorStatistics,
  getDashboardStats,
  logout,
  fetchAPI 
} from "@/api/api";

// Types
interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  specialization: string;
  role: string;
  status: 'actif' | 'desactive' | 'suspendu';
  created_at: string;
  updated_at: string;
  patients_count: number;
  last_login: string;
}

interface DoctorData {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  license_number?: string;
  specialization?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  patients_count?: number;
  last_login?: string;
}

interface LoginHistory {
  id: number;
  doctorName: string;
  email: string;
  timestamp: string;
  status: 'success' | 'failed';
}

interface NewDoctorData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  specialization: string;
  password: string;
  password_confirmation: string;
  role: string;
  status: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
  user?: any;
  doctors?: Doctor[];
  token?: string;
}
interface StatisticsData {
  total_doctors: number;
  active_doctors: number;
  desactive_doctors: number;
  suspendu_doctors: number;
  total_patients: number;
  average_patients_per_doctor: number;
}

interface DoctorsResponse {
  success: boolean;
  message?: string; // Rend la propriété optionnelle
  doctors?: Doctor[];
}

interface DashboardStats {
  totalPatients: number;
  criticalPatients: number;
  followUpRate: number;
  doctorsCount: number;
  patientsByStage: {
    [key: string]: number;
  };
}

// Mock data for login history (à remplacer par des données réelles plus tard)
const mockLoginHistory: LoginHistory[] = [
  {
    id: 1,
    doctorName: 'Dr. Jean Dupont',
    email: 'jean.dupont@example.com',
    timestamp: '2023-04-01T08:30:00',
    status: 'success'
  },
  {
    id: 2,
    doctorName: 'Dr. Marie Laurent',
    email: 'marie.laurent@example.com',
    timestamp: '2023-04-01T09:15:00',
    status: 'success'
  },
  {
    id: 3,
    doctorName: 'Dr. Pierre Martin',
    email: 'pierre.martin@example.com',
    timestamp: '2023-03-31T14:45:00',
    status: 'success'
  },
  {
    id: 4,
    doctorName: 'Dr. Thomas Bernard',
    email: 'thomas.bernard@example.com',
    timestamp: '2023-03-30T11:20:00',
    status: 'success'
  },
  {
    id: 5,
    doctorName: 'Dr. Jean Dupont',
    email: 'jean.dupont@example.com',
    timestamp: '2023-03-29T16:05:00',
    status: 'success'
  },
  {
    id: 6,
    doctorName: 'Dr. Marie Laurent',
    email: 'marie.laurent@example.com',
    timestamp: '2023-03-28T10:30:00',
    status: 'failed'
  }
];

export default function AdminPage() {
  const router = useRouter();
  // État pour l'utilisateur actuel
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'doctors' | 'loginHistory' | 'settings'>('dashboard');
  
  // State for doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Doctor>('first_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [sortedDoctors, setSortedDoctors] = useState<Doctor[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    criticalPatients: 0,
    followUpRate: 0,
    doctorsCount: 0,
    patientsByStage: {}
  });

  // State for login history
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  
  // State for modals
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isEditDoctorModalOpen, setIsEditDoctorModalOpen] = useState(false);
  const [isDeleteDoctorModalOpen, setIsDeleteDoctorModalOpen] = useState(false);
  const [isViewDoctorModalOpen, setIsViewDoctorModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [newDoctorData, setNewDoctorData] = useState<NewDoctorData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    license_number: '',
    specialization: '',
    password: '',
    password_confirmation: '',
    role: 'medecin',
    status: 'actif'
  });
  const [newPassword, setNewPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction pour charger les statistiques
    const loadStatistics = async () => {
      try {
        const response = await getDoctorStatistics() as ApiResponse<{
          total_doctors: number;
          active_doctors: number;
          desactive_doctors: number;
          suspendu_doctors: number;
          total_patients: number;
          average_patients_per_doctor: number;
        }>;
        
        if (response.success && response.data) {
          setStats({
            totalPatients: response.data.total_patients,
            criticalPatients: 0,
            followUpRate: 0,
            doctorsCount: response.data.total_doctors,
            patientsByStage: {}
          });
        } else {
          console.error('Erreur:', response.message);
        }
      } catch (error) {
        console.error('Erreur de chargement:', error);
      }
    };

    // Fonction pour charger les médecins
    const loadDoctors = async () => {
      try {
        setLoadingDoctors(true);
        const response = await getDoctors();
        
        if (response.success && response.data) {
          setDoctors(response.data);
        } else {
          throw new Error(response.message || 'Réponse API invalide');
        }
      } catch (error) {
        // Méthode 1: Vérification explicite
        if (error instanceof Error) {
          console.error('Erreur détaillée:', error.message);
          setError(error.message);
        } else {
          console.error('Erreur inconnue:', error);
          setError('Une erreur inconnue est survenue');
        }
    
        // Méthode 2: Conversion en Error
        const err = error as Error;
        console.error('Erreur:', err.message);
        setError(err.message || 'Erreur lors du chargement');
        
        // Méthode 3: Utilisation d'un type personnalisé
        interface ApiError {
          message?: string;
          response?: {
            status?: number;
            data?: {
              message?: string;
            };
          };
        }
        const apiError = error as ApiError;
        setError(
          apiError.message || 
          apiError.response?.data?.message || 
          'Erreur API inconnue'
        );
      } finally {
        setLoadingDoctors(false);
      }
    };
  
   // Vérifier l'authentification et charger les données
   useEffect(() => {
    loadStatistics();
    loadDoctors();
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les informations de l'utilisateur connecté
        const userResponse = await getCurrentUser() as ApiResponse<any>;
        if (!userResponse.success) {
          throw new Error(userResponse.message || "Échec de récupération de l'utilisateur");
        }
        
        // Vérifier si l'utilisateur est un administrateur
        if (userResponse.user.role !== 'admin') {
          localStorage.removeItem('auth_token');
          router.push('/');
          return;
        }
        
        setCurrentUser(userResponse.user);
        
        // Récupérer la liste des médecins
        try {
          const doctorsResponse = await getDoctors();
          
          // Vérifier si la réponse est valide
          if (!doctorsResponse || typeof doctorsResponse !== 'object') {
            throw new Error("Format de réponse invalide");
          }
          
          // Traiter la réponse comme any pour éviter les erreurs de typage
          const response = doctorsResponse as any;
          
          if (!response.success) {
            throw new Error(response.message || "Échec de récupération des médecins");
          }
          
          // Vérifier si doctors existe dans la réponse, sinon utiliser data ou un tableau vide
          const doctorsData = response.doctors || response.data || [];
          
          // Filtrer pour n'avoir que les médecins (role = doctor)
          const doctorsList = doctorsData.filter((user: any) => user.role === 'doctor');
          
          // Ajouter le nombre de patients pour chaque médecin (à implémenter côté backend plus tard)
          const enhancedDoctors = doctorsList.map((doctor: DoctorData) => ({
            ...doctor,
            patients_count: Math.floor(Math.random() * 30) + 1, // Valeur aléatoire pour la démonstration
            last_login: doctor.updated_at ? new Date(doctor.updated_at).toISOString() : new Date().toISOString() // Utiliser updated_at comme approximation
          })) as Doctor[];
          
          setDoctors(enhancedDoctors);
          setFilteredDoctors(enhancedDoctors);
          setSortedDoctors(enhancedDoctors);
        
        } catch (err: any) {
          console.error("Erreur lors du chargement des données:", err);
          setError(err.message || "Une erreur s'est produite lors du chargement des données");
        } finally {
          setLoading(false);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données:", err);
        setError(err.message || "Une erreur s'est produite lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('auth_token');
      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      // Même en cas d'erreur, on supprime le token et on redirige
      localStorage.removeItem('auth_token');
      router.push('/');
    }
  };

  
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDoctors(doctors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = doctors.filter(doctor => 
        `${doctor.first_name} ${doctor.last_name}`.toLowerCase().includes(query) ||
        doctor.specialization?.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query)
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);
  
  // Handle sorting
  useEffect(() => {
    const sorted = [...filteredDoctors].sort((a, b) => {
      if (sortField === 'last_login') {
        // Special handling for lastLogin
        if (!a.last_login) return sortDirection === 'asc' ? 1 : -1;
        if (!b.last_login) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc' 
          ? new Date(a.last_login).getTime() - new Date(b.last_login).getTime()
          : new Date(b.last_login).getTime() - new Date(a.last_login).getTime();
      } else {
        // General sorting
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // For numbers
          return sortDirection === 'asc' 
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
        }
      }
    });
    
    setSortedDoctors(sorted);
  }, [filteredDoctors, sortField, sortDirection]);
  
  // Handle sort click
  const handleSort = (field: keyof Doctor) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Fonction pour charger l'historique des connexions
  const loadLoginHistory = async () => {
    try {
      const response = await fetchAPI('doctors/login-history', {}, true);
      if (response.success && response.data) {
        setLoginHistory(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des connexions:', error);
    }
  };

  useEffect(() => {
    loadLoginHistory();
  }, []);

  // Handle add doctor
  const handleAddDoctor = async () => {
    try {
      setFormErrors({});
      
      // Validation
      const errors: Record<string, string> = {};
      if (!newDoctorData.first_name) errors.first_name = "Le prénom est requis";
      if (!newDoctorData.last_name) errors.last_name = "Le nom est requis";
      if (!newDoctorData.email) errors.email = "L'email est requis";
      if (!newDoctorData.email.includes('@')) errors.email = "L'email n'est pas valide";
      if (!newDoctorData.specialization) errors.specialization = "La spécialisation est requise";
      if (!newDoctorData.license_number) errors.license_number = "Le numéro de licence est requis";
      if (!newDoctorData.password) errors.password = "Le mot de passe est requis";
      if (newDoctorData.password.length < 8) errors.password = "Le mot de passe doit contenir au moins 8 caractères";
      if (newDoctorData.password !== newDoctorData.password_confirmation) errors.password_confirmation = "Les mots de passe ne correspondent pas";
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      
      // Appel API pour créer un médecin
      const response = await createDoctor({
        ...newDoctorData,
        role: 'medecin'
      });
      
      // Traiter la réponse comme any pour éviter les erreurs de typage
      const apiResponse = response as any;
      
      if (!apiResponse.success) {
        if (apiResponse.errors) {
          setFormErrors(apiResponse.errors);
        } else {
          setFormErrors({ general: apiResponse.message || "Erreur lors de la création du médecin" });
        }
        return;
      }
      
      // 1. Définissez un type pour le statut (si ce n'est pas déjà fait)
      type DoctorStatus = "actif" | "desactive" | "suspendu";

      // 2. Modifiez votre code comme suit :
      const newDoctor: Doctor = {
        id: apiResponse.data.id,
        first_name: newDoctorData.first_name || '',
        last_name: newDoctorData.last_name || '',
        email: newDoctorData.email || '',
        phone: newDoctorData.phone || '',
        license_number: newDoctorData.license_number || '',
        specialization: newDoctorData.specialization || '',
        role: newDoctorData.role || 'medecin',
        status: (["actif", "desactive", "suspendu"].includes(newDoctorData.status) 
          ? newDoctorData.status 
          : 'actif') as DoctorStatus, // Conversion de type sûre
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patients_count: 0,
        last_login: '-'
      };
      
      setDoctors([...doctors, newDoctor]);
      setIsAddDoctorModalOpen(false);
      setSuccessMessage("Médecin ajouté avec succès");
      
      // Réinitialiser le formulaire
      setNewDoctorData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        license_number: '',
        specialization: '',
        password: '',
        password_confirmation: '',
        role: 'medecin',
        status: 'actif'
      });
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      console.error("Erreur lors de l'ajout du médecin:", error);
      setFormErrors({ general: error.message || "Une erreur s'est produite" });
    }
  };
  
  // Handle update doctor
  const handleUpdateDoctor = async () => {
    // Vérification initiale
    if (!selectedDoctor || !newDoctorData) {
      setFormErrors({ general: 'Aucun médecin sélectionné' });
      return;
    }
  
    try {
      setFormErrors({});
      
      // Validation
      const errors: Record<string, string> = {};
      if (!newDoctorData.first_name) errors.first_name = "Prénom requis";
      if (!newDoctorData.last_name) errors.last_name = "Nom requis";
      if (!newDoctorData.email?.includes('@')) errors.email = "Email invalide";
  
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
  
      // Appel API avec vérification de selectedDoctor
      const response = await updateDoctor(selectedDoctor.id, {
        first_name: newDoctorData.first_name,
        last_name: newDoctorData.last_name,
        email: newDoctorData.email,
        phone: newDoctorData.phone ?? null,
        license_number: newDoctorData.license_number ?? null,
        specialization: newDoctorData.specialization ?? null,
        status: newDoctorData.status || 'actif',
        role: newDoctorData.role || 'medecin'
      });
  
      // Mise à jour de l'état
      setDoctors(prev => prev.map(doc => 
        doc.id === selectedDoctor!.id 
          ? { ...doc, ...(response as ApiResponse<Doctor>).data! } 
          : doc
      ));
      
      setIsEditDoctorModalOpen(false);
      setSuccessMessage('Médecin mis à jour');
      
    } catch (error) {
      setFormErrors({
        general: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };
  
  // Handle delete doctor
  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;
    
    try {
      // Appel API pour supprimer un médecin
      const response = await deleteDoctor(selectedDoctor.id) as ApiResponse<null>;
      
      if (response.success) {
        // Mettre à jour la liste des médecins
        const updatedDoctors = doctors.filter(doctor => doctor.id !== selectedDoctor.id);
        
        setDoctors(updatedDoctors);
        setIsDeleteDoctorModalOpen(false);
        setSuccessMessage("Médecin supprimé avec succès");
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setFormErrors({ general: response.message || "Erreur lors de la suppression du médecin" });
      }
    } catch (error: any) {
      console.error("Erreur lors de la suppression du médecin:", error);
      setFormErrors({ general: error.message || "Une erreur s'est produite" });
    }
  };
  
  // Handle reset password
  const handleResetPassword = async () => {
    if (!selectedDoctor) return;
    
    try {
      setFormErrors({});
      
      // Validation
      if (!newPassword) {
        setFormErrors({ password: "Le mot de passe est requis" });
        return;
      }
      
      if (newPassword.length < 8) {
        setFormErrors({ password: "Le mot de passe doit contenir au moins 8 caractères" });
        return;
      }
      
      // Appel API pour réinitialiser le mot de passe
      const response = await resetDoctorPassword(selectedDoctor.id, newPassword) as ApiResponse<{password: string}>;
      
      if (response.success) {
        setIsResetPasswordModalOpen(false);
        setSuccessMessage("Mot de passe réinitialisé avec succès");
        setNewPassword('');
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setFormErrors({ general: response.message || "Erreur lors de la réinitialisation du mot de passe" });
      }
    } catch (error: any) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      setFormErrors({ general: error.message || "Une erreur s'est produite" });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <div className="bg-cyan-500 p-2 rounded-lg mr-3">
            <Settings className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">Administration</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <button 
                className={`w-full flex items-center p-3 ${activeTab === 'dashboard' ? 'bg-indigo-800' : 'hover:bg-indigo-800'} rounded-lg transition-colors`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Tableau de bord</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 ${activeTab === 'doctors' ? 'bg-indigo-800' : 'hover:bg-indigo-800'} rounded-lg transition-colors`}
                onClick={() => setActiveTab('doctors')}
              >
                <Users className="mr-3 h-5 w-5" />
                <span>Médecins</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 ${activeTab === 'loginHistory' ? 'bg-indigo-800' : 'hover:bg-indigo-800'} rounded-lg transition-colors`}
                onClick={() => setActiveTab('loginHistory')}
              >
                <Clock className="mr-3 h-5 w-5" />
                <span>Historique</span>
              </button>
            </li>
            <li>
              <button 
                className={`w-full flex items-center p-3 ${activeTab === 'settings' ? 'bg-indigo-800' : 'hover:bg-indigo-800'} rounded-lg transition-colors`}
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-3 h-5 w-5" />
                <span>Paramètres</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center p-3 hover:bg-indigo-800 rounded-lg"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Déconnexion</span>
          </button>
          
          <div className="flex items-center mt-6 p-3 bg-indigo-800 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
              <span className="font-bold">{currentUser?.first_name?.charAt(0)}{currentUser?.last_name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium">{currentUser?.first_name} {currentUser?.last_name}</p>
              <p className="text-xs text-gray-300">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Success message */}
        {successMessage && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md flex items-center z-50">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        )}
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Médecins</h2>
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Users className="h-6 w-6 text-indigo-600" />
                  </div>
                </div> 
                <p className="text-3xl font-bold text-gray-800">{stats.doctorsCount}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {stats.doctorsCount} médecins
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Patients</h2>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{stats.totalPatients}</p>
                <p className="text-sm text-gray-500 mt-2">Patients</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Connexions</h2>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">{loginHistory.length}</p>
                <p className="text-sm text-gray-500 mt-2">{loginHistory.filter(l => l.status === 'success').length} réussies, {loginHistory.filter(l => l.status === 'failed').length} échouées</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-800">Statistiques</h2>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <PieChart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">100%</p>
                <p className="text-sm text-gray-500 mt-2">Système opérationnel</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Dernières connexions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médecin</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loginHistory.slice(0, 5).map(login => (
                        <tr key={login.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{login.doctorName}</div>
                                <div className="text-sm text-gray-500">{login.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(login.timestamp).toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {login.status === 'success' ? 'Succès' : 'Échec'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Médecins récemment actifs</h2>
                <div className="space-y-4">
                  {sortedDoctors
                    .filter(doctor => doctor.status === 'actif')
                    .sort((a, b) => {
                      if (!a.last_login) return 1;
                      if (!b.last_login) return -1;
                      return new Date(b.last_login).getTime() - new Date(a.last_login).getTime();
                    })
                    .slice(0, 5)
                    .map(doctor => (
                      <div key={doctor.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                            <span className="font-medium text-indigo-600">
                              {doctor.first_name.charAt(0)}{doctor.last_name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{doctor.first_name} {doctor.last_name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialization}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-800">{doctor.patients_count} patients</p>
                          <p className="text-xs text-gray-500">
                            {doctor.last_login !== '-' 
                              ? `Dernière connexion: ${new Date(doctor.last_login).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` 
                              : 'Jamais connecté'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {/* Doctors Management */}
        {activeTab === 'doctors' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des médecins</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-medium">{filteredDoctors.length}</span>
                  <span className="ml-1">résultats</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <input 
                    type="text" 
                    placeholder="Rechercher un médecin..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    setNewDoctorData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      license_number: "",
                      specialization: "",
                      password: "",
                      password_confirmation: "",
                      role: "medecin",
                      status: "actif",
                    });
                    setIsAddDoctorModalOpen(true);
                  }}
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Ajouter un médecin
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('first_name')}
                      >
                        <div className="flex items-center">
                          <span>Nom</span>
                          {sortField === 'first_name' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('specialization')}
                      >
                        <div className="flex items-center">
                          <span>Spécialité</span>
                          {sortField === 'specialization' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center">
                          <span>Email</span>
                          {sortField === 'email' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('patients_count')}
                      >
                        <div className="flex items-center">
                          <span>Patients</span>
                          {sortField === 'patients_count' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          <span>Statut</span>
                          {sortField === 'status' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('last_login')}
                      >
                        <div className="flex items-center">
                          <span>Dernière connexion</span>
                          {sortField === 'last_login' && (
                            sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedDoctors.map(doctor => (
                      <tr key={doctor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                              <p className="font-medium text-gray-800">{doctor.first_name} {doctor.last_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.patients_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${doctor.status === 'actif' ? 'bg-green-100 text-green-800' : doctor.status === 'desactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {doctor.status === 'actif' ? 'Actif' : doctor.status === 'desactive' ? 'Désactivé':'Suspendu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doctor.last_login ? new Date(doctor.last_login).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              className="p-1 text-indigo-600 hover:text-indigo-900"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setIsViewDoctorModalOpen(true);
                              }}
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              className="p-1 text-blue-600 hover:text-blue-900"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setNewDoctorData({
                                  first_name: doctor.first_name,
                                  last_name: doctor.last_name,
                                  email: doctor.email,
                                  phone: doctor.phone,
                                  license_number: doctor.license_number,
                                  specialization: doctor.specialization,
                                  password: '',
                                  password_confirmation: '',
                                  role: doctor.role,
                                  status: doctor.status
                                });
                                setIsEditDoctorModalOpen(true);
                              }}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-900"
                              onClick={() => {
                                setSelectedDoctor(doctor);
                                setIsDeleteDoctorModalOpen(true);
                              }}
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
              
              {/* Message vide */}
            {sortedDoctors.length === 0 && !loadingDoctors && (
              <div className="text-center py-8 col-span-full">
                <p className="text-gray-500">Aucun médecin trouvé</p>
                
                <button 
                  onClick={() => loadDoctors()}
                  className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Réessayer
                </button>
              </div>
            )}

              {/* Loading state */}
              {loadingDoctors && (
                <div className="text-center py-8 col-span-full">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                  <p className="mt-2 text-gray-500">Chargement des médecins...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Login History Tab */}
        {activeTab === 'loginHistory' && (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Historique de connexion</h2>
                <p className="text-sm text-gray-500 mt-1">Suivi des activités de connexion des médecins</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médecin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Heure
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Appareil
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Localisation
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loginHistory.slice().reverse().map(login => (
                      <tr key={login.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                              <span className="font-medium text-indigo-600">
                                {login.doctorName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{login.doctorName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(login.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {login.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {login.status === 'success' ? 'Succès' : 'Échec'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="p-6 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Paramètres de l'administrateur</h2>
              <p className="text-gray-600 mb-6">Configurez les paramètres généraux de la plateforme.</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Notifications</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notifications par email</p>
                      <p className="text-xs text-gray-500">Recevoir des notifications par email pour les nouvelles inscriptions</p>
                    </div>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox"
                        className="absolute w-5 h-5 opacity-0 cursor-pointer"
                        defaultChecked={true}
                      />
                      <div className="w-10 h-5 rounded-full bg-indigo-600"></div>
                      <div className="absolute left-0 w-5 h-5 bg-white rounded-full shadow transform translate-x-5"></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Sécurité</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Authentification à deux facteurs</p>
                      <p className="text-xs text-gray-500">Exiger l'authentification à deux facteurs pour tous les médecins</p>
                    </div>
                    <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full cursor-pointer">
                      <input 
                        type="checkbox"
                        className="absolute w-5 h-5 opacity-0 cursor-pointer"
                        defaultChecked={false}
                      />
                      <div className="w-10 h-5 rounded-full bg-gray-300"></div>
                      <div className="absolute left-0 w-5 h-5 bg-white rounded-full shadow transform translate-x-0"></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 mb-2">Sauvegarde des données</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Dernière sauvegarde: 01/04/2025 à 08:00</p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
                      Lancer une sauvegarde manuelle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Doctor Modal */}
        {isAddDoctorModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
                <h2 className="text-xl font-bold text-gray-800">Ajouter un médecin</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formErrors.general}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.last_name}
                    onChange={(e) => setNewDoctorData({...newDoctorData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.first_name}
                    onChange={(e) => setNewDoctorData({...newDoctorData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.email}
                    onChange={(e) => setNewDoctorData({...newDoctorData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.phone}
                    onChange={(e) => setNewDoctorData({...newDoctorData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de licence</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.license_number}
                    onChange={(e) => setNewDoctorData({...newDoctorData, license_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.specialization}
                    onChange={(e) => setNewDoctorData({...newDoctorData, specialization: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.password}
                    onChange={(e) => setNewDoctorData({...newDoctorData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation du mot de passe</label>
                  <input 
                    type="password" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.password_confirmation}
                    onChange={(e) => setNewDoctorData({...newDoctorData, password_confirmation: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.status}
                    onChange={(e) => setNewDoctorData({...newDoctorData, status: e.target.value as "actif" | "desactive" | "suspendu"})}
                  >
                    <option value="actif">Actif</option>
                    <option value="desactive">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                    
                    
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsAddDoctorModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={handleAddDoctor}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Doctor Modal */}
        {isEditDoctorModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-scroll">
              <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
                <h2 className="text-xl font-bold text-gray-800">Modifier un médecin </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsEditDoctorModalOpen(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formErrors.general}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.last_name}
                    onChange={(e) => setNewDoctorData({...newDoctorData, last_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.first_name}
                    onChange={(e) => setNewDoctorData({...newDoctorData, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.email}
                    onChange={(e) => setNewDoctorData({...newDoctorData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.phone}
                    onChange={(e) => setNewDoctorData({...newDoctorData, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de licence</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.license_number}
                    onChange={(e) => setNewDoctorData({...newDoctorData, license_number: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.specialization}
                    onChange={(e) => setNewDoctorData({...newDoctorData, specialization: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newDoctorData.status}
                    onChange={(e) => setNewDoctorData({...newDoctorData, status: e.target.value as "actif" | "desactive" | "suspendu"})}
                  >
                    <option value="actif">Actif</option>
                    <option value="desactive">Inactif</option>
                    <option value="suspendu">Suspendu</option>
                    
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsEditDoctorModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={!selectedDoctor} // Désactive si null
                  onClick={handleUpdateDoctor}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Delete Doctor Modal */}
        {isDeleteDoctorModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Supprimer un médecin</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsDeleteDoctorModalOpen(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600">Êtes-vous sûr de vouloir supprimer le médecin <span className="font-medium text-gray-800">{selectedDoctor.first_name} {selectedDoctor.last_name}</span> ? Cette action est irréversible.</p>
                {(selectedDoctor.patients_count || 0) > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <p className="text-sm text-yellow-700">
                        Ce médecin a actuellement <span className="font-medium">{selectedDoctor.patients_count || 0} patients</span> assignés. Veuillez les réassigner à un autre médecin avant de procéder à la suppression.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsDeleteDoctorModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={handleDeleteDoctor}
                  disabled={(selectedDoctor.patients_count || 0) > 0}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* View Doctor Modal */}
        {isViewDoctorModalOpen && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Détails du médecin</h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsViewDoctorModalOpen(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-indigo-600">
                      {selectedDoctor.first_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">{selectedDoctor.first_name} {selectedDoctor.last_name}</h3>
                  <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${selectedDoctor.status === 'actif' ? 'bg-green-100 text-green-800' : selectedDoctor.status === 'desactive' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800' }`}>
                      {selectedDoctor.status === 'actif' ? 'Actif' : selectedDoctor.status === 'desactive' ? 'Désactivé':'Suspendu'}
                    </span>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Téléphone</p>
                      <p className="text-gray-800">{selectedDoctor.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patients assignés</p>
                      <p className="text-gray-800">{selectedDoctor.patients_count}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                      <p className="text-gray-800">{new Date(selectedDoctor.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Dernière connexion</p>
                      <p className="text-gray-800">
                        {selectedDoctor.last_login !== '-' 
                          ? new Date(selectedDoctor.last_login).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) 
                          : 'Jamais connecté'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-md font-medium text-gray-800 mb-4">Activité récente</h4>
                    <div className="space-y-3">
                      {loginHistory
                        .filter(login => login.doctorName === selectedDoctor.first_name + ' ' + selectedDoctor.last_name)
                        .slice(-3)
                        .reverse()
                        .map(login => (
                          <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <div>
                                <p className="text-sm text-gray-800">
                                  {login.status === 'success' ? 'Connexion réussie' : 'Échec de connexion'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(login.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • {login.email}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${login.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {login.status === 'success' ? 'Succès' : 'Échec'}
                            </span>
                          </div>
                        ))}
                      {loginHistory.filter(login => login.doctorName === selectedDoctor.first_name + ' ' + selectedDoctor.last_name).length === 0 && (
                        <p className="text-sm text-gray-500">Aucune activité récente</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-3">
                <button 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsViewDoctorModalOpen(false)}
                >
                  Fermer
                </button>
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  onClick={() => {
                    setIsViewDoctorModalOpen(false);
                    setNewDoctorData({
                      first_name: selectedDoctor.first_name,
                      last_name: selectedDoctor.last_name,
                      email: selectedDoctor.email,
                      phone: selectedDoctor.phone,
                      license_number: selectedDoctor.license_number,
                      specialization: selectedDoctor.specialization,
                      password: '',
                      password_confirmation: '',
                      role: selectedDoctor.role,
                      status: selectedDoctor.status
                    });
                    setIsEditDoctorModalOpen(true);
                  }}
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
