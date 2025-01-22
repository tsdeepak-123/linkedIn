// components/PostsList.tsx
import React from 'react';

interface Post {
  id: string;
  text: string;
  created: string;
  author: {
    name: string;
  };
}

interface PostsListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const PostsList = ({ posts, loading, error }: PostsListProps) => {
  if (loading) return <div className="text-center py-4">Loading posts...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;
  if (!posts.length) return <div className="text-gray-600 py-4">No posts found</div>;

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="font-medium text-gray-900">{post.author.name}</div>
            <div className="text-sm text-gray-500">
              {new Date(post.created).toLocaleDateString()}
            </div>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{post.text}</p>
        </div>
      ))}
    </div>
  );
};

export default PostsList;