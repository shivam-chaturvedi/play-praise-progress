import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Video } from "lucide-react";
import { Link } from "react-router-dom";

const Post = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Upload Video</h1>
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

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Share Your Practice</CardTitle>
            <CardDescription>
              Upload a video of your practice session to get feedback from coaches
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Upload */}
            <div className="space-y-2">
              <Label>Video File</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop your video file here, or click to browse
                </p>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supported formats: MP4, MOV, AVI (Max 100MB)
                </p>
              </div>
            </div>

            {/* Video Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g., Tennis backhand practice" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe what you're working on and what feedback you're looking for..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sport</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tennis">Tennis</SelectItem>
                      <SelectItem value="volleyball">Volleyball</SelectItem>
                      <SelectItem value="football">Football</SelectItem>
                      <SelectItem value="golf">Golf</SelectItem>
                      <SelectItem value="basketball">Basketball</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="l1">L1 - Beginner</SelectItem>
                      <SelectItem value="l2">L2 - Intermediate</SelectItem>
                      <SelectItem value="l3">L3 - Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Privacy Setting */}
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label htmlFor="privacy" className="font-medium">
                    Coaches Only
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Only coaches can see this video
                  </p>
                </div>
                <Switch id="privacy" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
              <Button className="flex-1">
                Post Video
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Post;