
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Notification } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/contexts/NotificationContext";
import { CheckCircle, Info, AlertCircle, AlertTriangle, X } from "lucide-react";

interface NotificationCardProps {
  notification: Notification;
  onClose?: () => void;
}

export function NotificationCard({ notification, onClose }: NotificationCardProps) {
  const { markAsRead, removeNotification } = useNotifications();
  const navigate = useNavigate();
  const [removed, setRemoved] = useState(false);
  
  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const handleClick = () => {
    markAsRead(notification.id);
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    if (onClose) {
      onClose();
    }
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoved(true);
    
    setTimeout(() => {
      removeNotification(notification.id);
    }, 300);
  };
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${
        removed ? "opacity-0 h-0 overflow-hidden" : ""
      } ${notification.read ? "opacity-80" : "border-l-4 border-l-blue-500"}`}
      onClick={handleClick}
    >
      <CardContent className="p-4 flex items-start">
        <div className="mr-3 pt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            <button
              onClick={handleRemove}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
