const express = require('express');
const router = express.Router();
const { SavedJob, Job } = require('../models');
const { auth } = require('../middleware/auth');

// @route   POST /api/saved-jobs
// @desc    Save/bookmark a job
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { job_id } = req.body;

    // Check if job exists
    const job = await Job.findByPk(job_id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already saved
    const existing = await SavedJob.findOne({
      where: { user_id: req.userId, job_id }
    });

    if (existing) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    const savedJob = await SavedJob.create({
      user_id: req.userId,
      job_id
    });

    res.status(201).json({
      message: 'Job saved successfully',
      savedJob
    });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/saved-jobs
// @desc    Get user's saved jobs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const savedJobs = await SavedJob.findAll({
      where: { user_id: req.userId },
      order: [['savedAt', 'DESC']],
      include: [{
        model: Job,
        as: 'job'
      }]
    });

    res.json(savedJobs);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/saved-jobs/:jobId
// @desc    Remove saved job
// @access  Private
router.delete('/:jobId', auth, async (req, res) => {
  try {
    const savedJob = await SavedJob.findOne({
      where: { user_id: req.userId, job_id: req.params.jobId }
    });

    if (!savedJob) {
      return res.status(404).json({ message: 'Saved job not found' });
    }

    await savedJob.destroy();

    res.json({ message: 'Job removed from saved list' });
  } catch (error) {
    console.error('Remove saved job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
