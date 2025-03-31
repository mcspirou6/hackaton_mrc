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
  Stethoscope,
  AlertTriangle,
  Filter,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
  ChevronDown
} from "lucide-react";

// Types
interface Alert {
  id: number;
  patientId: number;
  patientName: string;
  type: "Critique" | "Important" | "Information";
  message: string;
  date: string;
  time: string;
  status: "Nouveau" | "En cours" | "Résolu" | "Ignoré";
  assignedTo?: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  stade: string;
  status: string;
  phone: string;
}

export default function Alerts() {
  // États
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: 1, patientId: 4, patientName: "Sophie Dubois", type: "Critique", message: "Valeurs de créatinine critiques", date: "31/03/2025", time: "08:15", status: "Nouveau" },
    { id: 2, patientId: 2, patientName: "Marie Curie", type: "Important", message: "Pression artérielle élevée", date: "30/03/2025", time: "14:30", status: "En cours", assignedTo: "Dr. Martin" },
    { id: 3, patientId: 1, patientName: "Jean Dupont", type: "Information", message: "Rappel de rendez-vous demain", date: "30/03/2025", time: "10:00", status: "Résolu" },
    { id: 4, patientId: 3, patientName: "Pierre Martin", type: "Important", message: "Résultats d'analyse anormaux", date: "29/03/2025", time: "16:45", status: "En cours", assignedTo: "Dr. Legrand" },
    { id: 5, patientId: 4, patientName: "Sophie Dubois", type: "Critique", message: "Symptômes de détresse respiratoire", date: "29/03/2025", time: "09:20", status: "Résolu" },
    { id: 6, patientId: 2, patientName: "Marie Curie", type: "Information", message: "Médicaments à renouveler", date: "28/03/2025", time: "11:30", status: "Nouveau" },
    { id: 7, patientId: 1, patientName: "Jean Dupont", type: "Important", message: "Douleur abdominale signalée", date: "27/03/2025", time: "13:15", status: "Ignoré" },
    { id: 8, patientId: 3, patientName: "Pierre Martin", type: "Information", message: "Changement de traitement effectué", date: "26/03/2025", time: "15:40", status: "Résolu" },
  ]);
  
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "Jean Dupont", age: 65, stade: "Stade 3", status: "Stable", phone: "06 12 34 56 78" },
    { id: 2, name: "Marie Curie", age: 72, stade: "Stade 4", status: "Attention", phone: "06 23 45 67 89" },
    { id: 3, name: "Pierre Martin", age: 58, stade: "Stade 2", status: "Stable", phone: "06 34 56 78 90" },
    { id: 4, name: "Sophie Dubois", age: 67, stade: "Stade 5", status: "Critique", phone: "06 45 67 89 01" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  
  // Filtrer les alertes
  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alert.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || alert.type === filterType;
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Types d'alertes uniques
  const alertTypes = ["Critique", "Important", "Information"];
  
  // Statuts d'alertes uniques
  const alertStatuses = ["Nouveau", "En cours", "Résolu", "Ignoré"];
  
  // Fonction pour obtenir la couleur du type d'alerte
  const getTypeColor = (type: string) => {
    switch(type) {
      case "Critique": return "bg-red-100 text-red-800";
      case "Important": return "bg-yellow-100 text-yellow-800";
      case "Information": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Nouveau": return "bg-purple-100 text-purple-800";
      case "En cours": return "bg-blue-100 text-blue-800";
      case "Résolu": return "bg-green-100 text-green-800";
      case "Ignoré": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-indigo-900 text-white p-4 md:p-6 flex flex-col">
        <div className="flex items-center mb-6 md:mb-10">
          <div className="bg-cyan-500 p-2 rounded-lg mr-3">
            <Stethoscope className="h-5 w-5 md:h-6 md:w-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold">NéphroSuivi</h1>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2 md:space-y-4">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <LayoutDashboard className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Tableau de bord</span>
              </Link>
            </li>
            <li>
              <Link href="/patients" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <Users className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Patients</span>
              </Link>
            </li>
            <li>
              <Link href="/appointments" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <Calendar className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Rendez-vous</span>
              </Link>
            </li>
            <li>
              <Link href="/reports" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <FileText className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Rapports</span>
              </Link>
            </li>
            <li>
              <Link href="/messages" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <MessageSquare className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Messages</span>
              </Link>
            </li>
            <li>
              <Link href="/alerts" className="flex items-center p-2 md:p-3 bg-indigo-800 rounded-lg">
                <Bell className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Alertes</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <Link href="/settings" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
            <Settings className="mr-3 h-4 w-4 md:h-5 md:w-5" />
            <span>Paramètres</span>
          </Link>
          <div className="flex items-center mt-4 md:mt-6 p-2 md:p-3 bg-indigo-800 rounded-lg">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cyan-500 flex items-center justify-center mr-3">
              <span className="font-bold text-sm md:text-base">DR</span>
            </div>
            <div>
              <p className="font-medium text-sm md:text-base">Dr. Richard</p>
              <p className="text-xs text-gray-300">Néphrologue</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">Centre d'alertes</h1>
          <div className="flex items-center">
            <div className="relative mr-4 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        
        {/* Alerts Content */}
        <main className="p-4 md:p-6">
          {/* Action Bar */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative">
                <select 
                  className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  {alertTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                <AlertTriangle className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative">
                <select 
                  className="appearance-none pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white w-full"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  {alertStatuses.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 mr-2" />
              Créer une alerte
            </button>
          </div>
          
          {/* Alerts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Alerts List */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center">
                          Patient
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Message
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="h-4 w-4 ml-1" />
                        </div>
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAlerts.map((alert) => {
                      const patient = patients.find(p => p.id === alert.patientId);
                      
                      return (
                        <tr 
                          key={alert.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${selectedAlert?.id === alert.id ? 'bg-indigo-50' : ''}`}
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`flex-shrink-0 h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center ${
                                patient?.status === "Stable" ? "bg-green-100 text-green-700" :
                                patient?.status === "Attention" ? "bg-yellow-100 text-yellow-700" :
                                "bg-red-100 text-red-700"
                              }`}>
                                {alert.patientName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div className="ml-3 md:ml-4">
                                <div className="text-sm font-medium text-gray-900">{alert.patientName}</div>
                                <div className="text-xs text-gray-500 hidden md:block">{patient?.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(alert.type)}`}>
                              {alert.type}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900 truncate max-w-[200px]">{alert.message}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">{alert.date}</div>
                            <div className="text-xs text-gray-500">{alert.time}</div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(alert.status)}`}>
                              {alert.status}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Eye className="h-5 w-5" />
                              </button>
                              {alert.status !== "Résolu" && (
                                <button className="text-green-600 hover:text-green-900">
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                              )}
                              {alert.status !== "Ignoré" && (
                                <button className="text-red-600 hover:text-red-900">
                                  <XCircle className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Selected Alert Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              {selectedAlert ? (
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(selectedAlert.type)}`}>
                        {selectedAlert.type}
                      </span>
                      <h2 className="text-lg font-bold text-gray-800 mt-2">{selectedAlert.message}</h2>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Détails du patient</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                          patients.find(p => p.id === selectedAlert.patientId)?.status === "Stable" ? "bg-green-100 text-green-700" :
                          patients.find(p => p.id === selectedAlert.patientId)?.status === "Attention" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {selectedAlert.patientName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{selectedAlert.patientName}</div>
                          <div className="text-sm text-gray-500">
                            {patients.find(p => p.id === selectedAlert.patientId)?.age} ans - 
                            {patients.find(p => p.id === selectedAlert.patientId)?.stade}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patients.find(p => p.id === selectedAlert.patientId)?.phone}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Informations</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Date</div>
                        <div className="text-sm font-medium">{selectedAlert.date}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Heure</div>
                        <div className="text-sm font-medium">{selectedAlert.time}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Assigné à</div>
                        <div className="text-sm font-medium">{selectedAlert.assignedTo || "Non assigné"}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs text-gray-500">Priorité</div>
                        <div className="text-sm font-medium">{
                          selectedAlert.type === "Critique" ? "Haute" :
                          selectedAlert.type === "Important" ? "Moyenne" : "Basse"
                        }</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedAlert.message}. Cette alerte a été générée automatiquement par le système de surveillance des patients.
                      {selectedAlert.type === "Critique" && " Une intervention immédiate est recommandée."}
                      {selectedAlert.type === "Important" && " Une vérification rapide est recommandée."}
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    {selectedAlert.status !== "Résolu" && (
                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Marquer comme résolu
                      </button>
                    )}
                    {selectedAlert.status !== "Ignoré" && (
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                        <XCircle className="h-5 w-5 mr-2" />
                        Ignorer
                      </button>
                    )}
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 mr-2" />
                      Assigner
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Aucune alerte sélectionnée</h3>
                  <p className="text-gray-500 text-center mb-6">Sélectionnez une alerte dans la liste pour voir les détails</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
