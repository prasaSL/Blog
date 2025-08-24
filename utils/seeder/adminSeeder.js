const User = require('../../models/User.model');
const { sequelize } = require('../../config/database');
const dotenv = require('dotenv');

dotenv.config();



/**
 * Seeds the database with an admin user if one doesn't exist
 */
const seedAdminUser = async () => {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin user exists with the specified email
    const adminExists = await User.findOne({
      where: { 
        email: process.env.SUPER_ADMIN_EMAIL,
        role: 'admin'
      }
    });

    // If admin doesn't exist, create one
    if (!adminExists) {
      console.log('No admin user found. Creating default admin...');
      
      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Default admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};

module.exports = seedAdminUser;