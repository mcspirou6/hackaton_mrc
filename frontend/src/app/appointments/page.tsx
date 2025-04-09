"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  ChevronLeft, 
  ChevronRight,
  Stethoscope,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  CalendarClock,
  X,
  Eye
} from "lucide-react";
import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getPatients,
  getDoctors
} from "@/api/api";

// Types pour les réponses de l'API
interface AppointmentResponse {
  id: number;
  patientName: string;
  patientId: number;
  date: string;
  time: string;
  duration: string;
  type: string;
  doctor: string;
  status: string;
  notes?: string;
  patient: {
    phone: string;
    status: string;
  };
}

interface PatientResponse {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  stade: string;
  status: string;
  phone: string;
}

interface DoctorResponse {
  id: number;
  name: string;
  specialty: string;
  color?: string;
}

// Types pour le composant
interface Appointment {
  id: number;
  patientName: string;
  patientId: number;
  date: string;
  time: string;
  duration: string;
  type: string;
  doctor: string;
  status: "Planifié" | "Confirmé" | "Annulé" | "Terminé";
  notes?: string;
  patient: {
    phone: string;
    status: string;
  };
}

interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  stade: string;
  status: string;
  phone: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  color: string;
}

export default function Appointments() {
  // États
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDoctor, setFilterDoctor] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  
  const [newAppointment, setNewAppointment] = useState<Partial<Appointment>>({
    patientId: 1,
    date: "",
    time: "09:00",
    duration: "30 min",
    type: "Consultation",
    doctor: "",
    status: "Planifié"
  });

  // Initialize date-dependent states on client side
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setCalendarMonth(today);
    setNewAppointment(prev => ({
      ...prev,
      date: formatDateToDDMMYYYY(today),
    }));
  }, []);

  // Formatage de la date en dd/mm/YYYY
  function formatDateToDDMMYYYY(date: Date | null): string {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Fonction pour convertir une date dd/mm/YYYY en Y-m-d
  const formatToYMD = (date: Date | null): string | undefined => {
    if (!date) return undefined;
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Chargement initial des données
  useEffect(() => {
    if (!selectedDate) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const patientsResponse = await getPatients();
        const doctorsResponse = await getDoctors();
        setPatients(patientsResponse.data);
        setDoctors(doctorsResponse.data);

        setNewAppointment(prev => ({
          ...prev,
          patientId: patientsResponse.data[0]?.id || 1,
          doctor: doctorsResponse.data[0]?.id.toString() || "",
        }));

        const filters = {
          doctor_id: filterDoctor === "all" ? undefined : filterDoctor,
          status: filterStatus === "all" ? undefined : filterStatus,
          type: filterType === "all" ? undefined : filterType,
          date: formatToYMD(selectedDate),
          search: searchTerm || undefined,
        };

        const appointmentsResponse = await getAppointments(filters);
        const transformedAppointments = transformAppointments(appointmentsResponse.data);
        setAppointments(transformedAppointments);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        toast.error('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filterDoctor, filterStatus, filterType, selectedDate, searchTerm, currentView]);

  // Transformation avec conversion de date
// Transformation avec conversion de date
const transformAppointments = (apiAppointments: AppointmentResponse[]): Appointment[] => {
  if (!selectedDate) return []; // Si selectedDate n'est pas défini, retourne une liste vide

  const formattedDate = formatDateToDDMMYYYY(selectedDate); // Utilise directement selectedDate pour la date

  return apiAppointments.map(appt => {
    // Validation et transformation de l'heure
    let formattedTime = "N/A"; // Valeur par défaut si l'heure est invalide
    if (appt.time && appt.time.match(/^\d{2}:\d{2}(:\d{2})?$/)) { // Vérifie que l'heure est au format HH:MM ou HH:MM:SS
      formattedTime = appt.time.split(':').slice(0, 2).join(':'); // Garde uniquement HH:MM
    } else {
      console.warn(`Heure invalide pour le rendez-vous ID ${appt.id}: ${appt.time}`);
    }

    return {
      id: appt.id,
      patientName: appt.patientName,
      patientId: appt.patientId,
      date: formattedDate, // Utilise la date sélectionnée directement
      time: formattedTime,
      duration: appt.duration || "N/A",
      type: appt.type || "N/A",
      doctor: appt.doctor || "N/A",
      status: (appt.status as "Planifié" | "Confirmé" | "Annulé" | "Terminé") || "Planifié",
      notes: appt.notes || '',
      patient: {
        phone: appt.patient?.phone || "N/A",
        status: appt.patient?.status || "N/A"
      }
    };
  });
};

  // Fonctions pour gérer l’affichage des détails
  const openAppointmentDetails = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const closeAppointmentDetails = () => {
    setShowAppointmentDetails(false);
    setCurrentAppointment(null);
  };

  // Fonction pour ouvrir le formulaire d’édition
  const openEditForm = (appointment: Appointment) => {
    const doctor = doctors.find(d => d.name === appointment.doctor);
    setCurrentAppointment(appointment);
    setNewAppointment({
      patientId: appointment.patientId,
      date: appointment.date,
      time: appointment.time,
      duration: appointment.duration,
      type: appointment.type,
      doctor: doctor ? doctor.id.toString() : "",
      status: appointment.status,
      notes: appointment.notes
    });
    setShowAppointmentForm(true);
  };

  // Filtrer les rendez-vous côté client pour la vue Liste
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    const matchesDoctor = filterDoctor === "all" || appointment.doctor === doctors.find(d => d.id === Number(filterDoctor))?.name;
    const matchesType = filterType === "all" || appointment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesType;
  });

  // Fonction pour obtenir le nombre de jours dans un mois
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Générer les jours du mois dynamiquement pour le mini-calendrier
  const daysInMonth = Array.from({ length: getDaysInMonth(calendarMonth.getMonth(), calendarMonth.getFullYear()) }, (_, i) => {
    const day = i + 1;
    const date = `${day < 10 ? '0' + day : day}/${(calendarMonth.getMonth() + 1).toString().padStart(2, '0')}/${calendarMonth.getFullYear()}`;
    const hasAppointments = filteredAppointments.some(a => a.date === date);
    return { day, date, hasAppointments };
  });

  // Types de rendez-vous uniques
  const appointmentTypes = Array.from(new Set(appointments.map(a => a.type)));

  // Statuts de rendez-vous uniques
  const appointmentStatuses = ["Planifié", "Confirmé", "Annulé", "Terminé"];

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planifié": return "bg-blue-100 text-blue-800";
      case "Confirmé": return "bg-green-100 text-green-800";
      case "Annulé": return "bg-red-100 text-red-800";
      case "Terminé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Fonctions pour gérer le formulaire de rendez-vous
  const openAppointmentForm = () => {
    setCurrentAppointment(null);
    setShowAppointmentForm(true);
  };
  
  const closeAppointmentForm = () => {
    setShowAppointmentForm(false);
    setNewAppointment({
      patientId: patients[0]?.id || 1,
      date: selectedDate ? formatDateToDDMMYYYY(selectedDate) : "",
      time: "09:00",
      duration: "30 min",
      type: "Consultation",
      doctor: doctors[0]?.id.toString() || "",
      status: "Planifié"
    });
  };

  const handleAppointmentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'date') {
      const [year, month, day] = value.split('-');
      setNewAppointment(prev => ({ ...prev, [name]: `${day}/${month}/${year}` }));
    } else {
      setNewAppointment(prev => ({ ...prev, [name]: value }));
    }
  };

  // Fonction pour ajouter/mettre à jour un rendez-vous
  const saveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsActionLoading(true);
      const patient = patients.find(p => p.id === Number(newAppointment.patientId));
      if (!patient) throw new Error("Patient non trouvé");
    
      const doctor = doctors.find(d => d.id === Number(newAppointment.doctor));
      if (!doctor) throw new Error("Médecin non trouvé");
    
      const appointmentData = {
        patient_id: newAppointment.patientId,
        user_id: doctor.id,
        date: newAppointment.date,
        time: newAppointment.time,
        duration: newAppointment.duration,
        type: newAppointment.type,
        status: newAppointment.status,
        notes: newAppointment.notes
      };
    
      let response: { data: AppointmentResponse };
    
      if (currentAppointment) {
        response = await updateAppointment(currentAppointment.id, appointmentData);
        setAppointments(appointments.map(appt => 
          appt.id === currentAppointment.id ? transformAppointments([response.data])[0] : appt
        ));
      } else {
        response = await createAppointment(appointmentData);
        setAppointments([...appointments, transformAppointments([response.data])[0]]);
      }
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
      closeAppointmentForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du RDV:", error);
      let errorMessage = "Erreur lors de la sauvegarde du rendez-vous";
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fonction pour confirmer un rendez-vous
  const confirmAppointment = async (id: number) => {
    try {
      setIsActionLoading(true);
      await updateAppointment(id, { status: 'Confirmé' });
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status: 'Confirmé' } : appt
      ));
    } catch (error) {
      console.error("Erreur confirmation RDV:", error);
      alert("Impossible de confirmer le rendez-vous. Veuillez réessayer.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fonction pour annuler un rendez-vous
  const cancelAppointment = async (id: number) => {
    try {
      setIsActionLoading(true);
      await updateAppointment(id, { status: 'Annulé' });
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status: 'Annulé' } : appt
      ));
    } catch (error) {
      console.error("Erreur annulation RDV:", error);
      alert("Impossible d'annuler le rendez-vous. Veuillez réessayer.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fonction pour supprimer un rendez-vous
  const handleDeleteAppointment = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) return;
    
    try {
      setIsActionLoading(true);
      await deleteAppointment(id);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erreur suppression RDV:", error);
      alert("Impossible de supprimer le rendez-vous. Veuillez réessayer.");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Fonctions pour naviguer entre les jours
  const handlePreviousDay = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    setCalendarMonth(new Date(newDate));
  };

  const handleNextDay = () => {
    if (!selectedDate) return;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    setCalendarMonth(new Date(newDate));
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCalendarMonth(today);
  };

  // Fonctions pour naviguer entre les mois
  const handlePreviousMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCalendarMonth(newMonth);
    setSelectedDate(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
  };

  const handleNextMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCalendarMonth(newMonth);
    setSelectedDate(new Date(newMonth.getFullYear(), newMonth.getMonth(), 1));
  };

  // Render nothing until selectedDate is initialized
  if (!selectedDate) {
    return null;
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
              <Link href="/appointments" className="flex items-center p-3 bg-indigo-800 rounded-lg">
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
          <h1 className="text-2xl font-bold text-gray-800">Gestion des rendez-vous</h1>
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
        
        {/* Appointments Content */}
        <main className="p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${currentView === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setCurrentView('list')}
              >
                Liste
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-medium ${currentView === 'calendar' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setCurrentView('calendar')}
              >
                Calendrier
              </button>
            </div>
            
            <div className="flex space-x-2">
              <div className="flex items-center space-x-2">
                <button onClick={handlePreviousDay} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-sm font-medium text-gray-700">{formatDateToDDMMYYYY(selectedDate)}</span>
                <button onClick={handleNextDay} className="p-1 rounded-full hover:bg-gray-100">
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>
                <button onClick={handleToday} className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium">
                  Aujourd'hui
                </button>
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  {appointmentStatuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={filterDoctor}
                  onChange={(e) => setFilterDoctor(e.target.value)}
                >
                  <option value="all">Tous les médecins</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={String(doctor.id)}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
                <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  {appointmentTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <CalendarClock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <button 
                onClick={openAppointmentForm}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nouveau rendez-vous
              </button>
            </div>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          )}
          
          {/* List View */}
          {!isLoading && currentView === 'list' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Patient
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Date & Heure
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médecin
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Durée
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
                    {filteredAppointments.length > 0 ? (
                      filteredAppointments.map((appointment) => {
                        const patient = patients.find(p => p.id === appointment.patientId);
                        const doctor = doctors.find(d => d.name === appointment.doctor);
                        
                        return (
                          <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                                  patient?.status === "Stable" ? "bg-green-100 text-green-700" :
                                  patient?.status === "Attention" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {appointment.patientName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                                  <div className="text-sm text-gray-500">{patient?.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{appointment.date}</div>
                              <div className="text-sm text-gray-500">{appointment.time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                {appointment.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: doctor?.color || '#4f46e5' }}></div>
                                <div className="text-sm text-gray-900">{appointment.doctor}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {appointment.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => openAppointmentDetails(appointment)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Voir les détails"
                                  disabled={isActionLoading}
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                                <button 
                                  onClick={() => openEditForm(appointment)}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Modifier"
                                  disabled={isActionLoading}
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button 
                                  onClick={() => confirmAppointment(appointment.id)}
                                  className={`text-green-600 hover:text-green-900 ${appointment.status === 'Confirmé' || appointment.status === 'Terminé' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Confirmer"
                                  disabled={isActionLoading || appointment.status === 'Confirmé' || appointment.status === 'Terminé'}
                                >
                                  {isActionLoading ? (
                                    <div className="animate-spin h-5 w-5 border-t-2 border-green-600 rounded-full"></div>
                                  ) : (
                                    <CheckCircle className="h-5 w-5" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => cancelAppointment(appointment.id)}
                                  className={`text-red-600 hover:text-red-900 ${appointment.status === 'Annulé' || appointment.status === 'Terminé' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Annuler"
                                  disabled={isActionLoading || appointment.status === 'Annulé' || appointment.status === 'Terminé'}
                                >
                                  {isActionLoading ? (
                                    <div className="animate-spin h-5 w-5 border-t-2 border-red-600 rounded-full"></div>
                                  ) : (
                                    <XCircle className="h-5 w-5" />
                                  )}
                                </button>
                                <button 
                                  onClick={() => handleDeleteAppointment(appointment.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Supprimer"
                                  disabled={isActionLoading}
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                          Aucun rendez-vous trouvé pour le {formatDateToDDMMYYYY(selectedDate)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Calendar View */}
          {!isLoading && currentView === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Mini Calendar */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    {calendarMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button onClick={handlePreviousMonth} className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {/* Days of week */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"].map((day, index) => (
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
                        ${day.date === formatDateToDDMMYYYY(selectedDate) ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                        ${day.hasAppointments && day.date !== formatDateToDDMMYYYY(selectedDate) ? 'font-medium' : ''}
                      `}
                      onClick={() => {
                        const [dayStr, monthStr, yearStr] = day.date.split('/');
                        setSelectedDate(new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(dayStr)));
                      }}
                    >
                      <span>{day.day}</span>
                      {day.hasAppointments && (
                        <div className={`w-1 h-1 rounded-full mt-1 ${day.date === formatDateToDDMMYYYY(selectedDate) ? 'bg-white' : 'bg-indigo-400'}`}></div>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-2">Légende</h3>
                  <div className="space-y-2">
                    {appointmentTypes.map((type, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-indigo-400 mr-2"></div>
                        <span className="text-sm text-gray-600">{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={openAppointmentForm}
                  className="mt-6 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un rendez-vous
                </button>
              </div>
              
              {/* Day Schedule */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Rendez-vous du {formatDateToDDMMYYYY(selectedDate)}
                  </h2>
                </div>
                
                {filteredAppointments.filter(appointment => 
                  selectedDate && appointment.date === formatDateToDDMMYYYY(selectedDate)
                ).length > 0 ? (
                  <div className="space-y-4">
                    {filteredAppointments
                      .filter(appointment => 
                        selectedDate && appointment.date === formatDateToDDMMYYYY(selectedDate)
                      )
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((appointment) => {
                        const doctor = doctors.find(d => d.name === appointment.doctor);
                        
                        return (
                          <div 
                            key={appointment.id} 
                            className="flex p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex flex-col items-center mr-6">
                              <div className="text-lg font-bold text-indigo-600">{appointment.time}</div>
                              <div className="text-sm text-gray-500">{appointment.duration}</div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                                  {appointment.status}
                                </span>
                              </div>
                              
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <span className="mr-4">{appointment.type}</span>
                                <div className="flex items-center">
                                  <div className="h-2 w-2 rounded-full mr-1" style={{ backgroundColor: doctor?.color || '#4f46e5' }}></div>
                                  <span>{appointment.doctor}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 items-start">
                              <button 
                                onClick={() => openAppointmentDetails(appointment)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-blue-600"
                                title="Voir les détails"
                                disabled={isActionLoading}
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => openEditForm(appointment)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                                title="Modifier"
                                disabled={isActionLoading}
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button 
                                onClick={() => confirmAppointment(appointment.id)}
                                className={`p-2 rounded-lg hover:bg-gray-100 text-green-600 ${appointment.status === 'Confirmé' || appointment.status === 'Terminé' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Confirmer"
                                disabled={isActionLoading || appointment.status === 'Confirmé' || appointment.status === 'Terminé'}
                              >
                                {isActionLoading ? (
                                  <div className="animate-spin h-5 w-5 border-t-2 border-green-600 rounded-full"></div>
                                ) : (
                                  <CheckCircle className="h-5 w-5" />
                                )}
                              </button>
                              <button 
                                onClick={() => cancelAppointment(appointment.id)}
                                className={`p-2 rounded-lg hover:bg-gray-100 text-red-600 ${appointment.status === 'Annulé' || appointment.status === 'Terminé' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Annuler"
                                disabled={isActionLoading || appointment.status === 'Annulé' || appointment.status === 'Terminé'}
                              >
                                {isActionLoading ? (
                                  <div className="animate-spin h-5 w-5 border-t-2 border-red-600 rounded-full"></div>
                                ) : (
                                  <XCircle className="h-5 w-5" />
                                )}
                              </button>
                              <button 
                                onClick={() => handleDeleteAppointment(appointment.id)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-red-600"
                                title="Supprimer"
                                disabled={isActionLoading}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Pour voir les rendez-vous</h3>
                    <p className="text-gray-500 mb-6">
                      Veuillez consulter l'onglet{' '}
                      <button 
                        onClick={() => setCurrentView('list')}
                        className="text-indigo-600 hover:underline"
                      >
                        Liste
                      </button>.
                    </p>
                    <button 
                      onClick={openAppointmentForm}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Ajouter un rendez-vous
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Formulaire d’ajout/édition de rendez-vous */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentAppointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                </h2>
                <button 
                  onClick={closeAppointmentForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={saveAppointment}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                    <select
                      name="patientId"
                      value={newAppointment.patientId}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.id}>
                          {`${patient.first_name} ${patient.last_name}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
                    <select
                      name="doctor"
                      value={newAppointment.doctor}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      {doctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={newAppointment.date?.split('/').reverse().join('-') || ''} 
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Heure</label>
                    <input
                      type="time"
                      name="time"
                      value={newAppointment.time}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durée</label>
                    <select
                      name="duration"
                      value={newAppointment.duration}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="30 min">30 minutes</option>
                      <option value="45 min">45 minutes</option>
                      <option value="60 min">1 heure</option>
                      <option value="90 min">1 heure 30</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      name="type"
                      value={newAppointment.type}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Dialyse">Dialyse</option>
                      <option value="Suivi">Suivi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                    <select
                      name="status"
                      value={newAppointment.status}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="Planifié">Planifié</option>
                      <option value="Confirmé">Confirmé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                    <textarea
                      name="notes"
                      value={newAppointment.notes || ""}
                      onChange={handleAppointmentInputChange}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={closeAppointmentForm}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                    disabled={isActionLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full mr-2"></div>
                    ) : null}
                    {currentAppointment ? 'Mettre à jour' : 'Créer le rendez-vous'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails du rendez-vous */}
      {showAppointmentDetails && currentAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Détails du rendez-vous</h2>
                <button 
                  onClick={closeAppointmentDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.patientName}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.patient.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Date</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Heure</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Médecin</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.doctor}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Durée</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.duration}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Type</h3>
                    <p className="mt-1 text-sm text-gray-900">{currentAppointment.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentAppointment.status)}`}>
                        {currentAppointment.status}
                      </span>
                    </p>
                  </div>
                </div>
                
                {currentAppointment.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                    <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">{currentAppointment.notes}</p>
                  </div>
                )}
                
                <div className="flex justify-end mt-6 space-x-4">
                  <button
                    type="button"
                    onClick={closeAppointmentDetails}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification de succès */}
      {showSuccessAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>
            {currentAppointment ? 'Rendez-vous mis à jour avec succès !' : 'Rendez-vous créé avec succès !'}
          </span>
        </div>
      )}
    </div>
  );
}