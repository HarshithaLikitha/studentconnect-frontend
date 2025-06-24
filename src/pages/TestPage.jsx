import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Code, Calendar, BookOpen, MessageSquare, User } from 'lucide-react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">StudentConnect Features Test</h1>
          <p className="text-gray-600 mt-2">Testing the new feature pages</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Communities Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Communities</CardTitle>
                  <Badge variant="secondary">New Feature</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Join communities based on your interests and connect with like-minded students.
              </CardDescription>
              <Button className="w-full mt-4">
                Explore Communities
              </Button>
            </CardContent>
          </Card>

          {/* Projects Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Projects</CardTitle>
                  <Badge variant="secondary">New Feature</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Work on exciting projects with students from around the world.
              </CardDescription>
              <Button className="w-full mt-4">
                Browse Projects
              </Button>
            </CardContent>
          </Card>

          {/* Events Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Events</CardTitle>
                  <Badge variant="secondary">New Feature</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Participate in events, hackathons, and workshops to enhance your skills.
              </CardDescription>
              <Button className="w-full mt-4">
                View Events
              </Button>
            </CardContent>
          </Card>

          {/* Tutorials Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tutorials</CardTitle>
                  <Badge variant="secondary">New Feature</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Access tutorials and learning materials curated by the community.
              </CardDescription>
              <Button className="w-full mt-4">
                Learn Now
              </Button>
            </CardContent>
          </Card>

          {/* Messages Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Badge variant="secondary">New Feature</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Connect and collaborate with instant messaging and communication tools.
              </CardDescription>
              <Button className="w-full mt-4">
                Start Chatting
              </Button>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Profile</CardTitle>
                  <Badge variant="secondary">Enhanced</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Showcase your skills and learn from others in the community.
              </CardDescription>
              <Button className="w-full mt-4">
                View Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">All Features Implemented!</CardTitle>
              <CardDescription>
                The StudentConnect application now includes all the requested social media features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <h4 className="font-medium mb-2">✅ Completed Features:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Communities with join/leave functionality</li>
                    <li>• Projects with collaboration features</li>
                    <li>• Events with registration system</li>
                  </ul>
                </div>
                <div className="text-left">
                  <h4 className="font-medium mb-2">✅ Also Included:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Tutorials with creation and viewing</li>
                    <li>• Messages with real-time chat</li>
                    <li>• Enhanced user profiles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestPage;

