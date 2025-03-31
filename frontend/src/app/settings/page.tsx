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
  User,
  Lock,
  Bell as BellIcon,
  Globe,
  Palette,
  Shield,
  Save,
  LogOut,
  Moon,
  Sun,
  ChevronRight,
  Check
} from "lucide-react";

export default function SettingsPage() {
  // États
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "appearance" | "language" | "privacy">("profile");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Dr. Richard",
    email: "dr.richard@nephrosuivi.fr",
    phone: "06 12 34 56 78",
    specialty: "Néphrologue",
    hospital: "Centre Hospitalier Universitaire",
    address: "123 Avenue de la Médecine, 75001 Paris",
    bio: "Néphrologue spécialisé dans le traitement des maladies rénales chroniques. Plus de 15 ans d'expérience dans le suivi des patients dialysés."
  });
  
  // Fonction pour mettre à jour les données du profil
  const updateProfileData = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
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
              <Link href="/alerts" className="flex items-center p-2 md:p-3 hover:bg-indigo-800 rounded-lg transition-colors">
                <Bell className="mr-3 h-4 w-4 md:h-5 md:w-5" />
                <span>Alertes</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto">
          <Link href="/settings" className="flex items-center p-2 md:p-3 bg-indigo-800 rounded-lg">
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
        <header className="bg-white p-4 md:p-6 flex items-center justify-between shadow-sm">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Paramètres</h1>
          <div className="flex items-center">
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        
        {/* Settings Content */}
        <main className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Paramètres</h2>
              <nav>
                <ul className="space-y-1">
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-5 w-5 mr-3" />
                      <span>Profil</span>
                      {activeTab === 'profile' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      <span>Sécurité</span>
                      {activeTab === 'security' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <BellIcon className="h-5 w-5 mr-3" />
                      <span>Notifications</span>
                      {activeTab === 'notifications' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'appearance' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('appearance')}
                    >
                      <Palette className="h-5 w-5 mr-3" />
                      <span>Apparence</span>
                      {activeTab === 'appearance' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'language' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('language')}
                    >
                      <Globe className="h-5 w-5 mr-3" />
                      <span>Langue</span>
                      {activeTab === 'language' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                  <li>
                    <button 
                      className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-700'}`}
                      onClick={() => setActiveTab('privacy')}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      <span>Confidentialité</span>
                      {activeTab === 'privacy' && <ChevronRight className="h-5 w-5 ml-auto" />}
                    </button>
                  </li>
                </ul>
              </nav>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
            
            {/* Settings Content */}
            <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Informations du profil</h2>
                  
                  <div className="flex flex-col md:flex-row items-start mb-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                      <span className="text-3xl font-bold text-indigo-600">DR</span>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-1">{profileData.name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{profileData.specialty}</p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm">
                        Changer la photo
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.name}
                        onChange={(e) => updateProfileData('name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.email}
                        onChange={(e) => updateProfileData('email', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <input 
                        type="tel" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.phone}
                        onChange={(e) => updateProfileData('phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spécialité</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.specialty}
                        onChange={(e) => updateProfileData('specialty', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hôpital / Clinique</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.hospital}
                        onChange={(e) => updateProfileData('hospital', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={profileData.address}
                        onChange={(e) => updateProfileData('address', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                      <textarea 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                        value={profileData.bio}
                        onChange={(e) => updateProfileData('bio', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center">
                      <Save className="h-5 w-5 mr-2" />
                      Enregistrer les modifications
                    </button>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Sécurité du compte</h2>
                  
                  <div className="mb-8">
                    <h3 className="text-md font-medium text-gray-800 mb-4">Changer le mot de passe</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                      Mettre à jour le mot de passe
                    </button>
                  </div>
                  
                  <div className="mb-8 border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-4">Authentification à deux facteurs</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Protégez votre compte avec l'authentification à deux facteurs</p>
                        <p className="text-xs text-gray-500">Non activée</p>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                        Activer
                      </button>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-md font-medium text-gray-800 mb-4">Sessions actives</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Windows - Chrome</p>
                          <p className="text-xs text-gray-500">Paris, France • Actif maintenant</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Actuel</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">iPhone - Safari</p>
                          <p className="text-xs text-gray-500">Paris, France • Dernière activité: il y a 2 heures</p>
                        </div>
                        <button className="text-red-600 text-sm">Déconnecter</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Paramètres de notification</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-md font-medium text-gray-800">Notifications</h3>
                        <p className="text-sm text-gray-500">Activer ou désactiver toutes les notifications</p>
                      </div>
                      <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input 
                          type="checkbox"
                          className="absolute w-6 h-6 opacity-0 cursor-pointer"
                          checked={notificationsEnabled}
                          onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                        />
                        <div className={`w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0 w-6 h-6 bg-white rounded-full shadow transform transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Notifications par email</h4>
                        <p className="text-xs text-gray-500">Recevoir des notifications par email</p>
                      </div>
                      <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input 
                          type="checkbox"
                          className="absolute w-5 h-5 opacity-0 cursor-pointer"
                          checked={emailNotifications}
                          onChange={() => setEmailNotifications(!emailNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${emailNotifications && notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${emailNotifications && notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">Notifications par SMS</h4>
                        <p className="text-xs text-gray-500">Recevoir des notifications par SMS</p>
                      </div>
                      <div className="relative inline-block w-10 h-5 transition duration-200 ease-in-out rounded-full cursor-pointer">
                        <input 
                          type="checkbox"
                          className="absolute w-5 h-5 opacity-0 cursor-pointer"
                          checked={smsNotifications}
                          onChange={() => setSmsNotifications(!smsNotifications)}
                          disabled={!notificationsEnabled}
                        />
                        <div className={`w-10 h-5 rounded-full transition-colors ${smsNotifications && notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                        <div className={`absolute left-0 w-5 h-5 bg-white rounded-full shadow transform transition-transform ${smsNotifications && notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Apparence</h2>
                  
                  <div className="mb-6">
                    <h3 className="text-md font-medium text-gray-800 mb-4">Thème</h3>
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer ${!darkMode ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => setDarkMode(false)}
                      >
                        <div className="flex items-center mb-2">
                          <Sun className="h-5 w-5 text-indigo-600 mr-2" />
                          <span className="font-medium text-gray-800">Clair</span>
                          {!darkMode && <Check className="h-4 w-4 text-indigo-600 ml-2" />}
                        </div>
                        <div className="w-full h-24 bg-white border border-gray-200 rounded"></div>
                      </div>
                      
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer ${darkMode ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}
                        onClick={() => setDarkMode(true)}
                      >
                        <div className="flex items-center mb-2">
                          <Moon className="h-5 w-5 text-indigo-600 mr-2" />
                          <span className="font-medium text-gray-800">Sombre</span>
                          {darkMode && <Check className="h-4 w-4 text-indigo-600 ml-2" />}
                        </div>
                        <div className="w-full h-24 bg-gray-800 border border-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Language Settings */}
              {activeTab === 'language' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Langue</h2>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sélectionner la langue</label>
                    <select 
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-6">Confidentialité</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">Données personnelles</h3>
                      <p className="text-sm text-gray-600 mb-4">Gérez comment vos données personnelles sont utilisées</p>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg">
                        Télécharger mes données
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-md font-medium text-gray-800 mb-2">Suppression du compte</h3>
                      <p className="text-sm text-gray-600 mb-4">Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière. Soyez certain.</p>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                        Supprimer mon compte
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
