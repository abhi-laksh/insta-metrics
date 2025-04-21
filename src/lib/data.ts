export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  code?: string; // Instagram post code for creating post URLs
}

export interface MetricsData {
  totalImpressions: number;
  totalReach: number;
  totalLikes: number;
  totalComments: number;
  totalSaves: number;
  posts: Post[];
}

export const mockData: MetricsData = {
  totalImpressions: 125780,
  totalReach: 98450,
  totalLikes: 15320,
  totalComments: 2845,
  totalSaves: 3210,
  posts: [
    {
      id: '1',
      title: 'Summer Collection Launch',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      impressions: 24580,
      reach: 19870,
      likes: 3240,
      comments: 542,
      saves: 678
    },
    {
      id: '2',
      title: 'Product Showcase',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      impressions: 18750,
      reach: 15320,
      likes: 2150,
      comments: 325,
      saves: 412
    },
    {
      id: '3',
      title: 'Customer Testimonial',
      imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      impressions: 15230,
      reach: 12450,
      likes: 1870,
      comments: 289,
      saves: 345
    },
    {
      id: '4',
      title: 'Behind the Scenes',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      impressions: 21450,
      reach: 17890,
      likes: 2560,
      comments: 478,
      saves: 532
    },
    {
      id: '5',
      title: 'New Product Teaser',
      imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      impressions: 28970,
      reach: 22450,
      likes: 3420,
      comments: 612,
      saves: 745
    }
  ]
};

export function getMetricsData(): MetricsData {
  return mockData;
}

export function searchPosts(query: string): Post[] {
  if (!query) return mockData.posts;
  
  const lowerQuery = query.toLowerCase();
  return mockData.posts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery)
  );
}
