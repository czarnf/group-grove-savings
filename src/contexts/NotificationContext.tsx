
import { createContext, useContext, useState } from "react";
import { Notification } from "@/types";
import { mockNotifications } from "@/lib/mockData";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Filter notifications for current user and calculate unread count
  const userNotifications = user 
    ? notifications.filter(notif => notif.userId === user.id)
    : [];
  
  const unreadCount = userNotifications.filter(notif => !notif.read).length;
  
  const markAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    if (!user) return;
    
    setNotifications(prevNotifications =>
      prevNotifications.map(notif =>
        notif.userId === user.id ? { ...notif, read: true } : notif
      )
    );
  };
  
  const removeNotification = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notif => notif.id !== notificationId)
    );
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;
    
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false,
      userId: user.id
    };
    
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        removeNotification,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
