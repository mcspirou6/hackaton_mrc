"use client";

import { useState, useEffect } from "react";
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
  Clock
} from "lucide-react";

// Types
interface Patient {
  id: number;
  name: string;
  age: number;
  stade: "Stade 1" | "Stade 2" | "Stade 3" | "Stade 4" | "Stade 5";
  lastVisit: string;
  nextVisit: string;
  status: "Stable" | "Attention" | "Critique";
}

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: string;
  doctor: string;
}

interface HealthMetric {
  name: string;
  value: number;
  status: "normal" | "warning" | "critical";
  icon: React.ReactNode;
}

export default function Dashboard() {
  // États
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "Jean Dupont", age: 65, stade: "Stade 3", lastVisit: "15/03/2025", nextVisit: "15/04/2025", status: "Stable" },
    { id: 2, name: "Marie Curie", age: 72, stade: "Stade 4", lastVisit: "20/03/2025", nextVisit: "03/04/2025", status: "Attention" },
    { id: 3, name: "Pierre Martin", age: 58, stade: "Stade 2", lastVisit: "25/03/2025", nextVisit: "25/04/2025", status: "Stable" },
    { id: 4, name: "Sophie Dubois", age: 67, stade: "Stade 5", lastVisit: "28/03/2025", nextVisit: "04/04/2025", status: "Critique" },
  ]);
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, patientName: "Jean Dupont", time: "09:00-11:00", type: "Consultation", doctor: "Dr. Martin" },
    { id: 2, patientName: "Sophie Dubois", time: "11:00-12:00", type: "Dialyse", doctor: "Dr. Legrand" },
    { id: 3, patientName: "Marie Curie", time: "14:00-15:00", type: "Suivi", doctor: "Dr. Martin" },
  ]);
  
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { name: "Cœur", value: 95, status: "normal", icon: <Heart className="w-6 h-6 text-red-500" /> },
    { name: "Activité", value: 85, status: "normal", icon: <Activity className="w-6 h-6 text-blue-500" /> },
    { name: "Os", value: 60, status: "warning", icon: <BoneIcon className="w-6 h-6 text-orange-500" /> },
    { name: "Hummeur", value: 90, status: "normal", icon: <Smile className="w-6 h-6 text-white" /> },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentMonth, setCurrentMonth] = useState("Mars 2025");
  const [selectedDay, setSelectedDay] = useState(31);
  
  // Filtrer les patients en fonction du terme de recherche
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Jours de la semaine
  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  // Générer les jours du mois (simplifié)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
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
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{patients.length}</h3>
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
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">{appointments.length}</h3>
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
                  <h3 className="text-3xl font-bold text-gray-800 mt-1">
                    {patients.filter(p => p.status === "Critique").length}
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
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-800">{patient.name}</h3>
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
                      <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="mr-3">{appointment.type}</span>
                        <span className="text-indigo-600">{appointment.doctor}</span>
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
