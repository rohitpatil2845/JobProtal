const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    defaultValue: 'India'
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Remote', 'Night Shift'),
    defaultValue: 'Full-time'
  },
  experience: {
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'e.g., 0-2 years, 2-5 years'
  },
  salaryMin: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salaryMax: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salaryCurrency: {
    type: DataTypes.STRING(10),
    defaultValue: 'INR'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'e.g., IT, Marketing, Sales'
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  },
  postedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active'
  },
  applicationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

module.exports = Job;
