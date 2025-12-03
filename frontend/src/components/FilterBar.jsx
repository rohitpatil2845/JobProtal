import { useState } from 'react';
import { FiSearch, FiMapPin, FiBriefcase, FiDollarSign } from 'react-icons/fi';

const FilterBar = ({ onFilter, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    jobType: '',
    experience: '',
    salaryMin: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      city: '',
      jobType: '',
      experience: '',
      salaryMin: '',
      category: ''
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-3">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search jobs, companies, keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* City */}
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Job Type */}
          <div className="relative">
            <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Night Shift">Night Shift</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <select
              name="experience"
              value={filters.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Experience Level</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          {/* Salary */}
          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="salaryMin"
              value={filters.salaryMin}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="">Min Salary</option>
              <option value="100000">₹1L+</option>
              <option value="300000">₹3L+</option>
              <option value="500000">₹5L+</option>
              <option value="800000">₹8L+</option>
              <option value="1000000">₹10L+</option>
              <option value="1500000">₹15L+</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleChange}
              placeholder="Category (e.g., IT, Marketing)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary px-6"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterBar;
