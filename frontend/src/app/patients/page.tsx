"use client";

import { useState } from "react";
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
  Home
} from "lucide-react";

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

// Types pour les patients
interface Patient {
  id: number;
  identifiant: string; // Identifiant unique patient
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: "male" | "female";
  address: string;
  phone: string;
  emergency_contact: string;
  referring_doctor_id: number; // ID du médecin référent
  url_photo?: string;
  
  // Informations médicales supplémentaires
  stade: "Stade 1" | "Stade 2" | "Stade 3" | "Stade 4" | "Stade 5";
  lastVisit: string;
  nextVisit: string;
  status: "Stable" | "Attention" | "Critique";
  bloodType?: string;
  creatinine?: number;
  gfr?: number;
}

// Fonction pour créer un patient via l'API
const createPatient = async (patientData: any) => {
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

export default function Patients() {
  // États
  const [patients, setPatients] = useState<Patient[]>([
    { 
      id: 1,
      identifiant: "PAT-001-2025",
      first_name: "Jean",
      last_name: "Dupont", 
      birth_date: "1960-05-15",
      gender: "male",
      address: "123 Rue de Paris, 75001 Paris",
      phone: "06 12 34 56 78",
      emergency_contact: "Marie Dupont: 06 87 65 43 21",
      referring_doctor_id: 1,
      url_photo: "/patients/patient1.jpg",
      stade: "Stade 3", 
      lastVisit: "15/03/2025", 
      nextVisit: "15/04/2025", 
      status: "Stable",
      bloodType: "A+",
      creatinine: 180,
      gfr: 45
    },
    { 
      id: 2,
      identifiant: "PAT-002-2025",
      first_name: "Marie",
      last_name: "Curie", 
      birth_date: "1953-11-22",
      gender: "female",
      address: "456 Avenue Victor Hugo, 75016 Paris",
      phone: "06 23 45 67 89",
      emergency_contact: "Pierre Curie: 06 12 34 56 78",
      referring_doctor_id: 2,
      url_photo: "/patients/patient2.jpg",
      stade: "Stade 4", 
      lastVisit: "20/03/2025", 
      nextVisit: "03/04/2025", 
      status: "Attention",
      bloodType: "O-",
      creatinine: 250,
      gfr: 28
    },
    { 
      id: 3,
      identifiant: "PAT-003-2025",
      first_name: "Pierre",
      last_name: "Martin", 
      birth_date: "1967-08-30",
      gender: "male",
      address: "789 Boulevard Saint-Michel, 75005 Paris",
      phone: "06 34 56 78 90",
      emergency_contact: "Sophie Martin: 06 98 76 54 32",
      referring_doctor_id: 1,
      url_photo: "/patients/patient3.jpg",
      stade: "Stade 2", 
      lastVisit: "25/03/2025", 
      nextVisit: "25/04/2025", 
      status: "Stable",
      bloodType: "B+",
      creatinine: 130,
      gfr: 65
    },
    { 
      id: 4,
      identifiant: "PAT-004-2025",
      first_name: "Sophie",
      last_name: "Dubois", 
      birth_date: "1958-04-12",
      gender: "female",
      address: "321 Rue de Rivoli, 75004 Paris",
      phone: "06 45 67 89 01",
      emergency_contact: "Jean Dubois: 06 54 32 10 98",
      referring_doctor_id: 3,
      url_photo: "/patients/patient4.jpg",
      stade: "Stade 5", 
      lastVisit: "28/03/2025", 
      nextVisit: "04/04/2025", 
      status: "Critique",
      bloodType: "AB+",
      creatinine: 350,
      gfr: 12
    },
  ]);
  
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
  
  // État pour le formulaire d'ajout de patient
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    identifiant: `PAT-00${patients.length + 1}-2025`,
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "male",
    address: "",
    phone: "",
    emergency_contact: "",
    referring_doctor_id: 1,
    stade: "Stade 1",
    status: "Stable",
    lastVisit: new Date().toLocaleDateString('fr-FR'),
    nextVisit: new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR')
  });
  
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
  const deletePatient = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce patient ?")) {
      setPatients(patients.filter(patient => patient.id !== id));
    }
  };
  
  // Fonction pour ouvrir le formulaire d'ajout de patient
  const openAddPatientForm = () => {
    setShowAddPatientForm(true);
  };
  
  // Fonction pour fermer le formulaire d'ajout de patient
  const closeAddPatientForm = () => {
    setShowAddPatientForm(false);
  };
  
  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPatient({
      ...newPatient,
      [name]: value
    });
  };
  
  // Fonction pour ajouter un nouveau patient
  const addNewPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Vérifier si l'utilisateur est authentifié
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert("Vous devez être connecté pour ajouter un patient.");
        return;
      }
      
      // Préparation des données pour l'API
      const patientData = {
        identifiant: newPatient.identifiant || `PAT-00${patients.length + 2}-2025`,
        first_name: newPatient.first_name || "",
        last_name: newPatient.last_name || "",
        birth_date: newPatient.birth_date || "",
        gender: newPatient.gender as "male" | "female" || "male",
        address: newPatient.address || "",
        phone: newPatient.phone || "",
        emergency_contact: newPatient.emergency_contact || "",
        referring_doctor_id: Number(newPatient.referring_doctor_id) || 1,
      };
      
      // Importer la fonction createPatient de l'API
      const { createPatient } = await import('@/api/api');
      
      // Appel à l'API pour créer le patient dans la base de données
      const response = await createPatient(patientData);
      
      // Traiter la réponse comme any pour éviter les erreurs de typage
      const apiResponse = response as any;
      
      if (apiResponse && apiResponse.success) {
        // Création du nouveau patient avec les données du formulaire et la réponse de l'API
        const patientToAdd: Patient = {
          id: apiResponse.data.id || Math.max(...patients.map(p => p.id)) + 1,
          ...patientData,
          stade: newPatient.stade as "Stade 1" | "Stade 2" | "Stade 3" | "Stade 4" | "Stade 5" || "Stade 1",
          lastVisit: newPatient.lastVisit || new Date().toLocaleDateString('fr-FR'),
          nextVisit: newPatient.nextVisit || new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('fr-FR'),
          status: newPatient.status as "Stable" | "Attention" | "Critique" || "Stable",
          url_photo: newPatient.url_photo || "",
          bloodType: newPatient.bloodType || "O+",
          creatinine: newPatient.creatinine || 90,
          gfr: newPatient.gfr || 90
        };
        
        // Ajout du patient à la liste
        setPatients([...patients, patientToAdd]);
        
        // Réinitialisation du formulaire et fermeture
        setNewPatient({
          identifiant: `PAT-00${patients.length + 2}-2025`,
          first_name: "",
          last_name: "",
          birth_date: "",
          gender: "male",
          address: "",
          phone: "",
          emergency_contact: "",
          referring_doctor_id: 1,
          stade: "Stade 1",
          status: "Stable"
        });
        setShowAddPatientForm(false);
        
        // Message de succès
        alert("Patient ajouté avec succès !");
      } else {
        // Gestion des erreurs de l'API
        alert(`Erreur lors de l'ajout du patient: ${apiResponse?.message || "Une erreur est survenue"}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du patient:", error);
      alert("Une erreur est survenue lors de l'ajout du patient. Veuillez réessayer.");
    }
  };

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
              <span className="font-bold">DR</span>
            </div>
            <div>
              <p className="font-medium">Dr. Richard</p>
              <p className="text-xs text-gray-300">Néphrologue</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
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
              <div className="flex items-center space-x-4">
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
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
                      Dernière visite
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prochaine visite
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
                          <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden border-2 border-indigo-100">
                            {patient.url_photo ? (
                              <img 
                                src={patient.url_photo} 
                                alt={`${patient.first_name} ${patient.last_name}`} 
                                className="h-full w-full object-cover"
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.nextVisit}
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Détails du patient</h2>
                <button 
                  onClick={closePatientDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Informations personnelles */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Users className="mr-2 h-5 w-5 text-indigo-600" />
                    Informations personnelles
                  </h3>
                  <div className="flex items-center mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-indigo-200 mr-4">
                      {selectedPatient.url_photo ? (
                        <img 
                          src={selectedPatient.url_photo} 
                          alt={`${selectedPatient.first_name} ${selectedPatient.last_name}`} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-xl font-medium text-indigo-800">
                            {selectedPatient.first_name[0]}{selectedPatient.last_name[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xl font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</p>
                      <p className="text-gray-500">Né(e) le: {selectedPatient.birth_date}</p>
                      <p className="text-gray-500">Genre: {selectedPatient.gender === 'male' ? 'Masculin' : 'Féminin'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-8 text-indigo-600"><Clipboard className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Identifiant</p>
                        <p className="font-medium">{selectedPatient.identifiant}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 text-indigo-600"><MessageSquare className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p>{selectedPatient.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 text-indigo-600"><Home className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p>{selectedPatient.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 text-red-500"><AlertTriangle className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Contact d'urgence</p>
                        <p>{selectedPatient.emergency_contact}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 text-green-500"><Stethoscope className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Médecin référent</p>
                        <p>{doctors.find(d => d.id === selectedPatient.referring_doctor_id)?.first_name} {doctors.find(d => d.id === selectedPatient.referring_doctor_id)?.last_name}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Informations médicales */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Activity className="mr-2 h-5 w-5 text-indigo-600" />
                    Informations médicales
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Folder className="h-4 w-4 text-indigo-600 mr-1" />
                        Stade MRC
                      </p>
                      <span className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        selectedPatient.stade === "Stade 1" ? "bg-green-100 text-green-800" :
                        selectedPatient.stade === "Stade 2" ? "bg-green-100 text-green-800" :
                        selectedPatient.stade === "Stade 3" ? "bg-yellow-100 text-yellow-800" :
                        selectedPatient.stade === "Stade 4" ? "bg-orange-100 text-orange-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedPatient.stade}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                        Statut
                      </p>
                      <span className={`px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        selectedPatient.status === "Stable" ? "bg-green-100 text-green-800" :
                        selectedPatient.status === "Attention" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <div className="w-1/2">
                        <p className="text-sm font-medium text-gray-500 flex items-center">
                          <Activity className="h-4 w-4 text-indigo-600 mr-1" />
                          Créatinine
                        </p>
                        <p className="text-sm font-semibold">
                          {selectedPatient.creatinine !== undefined ? `${selectedPatient.creatinine} µmol/L` : 'Non disponible'}
                        </p>
                      </div>
                      <div className="w-1/2">
                        <p className="text-sm font-medium text-gray-500 flex items-center">
                          <Activity className="h-4 w-4 text-indigo-600 mr-1" />
                          DFG (GFR)
                        </p>
                        <p className="text-sm font-semibold">
                          {selectedPatient.gfr !== undefined ? `${selectedPatient.gfr} mL/min/1.73m²` : 'Non disponible'}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Droplets className="h-4 w-4 text-red-500 mr-1" />
                        Groupe sanguin
                      </p>
                      <span className="font-medium">{selectedPatient.bloodType || "Non renseigné"}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Microscope className="h-4 w-4 text-purple-500 mr-1" />
                        Créatinine (μmol/L)
                      </p>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">{selectedPatient.creatinine !== undefined ? selectedPatient.creatinine : 'Non disponible'}</span>
                        {selectedPatient.creatinine !== undefined && (
                          <span className="ml-2 text-xs text-gray-500">
                            {selectedPatient.creatinine > 120 ? "(Élevée)" : "(Normale)"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 flex items-center">
                        <Activity className="h-4 w-4 text-blue-500 mr-1" />
                        DFG (mL/min/1.73m²)
                      </p>
                      <div className="flex items-center">
                        <span className="text-lg font-medium">{selectedPatient.gfr !== undefined ? selectedPatient.gfr : 'Non disponible'}</span>
                        {selectedPatient.gfr !== undefined && (
                          <span className="ml-2 text-xs text-gray-500">
                            {selectedPatient.gfr < 60 ? "(Réduit)" : "(Normal)"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Antécédents médicaux et facteurs de risque */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileCheck className="mr-2 h-5 w-5 text-indigo-600" />
                    Antécédents & Facteurs de risque
                  </h3>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                      <Dna className="mr-1 h-4 w-4" />
                      Antécédents médicaux
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                        <span>Diabète</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                        <span>Hypertension</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                        <span>Maladies rénales</span>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                        <span>Cancer familial</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-1 h-4 w-4" />
                      Facteurs de risque
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center">
                        <Cigarette className="h-4 w-4 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm">Tabac</p>
                          <select className="text-sm border rounded p-1">
                            <option>Non-fumeur</option>
                            <option>Ancien fumeur</option>
                            <option>Fumeur actif</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Weight className="h-4 w-4 text-orange-500 mr-2" />
                        <div>
                          <p className="text-sm">IMC</p>
                          <select className="text-sm border rounded p-1">
                            <option>Normal</option>
                            <option>Surpoids</option>
                            <option>Obésité</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center col-span-2">
                        <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded mr-2" />
                        <span>Exposition à des produits chimiques</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rendez-vous */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Rendez-vous</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Dernière visite</p>
                      <p className="font-medium">{selectedPatient.lastVisit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prochaine visite</p>
                      <p className="font-medium">{selectedPatient.nextVisit}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">Historique des visites</h4>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/03/2025</p>
                      <p className="text-sm text-gray-600">Consultation de suivi</p>
                      <p className="text-xs text-gray-500">Dr. Martin</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/02/2025</p>
                      <p className="text-sm text-gray-600">Analyses sanguines</p>
                      <p className="text-xs text-gray-500">Dr. Legrand</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/01/2025</p>
                      <p className="text-sm text-gray-600">Consultation initiale</p>
                      <p className="text-xs text-gray-500">Dr. Martin</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Deuxième ligne avec examens d'imagerie, classification TNM et rendez-vous */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Examens d'imagerie et diagnostic */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileImage className="mr-2 h-5 w-5 text-indigo-600" />
                    Examens d'imagerie
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                        <FileImage className="mr-1 h-4 w-4" />
                        Échographie rénale
                      </h4>
                      <div className="flex items-center mb-2">
                        <p className="text-sm mr-2">Présence d'une masse suspecte ?</p>
                        <div className="flex space-x-2">
                          <div className="flex items-center">
                            <input type="radio" name="masse_suspecte" id="masse_oui" className="mr-1" />
                            <label htmlFor="masse_oui" className="text-sm">Oui</label>
                          </div>
                          <div className="flex items-center">
                            <input type="radio" name="masse_suspecte" id="masse_non" className="mr-1" />
                            <label htmlFor="masse_non" className="text-sm">Non</label>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        <p>Date: 10/03/2025</p>
                        <p>Commentaire: Examen à refaire dans 3 mois</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                        <FileImage className="mr-1 h-4 w-4" />
                        Scanner / IRM
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <p className="text-sm w-32">Taille tumeur:</p>
                          <input type="text" className="border rounded p-1 text-sm w-20" placeholder="cm" />
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm w-32">Emplacement:</p>
                          <select className="border rounded p-1 text-sm">
                            <option>Rein droit</option>
                            <option>Rein gauche</option>
                            <option>Bilatéral</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <p className="text-sm w-32">Extension:</p>
                          <select className="border rounded p-1 text-sm">
                            <option>Localisée</option>
                            <option>Capsule rénale</option>
                            <option>Veine rénale</option>
                            <option>Veine cave</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
                        <Microscope className="mr-1 h-4 w-4" />
                        Biopsie rénale
                      </h4>
                      <div className="flex items-center mb-2">
                        <p className="text-sm mr-2">Résultat:</p>
                        <select className="border rounded p-1 text-sm">
                          <option>Non réalisée</option>
                          <option>Bénigne</option>
                          <option>Maligne</option>
                          <option>En attente</option>
                        </select>
                      </div>
                      <div className="flex items-center">
                        <p className="text-sm mr-2">Type de cancer:</p>
                        <select className="border rounded p-1 text-sm">
                          <option>N/A</option>
                          <option>Carcinome à cellules claires</option>
                          <option>Carcinome papillaire</option>
                          <option>Carcinome chromophobe</option>
                          <option>Autre</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Classification TNM et stade */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clipboard className="mr-2 h-5 w-5 text-indigo-600" />
                    Classification TNM
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2">Tumeur (T)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t1a" className="mr-1" />
                          <label htmlFor="t1a" className="text-sm">T1a (≤4cm)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t1b" className="mr-1" />
                          <label htmlFor="t1b" className="text-sm">T1b (4-7cm)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t2a" className="mr-1" />
                          <label htmlFor="t2a" className="text-sm">T2a (7-10cm)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t2b" className="mr-1" />
                          <label htmlFor="t2b" className="text-sm">T2b ({'>'}10cm)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t3" className="mr-1" />
                          <label htmlFor="t3" className="text-sm">T3 (Extension)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="tumeur" id="t4" className="mr-1" />
                          <label htmlFor="t4" className="text-sm">T4 (Invasion)</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2">Ganglions (N)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <input type="radio" name="ganglions" id="n0" className="mr-1" />
                          <label htmlFor="n0" className="text-sm">N0 (Aucun)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="ganglions" id="n1" className="mr-1" />
                          <label htmlFor="n1" className="text-sm">N1 (1 ganglion)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="ganglions" id="n2" className="mr-1" />
                          <label htmlFor="n2" className="text-sm">N2 (≥2 ganglions)</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2">Métastases (M)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <input type="radio" name="metastases" id="m0" className="mr-1" />
                          <label htmlFor="m0" className="text-sm">M0 (Aucune)</label>
                        </div>
                        <div className="flex items-center">
                          <input type="radio" name="metastases" id="m1" className="mr-1" />
                          <label htmlFor="m1" className="text-sm">M1 (Présentes)</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-indigo-700 mb-2">Stade de la maladie</h4>
                      <select className="w-full border rounded p-2 text-sm bg-white">
                        <option>Stade 1 : Petite tumeur localisée</option>
                        <option>Stade 2 : Tumeur plus grosse mais confinée au rein</option>
                        <option>Stade 3 : Propagation aux ganglions lymphatiques</option>
                        <option>Stade 4 : Métastases à distance</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Rendez-vous */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-indigo-600" />
                    Rendez-vous
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center">
                      <div className="w-8 text-indigo-600"><Calendar className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Dernière visite</p>
                        <p className="font-medium">{selectedPatient.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 text-green-600"><Calendar className="h-4 w-4" /></div>
                      <div>
                        <p className="text-sm text-gray-500">Prochain rendez-vous</p>
                        <p className="font-medium">{selectedPatient.nextVisit}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileCheck className="mr-1 h-4 w-4 text-indigo-600" />
                    Historique des visites
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/03/2025</p>
                      <p className="text-sm text-gray-600">Consultation de suivi</p>
                      <p className="text-xs text-gray-500">Dr. Martin</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/02/2025</p>
                      <p className="text-sm text-gray-600">Analyses sanguines</p>
                      <p className="text-xs text-gray-500">Dr. Legrand</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-gray-200">
                      <p className="font-medium">15/01/2025</p>
                      <p className="text-sm text-gray-600">Consultation initiale</p>
                      <p className="text-xs text-gray-500">Dr. Martin</p>
                    </div>
                  </div>
                  
                  <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm flex items-center justify-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Planifier un rendez-vous
                  </button>
                </div>
              </div>
              
              {/* Graphique d'évolution */}
              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Évolution du DFG</h3>
                <div className="h-64 bg-white p-4 rounded border border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Graphique d'évolution du DFG (mL/min/1.73m²)</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-4">
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                  Imprimer le dossier
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                  Planifier un rendez-vous
                </button>
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
                <h2 className="text-2xl font-bold text-gray-800">Ajouter un patient</h2>
                <button 
                  onClick={closeAddPatientForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={addNewPatient}>
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
                      name="stade" 
                      value={newPatient.stade} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Stade 1">Stade 1</option>
                      <option value="Stade 2">Stade 2</option>
                      <option value="Stade 3">Stade 3</option>
                      <option value="Stade 4">Stade 4</option>
                      <option value="Stade 5">Stade 5</option>
                    </select>
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
                    <label className="text-sm text-gray-500">Dernière visite</label>
                    <input 
                      type="date" 
                      name="lastVisit" 
                      value={newPatient.lastVisit} 
                      onChange={handleInputChange} 
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Prochaine visite</label>
                    <input 
                      type="date" 
                      name="nextVisit" 
                      value={newPatient.nextVisit} 
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
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Ajouter le patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
