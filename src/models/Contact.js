const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['Oficina', 'Cliente', 'Mecânico', 'Suporte'],
    default: 'Cliente'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// ✅ ADICIONADO: Virtual para converter _id para id
contactSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

contactSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Contact', contactSchema);