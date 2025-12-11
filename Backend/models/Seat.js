// models/Seat.js
const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  seat_number: { type: Number, required: true },
  status: { type: String, enum: ['AVAILABLE','BOOKED'], default: 'AVAILABLE' },
  created_at: { type: Date, default: Date.now }
});

// Unique index to prevent duplicate seat numbers for a show
SeatSchema.index({ show: 1, seat_number: 1 }, { unique: true });

module.exports = mongoose.model('Seat', SeatSchema);