import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Profile Page
export const Profile = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Communities Page
export const Communities = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Communities</CardTitle>
          <CardDescription>Discover and join communities</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Communities page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Community Detail Page
export const CommunityDetail = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Community Detail</CardTitle>
          <CardDescription>Community information and posts</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Community detail page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Projects Page
export const Projects = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Discover and collaborate on projects</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Projects page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Project Detail Page
export const ProjectDetail = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Detail</CardTitle>
          <CardDescription>Project information and collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Project detail page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Events Page
export const Events = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Discover and attend events</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Events page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Event Detail Page
export const EventDetail = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Detail</CardTitle>
          <CardDescription>Event information and registration</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Event detail page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Tutorials Page
export const Tutorials = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Tutorials</CardTitle>
          <CardDescription>Learn with community tutorials</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tutorials page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Tutorial Detail Page
export const TutorialDetail = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Tutorial Detail</CardTitle>
          <CardDescription>Tutorial content and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Tutorial detail page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Messages Page
export const Messages = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Chat with other students</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Messages page coming soon...</p>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Export all components as default exports for individual files
export default {
  Profile,
  Communities,
  CommunityDetail,
  Projects,
  ProjectDetail,
  Events,
  EventDetail,
  Tutorials,
  TutorialDetail,
  Messages
};

