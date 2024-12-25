const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tour: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  dates: { type: [Date], required: true },
  adults: { type: Number, required: true },
  children: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
