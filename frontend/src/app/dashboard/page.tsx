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
  ChevronLeft, 
  ChevronRight,
  Heart,
  Activity,
  Bone as BoneIcon,
  Smile,
  Stethoscope,
  Pill,
  Droplets,
  Microscope,
  Clipboard,
  AlertTriangle,
  FileCheck,
  Syringe,
  Thermometer,
  Plus,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  LogOut
} from "lucide-react";
import { getCurrentUser, getPatients, getAppointments, getKidneyDiseaseStages, getPatientsStatistics, logout } from "@/api/api";

// Types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: T;
  user?: any;
  patients?: Patient[];
  appointments?: Appointment[];
  stages?: KidneyDiseaseStage[];
  token?: string;
}

interface Patient {
  id: number;
  identifiant: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  address: string;
  phone: string;
  emergency_contact: string;
  referring_doctor_id: number;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  age?: number;
  status?: "Stable" | "Attention" | "Critique";
  stade?: string;
}

interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  time: string;
  reason: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  doctor?: {
    first_name: string;
    last_name: string;
  };
}

interface HealthMetric {
  name: string;
  value: number;
  status: "normal" | "warning" | "critical";
  icon: React.ReactNode;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  license_number: string | null;
  specialization: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface KidneyDiseaseStage {
  id: number;
  name: string;
  description: string;
  recommendations: string;
  created_at: string;
  updated_at: string;
}

interface StatisticsData {
  total_patients_medecin: number;
  total_rendez_vous: number;
  total_patients_critiques: number;
}

export default function Dashboard() {
  const router = useRouter();
  // États
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [kidneyDiseaseStages, setKidneyDiseaseStages] = useState<KidneyDiseaseStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { name: "Cœur", value: 95, status: "normal", icon: <Heart className="w-6 h-6 text-red-500" /> },
    { name: "Activité", value: 85, status: "normal", icon: <Activity className="w-6 h-6 text-blue-500" /> },
    { name: "Os", value: 60, status: "warning", icon: <BoneIcon className="w-6 h-6 text-orange-500" /> },
    { name: "Hummeur", value: 90, status: "normal", icon: <Smile className="w-6 h-6 text-white" /> },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState("Mars 2025");
  const [selectedDay, setSelectedDay] = useState(31);

  const [statistics, setStatistics] = useState({
      total_patients_medecin: 0,
      total_rendez_vous: 0,
      total_patients_critiques: 0,
    });
  


  // Fonction pour charger les statistiques
      const loadStatistics = async () => {
        try {
          const response = await getPatientsStatistics();
          
          if (response.success && response.data) {
            setStatistics({
              total_patients_medecin: response.data.total_patients_medecin,
              total_rendez_vous: response.data.total_rendez_vous,
              total_patients_critiques: response.data.total_patients_critiques,
            });
          } else {
            console.error('Erreur:', response.message);
          }
        } catch (error) {
          console.error('Erreur de chargement:', error);
        }
      };

  // Vérifier l'authentification et charger les données
  useEffect(() => {
    loadStatistics();
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
        setCurrentUser(userResponse.user);
        
        // Récupérer la liste des patients
        const patientsResponse = await getPatients() as unknown as ApiResponse<Patient[]>;
        if (!patientsResponse.success) {
          throw new Error(patientsResponse.message || "Échec de récupération des patients");
        }
        
        // Ajouter des propriétés calculées aux patients
        const enhancedPatients = patientsResponse.patients?.map((patient: Patient) => {
          // Calculer l'âge à partir de la date de naissance
          const birthDate = new Date(patient.birth_date);
          const ageDifMs = Date.now() - birthDate.getTime();
          const ageDate = new Date(ageDifMs);
          const age = Math.abs(ageDate.getUTCFullYear() - 1970);
          
          // Attribuer un statut aléatoire pour la démonstration
          const statuses: ("Stable" | "Attention" | "Critique")[] = ["Stable", "Attention", "Critique"];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          // Attribuer un stade aléatoire pour la démonstration
          const stades = ["Stade 1", "Stade 2", "Stade 3", "Stade 4", "Stade 5"];
          const randomStade = stades[Math.floor(Math.random() * stades.length)];
          
          return {
            ...patient,
            age,
            status: randomStatus,
            stade: randomStade
          };
        }) || [];
        
        setPatients(enhancedPatients);
        
        // Récupérer les rendez-vous
        const appointmentsResponse = await getAppointments() as unknown as ApiResponse<Appointment[]>;
        if (!appointmentsResponse.success) {
          throw new Error(appointmentsResponse.message || "Échec de récupération des rendez-vous");
        }
        setAppointments(appointmentsResponse.appointments || []);
        
        // Récupérer les stades de maladie rénale
        const stagesResponse = await getKidneyDiseaseStages() as unknown as ApiResponse<KidneyDiseaseStage[]>;
        if (!stagesResponse.success) {
          throw new Error(stagesResponse.message || "Échec de récupération des stades de maladie rénale");
        }
        setKidneyDiseaseStages(stagesResponse.stages || []);
        
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
  
  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = patients.filter(patient => 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Jours de la semaine
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  // Générer les jours du mois (simplifié)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

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
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white p-6 flex flex-col">
        <div className="flex items-center mb-10">
          <div className="bg-cyan-500 p-2 rounded-lg mr-3">
            <Stethoscope className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold">NéphroSuivi</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link href="/dashboard" className="flex items-center p-3 bg-indigo-800 rounded-lg">
                <LayoutDashboard className="mr-3 h-5 w-5" />
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link href="/patients" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
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
              <span className="font-bold">DR</span>
            </div>
            <div>
              <p className="font-medium">{currentUser?.first_name} {currentUser?.last_name}</p>
              <p className="text-xs text-gray-300">{currentUser?.role}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white p-6 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input 
                type="text" 
                placeholder="Rechercher..." 
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
        
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{statistics.total_patients_medecin}</h3>
                </div>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+2.5%</span>
                <span className="text-gray-500 text-sm ml-1">depuis le mois dernier</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Rendez-vous aujourd'hui</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{statistics.total_rendez_vous}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+12%</span>
                <span className="text-gray-500 text-sm ml-1">depuis la semaine dernière</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Patients critiques</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{statistics.total_patients_critiques}
                  </h3>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-red-500 text-sm font-medium">+1</span>
                <span className="text-gray-500 text-sm ml-1">depuis hier</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Taux de suivi</p>
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">92%</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+4%</span>
                <span className="text-gray-500 text-sm ml-1">depuis le trimestre dernier</span>
              </div>
            </div>
          </div>
          
          {/* Health Metrics and Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Health Metrics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-1">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Indicateurs de santé</h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Voir tout</button>
              </div>
              
              <div className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-lg mr-4 ${
                      metric.status === "normal" ? "bg-green-100" :
                      metric.status === "warning" ? "bg-yellow-100" : "bg-red-100"
                    }`}>
                      {metric.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{metric.name}</h3>
                        <span className={`text-sm font-medium ${
                          metric.status === "normal" ? "text-green-600" :
                          metric.status === "warning" ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metric.status === "normal" ? "bg-green-500" :
                            metric.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="mt-6 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un indicateur
              </button>
            </div>
            
            {/* Calendar */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Calendrier</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <span className="font-medium">{currentMonth}</span>
                  <button className="p-1 rounded-full hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {daysInMonth.map((day, index) => (
                  <button 
                    key={index} 
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm p-1
                      ${day === selectedDay ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                      ${day === 31 && !selectedDay ? 'bg-indigo-100 text-indigo-800 font-medium' : ''}
                    `}
                    onClick={() => setSelectedDay(day)}
                  >
                    <span>{day}</span>
                    {[5, 12, 18, 25].includes(day) && (
                      <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Patients and Appointments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Patients */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Patients récents</h2>
                <Link href="/patients" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Voir tous
                </Link>
              </div>
              
              <div className="space-y-3">
                {filteredPatients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      patient.status === "Stable" ? "bg-green-100 text-green-700" :
                      patient.status === "Attention" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {patient.first_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{patient.first_name} {patient.last_name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === "Stable" ? "bg-green-100 text-green-800" :
                          patient.status === "Attention" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{patient.age} ans</span>
                        <span className={`px-2 rounded-full text-xs ${
                          patient.stade === "Stade 1" || patient.stade === "Stade 2" ? "bg-green-50 text-green-700" :
                          patient.stade === "Stade 3" ? "bg-yellow-50 text-yellow-700" :
                          patient.stade === "Stade 4" ? "bg-orange-50 text-orange-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {patient.stade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Today's Appointments */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Rendez-vous du jour</h2>
                <Link href="/appointments" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  Voir tous
                </Link>
              </div>
              
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="flex p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center mr-4 text-center">
                      <div className="bg-indigo-100 text-indigo-800 rounded-lg px-3 py-1 text-sm font-medium mb-1">
                        {appointment.time.split('-')[0]}
                      </div>
                      <Clock className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{appointment.patient?.first_name} {appointment.patient?.last_name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{appointment.reason}</span>
                        <span className="text-indigo-600">{appointment.doctor?.first_name} {appointment.doctor?.last_name}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <MessageSquare className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100">
                        <Calendar className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un rendez-vous
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
