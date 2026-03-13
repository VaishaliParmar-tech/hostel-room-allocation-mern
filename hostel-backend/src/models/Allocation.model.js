const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room:        { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  request:     { type: mongoose.Schema.Types.ObjectId, ref: 'RoomRequest', required: true },
  allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isActive:    { type: Boolean, default: true },
  checkOutDate:{ type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Allocation', allocationSchema);
