
import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, CheckCheck, Filter } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  
  const unreadNotifications = notifications.filter(notification => !notification.read);
  const displayedNotifications = activeTab === "all" ? notifications : unreadNotifications;
  
  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };
  
  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center">
          <Bell className="mr-3 h-6 w-6" />
          <h1 className="text-3xl font-bold">Notifications</h1>
        </div>
        
        {unreadNotifications.length > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" /> Mark All as Read
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "unread")}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadNotifications.length > 0 && (
                <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground">
                  {unreadNotifications.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
        
        <TabsContent value="all">
          {notifications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Notifications</CardTitle>
                <CardDescription>
                  You don't have any notifications at the moment.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Notifications about your groups, distributions, and account activity will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="unread">
          {unreadNotifications.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Unread Notifications</CardTitle>
                <CardDescription>
                  You've read all your notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Any new notifications will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {unreadNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
