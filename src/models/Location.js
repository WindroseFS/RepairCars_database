const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
  label: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Location', LocationSchema);
