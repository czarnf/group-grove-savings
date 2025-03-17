
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications();
  
  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        {unreadNotifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" className="flex items-center">
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">No Notifications</h3>
                <p className="text-muted-foreground">
                  You don't have any notifications yet.
                </p>
              </div>
            ) : (
              notifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="unread">
          <div className="space-y-4">
            {unreadNotifications.length === 0 ? (
              <div className="bg-muted p-8 rounded-lg text-center">
                <h3 className="text-xl font-medium mb-2">No Unread Notifications</h3>
                <p className="text-muted-foreground">
                  You've read all your notifications.
                </p>
              </div>
            ) : (
              unreadNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
