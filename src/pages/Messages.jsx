import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Messages = () => (
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

export default Messages;
