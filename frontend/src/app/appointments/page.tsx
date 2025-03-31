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
  ChevronLeft, 
  ChevronRight,
  Stethoscope,
  Clock,
  Plus,
  Filter,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  CalendarClock
} from "lucide-react";

// Types
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
}

interface Patient {
  id: number;
  name: string;
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
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "Jean Dupont", patientId: 1, date: "31/03/2025", time: "09:00", duration: "30 min", type: "Consultation", doctor: "Dr. Martin", status: "Planifié" },
    { id: 2, patientName: "Sophie Dubois", patientId: 4, date: "31/03/2025", time: "11:00", duration: "60 min", type: "Dialyse", doctor: "Dr. Legrand", status: "Confirmé" },
    { id: 3, patientName: "Marie Curie", patientId: 2, date: "31/03/2025", time: "14:00", duration: "45 min", type: "Suivi", doctor: "Dr. Martin", status: "Confirmé" },
    { id: 4, patientName: "Pierre Martin", patientId: 3, date: "01/04/2025", time: "10:00", duration: "30 min", type: "Consultation", doctor: "Dr. Martin", status: "Planifié" },
    { id: 5, patientName: "Jean Dupont", patientId: 1, date: "15/04/2025", time: "09:30", duration: "30 min", type: "Suivi", doctor: "Dr. Martin", status: "Planifié" },
    { id: 6, patientName: "Sophie Dubois", patientId: 4, date: "04/04/2025", time: "11:00", duration: "60 min", type: "Dialyse", doctor: "Dr. Legrand", status: "Planifié" },
    { id: 7, patientName: "Marie Curie", patientId: 2, date: "03/04/2025", time: "15:30", duration: "30 min", type: "Consultation", doctor: "Dr. Dubois", status: "Planifié" },
    { id: 8, patientName: "Pierre Martin", patientId: 3, date: "25/04/2025", time: "14:00", duration: "45 min", type: "Suivi", doctor: "Dr. Martin", status: "Planifié" },
  ]);
  
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "Jean Dupont", age: 65, stade: "Stade 3", status: "Stable", phone: "06 12 34 56 78" },
    { id: 2, name: "Marie Curie", age: 72, stade: "Stade 4", status: "Attention", phone: "06 23 45 67 89" },
    { id: 3, name: "Pierre Martin", age: 58, stade: "Stade 2", status: "Stable", phone: "06 34 56 78 90" },
    { id: 4, name: "Sophie Dubois", age: 67, stade: "Stade 5", status: "Critique", phone: "06 45 67 89 01" },
  ]);
  
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 1, name: "Dr. Martin", specialty: "Néphrologue", color: "#4f46e5" },
    { id: 2, name: "Dr. Legrand", specialty: "Néphrologue", color: "#0891b2" },
    { id: 3, name: "Dr. Dubois", specialty: "Cardiologue", color: "#16a34a" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState<string>("31/03/2025");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDoctor, setFilterDoctor] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  
  // Filtrer les rendez-vous
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || appointment.status === filterStatus;
    const matchesDoctor = filterDoctor === "all" || appointment.doctor === filterDoctor;
    const matchesType = filterType === "all" || appointment.type === filterType;
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesType;
  });
  
  // Obtenir les rendez-vous pour la date sélectionnée (vue calendrier)
  const appointmentsForSelectedDate = appointments.filter(appointment => 
    appointment.date === selectedDate
  );
  
  // Générer les jours du mois (simplifié)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const date = `${day < 10 ? '0' + day : day}/03/2025`;
    const hasAppointments = appointments.some(a => a.date === date);
    return { day, date, hasAppointments };
  });
  
  // Types de rendez-vous uniques
  const appointmentTypes = Array.from(new Set(appointments.map(a => a.type)));
  
  // Statuts de rendez-vous uniques
  const appointmentStatuses = ["Planifié", "Confirmé", "Annulé", "Terminé"];
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Planifié": return "bg-blue-100 text-blue-800";
      case "Confirmé": return "bg-green-100 text-green-800";
      case "Annulé": return "bg-red-100 text-red-800";
      case "Terminé": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
                    <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
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
              
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau rendez-vous
              </button>
            </div>
          </div>
          
          {/* List View */}
          {currentView === 'list' && (
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
                    {filteredAppointments.map((appointment) => {
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
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Calendar View */}
          {currentView === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Mini Calendar */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">Mars 2025</h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full hover:bg-gray-100">
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-100">
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
                        ${day.date === selectedDate ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}
                        ${day.hasAppointments && day.date !== selectedDate ? 'font-medium' : ''}
                      `}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <span>{day.day}</span>
                      {day.hasAppointments && (
                        <div className={`w-1 h-1 rounded-full mt-1 ${day.date === selectedDate ? 'bg-white' : 'bg-indigo-400'}`}></div>
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
                
                <button className="mt-6 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un rendez-vous
                </button>
              </div>
              
              {/* Day Schedule */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 md:col-span-3">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-800">
                    Rendez-vous du {selectedDate}
                  </h2>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => {
                      const currentIndex = daysInMonth.findIndex(d => d.date === selectedDate);
                      if (currentIndex > 0) {
                        setSelectedDate(daysInMonth[currentIndex - 1].date);
                      }
                    }}>
                      <ChevronLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => {
                      const currentIndex = daysInMonth.findIndex(d => d.date === selectedDate);
                      if (currentIndex < daysInMonth.length - 1) {
                        setSelectedDate(daysInMonth[currentIndex + 1].date);
                      }
                    }}>
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                
                {appointmentsForSelectedDate.length > 0 ? (
                  <div className="space-y-4">
                    {appointmentsForSelectedDate
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
                              <button className="p-2 rounded-lg hover:bg-gray-100 text-indigo-600">
                                <CheckCircle className="h-5 w-5" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600">
                                <Edit className="h-5 w-5" />
                              </button>
                              <button className="p-2 rounded-lg hover:bg-gray-100 text-red-600">
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun rendez-vous</h3>
                    <p className="text-gray-500 mb-6">Il n'y a pas de rendez-vous programmés pour cette date.</p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
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
    </div>
  );
}
