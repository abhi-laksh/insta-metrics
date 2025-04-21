"use client";

interface Post {
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

interface MetricsTableProps {
  posts: Post[];
}

export default function MetricsTable({ posts }: MetricsTableProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow text-center">
        <p className="text-gray-500 dark:text-gray-400">No data found. Try searching for a different hashtag.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impressions</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reach</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Likes</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comments</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Saves</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img className="h-10 w-10 rounded-md object-cover" src={post.imageUrl} alt={post.title} />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{post.title}</div>
                    {post.code && (
                      <a 
                        href={`https://www.instagram.com/p/${post.code}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        See Post
                      </a>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{post.impressions.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{post.reach.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{post.likes.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{post.comments.toLocaleString()}</td>
              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{post.saves.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
