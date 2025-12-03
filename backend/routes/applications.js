const express = require('express');
const router = express.Router();
const { Application, Job, User } = require('../models');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/applications/apply
// @desc    Apply for a job
// @access  Private
router.post('/apply', [auth, upload.single('resume')], async (req, res) => {
  try {
    const { job_id, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: { job_id, user_id: req.userId }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    const application = await Application.create({
      job_id,
      user_id: req.userId,
      resumeUrl,
      coverLetter,
      status: 'pending'
    });

    // Update application count
    await job.increment('applicationCount');

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply job error:', error);
    res.status(500).json({ message: 'Server error applying for job' });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get user's applications
// @access  Private
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { user_id: req.userId },
      order: [['appliedAt', 'DESC']],
      include: [{
        model: Job,
        as: 'job',
        include: [{
          model: User,
          as: 'poster',
          attributes: ['name', 'email']
        }]
      }]
    });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job (Admin only)
// @access  Private/Admin
router.get('/job/:jobId', [auth], async (req, res) => {
  try {
    // Verify job belongs to this admin
    const job = await Job.findOne({
      where: { 
        job_id: req.params.jobId,
        postedBy: req.userId 
      }
    });

    if (!job && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await Application.findAll({
      where: { job_id: req.params.jobId },
      order: [['appliedAt', 'DESC']],
      include: [{
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email', 'phone', 'skills']
      }]
    });

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/applications/:id/status
// @desc    Update application status (Admin only)
// @access  Private/Admin
router.put('/:id/status', [auth], async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{
        model: Job,
        as: 'job'
      }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if admin owns the job
    if (application.job.postedBy !== req.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await application.update({ status });

    res.json({
      message: 'Application status updated',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
