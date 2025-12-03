import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiDownload, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications from /admin/applications...');
      const response = await api.get('/admin/applications');
      console.log('Applications response:', response.data);
      let filteredApps = response.data;
      
      if (filter !== 'all') {
        filteredApps = filteredApps.filter(app => app.status === filter);
      }
      
      setApplications(filteredApps);
      console.log('Set applications:', filteredApps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      console.log('Updating application:', applicationId, 'to status:', newStatus);
      const response = await api.patch(`/admin/applications/${applicationId}/status`, { status: newStatus });
      console.log('Update response:', response.data);
      toast.success(`Application ${newStatus} successfully`);
      fetchApplications();
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications</h1>
        <p className="text-gray-600">Review and manage job applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-4 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`pb-2 px-4 ${
            filter === 'all'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({applications.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`pb-2 px-4 ${
            filter === 'pending'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('reviewed')}
          className={`pb-2 px-4 ${
            filter === 'reviewed'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Reviewed
        </button>
        <button
          onClick={() => setFilter('accepted')}
          className={`pb-2 px-4 ${
            filter === 'accepted'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Accepted
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`pb-2 px-4 ${
            filter === 'rejected'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600">No applications found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.applicant?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.applicant?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{application.job?.title || 'Unknown Job'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-primary-600">
                        {application.matchScore ? `${Math.round(application.matchScore)}%` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {application.resumeUrl && (
                          <a
                            href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${application.resumeUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900"
                            title="View Resume"
                          >
                            <FiEye size={18} />
                          </a>
                        )}
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'reviewed')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark as Reviewed"
                            >
                              <FiClock size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              className="text-green-600 hover:text-green-900"
                              title="Accept Application"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Application"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                        {application.status === 'reviewed' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'accepted')}
                              className="text-green-600 hover:text-green-900"
                              title="Accept Application"
                            >
                              <FiCheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Application"
                            >
                              <FiXCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
