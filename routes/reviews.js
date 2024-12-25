// routes/review.js
const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Create Review (User)
router.post('/', auth, async (req, res) => {
  const { tour, rating, comment } = req.body;
  try {
    const newReview = new Review({
      user: req.user.id,
      tour,
      rating,
      comment
    });
    await newReview.save();
    res.status(201).json({ msg: 'Review created successfully', review: newReview });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Reviews for a Specific Tour
router.get('/tour/:tourId', async (req, res) => {
  try {
    const reviews = await Review.find({ tour: req.params.tourId }).populate('user');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Review (User)
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      { new: true }
    );
    
    res.json(updatedReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Review (User)
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    res.json({ msg: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
