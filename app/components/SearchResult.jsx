// SearchResult.jsx
import { useState } from 'react';

const SearchResult = ({ result }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [showPosts, setShowPosts] = useState(false);

  const fetchPosts = async () => {
    if (!showPosts) {
      setShowPosts(true);
      setLoadingPosts(true);
      setPostsError(null);

      try {
        const response = await fetch('/api/linkedin/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ organizationId: result.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPostsError('Failed to load posts. Please try again.');
      } finally {
        setLoadingPosts(false);
      }
    } else {
      setShowPosts(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{result.name}</h3>
          {result.industry && (
            <p className="text-gray-600 text-sm mt-1">{result.industry}</p>
          )}
        </div>
        
          {/* href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          View Profile
        </a> */}
      </div>
      
      {result.description && (
        <p className="text-gray-700 mb-4">{result.description}</p>
      )}
      
      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        {result.location && (
          <span className="flex items-center">
            <span className="mr-1">📍</span> {result.location}
          </span>
        )}
        {result.size && (
          <span className="flex items-center">
            <span className="mr-1">👥</span> {result.size} employees
          </span>
        )}
      </div>

      <button
        onClick={fetchPosts}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        {showPosts ? 'Hide Posts' : 'Show Posts'}
      </button>

      {/* {showPosts && (
        <div className="mt-4">
          <PostsList
            posts={posts}
            loading={loadingPosts}
            error={postsError}
          />
        </div>
      )} */}
    </div>
  );
};

export default SearchResult;