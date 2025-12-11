// models/Booking.js
const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  seats: [{ type: Number, required: true }],
  status: { type: String, enum: ['PENDING','CONFIRMED','FAILED'], default: 'CONFIRMED' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);