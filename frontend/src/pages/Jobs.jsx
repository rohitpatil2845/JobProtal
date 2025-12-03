import { useState, useEffect } from 'react';
import api from '../utils/api';
import JobCard from '../components/JobCard';
import FilterBar from '../components/FilterBar';
import SkeletonLoader from '../components/SkeletonLoader';
import { toast } from 'react-toastify';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });

  const fetchJobs = async (filters = {}, page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...filters,
        page,
        limit: 12
      });

      // Remove empty values
      for (const [key, value] of [...params.entries()]) {
        if (!value) params.delete(key);
      }

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        totalJobs: response.data.totalJobs
      });
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Fetch jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleFilter = (filters) => {
    fetchJobs(filters, 1);
  };

  const handlePageChange = (page) => {
    fetchJobs({}, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600">
          Showing {pagination.totalJobs} jobs
        </p>
      </div>

      <FilterBar onFilter={handleFilter} loading={loading} />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 border rounded-lg ${
                        page === pagination.currentPage
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.currentPage - 2 ||
                  page === pagination.currentPage + 2
                ) {
                  return <span key={page} className="px-2 py-2">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Jobs;
