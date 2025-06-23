import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Events = () => (
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

export default Events;
