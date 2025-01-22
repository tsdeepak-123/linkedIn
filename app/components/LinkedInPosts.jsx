import { useState, useEffect } from 'react';

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

  const PostSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border rounded-lg shadow-sm">
          {/* Date skeleton */}
          <div className="mb-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
          
          {/* Media skeleton */}
          <div className="mt-4 space-y-2">
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  if (loading || error || posts.length === 0) {
    return <PostSkeleton />;
  }

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
    </div>
  );
};

export default LinkedInPosts;