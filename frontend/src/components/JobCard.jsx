import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiHeart } from 'react-icons/fi';
import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, onSave }) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }

    setSaving(true);
    try {
      await api.post('/saved-jobs', { job_id: job.job_id });
      toast.success('Job saved successfully!');
      if (onSave) onSave(job.job_id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryCurrency || '₹'} ${(job.salaryMin / 1000).toFixed(0)}K - ${(job.salaryMax / 1000).toFixed(0)}K`;
    }
    return 'Competitive';
  };

  const timeAgo = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now - posted) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <Link to={`/jobs/${job.job_id}`}>
      <div className="card hover:border-primary-300 border border-transparent cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 hover:text-primary-600">
              {job.title}
            </h3>
            <p className="text-gray-600 font-medium">{job.company}</p>
          </div>
          
          {user && user.role !== 'admin' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiHeart size={22} className={saving ? 'animate-pulse' : ''} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <FiMapPin className="text-primary-600" />
            <span>{job.city}, {job.country || 'India'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiBriefcase className="text-primary-600" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiDollarSign className="text-primary-600" />
            <span>{formatSalary()}</span>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
            {job.jobType}
          </span>
          {job.category && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              {job.category}
            </span>
          )}
          {job.skills && job.skills.slice(0, 2).map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
              {skill}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FiClock size={14} />
            <span>{timeAgo(job.createdAt)}</span>
          </div>
          {job.applicationCount > 0 && (
            <span>{job.applicationCount} applicants</span>
          )}
        </div>

        {job.recommendationScore && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Match Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      job.recommendationScore >= 70
                        ? 'bg-green-500'
                        : job.recommendationScore >= 50
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${job.recommendationScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold">{job.recommendationScore}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
