"use client";

import React from 'react';

interface MediaItem {
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
  };
}

interface MetricsTableProps {
  mediaItems: MediaItem[];
}

const MetricsTable: React.FC<MetricsTableProps> = ({ mediaItems }) => {
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No data found. Try searching for a different hashtag.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Likes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comments
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mediaItems.map((item) => {
              const imageUrl = item.media.image_versions2?.candidates?.[0]?.url || '';
              const postUrl = `https://www.instagram.com/p/${item.media.code}/`;
              const likeCount = item.media.like_count;
              const commentCount = item.media.comment_count;

              return (
                <tr key={item.media.pk}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-20 w-20">
                        {imageUrl ? (
                          <img className="h-20 w-20 object-cover rounded" src={imageUrl} alt="Post" />
                        ) : (
                          <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <a 
                          href={postUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          See Post
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{likeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{commentCount}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsTable;
