import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Video, ExternalLink, Settings, ArrowLeft, User, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TutorialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorialDetails();
  }, [id]);

  const fetchTutorialDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/tutorials/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setTutorial(data);
      } else {
        console.error('Failed to fetch tutorial details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tutorial details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tutorial not found</h2>
            <Button onClick={() => navigate('/tutorials')}>
              Back to Tutorials
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tags = tutorial.tags ? JSON.parse(tutorial.tags) : [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/tutorials')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutorials
        </Button>

        {/* Tutorial Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {tutorial.image_url ? (
                  <img
                    src={tutorial.image_url}
                    alt={tutorial.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <BookOpen className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{tutorial.title}</CardTitle>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getDifficultyColor(tutorial.difficulty)}>
                        {tutorial.difficulty}
                      </Badge>
                      {tutorial.category && (
                        <Badge variant="outline">{tutorial.category}</Badge>
                      )}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {tutorial.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {tutorial.duration}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Created {formatDate(tutorial.created_at)}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Tutorial by community member
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {tutorial.video_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tutorial.video_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Video className="h-4 w-4" />
                        Watch Video
                      </Button>
                    )}
                    {tutorial.external_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(tutorial.external_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        External Link
                      </Button>
                    )}
                    {user && tutorial.created_by === user.id && (
                      <Button variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {tutorial.description && (
              <CardDescription className="mt-4 text-base">
                {tutorial.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Tags */}
        {tags.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tutorial Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Tutorial Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {tutorial.content ? (
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {tutorial.content}
                </div>
              ) : (
                <p className="text-gray-500 italic">No content available for this tutorial.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        {(tutorial.video_url || tutorial.external_url) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tutorial.video_url && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-medium">Video Tutorial</h3>
                        <p className="text-sm text-gray-500">Watch the video version of this tutorial</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(tutorial.video_url, '_blank')}
                    >
                      Watch
                    </Button>
                  </div>
                )}
                
                {tutorial.external_url && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <ExternalLink className="h-5 w-5 text-green-600" />
                      <div>
                        <h3 className="font-medium">External Resource</h3>
                        <p className="text-sm text-gray-500">Additional materials and resources</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(tutorial.external_url, '_blank')}
                    >
                      Visit
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tutorial Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tutorial Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Difficulty Level:</span>
                <div className="mt-1">
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                </div>
              </div>
              
              {tutorial.category && (
                <div>
                  <span className="font-medium text-gray-600">Category:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{tutorial.category}</Badge>
                  </div>
                </div>
              )}
              
              {tutorial.duration && (
                <div>
                  <span className="font-medium text-gray-600">Estimated Duration:</span>
                  <p className="mt-1">{tutorial.duration}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-600">Created:</span>
                <p className="mt-1">{formatDate(tutorial.created_at)}</p>
              </div>
              
              {tutorial.updated_at && tutorial.updated_at !== tutorial.created_at && (
                <div>
                  <span className="font-medium text-gray-600">Last Updated:</span>
                  <p className="mt-1">{formatDate(tutorial.updated_at)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TutorialDetail;

