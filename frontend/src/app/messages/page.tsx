"use client";

import { useState, useRef, useEffect } from "react";
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
  Send,
  PlusCircle,
  Phone,
  Video,
  MoreHorizontal,
  Paperclip,
  Image,
  Smile,
  ChevronDown,
  Filter,
  Clock,
  CheckCheck,
  User,
  UserPlus,
  X
} from "lucide-react";

// Types
interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  recipientId: number;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  isAttachment?: boolean;
  attachmentType?: string;
  attachmentName?: string;
}

interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantRole: string;
  participantStatus: "online" | "offline" | "away";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPatient: boolean;
}

export default function Messages() {
  // États
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: 1, participantId: 101, participantName: "Dr. Martin", participantRole: "Néphrologue", participantStatus: "online", lastMessage: "Bonjour, pouvez-vous me donner votre avis sur le dossier de Mme Dubois ?", lastMessageTime: "09:45", unreadCount: 2, isPatient: false },
    { id: 2, participantId: 102, participantName: "Dr. Legrand", participantRole: "Néphrologue", participantStatus: "offline", lastMessage: "J'ai mis à jour le traitement du patient.", lastMessageTime: "Hier", unreadCount: 0, isPatient: false },
    { id: 3, participantId: 1, participantName: "Jean Dupont", participantRole: "Patient", participantStatus: "away", lastMessage: "Merci pour les informations, docteur.", lastMessageTime: "Hier", unreadCount: 0, isPatient: true },
    { id: 4, participantId: 103, participantName: "Dr. Dubois", participantRole: "Cardiologue", participantStatus: "online", lastMessage: "Voici les résultats d'ECG que vous avez demandés.", lastMessageTime: "Lun", unreadCount: 0, isPatient: false },
    { id: 5, participantId: 2, participantName: "Marie Curie", participantRole: "Patient", participantStatus: "offline", lastMessage: "J'ai une question concernant mes médicaments.", lastMessageTime: "28/03", unreadCount: 1, isPatient: true },
    { id: 6, participantId: 104, participantName: "Dr. Bernard", participantRole: "Radiologue", participantStatus: "offline", lastMessage: "Les images scanner sont disponibles.", lastMessageTime: "27/03", unreadCount: 0, isPatient: false },
    { id: 7, participantId: 3, participantName: "Pierre Martin", participantRole: "Patient", participantStatus: "offline", lastMessage: "À quelle heure est mon prochain rendez-vous ?", lastMessageTime: "25/03", unreadCount: 0, isPatient: true },
  ]);
  
  const [messages, setMessages] = useState<{ [key: number]: Message[] }>({
    1: [
      { id: 1, senderId: 101, senderName: "Dr. Martin", senderRole: "Néphrologue", recipientId: 100, recipientName: "Dr. Richard", content: "Bonjour, pouvez-vous me donner votre avis sur le dossier de Mme Dubois ?", timestamp: "09:45", read: false },
      { id: 2, senderId: 101, senderName: "Dr. Martin", senderRole: "Néphrologue", recipientId: 100, recipientName: "Dr. Richard", content: "Elle présente des valeurs de créatinine élevées et je m'inquiète de l'évolution de sa fonction rénale.", timestamp: "09:46", read: false },
    ],
    2: [
      { id: 3, senderId: 100, senderName: "Dr. Richard", senderRole: "Néphrologue", recipientId: 102, recipientName: "Dr. Legrand", content: "Avez-vous reçu les derniers résultats d'analyse de M. Dupont ?", timestamp: "Hier 14:30", read: true },
      { id: 4, senderId: 102, senderName: "Dr. Legrand", senderRole: "Néphrologue", recipientId: 100, recipientName: "Dr. Richard", content: "Oui, je les ai reçus ce matin. Tout semble normal.", timestamp: "Hier 15:15", read: true },
      { id: 5, senderId: 102, senderName: "Dr. Legrand", senderRole: "Néphrologue", recipientId: 100, recipientName: "Dr. Richard", content: "J'ai mis à jour le traitement du patient.", timestamp: "Hier 15:20", read: true },
    ],
    3: [
      { id: 6, senderId: 1, senderName: "Jean Dupont", senderRole: "Patient", recipientId: 100, recipientName: "Dr. Richard", content: "Bonjour Docteur, j'ai une question concernant mon nouveau médicament.", timestamp: "Hier 10:15", read: true },
      { id: 7, senderId: 100, senderName: "Dr. Richard", senderRole: "Néphrologue", recipientId: 1, recipientName: "Jean Dupont", content: "Bonjour M. Dupont, je vous écoute.", timestamp: "Hier 11:30", read: true },
      { id: 8, senderId: 1, senderName: "Jean Dupont", senderRole: "Patient", recipientId: 100, recipientName: "Dr. Richard", content: "Dois-je le prendre avant ou après les repas ?", timestamp: "Hier 11:45", read: true },
      { id: 9, senderId: 100, senderName: "Dr. Richard", senderRole: "Néphrologue", recipientId: 1, recipientName: "Jean Dupont", content: "Il est préférable de le prendre après les repas pour éviter les irritations gastriques.", timestamp: "Hier 12:00", read: true },
      { id: 10, senderId: 1, senderName: "Jean Dupont", senderRole: "Patient", recipientId: 100, recipientName: "Dr. Richard", content: "Merci pour les informations, docteur.", timestamp: "Hier 12:05", read: true },
    ],
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [filterType, setFilterType] = useState<"all" | "doctors" | "patients">("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Effet pour faire défiler vers le bas lorsque les messages changent
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation, messages]);
  
  // Filtrer les conversations
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.participantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterType === "all" ? true :
      filterType === "doctors" ? !conversation.isPatient :
      filterType === "patients" ? conversation.isPatient : true;
    
    return matchesSearch && matchesFilter;
  });
  
  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (newMessage.trim() === "" || !selectedConversation) return;
    
    const newMessageObj: Message = {
      id: Math.max(...Object.values(messages).flatMap(msgs => msgs.map(m => m.id)), 0) + 1,
      senderId: 100, // ID du Dr. Richard (utilisateur actuel)
      senderName: "Dr. Richard",
      senderRole: "Néphrologue",
      recipientId: selectedConversation.participantId,
      recipientName: selectedConversation.participantName,
      content: newMessage,
      timestamp: "À l'instant",
      read: false,
    };
    
    // Mettre à jour les messages
    setMessages(prev => {
      const conversationMessages = prev[selectedConversation.id] || [];
      return {
        ...prev,
        [selectedConversation.id]: [...conversationMessages, newMessageObj],
      };
    });
    
    // Mettre à jour la dernière conversation
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, lastMessage: newMessage, lastMessageTime: "À l'instant", unreadCount: 0 }
          : conv
      )
    );
    
    // Réinitialiser le champ de message
    setNewMessage("");
  };
  
  // Fonction pour obtenir le statut de couleur
  const getStatusColor = (status: string) => {
    switch(status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-gray-400";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-400";
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
              <Link href="/messages" className="flex items-center p-2 md:p-3 bg-indigo-800 rounded-lg">
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-lg text-sm font-medium ${filterType === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilterType('all')}
              >
                Tous
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm font-medium ${filterType === 'doctors' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilterType('doctors')}
              >
                Médecins
              </button>
              <button 
                className={`px-3 py-1 rounded-lg text-sm font-medium ${filterType === 'patients' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilterType('patients')}
              >
                Patients
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-indigo-50' : ''}`}
                onClick={() => {
                  setSelectedConversation(conversation);
                  // Marquer les messages comme lus
                  if (conversation.unreadCount > 0) {
                    setConversations(prev => 
                      prev.map(conv => 
                        conv.id === conversation.id 
                          ? { ...conv, unreadCount: 0 }
                          : conv
                      )
                    );
                  }
                }}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${conversation.isPatient ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                      {conversation.participantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(conversation.participantStatus)}`}></div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-900">{conversation.participantName}</h3>
                      <span className="text-xs text-gray-500">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{conversation.participantRole}</p>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-full flex items-center justify-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Nouvelle conversation
            </button>
          </div>
        </div>
        
        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedConversation.isPatient ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                    {selectedConversation.participantName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedConversation.participantStatus)}`}></div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{selectedConversation.participantName}</h3>
                  <p className="text-xs text-gray-500">{selectedConversation.participantRole} · {
                    selectedConversation.participantStatus === "online" ? "En ligne" :
                    selectedConversation.participantStatus === "away" ? "Absent" : "Hors ligne"
                  }</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Phone className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Video className="h-5 w-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages[selectedConversation.id]?.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === 100 ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== 100 && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${selectedConversation.isPatient ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {message.senderName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${message.senderId === 100 ? 'bg-indigo-600 text-white' : 'bg-white'} rounded-lg px-4 py-2 shadow-sm`}>
                      {message.isAttachment ? (
                        <div className="flex items-center">
                          {message.attachmentType === "image" ? (
                            <Image className="h-5 w-5 mr-2" />
                          ) : (
                            <Paperclip className="h-5 w-5 mr-2" />
                          )}
                          <span>{message.attachmentName}</span>
                        </div>
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <div className={`text-xs mt-1 flex justify-end items-center ${message.senderId === 100 ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {message.timestamp}
                        {message.senderId === 100 && (
                          <CheckCheck className={`h-4 w-4 ml-1 ${message.read ? 'text-blue-400' : 'text-indigo-300'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-100 mr-2">
                  <Paperclip className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder="Écrivez un message..." 
                    className="pl-4 pr-10 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                  />
                  <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                    <Smile className="h-5 w-5" />
                  </button>
                </div>
                <button 
                  className="ml-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full"
                  onClick={sendMessage}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <div className="bg-indigo-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Vos messages</h2>
              <p className="text-gray-600 mb-6">Sélectionnez une conversation pour commencer à discuter</p>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center mx-auto">
                <UserPlus className="h-5 w-5 mr-2" />
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
