const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Job, User, Application } = require('../models');
const { auth, isAdmin } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      city, 
      jobType, 
      experience, 
      salaryMin, 
      salaryMax, 
      category,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const where = { status: 'active' };

    if (city) where.city = { [Op.like]: `%${city}%` };
    if (jobType) where.jobType = jobType;
    if (experience) where.experience = { [Op.like]: `%${experience}%` };
    if (category) where.category = category;
    if (salaryMin) where.salaryMin = { [Op.gte]: parseFloat(salaryMin) };
    if (salaryMax) where.salaryMax = { [Op.lte]: parseFloat(salaryMax) };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'poster',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      jobs,
      totalJobs: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error fetching jobs' });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'poster',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error fetching job' });
  }
});

// @route   POST /api/jobs
// @desc    Create new job (Admin only)
// @access  Private/Admin
router.post('/', [auth, isAdmin], async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      requirements,
      city,
      country,
      jobType,
      experience,
      salaryMin,
      salaryMax,
      category,
      skills,
      status
    } = req.body;

    const job = await Job.create({
      title,
      company,
      description,
      requirements,
      city,
      country,
      jobType,
      experience,
      salaryMin,
      salaryMax,
      category,
      skills,
      status: status || 'active',
      postedBy: req.userId
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error creating job' });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update job (Admin only)
// @access  Private/Admin
router.put('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if admin owns this job
    if (job.postedBy !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    await job.update(req.body);

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error updating job' });
  }
});

// @route   PATCH /api/jobs/:id/status
// @desc    Update job status (Admin only)
// @access  Private/Admin
router.patch('/:id/status', [auth, isAdmin], async (req, res) => {
  try {
    const { status } = req.body;
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    job.status = status;
    await job.save();

    res.json({
      message: 'Job status updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ message: 'Server error updating job status' });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete job (Admin only)
// @access  Private/Admin
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error deleting job' });
  }
});

// @route   GET /api/jobs/admin/my-jobs
// @desc    Get jobs posted by logged in admin
// @access  Private/Admin
router.get('/admin/my-jobs', [auth, isAdmin], async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { postedBy: req.userId },
      order: [['createdAt', 'DESC']],
      include: [{
        model: Application,
        as: 'applications',
        include: [{
          model: User,
          as: 'applicant',
          attributes: ['id', 'name', 'email']
        }]
      }]
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
