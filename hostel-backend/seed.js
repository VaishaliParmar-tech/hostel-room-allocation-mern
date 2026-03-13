// Run this once to create admin user: node seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User.model');
const Room = require('./src/models/Room.model');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Create Admin
  const adminExists = await User.findOne({ email: 'admin@hostel.com' });
  if (!adminExists) {
    await User.create({ name: 'Admin User', email: 'admin@hostel.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created: admin@hostel.com / admin123');
  }

  // Create Warden
  const wardenExists = await User.findOne({ email: 'warden@hostel.com' });
  if (!wardenExists) {
    await User.create({ name: 'Warden Singh', email: 'warden@hostel.com', password: 'warden123', role: 'warden', contactNumber: '9876543210' });
    console.log('✅ Warden created: warden@hostel.com / warden123');
  }

  // Create Sample Rooms
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    await Room.insertMany([
      { roomNumber: 'A-101', hostelBlock: 'Block A', capacity: 1, roomType: 'Single', floor: 1 },
      { roomNumber: 'A-102', hostelBlock: 'Block A', capacity: 2, roomType: 'Double', floor: 1 },
      { roomNumber: 'A-103', hostelBlock: 'Block A', capacity: 3, roomType: 'Triple', floor: 1 },
      { roomNumber: 'B-101', hostelBlock: 'Block B', capacity: 1, roomType: 'Single', floor: 1 },
      { roomNumber: 'B-102', hostelBlock: 'Block B', capacity: 2, roomType: 'Double', floor: 1 },
      { roomNumber: 'B-201', hostelBlock: 'Block B', capacity: 2, roomType: 'Double', floor: 2 },
    ]);
    console.log('✅ 6 sample rooms created');
  }

  console.log('\n🎉 Seed complete! You can now login with the credentials above.');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
