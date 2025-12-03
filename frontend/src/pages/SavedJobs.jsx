import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await api.get('/saved-jobs');
      setSavedJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch saved jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      setSavedJobs(savedJobs.filter(item => item.job_id !== jobId));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error('Failed to remove job');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
          <FiHeart className="text-red-500" />
          <span>Saved Jobs</span>
        </h1>
        <p className="text-gray-600">Your bookmarked jobs ({savedJobs.length})</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiHeart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
          <p className="text-gray-600 mb-6">Start saving jobs to view them later</p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/jobs/${item.job.job_id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-1">
                      {item.job.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 font-medium mb-2">{item.job.company}</p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{item.job.description}</p>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {item.job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {item.job.city}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {item.job.experience}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(item.job_id)}
                  className="ml-4 text-red-500 hover:text-red-700 p-2"
                  title="Remove from saved"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Saved {new Date(item.savedAt).toLocaleDateString()}
                </span>
                <Link to={`/jobs/${item.job.job_id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
