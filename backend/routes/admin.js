// routes/admin.js
const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const Seat = require('../models/Seat');

// POST /admin/shows  { name, start_time, total_seats }
router.post('/shows', async (req, res) => {
  try {
    const { name, start_time, total_seats } = req.body;
    if (!name || !start_time || !total_seats) return res.status(400).json({ error: 'Missing fields' });

    const show = await Show.create({ name, start_time, total_seats });

    // Bulk create seats
    const seatDocs = [];
    for (let i = 1; i <= total_seats; i++) {
      seatDocs.push({ show: show._id, seat_number: i, status: 'AVAILABLE' });
    }
    await Seat.insertMany(seatDocs);

    res.json({ show });
  } catch (err) {
    console.error('Admin create show error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /admin/shows - optional, lists shows (same as public)
router.get('/shows', async (req, res) => {
  try {
    const shows = await Show.find().sort({ start_time: 1 });
    res.json(shows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;