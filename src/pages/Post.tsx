import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Video } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useVideoUpload } from "@/hooks/useVideoUpload";
import { useAuth } from "@/hooks/useAuth";

const Post = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sport, setSport] = useState<'tennis' | 'volleyball' | 'football' | 'golf' | 'basketball' | 'other' | "">("");
  const [skillLevel, setSkillLevel] = useState<'L1' | 'L2' | 'L3' | "">("");
  const [isCoachesOnly, setIsCoachesOnly] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadVideo, uploading } = useVideoUpload();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        alert("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !title || !sport || !skillLevel) {
      alert("Please fill in all required fields and select a video file");
      return;
    }

    const result = await uploadVideo(selectedFile, {
      title,
      description,
      sport: sport as 'tennis' | 'volleyball' | 'football' | 'golf' | 'basketball' | 'other',
      skill_level: skillLevel as 'L1' | 'L2' | 'L3',
      is_coaches_only: isCoachesOnly
    });

    if (result) {
      navigate('/feed');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Upload */}
              <div className="space-y-2">
                <Label>Video File *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {selectedFile ? (
                    <p className="text-foreground mb-4">
                      Selected: {selectedFile.name}
                    </p>
                  ) : (
                    <p className="text-muted-foreground mb-4">
                      Drag and drop your video file here, or click to browse
                    </p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
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
                  <Label htmlFor="title">Video Title *</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Tennis backhand practice"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what you're working on and what feedback you're looking for..."
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Sport *</Label>
                    <Select value={sport} onValueChange={(value) => setSport(value as typeof sport)} required>
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
                    <Label>Skill Level *</Label>
                    <Select value={skillLevel} onValueChange={(value) => setSkillLevel(value as typeof skillLevel)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">L1 - Beginner</SelectItem>
                        <SelectItem value="L2">L2 - Intermediate</SelectItem>
                        <SelectItem value="L3">L3 - Advanced</SelectItem>
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
                  <Switch 
                    id="privacy" 
                    checked={isCoachesOnly}
                    onCheckedChange={setIsCoachesOnly}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button type="submit" className="flex-1" disabled={uploading}>
                  {uploading ? "Uploading..." : "Post Video"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Post;