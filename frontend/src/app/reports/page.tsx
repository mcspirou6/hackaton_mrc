"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Bell, 
  FileText, 
  Settings, 
  MessageSquare, 
  Search, 
  Stethoscope,
  Download,
  Filter,
  BarChart2,
  PieChart,
  LineChart,
  ArrowUpDown,
  FileDown,
  Share2,
  Clock,
  Plus,
  ChevronDown,
  ChevronRight,
  Printer,
  LogOut,
  Mail,
  AlertTriangle,
  Activity,
  Pill,
  CheckCircle,
  X
} from "lucide-react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  getReports, 
  getReportTemplates, 
  generatePatientReport, 
  downloadReport, 
  sendReportByEmail,
  getPatientDetailsForReport 
} from '@/api/reportService';
import { getPatients, getAllReports } from '@/api/api';
import ReportContent from "./ReportContent";

// Types
interface Report {
  id: number;
  title: string;
  type: string;
  category: string;
  date: string;
  author: string;
  status: string;
  format: string;
  patient_id?: number;
  user_id?: number;
  content?: any;
  file_path?: string;
  created_at?: string;
  updated_at?: string;
}

interface ReportTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  referring_doctor_id?: number;
  photo_url?: string;
  medicalInfo?: {
    kidney_disease_stage_id?: number;
  };
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface PatientsResponse {
  success: boolean;
  patients: Patient[];
  message: string | null;
}

export default function Reports() {
  const router = useRouter();
  // États
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // État pour le formulaire d'email
  const [emailForm, setEmailForm] = useState({
    to: '',
    subject: '',
    message: ''
  });
  
  // Charger les données de l'utilisateur connecté et les rapports
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Charger l'utilisateur
        const { getCurrentUser } = await import('@/api/api');
        const userResponse = await getCurrentUser() as unknown as { success: boolean; user: User };
        if (userResponse.success) {
          setCurrentUser(userResponse.user);
        }
        
        // Charger la liste des patients en utilisant la fonction getPatients de l'API
        try {
          const { getPatients } = await import('@/api/api');
          const patientsResponse = await getPatients();
          console.log("Réponse API patients:", patientsResponse);
          
          if (patientsResponse && typeof patientsResponse === 'object' && 'success' in patientsResponse && patientsResponse.success) {
            // Vérifier si les données sont dans data ou directement dans la réponse
            const patientsData = 'data' in patientsResponse && Array.isArray(patientsResponse.data) 
              ? patientsResponse.data 
              : Array.isArray(patientsResponse) ? patientsResponse : [];
            
            setPatients(patientsData);
            console.log(`${patientsData.length} patients chargés avec succès`);
          } else {
            console.error("Format de réponse patients incorrect:", patientsResponse);
            setPatients([]);
          }
        } catch (apiError) {
          console.error("Erreur lors de l'appel à l'API patients:", apiError);
          
          // Données de secours en cas d'erreur
          const mockPatients = [
            {
              id: 1,
              first_name: "Jean",
              last_name: "Dupont",
              birth_date: "1975-05-15",
              gender: "male"
            },
            {
              id: 2,
              first_name: "Marie",
              last_name: "Martin",
              birth_date: "1980-10-20",
              gender: "female"
            }
          ];
          
          setPatients(mockPatients);
          console.log("Utilisation de données patients simulées");
        }
        
        // Charger les rapports existants
        const { getAllReports } = await import('@/api/api');
        const reportsResponse = await getAllReports() as ApiResponse<Report[]>;
        if (reportsResponse.success && reportsResponse.data) {
          setReports(reportsResponse.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Impossible de charger les données. Veuillez réessayer.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"recent" | "templates">("recent");
  
  // Fonction pour télécharger un rapport
  const handleDownloadReport = async (report: Report) => {
    try {
      const response = await downloadReport(report.id) as unknown as ApiResponse<Blob>;
      
      if (response.success && response.data) {
        // Créer un URL pour le blob
        const blob = response.data;
        const url = window.URL.createObjectURL(blob);
        
        // Créer un lien et déclencher le téléchargement
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `rapport_${report.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        
        // Nettoyer
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success("Téléchargement du rapport réussi");
      } else {
        toast.error("Erreur lors du téléchargement du rapport");
      }
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement du rapport");
    }
  };
  
  // Fonction pour ouvrir le formulaire d'envoi par email
  const handleOpenEmailForm = (report: Report) => {
    // Si le rapport est lié à un patient, on pré-remplit l'email du patient
    if (report.patient_id) {
      const patient = patients.find(p => p.id === report.patient_id);
      if (patient && patient.emergency_contact) {
        setEmailForm({
          to: patient.emergency_contact,
          subject: `Rapport médical: ${report.title}`,
          message: `Cher(e) ${patient.first_name} ${patient.last_name},\n\nVeuillez trouver ci-joint votre rapport médical.\n\nCordialement,\n${currentUser ? currentUser.first_name + ' ' + currentUser.last_name : 'L\'équipe médicale'}`
        });
      } else {
        setEmailForm({
          to: '',
          subject: `Rapport médical: ${report.title}`,
          message: `Veuillez trouver ci-joint le rapport médical.\n\nCordialement,\n${currentUser ? currentUser.first_name + ' ' + currentUser.last_name : 'L\'équipe médicale'}`
        });
      }
    } else {
      setEmailForm({
        to: '',
        subject: `Rapport médical: ${report.title}`,
        message: `Veuillez trouver ci-joint le rapport médical.\n\nCordialement,\n${currentUser ? currentUser.first_name + ' ' + currentUser.last_name : 'L\'équipe médicale'}`
      });
    }
    
    setShowEmailModal(true);
  };
  
  // Fonction pour envoyer un rapport par email
  const handleSendEmail = async () => {
    if (!emailForm.to || !emailForm.subject || !emailForm.message) {
      toast.error("Veuillez remplir tous les champs du formulaire");
      return;
    }
    
    try {
      setIsSending(true);
      
      // Envoyer l'email
      const response = await sendReportByEmail({
        to: emailForm.to,
        subject: emailForm.subject,
        message: emailForm.message,
        reportId: selectedReport?.id || 0
      }) as unknown as ApiResponse<any>;
      
      if (response.success) {
        // Fermer le modal et réinitialiser le formulaire
        setShowEmailModal(false);
        setEmailForm({
          to: '',
          subject: '',
          message: ''
        });
        
        // Afficher un message de succès
        toast.success("Email envoyé avec succès");
      } else {
        toast.error(response.message || "Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email:", error);
      toast.error("Erreur lors de l'envoi de l'email");
    } finally {
      setIsSending(false);
    }
  };
  
  // Fonction pour ouvrir le modal de génération de rapport
  const handleOpenGenerateModal = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowGenerateModal(true);
  };

  // Fonction pour générer un rapport
  const handleGenerateReport = async () => {
    if (!selectedPatient) {
      toast.error("Veuillez sélectionner un patient");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Générer le rapport pour le patient sélectionné
      const response = await generatePatientReport(
        selectedPatient.id,
        "Personnalisé",
        { 
          author: currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "Dr. Système",
          user_id: 1 // ID de l'administrateur connecté (fixe)
        }
      ) as unknown as ApiResponse<Report>;
      
      if (response.success && response.data) {
        // Ajouter le nouveau rapport à la liste
        setReports(prevReports => [response.data as Report, ...prevReports]);
        
        // Fermer le modal et réinitialiser les sélections
        setShowGenerateModal(false);
        setSelectedPatient(null);
        
        // Afficher un message de succès
        toast.success("Rapport généré avec succès");
      } else {
        toast.error(response.message || "Erreur lors de la génération du rapport");
      }
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast.error("Erreur lors de la génération du rapport");
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Filtrer les rapports en fonction des filtres actifs
  const filteredReports = useMemo(() => {
    // Retourner directement les rapports sans filtrage
    return reports;
  }, [reports]);
  
  // Types de rapports uniques
  const reportTypes = ["Mensuel", "Trimestriel", "Annuel", "Personnalisé"];
  
  // Catégories de rapports uniques
  const reportCategories = ["Patients", "Traitements", "Médicaments", "Performance"];
  
  // Statuts de rapports uniques
  const reportStatuses = ["Généré", "En cours", "Programmé"];
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Généré": return "bg-green-100 text-green-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "Programmé": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Fonction pour obtenir l'icône du format
  const getFormatIcon = (format: string) => {
    switch(format) {
      case "PDF": return <FileText className="h-5 w-5" />;
      case "Excel": return <FileDown className="h-5 w-5" />;
      case "CSV": return <FileDown className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };
  
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
              <Link href="/dashboard" className="flex items-center p-3 hover:bg-indigo-800 rounded-lg transition-colors">
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
              <Link href="/reports" className="flex items-center p-3 bg-indigo-800 rounded-lg">
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
              <p className="text-xs text-gray-300">{currentUser ? currentUser.role : ''}</p>
            </div>
            <button 
              onClick={async () => {
                try {
                  const { logout } = await import('@/api/api');
                  await logout();
                  localStorage.removeItem('auth_token');
                  router.push('/');
                } catch (error) {
                  console.error("Erreur lors de la déconnexion:", error);
                  localStorage.removeItem('auth_token');
                  router.push('/');
                }
              }}
              className="ml-auto p-1 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <LogOut className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white p-6 flex items-center justify-between shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Gestion des rapports</h1>
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
        
        {/* Reports Content */}
        <main className="p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'recent' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('recent')}
              >
                Rapports récents
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'templates' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setActiveTab('templates')}
              >
                Modèles de rapports
              </button>
            </div>
            
            <div className="flex space-x-2">
              {activeTab === 'recent' && (
                <>
                  <div className="relative">
                    <select 
                      className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      {reportTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                      ))}
                    </select>
                    <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <select 
                      className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="all">Toutes les catégories</option>
                      {reportCategories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="relative">
                    <select 
                      className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tous les statuts</option>
                      {reportStatuses.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                      ))}
                    </select>
                    <BarChart2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </>
              )}
              
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={() => setActiveTab('templates')}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau rapport
              </button>
            </div>
          </div>
          
          {/* Recent Reports Tab */}
          {activeTab === 'recent' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Tableau des rapports */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            Titre <ChevronDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Catégorie
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            Date <ChevronDown className="h-4 w-4 ml-1" />
                          </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Auteur
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Format
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reports.length > 0 ? (
                        reports.map((report) => (
                          <tr 
                            key={report.id} 
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedReport(report);
                              setShowReportModal(true);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                                <div className="text-sm font-medium text-gray-900">{report.title}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                report.type === "Mensuel" ? "bg-blue-100 text-blue-800" :
                                report.type === "Trimestriel" ? "bg-purple-100 text-purple-800" :
                                report.type === "Annuel" ? "bg-orange-100 text-orange-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {report.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.category}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                report.status === "Généré" ? "bg-green-100 text-green-800" :
                                report.status === "En cours" ? "bg-blue-100 text-blue-800" :
                                "bg-yellow-100 text-yellow-800"
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {report.format}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {report.status === "Généré" && (
                                  <button 
                                    className="text-indigo-600 hover:text-indigo-900"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDownloadReport(report);
                                    }}
                                  >
                                    <Download className="h-5 w-5" />
                                  </button>
                                )}
                                <button 
                                  className="text-gray-600 hover:text-gray-900"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEmailForm(report);
                                  }}
                                >
                                  <Mail className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                            {loading ? (
                              <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
                                <span className="ml-2">Chargement des rapports...</span>
                              </div>
                            ) : (
                              <>
                                Aucun rapport disponible. 
                                <button 
                                  onClick={() => setShowGenerateModal(true)}
                                  className="ml-2 text-indigo-600 hover:text-indigo-900"
                                >
                                  Générer un rapport
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Selected Report Preview */}
              {selectedReport && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">{selectedReport.title}</h2>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">Créé par {selectedReport.author}</span>
                        <span>Le {selectedReport.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {selectedReport.status === "Généré" && (
                        <button 
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                          onClick={() => handleDownloadReport(selectedReport)}
                          disabled={isDownloading}
                        >
                          {isDownloading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Téléchargement...
                            </>
                          ) : (
                            <>
                              <Download className="h-5 w-5 mr-2" />
                              Télécharger
                            </>
                          )}
                        </button>
                      )}
                      <button 
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-5 w-5 mr-2" />
                        Imprimer
                      </button>
                      <button 
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                        onClick={() => handleOpenEmailForm(selectedReport)}
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Envoyer
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {/* Graphique 1 */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-4">Répartition des patients</h3>
                        <div className="aspect-square flex items-center justify-center">
                          <PieChart className="h-32 w-32 text-indigo-400" />
                        </div>
                      </div>
                      
                      {/* Graphique 2 */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-4">Évolution des traitements</h3>
                        <div className="aspect-square flex items-center justify-center">
                          <LineChart className="h-32 w-32 text-cyan-400" />
                        </div>
                      </div>
                      
                      {/* Graphique 3 */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-800 mb-4">Statistiques des rendez-vous</h3>
                        <div className="aspect-square flex items-center justify-center">
                          <BarChart2 className="h-32 w-32 text-indigo-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Résumé</h3>
                        <p className="text-gray-600">
                          Ce rapport présente une analyse détaillée des patients suivis au cours de la période {selectedReport.type.toLowerCase()}. 
                          Il inclut des statistiques sur les nouveaux patients, l'évolution des traitements, et les indicateurs de santé clés.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Points clés</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Augmentation de 12% du nombre de patients suivis</li>
                          <li>Amélioration de 8% des indicateurs de santé moyens</li>
                          <li>Réduction de 15% des rendez-vous manqués</li>
                          <li>Optimisation de 10% de la durée des traitements</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-800 mb-2">Recommandations</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          <li>Renforcer le suivi des patients à risque élevé</li>
                          <li>Mettre en place des rappels automatiques pour les rendez-vous</li>
                          <li>Optimiser la planification des traitements de dialyse</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      {template.icon === "Users" && <Users className="h-6 w-6 text-indigo-600" />}
                      {template.icon === "Activity" && <LineChart className="h-6 w-6 text-indigo-600" />}
                      {template.icon === "Pill" && <FileText className="h-6 w-6 text-indigo-600" />}
                      {template.icon === "BarChart2" && <BarChart2 className="h-6 w-6 text-indigo-600" />}
                      {template.icon === "AlertTriangle" && <Bell className="h-6 w-6 text-indigo-600" />}
                      {template.icon === "FileText" && <FileText className="h-6 w-6 text-indigo-600" />}
                    </div>
                    <h3 className="font-medium text-gray-800">{template.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-6">{template.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{template.category}</span>
                    <button 
                      className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium"
                      onClick={() => handleOpenGenerateModal(template)}
                    >
                      Générer
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      
      {/* Modal d'envoi par email */}
      {showEmailModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Envoyer le rapport par email</h3>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={emailForm.to}
                  onChange={(e) => setEmailForm({...emailForm, to: e.target.value})}
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({...emailForm, subject: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({...emailForm, message: e.target.value})}
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSendEmail}
                disabled={isSending || !emailForm.to || !emailForm.subject}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi...
                  </>
                ) : (
                  <>Envoyer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de détail du rapport */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">{selectedReport.title}</h3>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6 flex justify-end space-x-2">
              {selectedReport.status === "Généré" && (
                <button 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                  onClick={() => handleDownloadReport(selectedReport)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </>
                  )}
                </button>
              )}
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                onClick={() => handleOpenEmailForm(selectedReport)}
              >
                <Mail className="h-4 w-4 mr-2" />
                Envoyer par email
              </button>
              <button 
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </button>
            </div>
            
            {/* Contenu du rapport */}
            <div className="border rounded-lg p-6">
              <ReportContent report={selectedReport} />
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de génération de rapport */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Générer un rapport médical</h3>
              <button 
                onClick={() => setShowGenerateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-800 mb-2">Rapport médical complet</h4>
              <p className="text-gray-600 text-sm">Ce rapport contiendra toutes les informations médicales du patient, y compris les informations personnelles, les données médicales, les antécédents, les examens d'imagerie et la classification TNM.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">Sélectionnez un patient</label>
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
                    <span className="ml-2 text-sm text-gray-500">Chargement des patients...</span>
                  </div>
                ) : patients.length > 0 ? (
                  <select
                    id="patient"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedPatient?.id || ''}
                    onChange={(e) => {
                      const patientId = parseInt(e.target.value);
                      const patient = patients.find(p => p.id === patientId);
                      setSelectedPatient(patient || null);
                    }}
                  >
                    <option value="">-- Sélectionnez un patient --</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-red-500 text-sm">
                    Aucun patient disponible. Veuillez d'abord ajouter des patients.
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating || !selectedPatient}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Génération...
                  </>
                ) : (
                  <>Générer</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
