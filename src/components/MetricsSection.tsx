"use client";

import React from 'react';
import MetricCard from './MetricCard';

interface MetricsSectionProps {
  totalLikes: number;
  totalComments: number;
  totalPosts: number;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({ 
  totalLikes, 
  totalComments, 
  totalPosts 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard 
        title="Total Posts" 
        value={totalPosts} 
        icon="📊" 
      />
      <MetricCard 
        title="Total Likes" 
        value={totalLikes} 
        icon="❤️" 
      />
      <MetricCard 
        title="Total Comments" 
        value={totalComments} 
        icon="💬" 
      />
    </div>
  );
};

export default MetricsSection;
