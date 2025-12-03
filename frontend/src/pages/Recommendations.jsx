import { useState, useEffect } from 'react';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import { toast } from 'react-toastify';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/ai/recommendations');
      setRecommendations(response.data.recommendations);
    } catch (error) {
      toast.error('Failed to fetch recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
              <FiTrendingUp className="text-primary-600" />
              <span>Recommended Jobs For You</span>
            </h1>
            <p className="text-gray-600">
              AI-powered job recommendations based on your skills and profile
            </p>
          </div>
          <button
            onClick={fetchRecommendations}
            className="btn-outline flex items-center space-x-2"
          >
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiTrendingUp className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
          <p className="text-gray-600 mb-6">
            Update your profile with skills to get personalized job recommendations
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
