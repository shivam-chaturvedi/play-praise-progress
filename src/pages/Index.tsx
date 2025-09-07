import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Users, Video, Trophy, Star, ArrowRight, Palette } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="glass-effect border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Trophy className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-gradient">AthleteConnect</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="gradient" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="accent" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 shadow-md">
            🏆 Peer-to-Peer Coaching Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Elevate Your Game with Expert Coaching
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with professional coaches, share your practice videos, and receive personalized feedback to take your athletic performance to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="xl" variant="gradient" className="w-full sm:w-auto shadow-glow interactive">
                Get Started as Athlete
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Join as Coach
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform connects athletes with experienced coaches for personalized feedback and improvement
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader className="text-center">
              <Video className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle>Upload Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Share your practice sessions and technique videos with the coaching community
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-secondary" />
              <CardTitle>Connect with Coaches</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get matched with qualified coaches who specialize in your sport and skill level
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-accent" />
              <CardTitle>Receive Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get detailed comments, suggestions, and personalized advice from expert coaches
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-warning" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Monitor your improvement with analytics, achievements, and performance tracking
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-primary text-primary-foreground py-16 shadow-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Game?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who are already improving their skills with professional coaching feedback
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button size="xl" variant="accent" className="shadow-lg interactive">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="xl" variant="accent" className="shadow-lg interactive">
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
