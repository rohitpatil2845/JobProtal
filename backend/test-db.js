require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testConnection() {
  console.log('\n🔍 Testing MySQL Connection...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Password: ${process.env.DB_PASSWORD ? '***' + process.env.DB_PASSWORD.slice(-2) : 'EMPTY'}`);
  console.log(`Database: ${process.env.DB_NAME}`);
  console.log(`Port: ${process.env.DB_PORT}\n`);

  try {
    // Test connection without database first
    const sequelizeWithoutDB = new Sequelize({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false
    });

    await sequelizeWithoutDB.authenticate();
    console.log('✅ Connected to MySQL server successfully!');
    
    // Check if database exists
    const [results] = await sequelizeWithoutDB.query('SHOW DATABASES');
    const dbExists = results.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists!`);
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does NOT exist!`);
      console.log('\n📝 Run this command in MySQL:');
      console.log(`   CREATE DATABASE ${process.env.DB_NAME};`);
      await sequelizeWithoutDB.close();
      process.exit(1);
    }
    
    await sequelizeWithoutDB.close();
    
    // Now test with database
    const sequelizeWithDB = new Sequelize({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false
    });

    await sequelizeWithDB.authenticate();
    console.log(`✅ Connected to database '${process.env.DB_NAME}' successfully!`);
    await sequelizeWithDB.close();
    
    console.log('\n✅ All connection tests passed!\n');
    console.log('You can now start the server with: npm start\n');
  } catch (error) {
    console.error('\n❌ Connection Error:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Check if MySQL is running');
    console.error('   2. Verify password in .env file (current password ends with: ' + 
      (process.env.DB_PASSWORD ? process.env.DB_PASSWORD.slice(-2) : 'EMPTY') + ')');
    console.error('   3. Try connecting manually: mysql -u root -p');
    console.error('   4. If password is wrong, update DB_PASSWORD in .env file\n');
    process.exit(1);
  }
}

testConnection();
