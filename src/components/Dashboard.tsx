"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInstagramData, calculateMetricsData } from '../lib/instagramApi';
import SearchBar from './ui/SearchBar';
import MetricsSection from './dashboard/MetricsSection';
import MetricsTable from './dashboard/MetricsTable';

const Dashboard: React.FC = () => {
  const [hashtag, setHashtag] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // React Query hook for fetching Instagram data
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['instagramData', hashtag],
    queryFn: () => fetchInstagramData(hashtag),
    enabled: hashtag !== '', // Only fetch when hashtag is provided
    refetchOnWindowFocus: false,
  });

  // Calculate metrics data from API response
  const metricsData = calculateMetricsData(data || null);

  // Handle search submission
  const handleSearch = (term: string) => {
    setHashtag(term);
    setSearchTerm(term);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Instagram Metrics Dashboard</h1>
      
      <SearchBar onSearch={handleSearch} />
      
      {isLoading ? (
        <div className="text-center py-8">Loading data...</div>
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading data. Please try again.
        </div>
      ) : (
        <>
          {searchTerm && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Results for #{searchTerm}</h2>
            </div>
          )}
          
          <MetricsSection 
            metrics={{
              impressions: metricsData.totalImpressions,
              reach: metricsData.totalReach,
              likes: metricsData.totalLikes,
              comments: metricsData.totalComments,
              saves: metricsData.totalSaves
            }}
          />
          
          <MetricsTable posts={metricsData.posts} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
