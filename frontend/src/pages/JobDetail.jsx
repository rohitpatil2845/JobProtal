import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMapPin, FiBriefcase, FiDollarSign, FiClock, FiHeart, FiUpload } from 'react-icons/fi';

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null
  });
  const [matchScore, setMatchScore] = useState(null);

  useEffect(() => {
    fetchJob();
    if (isAuthenticated && user.role === 'user') {
      fetchMatchScore();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to fetch job details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchScore = async () => {
    try {
      const response = await api.post('/ai/match-score', { job_id: id });
      setMatchScore(response.data.matchScore);
    } catch (error) {
      console.error('Match score error:', error);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('coverLetter', applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
      }

      await api.post('/applications/apply', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Application submitted successfully!');
      setShowApplicationForm(false);
      setApplicationData({ coverLetter: '', resume: null });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSaveJob = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/login');
      return;
    }

    try {
      await api.post('/saved-jobs', { job_id: id });
      toast.success('Job saved successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Job not found</h2>
      </div>
    );
  }

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryCurrency || '₹'} ${(job.salaryMin / 1000).toFixed(0)}K - ${(job.salaryMax / 1000).toFixed(0)}K`;
    }
    return 'Competitive';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-xl text-gray-700 font-medium">{job.company}</p>
          </div>
          {user && user.role !== 'admin' && (
            <button
              onClick={handleSaveJob}
              className="btn-outline flex items-center space-x-2"
            >
              <FiHeart />
              <span>Save Job</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-primary-600" />
            <span>{job.city}, {job.country}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiBriefcase className="text-primary-600" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiDollarSign className="text-primary-600" />
            <span>{formatSalary()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="text-primary-600" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-full font-medium">
            {job.jobType}
          </span>
          {job.category && (
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full">
              {job.category}
            </span>
          )}
          {job.applicationCount > 0 && (
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full">
              {job.applicationCount} applicants
            </span>
          )}
        </div>

        {matchScore !== null && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Your Match Score</p>
                <p className="text-sm text-gray-600">Based on your skills and experience</p>
              </div>
              <div className="text-3xl font-bold text-primary-600">{matchScore}%</div>
            </div>
          </div>
        )}

        {user && user.role !== 'admin' && !showApplicationForm && (
          <button
            onClick={() => setShowApplicationForm(true)}
            className="w-full btn-primary py-3 text-lg font-semibold"
          >
            Apply Now
          </button>
        )}
      </div>

      {/* Application Form */}
      {showApplicationForm && (
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Submit Your Application</h2>
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="label">Cover Letter</label>
              <textarea
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                rows="6"
                className="input"
                placeholder="Tell us why you're a great fit for this role..."
              ></textarea>
            </div>

            <div>
              <label className="label">Upload Resume (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setApplicationData({ ...applicationData, resume: e.target.files[0] })}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload" className="cursor-pointer text-primary-600 hover:text-primary-700">
                  {applicationData.resume ? applicationData.resume.name : 'Click to upload or drag and drop'}
                </label>
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={applying}
                className="flex-1 btn-primary py-3 disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                type="button"
                onClick={() => setShowApplicationForm(false)}
                className="px-6 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Job Details */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Job Description</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {job.description}
          </div>
        </div>

        {job.requirements && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">
              {job.requirements}
            </div>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
