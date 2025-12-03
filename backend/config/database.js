const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'mysql';
const port = process.env.DB_PORT || (dialect === 'postgres' ? 5432 : 3306);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'job_portal',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: port,
    dialect: dialect,
    logging: false,
    dialectOptions: dialect === 'postgres' && process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
    
    // Sync all models
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
