const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-300 rounded-lg shimmer"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 shimmer mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 shimmer"></div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 bg-gray-300 rounded shimmer"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6 shimmer"></div>
        </div>
        <div className="mt-4 flex space-x-2">
          <div className="h-6 w-20 bg-gray-300 rounded shimmer"></div>
          <div className="h-6 w-24 bg-gray-300 rounded shimmer"></div>
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 shimmer mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2 shimmer"></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
