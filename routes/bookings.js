const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Create Booking (User)
router.post('/', auth, async (req, res) => {
  const { tour, dates, adults, children } = req.body;
  try {
    // Make sure that the required fields are available
    if (!tour || !dates || !adults || !children) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id,  // Get user ID from the authenticated user
      tour,
      dates,
      adults,
      children
    });

    await newBooking.save();
    res.status(201).json({ msg: 'Booking created successfully', booking: newBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while creating booking', details: err.message });
  }
});

// Get All Bookings (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const bookings = await Booking.find().populate('user').populate('tour');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching bookings', details: err.message });
  }
});

// Get bookings for a specific user
router.get('/user/:userId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const bookings = await Booking.find({ user: req.params.userId }).populate('tour');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching user bookings', details: err.message });
  }
});

// Update a booking (Admin only)
router.put('/:bookingId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      req.body,
      { new: true }
    ).populate('user').populate('tour');

    if (!updatedBooking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json(updatedBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating booking', details: err.message });
  }
});

// Delete a booking (Admin only)
router.delete('/:bookingId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

    const deletedBooking = await Booking.findByIdAndDelete(req.params.bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    res.json({ msg: 'Booking deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting booking', details: err.message });
  }
});

module.exports = router;
