import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Users, Calendar, MessageSquare, Settings, UserPlus, UserMinus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CommunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [community, setCommunity] = useState(null);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchCommunityDetails();
    fetchCommunityMembers();
    fetchCommunityPosts();
  }, [id]);

  useEffect(() => {
    if (community && user && members.length > 0) {
      setIsMember(members.some(member => member.id === user.id));
    }
  }, [community, user, members]);

  const fetchCommunityDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/communities/${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setCommunity(data);
      } else {
        console.error('Failed to fetch community details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };

  const fetchCommunityMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/communities/${id}/members`);
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data);
      } else {
        console.error('Failed to fetch community members:', data.error);
      }
    } catch (error) {
      console.error('Error fetching community members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommunityPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts?community_id=${id}`);
      const data = await response.json();
      
      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch community posts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    }
  };

  const handleJoinCommunity = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/communities/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsMember(true);
        fetchCommunityMembers();
        fetchCommunityDetails();
      } else {
        console.error('Failed to join community:', data.error);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  const handleLeaveCommunity = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/communities/${id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsMember(false);
        fetchCommunityMembers();
        fetchCommunityDetails();
      } else {
        console.error('Failed to leave community:', data.error);
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!token || !newPost.trim()) return;

    try {
      setIsPosting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPost,
          community_id: parseInt(id)
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setNewPost('');
        fetchCommunityPosts();
      } else {
        console.error('Failed to create post:', data.error);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
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

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community not found</h2>
            <Button onClick={() => navigate('/communities')}>
              Back to Communities
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/communities')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Button>

        {/* Community Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                {community.image_url ? (
                  <img
                    src={community.image_url}
                    alt={community.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Users className="h-12 w-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{community.name}</CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      {community.category && (
                        <Badge variant="outline">{community.category}</Badge>
                      )}
                      {community.is_private && (
                        <Badge variant="secondary">Private</Badge>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Users className="h-4 w-4 mr-1" />
                      {community.member_count} member{community.member_count !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(community.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user && (
                      <>
                        {isMember ? (
                          <Button
                            variant="outline"
                            onClick={handleLeaveCommunity}
                            className="flex items-center gap-2"
                          >
                            <UserMinus className="h-4 w-4" />
                            Leave
                          </Button>
                        ) : (
                          <Button
                            onClick={handleJoinCommunity}
                            className="flex items-center gap-2"
                          >
                            <UserPlus className="h-4 w-4" />
                            Join
                          </Button>
                        )}
                        {community.created_by === user.id && (
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
            {community.description && (
              <CardDescription className="mt-4 text-base">
                {community.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Create Post */}
            {user && isMember && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share with the community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What's on your mind?"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim() || isPosting}
                      >
                        {isPosting ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={post.author?.avatar_url} />
                          <AvatarFallback>
                            {post.author?.first_name?.[0]}{post.author?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {post.author?.first_name} {post.author?.last_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {post.title && (
                            <h3 className="font-medium mt-1">{post.title}</h3>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt="Post image"
                          className="mt-3 rounded-lg max-w-full h-auto"
                        />
                      )}
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments_count || 0} comments
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                    <p className="text-gray-500">
                      {isMember ? 'Be the first to share something with the community!' : 'Join the community to see posts and participate in discussions.'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityDetail;

