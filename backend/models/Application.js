const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'job_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  resumeUrl: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'hired'),
    defaultValue: 'pending'
  },
  matchScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'AI-calculated match score 0-100'
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'appliedAt'
});

module.exports = Application;
