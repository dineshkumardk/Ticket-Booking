// seed.js - Run this file to populate the DB with sample shows/seats/bookings
// Usage: node seed.js

const mongoose = require("mongoose");
require("dotenv").config();

// -----------------------------
// 1. CONNECT TO DATABASE
// -----------------------------
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ ERROR: MONGO_URL missing in .env file!");
  process.exit(1);
}

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// -----------------------------
// 2. DEFINE SCHEMAS
// -----------------------------
const ShowSchema = new mongoose.Schema({
  name: String,
  start_time: Date,
  total_seats: Number,
});

const SeatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
  seat_number: Number,
  status: {
    type: String,
    enum: ["AVAILABLE", "BOOKED", "RESERVED"],
    default: "AVAILABLE",
  },
});

const BookingSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show" },
  seats: [Number],
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "FAILED"],
    default: "PENDING",
  },
  created_at: { type: Date, default: Date.now },
});

const Show = mongoose.model("Show", ShowSchema);
const Seat = mongoose.model("Seat", SeatSchema);
const Booking = mongoose.model("Booking", BookingSchema);

// -----------------------------
// 3. SEED FUNCTION
// -----------------------------
async function seed() {
  console.log("🚀 Starting DB Seeding...");

  // Clear all existing documents
  await Show.deleteMany({});
  await Seat.deleteMany({});
  await Booking.deleteMany({});
  console.log("🧹 Cleared existing Shows, Seats, and Bookings");

  // Create sample shows
  const showA = await Show.create({
    name: "🎬 Movie — The Great Adventure",
    start_time: new Date(Date.now() + 86400000), // tomorrow
    total_seats: 40,
  });

  const showB = await Show.create({
    name: "🚌 Intercity Bus — Morning 9AM",
    start_time: new Date(Date.now() + 2 * 86400000), // day after
    total_seats: 24,
  });

  console.log("✨ Created sample shows");

  // Insert seats for both shows
  const seatsA = Array.from({ length: showA.total_seats }, (_, i) => ({
    show: showA._id,
    seat_number: i + 1,
    status: "AVAILABLE",
  }));

  const seatsB = Array.from({ length: showB.total_seats }, (_, i) => ({
    show: showB._id,
    seat_number: i + 1,
    status: "AVAILABLE",
  }));

  await Seat.insertMany([...seatsA, ...seatsB]);
  console.log("🪑 Seats created for both shows");

  // Create sample bookings
  const booking1 = await Booking.create({
    show: showA._id,
    seats: [2, 3],
    status: "CONFIRMED",
  });

  await Seat.updateMany(
    { show: showA._id, seat_number: { $in: [2, 3] } },
    { status: "BOOKED" }
  );

  const booking2 = await Booking.create({
    show: showA._id,
    seats: [4],
    status: "PENDING",
  });

  await Seat.updateOne(
    { show: showA._id, seat_number: 4 },
    { status: "RESERVED" }
  );

  const booking3 = await Booking.create({
    show: showB._id,
    seats: [10],
    status: "FAILED",
  });

  console.log("📦 Created sample bookings:");
  console.log("  CONFIRMED → Seats 2, 3");
  console.log("  PENDING   → Seat 4");
  console.log("  FAILED    → Seat 10 (Show B)");

  console.log("🎉 Database Seeding Completed!");
  mongoose.disconnect();
  process.exit(0);
}

// Run the seeding
seed().catch((err) => {
  console.error("❌ Seeding Failed:", err);
  process.exit(1);
});