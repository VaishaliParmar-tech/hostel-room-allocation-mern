const mongoose = require('mongoose');

const roomRequestSchema = new mongoose.Schema({
  student:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  preferredBlock: { type: String, default: '' },
  roomType:       { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  status:         { type: String, enum: ['pending', 'approved', 'rejected', 'allocated'], default: 'pending' },
  wardenRemarks:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('RoomRequest', roomRequestSchema);
