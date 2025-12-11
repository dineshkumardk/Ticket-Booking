// routes/shows.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const Booking = require('../models/Booking');

// GET /shows  => list shows
router.get('/', async (req, res) => {
  try {
    const shows = await Show.find().sort({ start_time: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /shows/:id  => show detail + seats
router.get('/:id', async (req, res) => {
  try {
    const showId = req.params.id;
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ error: 'Show not found' });

    const seats = await Seat.find({ show: showId }).sort({ seat_number: 1 }).select('seat_number status -_id');
    res.json({ show, seats });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * POST /shows/:id/book
 * body: { seats: [1,2,3] }
 * This uses MongoDB transactions to ensure atomicity and avoid overbooking.
 */
router.post('/:id/book', async (req, res) => {
  const requestedSeats = req.body.seats;
  if (!Array.isArray(requestedSeats) || requestedSeats.length === 0) {
    return res.status(400).json({ error: 'Provide seats array' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const showId = req.params.id;

    // 1) Fetch seat documents for these seat numbers with status AVAILABLE
    const seats = await Seat.find({
      show: showId,
      seat_number: { $in: requestedSeats },
      status: 'AVAILABLE'
    }).session(session).exec();

    if (seats.length !== requestedSeats.length) {
      // Some seats were not available or don't exist
      await session.abortTransaction();
      session.endSession();
      return res.status(409).json({ success: false, error: 'Some seats are not available' });
    }

    // 2) Mark seats as BOOKED
    await Seat.updateMany({
      show: showId,
      seat_number: { $in: requestedSeats }
    }, {
      $set: { status: 'BOOKED' }
    }).session(session);

    // 3) Create booking record (CONFIRMED)
    const booking = await Booking.create([{
      show: showId,
      seats: requestedSeats,
      status: 'CONFIRMED'
    }], { session });

    await session.commitTransaction();
    session.endSession();

    return res.json({ success: true, booking: booking[0] });
  } catch (err) {
    console.error('Booking transaction error', err);
    try {
      await session.abortTransaction();
    } catch (e) { /* ignore */ }
    session.endSession();
    return res.status(500).json({ success: false, error: 'Internal error' });
  }
});

module.exports = router;