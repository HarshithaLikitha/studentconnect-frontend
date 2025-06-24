import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Calendar, Github, ExternalLink, Settings, UserPlus, UserMinus, ArrowLeft, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetchProjectDetails();
    fetchProjectMembers();
  }, [id]);

  useEffect(() => {
    if (project && user && members.length > 0) {
      setIsMember(members.some(member => member.id === user.id));
    }
  }, [project, user, members]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setProject(data);
      } else {
        console.error('Failed to fetch project details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}/members`);
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data);
      } else {
        console.error('Failed to fetch project members:', data.error);
      }
    } catch (error) {
      console.error('Error fetching project members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsMember(true);
        fetchProjectMembers();
        fetchProjectDetails();
      } else {
        console.error('Failed to join project:', data.error);
      }
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  const handleLeaveProject = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsMember(false);
        fetchProjectMembers();
        fetchProjectDetails();
      } else {
        console.error('Failed to leave project:', data.error);
      }
    } catch (error) {
      console.error('Error leaving project:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
            <Button onClick={() => navigate('/projects')}>
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const techStack = project.tech_stack ? JSON.parse(project.tech_stack) : [];
  const lookingFor = project.looking_for ? JSON.parse(project.looking_for) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>

        {/* Project Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Code className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{project.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="h-4 w-4 mr-1" />
                      {project.member_count} member{project.member_count !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.github_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                      </Button>
                    )}
                    {project.demo_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(project.demo_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </Button>
                    )}
                    {user && (
                      <>
                        {isMember ? (
                          <Button
                            variant="outline"
                            onClick={handleLeaveProject}
                            className="flex items-center gap-2"
                          >
                            <UserMinus className="h-4 w-4" />
                            Leave
                          </Button>
                        ) : (
                          <Button
                            onClick={handleJoinProject}
                            className="flex items-center gap-2"
                          >
                            <UserPlus className="h-4 w-4" />
                            Join
                          </Button>
                        )}
                        {project.created_by === user.id && (
                          <Button variant="outline" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {project.description && (
              <CardDescription className="mt-4 text-base">
                {project.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Tech Stack */}
          {techStack.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tech Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Looking For */}
          {lookingFor.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {lookingFor.map((role) => (
                    <Badge key={role} variant="secondary">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {project.github_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(project.github_url, '_blank')}
                    className="w-full justify-start"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                )}
                {project.demo_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(project.demo_url, '_blank')}
                    className="w-full justify-start"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Demo
                  </Button>
                )}
                {!project.github_url && !project.demo_url && (
                  <p className="text-sm text-gray-500">No links available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>
                  
                  {techStack.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <Badge key={tech} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {lookingFor.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Looking for Collaborators</h3>
                      <div className="flex flex-wrap gap-2">
                        {lookingFor.map((role) => (
                          <Badge key={role} variant="secondary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Interested in joining? Click the "Join" button to become a collaborator!
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Project Status</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>
                          {member.first_name?.[0]}{member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {member.first_name} {member.last_name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">@{member.username}</p>
                        {member.college && (
                          <p className="text-xs text-gray-400 truncate">{member.college}</p>
                        )}
                        {member.id === project.created_by && (
                          <Badge variant="outline" className="text-xs mt-1">
                            Creator
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {members.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                  <p className="text-gray-500">
                    Be the first to join this project and start collaborating!
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

export default ProjectDetail;

