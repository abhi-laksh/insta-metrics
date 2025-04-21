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
            
          const post: Post = {
            id: mediaItem.media.id,
            pk: mediaItem.media.pk,
            username: username,
            title: `Post ${mediaItem.media.code}`,
            imageUrl: mediaItem.media.image_versions2?.candidates?.[0]?.url || '',
            impressions: 0, // Not available in the API
            reach: 0, // Not available in the API
            likes: mediaItem.media.like_count || 0,
            comments: mediaItem.media.comment_count || 0,
            saves: 0, // Not available in the API
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
      totalSaves: 0,
      posts: []
    };
  }
  
  const posts = convertToAppPosts(data);
  
  // Calculate totals
  let totalLikes = 0;
  let totalComments = 0;
  
  posts.forEach(post => {
    totalLikes += post.likes;
    totalComments += post.comments;
  });
  
  return {
    totalImpressions: 0, // Not available in the API
    totalReach: 0, // Not available in the API
    totalLikes,
    totalComments,
    totalSaves: 0, // Not available in the API
    posts
  };
};

// Function to search posts by hashtag
export const searchInstagramByHashtag = async (hashtag: string): Promise<Post[]> => {
  const data = await fetchInstagramData(hashtag);
  return convertToAppPosts(data);
};
