// Health check endpoint for Render
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

module.exports = router;
