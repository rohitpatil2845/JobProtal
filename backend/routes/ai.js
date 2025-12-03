const express = require('express');
const router = express.Router();
const { Job, User, Application } = require('../models');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getJobRecommendations,
  extractSkills,
  calculateMatchScore,
  generateJobDescription
} = require('../utils/aiHelpers');
const fs = require('fs');
const pdf = require('pdf-parse');

// @route   GET /api/ai/recommendations
// @desc    Get AI-powered job recommendations
// @access  Private
router.get('/recommendations', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all active jobs
    const jobs = await Job.findAll({
      where: { status: 'active' },
      limit: 50
    });

    // Get user's applied job IDs
    const applications = await Application.findAll({
      where: { user_id: req.userId },
      attributes: ['job_id']
    });
    const appliedJobIds = applications.map(app => app.job_id);

    // Get recommendations
    const recommendations = await getJobRecommendations(user, jobs, appliedJobIds);

    res.json({
      recommendations,
      message: 'Recommendations generated based on your profile and skills'
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Server error generating recommendations' });
  }
});

// @route   POST /api/ai/analyze-resume
// @desc    Analyze resume and extract skills
// @access  Private
router.post('/analyze-resume', [auth, upload.single('resume')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a resume file' });
    }

    let resumeText = '';

    // Parse PDF
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdf(dataBuffer);
      resumeText = pdfData.text;
    } else {
      // For DOC/DOCX, simplified text extraction
      resumeText = fs.readFileSync(req.file.path, 'utf-8');
    }

    // Extract skills
    const skills = extractSkills(resumeText);

    // Update user profile with extracted skills
    await User.update(
      { 
        skills,
        resumeUrl: `/uploads/resumes/${req.file.filename}`
      },
      { where: { id: req.userId } }
    );

    // Calculate match with jobs if job_id provided
    let matchScore = null;
    if (req.body.job_id) {
      const job = await Job.findByPk(req.body.job_id);
      if (job) {
        matchScore = calculateMatchScore(skills, null, job);
      }
    }

    res.json({
      message: 'Resume analyzed successfully',
      extractedSkills: skills,
      totalSkills: skills.length,
      matchScore,
      resumeUrl: `/uploads/resumes/${req.file.filename}`
    });
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ message: 'Server error analyzing resume' });
  }
});

// @route   POST /api/ai/generate-description
// @desc    Generate job description using AI
// @access  Private/Admin
router.post('/generate-description', auth, async (req, res) => {
  try {
    const { title, skills, experience, jobType } = req.body;

    if (!title || !skills) {
      return res.status(400).json({ message: 'Title and skills are required' });
    }

    const skillsArray = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    
    const description = generateJobDescription(
      title,
      skillsArray,
      experience || '2-5 years',
      jobType || 'Full-time'
    );

    res.json({
      message: 'Job description generated successfully',
      description,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Generate description error:', error);
    res.status(500).json({ message: 'Server error generating description' });
  }
});

// @route   POST /api/ai/match-score
// @desc    Calculate match score between user and job
// @access  Private
router.post('/match-score', auth, async (req, res) => {
  try {
    const { job_id } = req.body;

    const user = await User.findByPk(req.userId);
    const job = await Job.findByPk(job_id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const matchScore = calculateMatchScore(user.skills || [], null, job);

    res.json({
      matchScore,
      userSkills: user.skills || [],
      jobSkills: job.skills || [],
      message: matchScore >= 70 ? 'Great match!' : matchScore >= 50 ? 'Good match' : 'Consider improving your skills'
    });
  } catch (error) {
    console.error('Match score error:', error);
    res.status(500).json({ message: 'Server error calculating match score' });
  }
});

module.exports = router;
