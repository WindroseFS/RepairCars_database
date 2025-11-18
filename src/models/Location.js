const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  address: { type: String },
  label: { type: String }
}, { timestamps: true });

// ✅ ADICIONADO: Virtual para converter _id para id
LocationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

LocationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Location', LocationSchema);