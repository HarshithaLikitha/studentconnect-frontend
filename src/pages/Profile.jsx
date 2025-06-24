import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { User, MapPin, Calendar, Github, Linkedin, ExternalLink, Edit, MessageSquare, Users, Code, BookOpen, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [communities, setCommunities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    college: '',
    major: '',
    year: '',
    skills: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: ''
  });

  const isOwnProfile = !id || (currentUser && currentUser.id === parseInt(id));
  const profileUserId = id ? parseInt(id) : currentUser?.id;

  useEffect(() => {
    if (profileUserId) {
      fetchUserProfile();
      fetchUserCommunities();
      fetchUserProjects();
      fetchUserEvents();
    }
  }, [profileUserId]);

  const fetchUserProfile = async () => {
    try {
      if (isOwnProfile && currentUser) {
        setUser(currentUser);
        setEditForm({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          bio: currentUser.bio || '',
          college: currentUser.college || '',
          major: currentUser.major || '',
          year: currentUser.year || '',
          skills: currentUser.skills || '',
          github_url: currentUser.github_url || '',
          linkedin_url: currentUser.linkedin_url || '',
          portfolio_url: currentUser.portfolio_url || ''
        });
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${profileUserId}`);
        const data = await response.json();
        
        if (response.ok) {
          setUser(data);
        } else {
          console.error('Failed to fetch user profile:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCommunities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${profileUserId}/communities`);
      const data = await response.json();
      
      if (response.ok) {
        setCommunities(data);
      } else {
        console.error('Failed to fetch user communities:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user communities:', error);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${profileUserId}/projects`);
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data);
      } else {
        console.error('Failed to fetch user projects:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user projects:', error);
    }
  };

  const fetchUserEvents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${profileUserId}/events`);
      const data = await response.json();
      
      if (response.ok) {
        setEvents(data);
      } else {
        console.error('Failed to fetch user events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user events:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!token || !isOwnProfile) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await response.json();
      
      if (response.ok) {
        setUser(data);
        setIsEditDialogOpen(false);
        // Update the current user context if needed
      } else {
        console.error('Failed to update profile:', data.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSendMessage = () => {
    navigate('/messages');
    // In a real implementation, you might want to open a specific conversation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
            <Button onClick={() => navigate('/')}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const skills = user.skills ? (typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="w-24 h-24 mx-auto sm:mx-0">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {user.first_name} {user.last_name}
                    </CardTitle>
                    <p className="text-gray-600 mb-2">@{user.username}</p>
                    {user.college && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4" />
                        {user.college}
                      </div>
                    )}
                    {user.major && (
                      <p className="text-sm text-gray-500 mb-1">
                        {user.major} {user.year && `• ${user.year}`}
                      </p>
                    )}
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isOwnProfile && currentUser && (
                      <Button
                        onClick={handleSendMessage}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Message
                      </Button>
                    )}
                    {isOwnProfile && (
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Profile
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                              Update your profile information.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                  id="first_name"
                                  value={editForm.first_name}
                                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                  id="last_name"
                                  value={editForm.last_name}
                                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="bio">Bio</Label>
                              <Textarea
                                id="bio"
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                placeholder="Tell us about yourself..."
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="college">College</Label>
                                <Input
                                  id="college"
                                  value={editForm.college}
                                  onChange={(e) => setEditForm({...editForm, college: e.target.value})}
                                  placeholder="Your college/university"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="major">Major</Label>
                                <Input
                                  id="major"
                                  value={editForm.major}
                                  onChange={(e) => setEditForm({...editForm, major: e.target.value})}
                                  placeholder="Your major/field of study"
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="year">Year</Label>
                              <Input
                                id="year"
                                value={editForm.year}
                                onChange={(e) => setEditForm({...editForm, year: e.target.value})}
                                placeholder="e.g., Freshman, Sophomore, Junior, Senior"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="skills">Skills (comma-separated)</Label>
                              <Input
                                id="skills"
                                value={editForm.skills}
                                onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                                placeholder="e.g., JavaScript, Python, React, Node.js"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="github_url">GitHub URL</Label>
                              <Input
                                id="github_url"
                                value={editForm.github_url}
                                onChange={(e) => setEditForm({...editForm, github_url: e.target.value})}
                                placeholder="https://github.com/username"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                              <Input
                                id="linkedin_url"
                                value={editForm.linkedin_url}
                                onChange={(e) => setEditForm({...editForm, linkedin_url: e.target.value})}
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="portfolio_url">Portfolio URL</Label>
                              <Input
                                id="portfolio_url"
                                value={editForm.portfolio_url}
                                onChange={(e) => setEditForm({...editForm, portfolio_url: e.target.value})}
                                placeholder="https://yourportfolio.com"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleUpdateProfile}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {user.bio && (
              <CardDescription className="mt-4 text-base">
                {user.bio}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Skills and Links */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skills */}
          {skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {user.github_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(user.github_url, '_blank')}
                    className="w-full justify-start"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                )}
                {user.linkedin_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(user.linkedin_url, '_blank')}
                    className="w-full justify-start"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
                {user.portfolio_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(user.portfolio_url, '_blank')}
                    className="w-full justify-start"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Portfolio
                  </Button>
                )}
                {!user.github_url && !user.linkedin_url && !user.portfolio_url && (
                  <p className="text-sm text-gray-500">No links available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="communities" className="space-y-6">
          <TabsList>
            <TabsTrigger value="communities">Communities</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="communities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((community) => (
                <Card key={community.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/communities/${community.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{community.name}</h3>
                        <p className="text-sm text-gray-500">{community.member_count} members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {communities.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No communities yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "You haven't joined any communities yet." : "This user hasn't joined any communities yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/projects/${project.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Code className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{project.title}</h3>
                        <p className="text-sm text-gray-500">{project.status}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {projects.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "You haven't joined any projects yet." : "This user hasn't joined any projects yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/events/${event.id}`)}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.start_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {events.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                  <p className="text-gray-500">
                    {isOwnProfile ? "You haven't attended any events yet." : "This user hasn't attended any events yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;

