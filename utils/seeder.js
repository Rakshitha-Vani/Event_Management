const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!adminExists) {
      console.log('Seeding Default Admin Account...');
      
      await User.create({
        name: 'System Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default Admin Created: admin@gmail.com / admin123');
    } else {
      console.log('ℹ️ Admin account already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};

module.exports = seedAdmin;
