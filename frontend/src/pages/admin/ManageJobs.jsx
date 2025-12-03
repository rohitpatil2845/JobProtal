import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, inactive

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/admin/jobs');
      let filteredJobs = response.data;
      
      if (filter === 'active') {
        filteredJobs = filteredJobs.filter(job => job.status === 'active');
      } else if (filter === 'inactive') {
        filteredJobs = filteredJobs.filter(job => job.status === 'inactive');
      }
      
      setJobs(filteredJobs);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await api.patch(`/jobs/${jobId}/status`, { status: newStatus });
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
      console.error(error);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
      console.error(error);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Jobs</h1>
          <p className="text-gray-600">View and manage all your job postings</p>
        </div>
        <Link to="/admin/jobs/create" className="flex items-center space-x-2 btn-primary">
          <FiPlus />
          <span>Create New Job</span>
        </Link>
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
          All Jobs ({jobs.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`pb-2 px-4 ${
            filter === 'active'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`pb-2 px-4 ${
            filter === 'inactive'
              ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Jobs Table */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 mb-4">No jobs found</p>
          <Link to="/admin/jobs/create" className="btn-primary inline-block">
            Create Your First Job
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.job_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.city}, {job.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {job.applicationsCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/jobs/${job.job_id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Job"
                        >
                          <FiEye size={18} />
                        </Link>
                        <button
                          onClick={() => toast.info('Edit feature coming soon!')}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Job"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job.job_id, job.status)}
                          className={`${
                            job.status === 'active'
                              ? 'text-orange-600 hover:text-orange-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={job.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {job.status === 'active' ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                        <button
                          onClick={() => handleDelete(job.job_id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Job"
                        >
                          <FiTrash2 size={18} />
                        </button>
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

export default ManageJobs;
