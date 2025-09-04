import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trophy, Video, Star, Calendar, Upload, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useVideos } from "@/hooks/useVideos";
import { formatDistanceToNow } from "date-fns";

const Profile = () => {
  const { signOut } = useAuth();
  const { profile, loading, updateProfile, uploadAvatar } = useProfile();
  const { getUserVideos } = useVideos();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    display_name: string;
    bio: string;
    sport: 'tennis' | 'volleyball' | 'football' | 'golf' | 'basketball' | 'other' | '';
    skill_level: 'L1' | 'L2' | 'L3' | '';
  }>({
    display_name: "",
    bio: "",
    sport: "",
    skill_level: ""
  });
  const [userVideos, setUserVideos] = useState<any[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        sport: profile.sport || "",
        skill_level: profile.skill_level || ""
      });
    }
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    const updateData: any = { ...editForm };
    if (updateData.sport === '') updateData.sport = null;
    if (updateData.skill_level === '') updateData.skill_level = null;
    
    await updateProfile(updateData);
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const loadUserVideos = async () => {
    setVideosLoading(true);
    const videos = await getUserVideos();
    setUserVideos(videos);
    setVideosLoading(false);
  };

  // Load user videos when component mounts
  React.useEffect(() => {
    loadUserVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
            <p className="text-muted-foreground mb-4">Unable to load your profile.</p>
            <Link to="/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto mb-4 cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback className="text-lg">
                      {profile.display_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-2 right-2 bg-primary rounded-full p-1">
                    <Upload className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editForm.display_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                      placeholder="Display name"
                    />
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Bio"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={editForm.sport} onValueChange={(value) => setEditForm(prev => ({ ...prev, sport: value as any }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sport" />
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
                      <Select value={editForm.skill_level} onValueChange={(value) => setEditForm(prev => ({ ...prev, skill_level: value as any }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="L1">L1 - Beginner</SelectItem>
                          <SelectItem value="L2">L2 - Intermediate</SelectItem>
                          <SelectItem value="L3">L3 - Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile} className="flex-1">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold">{profile.display_name || "Anonymous"}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge variant={profile.role === 'coach' ? 'default' : 'secondary'}>
                        {profile.role}
                      </Badge>
                      {profile.skill_level && (
                        <Badge variant="outline">{profile.skill_level}</Badge>
                      )}
                      {profile.sport && (
                        <Badge variant="outline">{profile.sport}</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm">
                      {profile.bio || "No bio added yet."}
                    </p>
                    <div className="flex items-center justify-center gap-1 mt-4 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                    </div>
                    <Button className="w-full mt-4" onClick={handleEditProfile}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="videos">My Videos</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Videos</CardTitle>
                    <CardDescription>All your uploaded practice videos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {videosLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                    ) : userVideos.length === 0 ? (
                      <div className="text-center py-8">
                        <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No videos uploaded yet.</p>
                        <Link to="/post" className="mt-4 inline-block">
                          <Button>Upload Your First Video</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2">
                        {userVideos.map((video) => (
                          <div key={video.id} className="space-y-2">
                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                              <video 
                                controls 
                                className="w-full h-full object-cover"
                                poster="/placeholder.svg"
                              >
                                <source src={video.video_url} type="video/mp4" />
                              </video>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{video.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                {video.sport && (
                                  <Badge variant="outline" className="text-xs">
                                    {video.sport}
                                  </Badge>
                                )}
                                {video.skill_level && (
                                  <Badge variant="outline" className="text-xs">
                                    {video.skill_level}
                                  </Badge>
                                )}
                                {video.is_coaches_only && (
                                  <Badge variant="secondary" className="text-xs">
                                    Coaches Only
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                          <p className="font-medium">Profile updated</p>
                          <p className="text-sm text-muted-foreground">Just now</p>
                        </div>
                      </div>
                      {userVideos.slice(0, 3).map((video) => (
                        <div key={video.id} className="flex items-center gap-4 p-4 rounded-lg border">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium">Uploaded "{video.title}"</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                      {userVideos.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No recent activity. Upload a video to get started!
                        </p>
                      )}
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