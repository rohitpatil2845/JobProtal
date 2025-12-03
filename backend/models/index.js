const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const SavedJob = require('./SavedJob');

// Define associations
User.hasMany(Job, { foreignKey: 'postedBy', as: 'jobs' });
Job.belongsTo(User, { foreignKey: 'postedBy', as: 'poster' });

User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

User.hasMany(SavedJob, { foreignKey: 'user_id', as: 'savedJobs' });
SavedJob.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Job.hasMany(SavedJob, { foreignKey: 'job_id', as: 'savedBy' });
SavedJob.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = {
  User,
  Job,
  Application,
  SavedJob
};
