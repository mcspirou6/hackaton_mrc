import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { getDoctorAppointmentNotifications, markNotificationAsRead } from '@/api/emailService';

interface Notification {
  id: number;
  type: string; // 'reminder_24h', 'reminder_1h', 'reminder_30min', 'appointment_created', etc.
  message: string;
  appointment_id: number;
  patient_name: string;
  appointment_date: string;
  appointment_time: string;
  read: boolean;
  created_at: string;
  time_until?: string; // Temps restant avant le rendez-vous (pour les rappels)
}

interface NotificationBellProps {
  onNotificationsUpdate?: (count: number) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onNotificationsUpdate }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Récupérer les notifications au chargement et toutes les 2 minutes
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 2 * 60 * 1000); // 2 minutes pour être plus réactif aux rappels imminents
    
    return () => clearInterval(interval);
  }, []);

  // Fermer le menu des notifications en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await getDoctorAppointmentNotifications();
      setNotifications(notificationsData);
      
      // Mettre à jour le compteur de notifications non lues
      const unreadCount = notificationsData.filter(n => !n.read).length;
      if (onNotificationsUpdate) {
        onNotificationsUpdate(unreadCount);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      ));
      
      // Mettre à jour le compteur
      const unreadCount = notifications.filter(n => !n.read && n.id !== notificationId).length;
      if (onNotificationsUpdate) {
        onNotificationsUpdate(unreadCount);
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Fonction pour obtenir la couleur et l'icône en fonction du type de notification
  const getNotificationStyle = (type: string) => {
    switch(type) {
      case 'reminder_24h':
        return { bgColor: 'bg-blue-50', textColor: 'text-blue-600', urgency: 'faible' };
      case 'reminder_1h':
        return { bgColor: 'bg-yellow-50', textColor: 'text-yellow-600', urgency: 'moyenne' };
      case 'reminder_30min':
        return { bgColor: 'bg-orange-50', textColor: 'text-orange-600', urgency: 'élevée' };
      case 'appointment_created':
        return { bgColor: 'bg-green-50', textColor: 'text-green-600', urgency: '' };
      case 'appointment_updated':
        return { bgColor: 'bg-purple-50', textColor: 'text-purple-600', urgency: '' };
      case 'appointment_canceled':
        return { bgColor: 'bg-red-50', textColor: 'text-red-600', urgency: '' };
      default:
        return { bgColor: 'bg-gray-50', textColor: 'text-gray-600', urgency: '' };
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="relative" ref={notificationRef}>
      <button 
        className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        onClick={toggleNotifications}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-800">Notifications</h3>
          </div>
          
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => {
                const style = getNotificationStyle(notification.type);
                return (
                  <div 
                    key={notification.id} 
                    className={`p-3 hover:bg-gray-50 ${!notification.read ? style.bgColor : ''}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${style.textColor}`}>{notification.patient_name}</p>
                      <span className="text-xs text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="mt-1 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {notification.appointment_date} à {notification.appointment_time}
                      </span>
                      {style.urgency && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${style.bgColor} ${style.textColor}`}>
                          Priorité {style.urgency}
                        </span>
                      )}
                    </div>
                    {notification.time_until && (
                      <div className="mt-1 text-xs font-medium text-gray-500">
                        {notification.time_until}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucune notification
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;