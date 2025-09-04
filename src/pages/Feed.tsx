import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const Feed = () => {
  // Mock data - replace with actual feed data
  const posts = [
    {
      id: 1,
      author: {
        name: "Sarah Johnson",
        role: "athlete",
        avatar: "/placeholder.svg"
      },
      title: "Working on my tennis serve technique",
      description: "Been practicing my serve for weeks. Any feedback from coaches would be amazing!",
      videoUrl: "/placeholder.svg",
      likes: 15,
      comments: 8,
      timestamp: "2 hours ago",
      sport: "Tennis"
    },
    {
      id: 2,
      author: {
        name: "Mike Chen",
        role: "athlete",
        avatar: "/placeholder.svg"
      },
      title: "Volleyball spike practice",
      description: "Training for the upcoming tournament. How's my form?",
      videoUrl: "/placeholder.svg",
      likes: 23,
      comments: 12,
      timestamp: "4 hours ago",
      sport: "Volleyball"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
            <Link to="/profile">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {post.author.role}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {post.sport}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.description}</p>
                </div>
                
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Video Player</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Feed;