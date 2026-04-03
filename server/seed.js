require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../backend/models/User');
const connectDB = require('../backend/config/db');

const seedUsers = async () => {
  try {
    await connectDB();
    
    // Clear user local test
    await User.deleteMany({ email: 'admin@example.com' });

    // Tạo mật khẩu băm
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Tạo Demo user 
    await User.create({
      name: 'Admin Demo',
      email: 'admin@example.com',
      password: hashedPassword,
      authProvider: 'local'
    });

    console.log('✅ Đã tạo user test: admin@example.com / 123456');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
};

seedUsers();
