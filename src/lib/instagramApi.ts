import { toast } from 'react-toastify';
import { Post, MetricsData } from './data';

// Define the Instagram API response types
export interface InstagramApiResponse {
  sections: Section[];
  more_available: boolean;
  next_max_id: string;
  next_page: number;
  next_media_ids: string[];
  auto_load_more_enabled: boolean;
  status: string;
}

export interface Section {
  layout_type: string;
  feed_type: string;
  explore_item_info?: {
    num_columns: number;
    total_num_columns: number;
    aspect_ratio: number;
    autoplay: boolean;
  };
  layout_content: {
    medias: MediaItem[];
  };
}

export interface MediaItem {
  media: {
    pk: string;
    id: string;
    code: string;
    image_versions2: {
      candidates: Array<{
        width: number;
        height: number;
        url: string;
      }>;
    };
    comment_count: number;
    like_count: number;
    play_count?: number;
    reshare_count?: number;
    user?: {
      pk?: string;
      pk_id?: string;
      id?: string;
      username?: string;
      full_name?: string;
      is_private?: boolean;
      is_verified?: boolean;
      profile_pic_url?: string;
    };
    caption?: {
      user?: {
        username?: string;
        full_name?: string;
        profile_pic_url?: string;
      };
    };
  };
}

// Function to fetch Instagram data by hashtag
export const fetchInstagramData = async (hashtag: string): Promise<InstagramApiResponse | null> => {
  try {
    // Build the URL with query parameters
    const url = `https://instagram-realtimeapi.p.rapidapi.com/instagram/hashtags/${hashtag}/sections?rank_token=b&tab=top`;
    
    // Make the API request
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'instagram-realtimeapi.p.rapidapi.com',
        'x-rapidapi-key': '5a7b4ede34msh348850c8fe4f302p194c61jsn45d9d9f488da'
      }
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    // Parse the response data
    const data: InstagramApiResponse = await response.json();
    return data;
  } catch (error) {
    // Show error toast notification
    toast.error(`Failed to fetch Instagram data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('Error fetching Instagram data:', error);
    return null;
  }
};

// Function to convert Instagram API response to our app's Post format
export const convertToAppPosts = (data: InstagramApiResponse | null): Post[] => {
  if (!data || !data.sections) {
    return [];
  }
  
  const posts: Post[] = [];
  
  data.sections.forEach(section => {
    if (section.layout_content && section.layout_content.medias) {
      section.layout_content.medias.forEach(mediaItem => {
        if (mediaItem.media) {
          // Extract username from the appropriate location in the response
          // Try multiple possible locations where the username might be stored
          const username = 
            mediaItem.media.user?.username || 
            mediaItem.media.caption?.user?.username || 
            'Unknown';
          
          // Get engagement metrics (use 0 as default for missing values)
          const likes = mediaItem.media.like_count || 0;
          const comments = mediaItem.media.comment_count || 0;
          const plays = mediaItem.media.play_count || 0;
          const reshares = mediaItem.media.reshare_count || 0;
          
          // Calculate total engagements
          const totalEngagements = likes + comments + plays + reshares;
          
          // Calculate estimated reach and impressions using the formula
          // Instagram engagement rate: 0.50% (0.005)
          const instagramER = 0.005;
          const estimatedReach = Math.round(totalEngagements / instagramER);
          const estimatedImpressions = Math.round(estimatedReach * 1.6);
          
          const post: Post = {
            id: mediaItem.media.id,
            pk: mediaItem.media.pk,
            username: username,
            title: `Post ${mediaItem.media.code}`,
            imageUrl: mediaItem.media.image_versions2?.candidates?.[0]?.url || '',
            impressions: estimatedImpressions,
            reach: estimatedReach,
            likes: likes,
            comments: comments,
            reshares: reshares, // Using reshares instead of saves
            code: mediaItem.media.code // Add code for creating Instagram post URL
          };
          
          posts.push(post);
        }
      });
    }
  });
  
  return posts;
};

// Function to calculate metrics data from the Instagram API response
export const calculateMetricsData = (data: InstagramApiResponse | null): MetricsData => {
  if (!data || !data.sections) {
    return {
      totalImpressions: 0,
      totalReach: 0,
      totalLikes: 0,
      totalComments: 0,
      totalReshares: 0,
      posts: []
    };
  }
  
  const posts = convertToAppPosts(data);
  
  // Calculate totals
  let totalImpressions = 0;
  let totalReach = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalReshares = 0;
  
  posts.forEach(post => {
    totalImpressions += post.impressions;
    totalReach += post.reach;
    totalLikes += post.likes;
    totalComments += post.comments;
    totalReshares += post.reshares;
  });
  
  return {
    totalImpressions,
    totalReach,
    totalLikes,
    totalComments,
    totalReshares,
    posts
  };
};

// Function to search posts by hashtag
export const searchInstagramByHashtag = async (hashtag: string): Promise<Post[]> => {
  const data = await fetchInstagramData(hashtag);
  return convertToAppPosts(data);
};
