const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber:  { type: String, required: true, unique: true },
  hostelBlock: { type: String, required: true },
  capacity:    { type: Number, required: true },
  occupiedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  roomType:    { type: String, enum: ['Single', 'Double', 'Triple'], required: true },
  isAvailable: { type: Boolean, default: true },
  floor:       { type: Number, default: 1 },
}, { timestamps: true });

// Auto-update availability
roomSchema.pre('save', function (next) {
  this.isAvailable = this.occupiedBy.length < this.capacity;
  next();
});

module.exports = mongoose.model('Room', roomSchema);
