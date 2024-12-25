const express = require('express');
const auth = require('../middleware/authMiddleware');
const Tour = require('../models/Tour');
const router = express.Router();

// Create a new tour (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { title, description, location, price, images } = req.body;
  try {
    const newTour = new Tour({ title, description, location, price, images });
    await newTour.save();
    res.json(newTour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tours
router.get('/', async (req, res) => {
  try {
    const tours = await Tour.find();
    res.json(tours);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific tour
router.get('/:id', async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) return res.status(404).json({ msg: 'Tour not found' });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a tour (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  const { title, description, location, price, images } = req.body;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, { title, description, location, price, images }, { new: true });
    if (!updatedTour) return res.status(404).json({ msg: 'Tour not found' });
    res.json(updatedTour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a tour (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access denied' });

  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) return res.status(404).json({ msg: 'Tour not found' });
    res.json({ msg: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
