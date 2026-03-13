const User = require('../models/User.model');

// @desc   Get all students
// @route  GET /api/admin/students
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get all wardens
// @route  GET /api/admin/wardens
exports.getWardens = async (req, res) => {
  try {
    const wardens = await User.find({ role: 'warden' }).select('-password');
    res.json(wardens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Add warden
// @route  POST /api/admin/warden
exports.addWarden = async (req, res) => {
  try {
    const { name, email, password, contactNumber } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const warden = await User.create({ name, email, password, contactNumber, role: 'warden' });
    res.status(201).json({ _id: warden._id, name: warden.name, email: warden.email, role: warden.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Update user
// @route  PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body; // prevent direct password update here
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Delete user
// @route  DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
