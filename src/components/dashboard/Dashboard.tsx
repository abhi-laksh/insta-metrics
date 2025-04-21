"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchBar from '../ui/SearchBar';
import MetricsSection from './MetricsSection';
import MetricsTable from './MetricsTable';
import { type Post } from '../../lib/data';
import { fetchInstagramData, calculateMetricsData, searchInstagramByHashtag } from '../../lib/instagramApi';

export default function Dashboard() {
  const [hashtag, setHashtag] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [metricsData, setMetricsData] = useState({
    totalImpressions: 0,
    totalReach: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSaves: 0,
    posts: [] as Post[]
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setHashtag(query);
    
    try {
      const data = await fetchInstagramData(query);
      if (data) {
        const metrics = calculateMetricsData(data);
        setMetricsData(metrics);
      } else {
        setMetricsData({
          totalImpressions: 0,
          totalReach: 0,
          totalLikes: 0,
          totalComments: 0,
          totalSaves: 0,
          posts: []
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching Instagram data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-6">Instagram Metrics Dashboard</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-8">
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {hashtag && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Results for #{hashtag}</h2>
            </div>
          )}
          
          <section>
            <h2 className="text-lg font-medium mb-4">Performance Overview</h2>
            <MetricsSection 
              metrics={{
                impressions: metricsData.totalImpressions,
                reach: metricsData.totalReach,
                likes: metricsData.totalLikes,
                comments: metricsData.totalComments,
                saves: metricsData.totalSaves
              }} 
            />
          </section>
          
          <section>
            <h2 className="text-lg font-medium mb-4">Post Performance</h2>
            <MetricsTable posts={metricsData.posts} />
          </section>
        </div>
      )}
    </div>
  );
}
