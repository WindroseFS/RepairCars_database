const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'BRL' },
  method: { type: String },
  status: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  notes: { type: String }
}, { timestamps: true });

// ✅ ADICIONADO: Virtual para converter _id para id
PaymentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

PaymentSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);