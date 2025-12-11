// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const showsRoutes = require('./routes/shows');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Atlas
if (!process.env.MONGO_URL) {
  console.error('ERROR: MONGO_URL environment variable is not set!');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error', err));

app.get('/', (req, res) => res.send('Booking API (MongoDB)'));

// Routes
app.use('/admin', adminRoutes);
app.use('/shows', showsRoutes);

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));