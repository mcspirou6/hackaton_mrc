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
  Printer
} from "lucide-react";

// Types
interface Report {
  id: number;
  title: string;
  type: "Mensuel" | "Trimestriel" | "Annuel" | "Personnalisé";
  category: "Patients" | "Traitements" | "Médicaments" | "Performance";
  date: string;
  author: string;
  status: "Généré" | "En cours" | "Programmé";
  format: "PDF" | "Excel" | "CSV";
}

interface ReportTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export default function Reports() {
  // États
  const [reports, setReports] = useState<Report[]>([
    { id: 1, title: "Rapport mensuel des patients", type: "Mensuel", category: "Patients", date: "31/03/2025", author: "Dr. Richard", status: "Généré", format: "PDF" },
    { id: 2, title: "Suivi trimestriel des traitements", type: "Trimestriel", category: "Traitements", date: "15/03/2025", author: "Dr. Martin", status: "Généré", format: "Excel" },
    { id: 3, title: "Analyse annuelle des médicaments", type: "Annuel", category: "Médicaments", date: "01/01/2025", author: "Dr. Legrand", status: "Généré", format: "PDF" },
    { id: 4, title: "Rapport de performance Q1", type: "Trimestriel", category: "Performance", date: "31/03/2025", author: "Dr. Richard", status: "En cours", format: "PDF" },
    { id: 5, title: "Suivi des patients à risque", type: "Personnalisé", category: "Patients", date: "20/03/2025", author: "Dr. Dubois", status: "Généré", format: "Excel" },
    { id: 6, title: "Rapport mensuel d'avril", type: "Mensuel", category: "Patients", date: "30/04/2025", author: "Dr. Richard", status: "Programmé", format: "PDF" },
  ]);
  
  const [reportTemplates, setReportTemplates] = useState<ReportTemplate[]>([
    { id: 1, title: "Rapport mensuel des patients", description: "Vue d'ensemble des patients, nouveaux patients, et statuts", category: "Patients", icon: "Users" },
    { id: 2, title: "Suivi des traitements", description: "Analyse des traitements administrés et leur efficacité", category: "Traitements", icon: "Activity" },
    { id: 3, title: "Analyse des médicaments", description: "Consommation et efficacité des médicaments", category: "Médicaments", icon: "Pill" },
    { id: 4, title: "Rapport de performance", description: "Métriques de performance du service", category: "Performance", icon: "BarChart2" },
    { id: 5, title: "Patients à risque", description: "Liste et analyse des patients à haut risque", category: "Patients", icon: "AlertTriangle" },
    { id: 6, title: "Rapport personnalisé", description: "Créez un rapport sur mesure", category: "Personnalisé", icon: "FileText" },
  ]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"recent" | "templates">("recent");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Filtrer les rapports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || report.type === filterType;
    const matchesCategory = filterCategory === "all" || report.category === filterCategory;
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });
  
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
              
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau rapport
              </button>
            </div>
          </div>
          
          {/* Recent Reports Tab */}
          {activeTab === 'recent' && (
            <div className="grid grid-cols-1 gap-6">
              {/* Reports Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center">
                            Titre
                            <ArrowUpDown className="h-4 w-4 ml-1" />
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
                            Date
                            <ArrowUpDown className="h-4 w-4 ml-1" />
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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-gray-50" onClick={() => setSelectedReport(report)}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText className="h-5 w-5 text-indigo-500 mr-3" />
                              <div className="text-sm font-medium text-gray-900">{report.title}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {report.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{report.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {report.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(report.status)}`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFormatIcon(report.format)}
                              <span className="ml-1 text-sm text-gray-500">{report.format}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {report.status === "Généré" && (
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  <Download className="h-5 w-5" />
                                </button>
                              )}
                              <button className="text-gray-600 hover:text-gray-900">
                                <Printer className="h-5 w-5" />
                              </button>
                              <button className="text-blue-600 hover:text-blue-900">
                                <Share2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                          <Download className="h-5 w-5 mr-2" />
                          Télécharger
                        </button>
                      )}
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                        <Printer className="h-5 w-5 mr-2" />
                        Imprimer
                      </button>
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg flex items-center">
                        <Share2 className="h-5 w-5 mr-2" />
                        Partager
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
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium">
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
    </div>
  );
}
