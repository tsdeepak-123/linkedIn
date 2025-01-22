
// components/LinkedInPosts.jsx
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LinkedInPosts = ({ accessToken }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/linkedin/posts');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.elements || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchPosts();
    }
  }, [accessToken]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="mb-2 text-sm text-gray-600">
            {new Date(post.created.time).toLocaleDateString()}
          </div>
          {post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text && (
            <p className="text-gray-800">
              {post.specificContent['com.linkedin.ugc.ShareContent'].shareCommentary.text}
            </p>
          )}
          {/* Handle different post types */}
          {post.specificContent?.['com.linkedin.ugc.ShareContent']?.media && (
            <div className="mt-2">
              {post.specificContent['com.linkedin.ugc.ShareContent'].media.map((media, index) => (
                <div key={index} className="mt-2">
                  {media.title && <p className="font-medium">{media.title.text}</p>}
                  {media.description && <p className="text-gray-600">{media.description.text}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No posts found
        </div>
      )}
    </div>
  );
};

export default LinkedInPosts;