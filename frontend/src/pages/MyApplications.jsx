import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { FiFileText, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted':
      case 'hired':
        return <FiCheckCircle />;
      case 'rejected':
        return <FiXCircle />;
      default:
        return <FiClock />;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track all your job applications in one place</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FiFileText className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link to={`/jobs/${application.job.job_id}`}>
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 mb-1">
                      {application.job.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 font-medium mb-2">{application.job.company}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <FiCalendar />
                      <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                    </div>
                    {application.matchScore && (
                      <div>
                        <span className="font-medium">Match: {application.matchScore}%</span>
                      </div>
                    )}
                  </div>

                  {application.coverLetter && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-sm text-gray-700 line-clamp-3">{application.coverLetter}</p>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {getStatusIcon(application.status)}
                    <span className="capitalize">{application.status}</span>
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {application.resumeUrl && (
                    <a
                      href={`http://localhost:5000${application.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      View Resume →
                    </a>
                  )}
                </div>
                <Link to={`/jobs/${application.job.job_id}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View Job Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
