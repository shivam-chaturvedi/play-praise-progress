import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trophy, Video, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  // Mock user data - replace with actual user data
  const user = {
    name: "John Doe",
    role: "athlete",
    level: "L2",
    sport: "Tennis",
    bio: "Passionate tennis player looking to improve my game. Always eager to learn from experienced coaches!",
    joinDate: "March 2024",
    stats: {
      videos: 12,
      likes: 89,
      comments: 34,
      rewards: 5
    },
    achievements: [
      { name: "First Upload", icon: "🎯", date: "March 2024" },
      { name: "10 Videos", icon: "📹", date: "April 2024" },
      { name: "50 Likes", icon: "❤️", date: "May 2024" }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link to="/feed">
              <Button variant="outline" size="sm">Feed</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="secondary">{user.role}</Badge>
                  <Badge variant="outline">{user.level}</Badge>
                  <Badge variant="outline">{user.sport}</Badge>
                </div>
                <p className="text-muted-foreground mt-4 text-sm">{user.bio}</p>
                <div className="flex items-center justify-center gap-1 mt-4 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {user.joinDate}
                </div>
                <Button className="w-full mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Videos</span>
                  </div>
                  <span className="font-medium">{user.stats.videos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="font-medium">{user.stats.likes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Rewards</span>
                  </div>
                  <span className="font-medium">{user.stats.rewards}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Videos</CardTitle>
                    <CardDescription>All your uploaded practice videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground">Video {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your milestones and rewards</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.achievements.map((achievement, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium">{achievement.name}</p>
                            <p className="text-sm text-muted-foreground">{achievement.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest interactions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Uploaded new tennis serve video</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Received feedback from Coach Sarah</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;