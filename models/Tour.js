const mongoose = require('mongoose');
const TourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String] }
});

module.exports = mongoose.model('Tour', TourSchema);
