import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Search, Filter, Code, ExternalLink, Github, Play } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTech, setSelectedTech] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tech_stack: [],
    status: 'active',
    github_url: '',
    demo_url: '',
    image_url: '',
    looking_for: []
  });
  const [techInput, setTechInput] = useState('');
  const [lookingForInput, setLookingForInput] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' }
  ];

  const commonTechnologies = [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#',
    'Flutter', 'React Native', 'Vue.js', 'Angular', 'Django', 'Flask', 'Express',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'AWS', 'Docker', 'Kubernetes'
  ];

  useEffect(() => {
    fetchProjects();
  }, [currentPage, selectedStatus, selectedTech]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12'
      });
      
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }
      
      if (selectedTech) {
        params.append('tech', selectedTech);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProjects(data.projects);
        setTotalPages(data.pages);
      } else {
        console.error('Failed to fetch projects:', data.error);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const projectData = {
        ...newProject,
        tech_stack: newProject.tech_stack,
        looking_for: newProject.looking_for
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewProject({
          title: '',
          description: '',
          tech_stack: [],
          status: 'active',
          github_url: '',
          demo_url: '',
          image_url: '',
          looking_for: []
        });
        setTechInput('');
        setLookingForInput('');
        fetchProjects();
      } else {
        console.error('Failed to create project:', data.error);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !newProject.tech_stack.includes(techInput.trim())) {
      setNewProject({
        ...newProject,
        tech_stack: [...newProject.tech_stack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech) => {
    setNewProject({
      ...newProject,
      tech_stack: newProject.tech_stack.filter(t => t !== tech)
    });
  };

  const addLookingFor = () => {
    if (lookingForInput.trim() && !newProject.looking_for.includes(lookingForInput.trim())) {
      setNewProject({
        ...newProject,
        looking_for: [...newProject.looking_for, lookingForInput.trim()]
      });
      setLookingForInput('');
    }
  };

  const removeLookingFor = (role) => {
    setNewProject({
      ...newProject,
      looking_for: newProject.looking_for.filter(r => r !== role)
    });
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-2">Discover and collaborate on exciting projects</p>
            </div>
            
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Share your project idea and find collaborators.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input
                        id="title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        placeholder="Enter project title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        placeholder="Describe your project"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={newProject.status} onValueChange={(value) => setNewProject({...newProject, status: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Technologies</Label>
                      <div className="flex gap-2">
                        <Input
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          placeholder="Add technology"
                          onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                        />
                        <Button type="button" onClick={addTechnology} size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.tech_stack.map((tech) => (
                          <Badge key={tech} variant="secondary" className="cursor-pointer" onClick={() => removeTechnology(tech)}>
                            {tech} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Looking For</Label>
                      <div className="flex gap-2">
                        <Input
                          value={lookingForInput}
                          onChange={(e) => setLookingForInput(e.target.value)}
                          placeholder="e.g., Frontend Developer, Designer"
                          onKeyPress={(e) => e.key === 'Enter' && addLookingFor()}
                        />
                        <Button type="button" onClick={addLookingFor} size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newProject.looking_for.map((role) => (
                          <Badge key={role} variant="outline" className="cursor-pointer" onClick={() => removeLookingFor(role)}>
                            {role} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="github_url">GitHub URL (optional)</Label>
                      <Input
                        id="github_url"
                        value={newProject.github_url}
                        onChange={(e) => setNewProject({...newProject, github_url: e.target.value})}
                        placeholder="https://github.com/username/repo"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="demo_url">Demo URL (optional)</Label>
                      <Input
                        id="demo_url"
                        value={newProject.demo_url}
                        onChange={(e) => setNewProject({...newProject, demo_url: e.target.value})}
                        placeholder="https://your-demo.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image_url">Image URL (optional)</Label>
                      <Input
                        id="image_url"
                        value={newProject.image_url}
                        onChange={(e) => setNewProject({...newProject, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateProject} disabled={!newProject.title}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTech} onValueChange={setSelectedTech}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Tech" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Tech</SelectItem>
                {commonTechnologies.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-600 rounded-t-lg flex items-center justify-center">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <Code className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{project.title}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3">
                      {project.description || 'No description available'}
                    </CardDescription>
                    
                    {/* Tech Stack */}
                    {project.tech_stack && JSON.parse(project.tech_stack).length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(project.tech_stack).slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {JSON.parse(project.tech_stack).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{JSON.parse(project.tech_stack).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Looking For */}
                    {project.looking_for && JSON.parse(project.looking_for).length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Looking for:</p>
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(project.looking_for).slice(0, 2).map((role) => (
                            <Badge key={role} variant="secondary" className="text-xs">
                              {role}
                            </Badge>
                          ))}
                          {JSON.parse(project.looking_for).length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{JSON.parse(project.looking_for).length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {project.member_count} member{project.member_count !== 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-2">
                        {project.github_url && (
                          <Github className="h-4 w-4" />
                        )}
                        {project.demo_url && (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedStatus || selectedTech
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a project!'}
            </p>
            {user && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create First Project
              </Button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;

