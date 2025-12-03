import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { FiSend, FiLoader } from 'react-icons/fi';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requirements: '',
    city: '',
    country: 'India',
    jobType: 'Full-time',
    experience: '',
    salaryMin: '',
    salaryMax: '',
    category: '',
    skills: '',
    status: 'active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateDescription = async () => {
    if (!formData.title || !formData.skills) {
      toast.error('Please enter job title and skills first');
      return;
    }

    setGeneratingDescription(true);
    try {
      const response = await api.post('/ai/generate-description', {
        title: formData.title,
        skills: formData.skills.split(',').map(s => s.trim()),
        experience: formData.experience,
        jobType: formData.jobType
      });

      setFormData({ ...formData, description: response.data.description });
      toast.success('Job description generated!');
    } catch (error) {
      toast.error('Failed to generate description');
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        salaryMin: parseFloat(formData.salaryMin) || null,
        salaryMax: parseFloat(formData.salaryMax) || null
      };

      await api.post('/jobs', jobData);
      toast.success('Job posted successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">Fill in the details to create a new job posting</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
        {/* Job Title */}
        <div>
          <label className="label">Job Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., Senior React Developer"
          />
        </div>

        {/* Company */}
        <div>
          <label className="label">Company Name *</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., Tech Corp"
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">City *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., Bangalore"
            />
          </div>
          <div>
            <label className="label">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="input"
            />
          </div>
        </div>

        {/* Job Type & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Job Type *</label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Night Shift">Night Shift</option>
            </select>
          </div>
          <div>
            <label className="label">Experience Required *</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
              className="input"
              placeholder="e.g., 2-5 years"
            />
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Minimum Salary (₹)</label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 500000"
            />
          </div>
          <div>
            <label className="label">Maximum Salary (₹)</label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              className="input"
              placeholder="e.g., 800000"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="label">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input"
            placeholder="e.g., IT, Marketing, Sales"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="label">Required Skills (comma-separated) *</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="input"
            placeholder="e.g., React, Node.js, MongoDB, AWS"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="label mb-0">Job Description *</label>
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDescription}
              className="btn-outline text-sm flex items-center space-x-2"
            >
              {generatingDescription ? (
                <>
                  <FiLoader className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiSend />
                  <span>AI Generate</span>
                </>
              )}
            </button>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="8"
            className="input"
            placeholder="Describe the role, responsibilities, and what makes this position exciting..."
          ></textarea>
        </div>

        {/* Requirements */}
        <div>
          <label className="label">Requirements</label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            rows="6"
            className="input"
            placeholder="List the qualifications, education, and other requirements..."
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label className="label">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input"
          >
            <option value="active">Active (Visible to candidates)</option>
            <option value="draft">Draft (Not visible)</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary py-3 disabled:opacity-50"
          >
            {loading ? 'Creating Job...' : 'Post Job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/jobs')}
            className="px-8 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;
