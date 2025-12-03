import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiBriefcase, FiUsers, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
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

  const stats = dashboardData?.stats || {};
  const recentApplications = dashboardData?.recentApplications || [];
  const topJobs = dashboardData?.topJobs || [];
  const applicationsByStatus = dashboardData?.applicationsByStatus || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your jobs and track applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalJobs || 0}</p>
            </div>
            <div className="bg-primary-100 p-3 rounded-full">
              <FiBriefcase className="text-primary-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.activeJobs || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalApplications || 0}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiUsers className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.conversionRate || 0}%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiTrendingUp className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Applications by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Applications by Status</h3>
          <div className="space-y-3">
            {applicationsByStatus.map((item) => (
              <div key={item.status} className="flex justify-between items-center">
                <span className="capitalize text-gray-700">{item.status}</span>
                <span className="font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Jobs */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performing Jobs</h3>
          <div className="space-y-3">
            {topJobs.slice(0, 5).map((job) => (
              <Link
                key={job.job_id}
                to={`/admin/jobs/${job.job_id}/applications`}
                className="flex justify-between items-center hover:bg-gray-50 p-2 rounded"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 line-clamp-1">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <span className="ml-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {job.applicationCount} apps
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Applications</h3>
          <Link to="/admin/applications" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No applications yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Applicant</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Job</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{app.applicant.name}</p>
                        <p className="text-sm text-gray-600">{app.applicant.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-gray-900">{app.job.title}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/jobs/${app.job.job_id}/applications`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/jobs/create" className="bg-primary-600 text-white rounded-lg p-6 hover:bg-primary-700 transition-colors">
          <h3 className="text-xl font-bold mb-2">Post a New Job</h3>
          <p className="text-primary-100">Create and publish a new job posting</p>
        </Link>

        <Link to="/admin/jobs" className="bg-gray-800 text-white rounded-lg p-6 hover:bg-gray-900 transition-colors">
          <h3 className="text-xl font-bold mb-2">Manage Jobs</h3>
          <p className="text-gray-300">Edit or remove existing job postings</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
