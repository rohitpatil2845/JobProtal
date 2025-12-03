const express = require('express');
const router = express.Router();
const { Job, Application, User } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');
const { sequelize } = require('../config/database');

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard analytics
// @access  Private/Admin
router.get('/dashboard', [auth, isAdmin], async (req, res) => {
  try {
    // Total jobs posted by this admin
    const totalJobs = await Job.count({
      where: { postedBy: req.userId }
    });

    // Total applications received
    const totalApplications = await Application.count({
      include: [{
        model: Job,
        as: 'job',
        where: { postedBy: req.userId },
        attributes: []
      }]
    });

    // Active jobs
    const activeJobs = await Job.count({
      where: { 
        postedBy: req.userId,
        status: 'active'
      }
    });

    // Applications by status
    const applicationsByStatus = await Application.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      include: [{
        model: Job,
        as: 'job',
        where: { postedBy: req.userId },
        attributes: []
      }],
      group: ['status']
    });

    // Recent applications
    const recentApplications = await Application.findAll({
      limit: 10,
      order: [['appliedAt', 'DESC']],
      include: [
        {
          model: Job,
          as: 'job',
          where: { postedBy: req.userId }
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    // Top performing jobs
    const topJobs = await Job.findAll({
      where: { postedBy: req.userId },
      order: [['applicationCount', 'DESC']],
      limit: 5,
      attributes: ['job_id', 'title', 'company', 'applicationCount', 'createdAt']
    });

    // Conversion rate (hired / total applications)
    const hiredCount = await Application.count({
      where: { status: 'hired' },
      include: [{
        model: Job,
        as: 'job',
        where: { postedBy: req.userId },
        attributes: []
      }]
    });

    const conversionRate = totalApplications > 0 
      ? ((hiredCount / totalApplications) * 100).toFixed(2) 
      : 0;

    res.json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        hiredCount,
        conversionRate: parseFloat(conversionRate)
      },
      applicationsByStatus,
      recentApplications,
      topJobs
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private/Admin
router.get('/analytics', [auth, isAdmin], async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.createdAt = { [sequelize.Op.gte]: new Date(startDate) };
    if (endDate) dateFilter.createdAt = { ...dateFilter.createdAt, [sequelize.Op.lte]: new Date(endDate) };

    // Jobs posted over time
    const jobsOverTime = await Job.findAll({
      where: { 
        postedBy: req.userId,
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('job_id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      jobsOverTime
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all jobs posted by admin
// @access  Private/Admin
router.get('/jobs', [auth, isAdmin], async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { postedBy: req.userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Application,
        as: 'applications',
        attributes: ['id']
      }]
    });
    
    // Add applications count manually
    const jobsWithCount = jobs.map(job => {
      const jobData = job.toJSON();
      jobData.applicationsCount = jobData.applications ? jobData.applications.length : 0;
      delete jobData.applications;
      return jobData;
    });
    
    res.json(jobsWithCount);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications for admin's jobs
// @access  Private/Admin
router.get('/applications', [auth, isAdmin], async (req, res) => {
  try {
    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          as: 'job',
          where: { postedBy: req.userId },
          attributes: ['job_id', 'title', 'company']
        },
        {
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email', 'phone']
        }
      ],
      order: [['appliedAt', 'DESC']]
    });
    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error fetching applications' });
  }
});

// @route   PATCH /api/admin/applications/:id/status
// @desc    Update application status
// @access  Private/Admin
router.patch('/applications/:id/status', [auth, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Verify application belongs to admin's job
    const application = await Application.findOne({
      where: { id },
      include: [{
        model: Job,
        as: 'job',
        where: { postedBy: req.userId }
      }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error updating application status' });
  }
});

module.exports = router;
