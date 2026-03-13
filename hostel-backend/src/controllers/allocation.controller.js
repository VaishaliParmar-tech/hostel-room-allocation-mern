const Allocation = require('../models/Allocation.model');
const Room = require('../models/Room.model');
const RoomRequest = require('../models/RoomRequest.model');

// @desc   Get all allocations
// @route  GET /api/allocations
exports.getAllAllocations = async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate('student', 'name email contactNumber')
      .populate('room', 'roomNumber hostelBlock roomType floor')
      .populate('allocatedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get student's own allocation
// @route  GET /api/allocations/my
exports.getMyAllocation = async (req, res) => {
  try {
    const allocation = await Allocation.findOne({ student: req.user._id, isActive: true })
      .populate('room', 'roomNumber hostelBlock roomType floor capacity occupiedBy')
      .populate('allocatedBy', 'name');
    res.json(allocation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Allocate room to student (Warden)
// @route  POST /api/allocations
exports.allocateRoom = async (req, res) => {
  try {
    const { studentId, roomId, requestId } = req.body;

    // Check student doesn't already have active allocation
    const existingAlloc = await Allocation.findOne({ student: studentId, isActive: true });
    if (existingAlloc)
      return res.status(400).json({ message: 'Student already has an active room allocation' });

    // Check room availability
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.isAvailable)
      return res.status(400).json({ message: 'Room is not available' });

    // Create allocation
    const allocation = await Allocation.create({
      student: studentId, room: roomId,
      request: requestId, allocatedBy: req.user._id,
    });

    // Update room occupancy
    room.occupiedBy.push(studentId);
    await room.save();

    // Update request status to allocated
    await RoomRequest.findByIdAndUpdate(requestId, { status: 'allocated' });

    const populated = await allocation.populate([
      { path: 'student', select: 'name email' },
      { path: 'room', select: 'roomNumber hostelBlock roomType' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Vacate room
// @route  PUT /api/allocations/:id/vacate
exports.vacateRoom = async (req, res) => {
  try {
    const allocation = await Allocation.findById(req.params.id);
    if (!allocation) return res.status(404).json({ message: 'Allocation not found' });

    allocation.isActive = false;
    allocation.checkOutDate = new Date();
    await allocation.save();

    // Remove student from room
    const room = await Room.findById(allocation.room);
    room.occupiedBy = room.occupiedBy.filter(id => id.toString() !== allocation.student.toString());
    await room.save();

    res.json({ message: 'Room vacated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Occupancy report
// @route  GET /api/allocations/report
exports.getReport = async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ isAvailable: true });
    const activeAllocations = await Allocation.countDocuments({ isActive: true });
    const pendingRequests = await (require('../models/RoomRequest.model')).countDocuments({ status: 'pending' });
    res.json({ totalRooms, availableRooms, occupiedRooms: totalRooms - availableRooms, activeAllocations, pendingRequests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
