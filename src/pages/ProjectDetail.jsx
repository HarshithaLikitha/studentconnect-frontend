import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectDetail = () => (
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

export default ProjectDetail;
