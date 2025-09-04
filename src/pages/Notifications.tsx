import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageCircle, Trophy, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Notifications = () => {
  // Mock notification data - replace with actual data
  const notifications = {
    unread: [
      {
        id: 1,
        type: "like",
        user: { name: "Coach Sarah", avatar: "/placeholder.svg" },
        message: "liked your tennis serve video",
        time: "2 min ago",
        post: "Tennis serve practice"
      },
      {
        id: 2,
        type: "comment",
        user: { name: "Coach Mike", avatar: "/placeholder.svg" },
        message: "commented on your volleyball spike practice",
        time: "15 min ago",
        post: "Volleyball training session"
      },
      {
        id: 3,
        type: "reward",
        user: { name: "Coach Emma", avatar: "/placeholder.svg" },
        message: "awarded you a badge for improvement",
        time: "1 hour ago",
        post: "Tennis backhand technique"
      }
    ],
    read: [
      {
        id: 4,
        type: "like",
        user: { name: "Coach John", avatar: "/placeholder.svg" },
        message: "liked your practice video",
        time: "2 hours ago",
        post: "Morning tennis practice"
      },
      {
        id: 5,
        type: "comment",
        user: { name: "Coach Lisa", avatar: "/placeholder.svg" },
        message: "left feedback on your technique",
        time: "1 day ago",
        post: "Footwork drill practice"
      }
    ]
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "reward":
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const NotificationItem = ({ notification, isRead = false }: { notification: any, isRead?: boolean }) => (
    <div className={`flex items-start gap-4 p-4 rounded-lg border ${!isRead ? 'bg-accent/50' : ''}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage src={notification.user.avatar} />
        <AvatarFallback>{notification.user.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {getIcon(notification.type)}
          <span className="font-medium text-sm">{notification.user.name}</span>
          <span className="text-sm text-muted-foreground">{notification.message}</span>
        </div>
        <p className="text-sm text-muted-foreground truncate">{notification.post}</p>
        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
      </div>
      {!isRead && (
        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <Badge variant="secondary">{notifications.unread.length} new</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">Mark All Read</Button>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Tabs defaultValue="unread" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread" className="flex items-center gap-2">
              New
              {notifications.unread.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {notifications.unread.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value="unread" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>New Notifications</CardTitle>
                <CardDescription>Your latest updates and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications.unread.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.unread.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No new notifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {notifications.unread.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>New</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.unread.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Earlier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.read.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} isRead />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;