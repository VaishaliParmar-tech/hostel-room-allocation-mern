const RoomRequest = require('../models/RoomRequest.model');

// @desc   Get all requests (Warden/Admin)
// @route  GET /api/requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find()
      .populate('student', 'name email contactNumber')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Get student's own requests
// @route  GET /api/requests/my
exports.getMyRequests = async (req, res) => {
  try {
    const requests = await RoomRequest.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Submit room request
// @route  POST /api/requests
exports.createRequest = async (req, res) => {
  try {
    const existing = await RoomRequest.findOne({
      student: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });
    if (existing)
      return res.status(400).json({ message: 'You already have an active request' });

    const request = await RoomRequest.create({
      student: req.user._id,
      roomType: req.body.roomType,
      preferredBlock: req.body.preferredBlock,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Approve request
// @route  PUT /api/requests/:id/approve
exports.approveRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', wardenRemarks: req.body.remarks || 'Approved' },
      { new: true }
    ).populate('student', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Reject request
// @route  PUT /api/requests/:id/reject
exports.rejectRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', wardenRemarks: req.body.remarks || 'Rejected' },
      { new: true }
    ).populate('student', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc   Cancel request (student)
// @route  DELETE /api/requests/:id
exports.cancelRequest = async (req, res) => {
  try {
    const request = await RoomRequest.findOne({ _id: req.params.id, student: req.user._id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    if (request.status !== 'pending')
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    await request.deleteOne();
    res.json({ message: 'Request cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
