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
import { BookOpen, Plus, Search, Filter, Clock, Video, ExternalLink, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTutorial, setNewTutorial] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    difficulty: 'beginner',
    duration: '',
    tags: [],
    video_url: '',
    external_url: '',
    image_url: ''
  });
  const [tagInput, setTagInput] = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const categories = [
    'Programming',
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'DevOps',
    'Cybersecurity',
    'Database',
    'Cloud Computing'
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    fetchTutorials();
  }, [currentPage, selectedCategory, selectedDifficulty]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: '12'
      });
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (selectedDifficulty) {
        params.append('difficulty', selectedDifficulty);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tutorials?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTutorials(data.tutorials);
        setTotalPages(data.pages);
      } else {
        console.error('Failed to fetch tutorials:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTutorial = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const tutorialData = {
        ...newTutorial,
        tags: newTutorial.tags
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tutorials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tutorialData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsCreateDialogOpen(false);
        setNewTutorial({
          title: '',
          description: '',
          content: '',
          category: '',
          difficulty: 'beginner',
          duration: '',
          tags: [],
          video_url: '',
          external_url: '',
          image_url: ''
        });
        setTagInput('');
        fetchTutorials();
      } else {
        console.error('Failed to create tutorial:', data.error);
      }
    } catch (error) {
      console.error('Error creating tutorial:', error);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !newTutorial.tags.includes(tagInput.trim())) {
      setNewTutorial({
        ...newTutorial,
        tags: [...newTutorial.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setNewTutorial({
      ...newTutorial,
      tags: newTutorial.tags.filter(t => t !== tag)
    });
  };

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
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
              <h1 className="text-3xl font-bold text-gray-900">Tutorials</h1>
              <p className="text-gray-600 mt-2">Learn new skills with community-created tutorials</p>
            </div>
            
            {user && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Tutorial
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Tutorial</DialogTitle>
                    <DialogDescription>
                      Share your knowledge with the community by creating a tutorial.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Tutorial Title</Label>
                      <Input
                        id="title"
                        value={newTutorial.title}
                        onChange={(e) => setNewTutorial({...newTutorial, title: e.target.value})}
                        placeholder="Enter tutorial title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTutorial.description}
                        onChange={(e) => setNewTutorial({...newTutorial, description: e.target.value})}
                        placeholder="Brief description of what this tutorial covers"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={newTutorial.content}
                        onChange={(e) => setNewTutorial({...newTutorial, content: e.target.value})}
                        placeholder="Write your tutorial content here..."
                        rows={6}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={newTutorial.category} onValueChange={(value) => setNewTutorial({...newTutorial, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select value={newTutorial.difficulty} onValueChange={(value) => setNewTutorial({...newTutorial, difficulty: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                          <SelectContent>
                            {difficulties.map((difficulty) => (
                              <SelectItem key={difficulty.value} value={difficulty.value}>
                                {difficulty.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration (optional)</Label>
                      <Input
                        id="duration"
                        value={newTutorial.duration}
                        onChange={(e) => setNewTutorial({...newTutorial, duration: e.target.value})}
                        placeholder="e.g., 30 minutes, 2 hours"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Add tag"
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button type="button" onClick={addTag} size="sm">Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTutorial.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="video_url">Video URL (optional)</Label>
                      <Input
                        id="video_url"
                        value={newTutorial.video_url}
                        onChange={(e) => setNewTutorial({...newTutorial, video_url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="external_url">External URL (optional)</Label>
                      <Input
                        id="external_url"
                        value={newTutorial.external_url}
                        onChange={(e) => setNewTutorial({...newTutorial, external_url: e.target.value})}
                        placeholder="https://example.com/tutorial"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image_url">Image URL (optional)</Label>
                      <Input
                        id="image_url"
                        value={newTutorial.image_url}
                        onChange={(e) => setNewTutorial({...newTutorial, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleCreateTutorial} disabled={!newTutorial.title}>
                      Create Tutorial
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
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tutorials Grid */}
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
            {filteredTutorials.map((tutorial) => (
              <Link key={tutorial.id} to={`/tutorials/${tutorial.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    {tutorial.image_url ? (
                      <img
                        src={tutorial.image_url}
                        alt={tutorial.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-white" />
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{tutorial.title}</CardTitle>
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    {tutorial.category && (
                      <Badge variant="outline" className="w-fit text-xs">
                        {tutorial.category}
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-3">
                      {tutorial.description || 'No description available'}
                    </CardDescription>
                    
                    {/* Tags */}
                    {tutorial.tags && JSON.parse(tutorial.tags).length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {JSON.parse(tutorial.tags).slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {JSON.parse(tutorial.tags).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{JSON.parse(tutorial.tags).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {tutorial.duration && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {tutorial.duration}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {tutorial.video_url && (
                          <Video className="h-4 w-4" />
                        )}
                        {tutorial.external_url && (
                          <ExternalLink className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-400 mt-2">
                      <User className="h-3 w-3 mr-1" />
                      Created {new Date(tutorial.created_at).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory || selectedDifficulty
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a tutorial!'}
            </p>
            {user && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create First Tutorial
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

export default Tutorials;

