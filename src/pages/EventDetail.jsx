import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const EventDetail = () => (
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

export default EventDetail;
