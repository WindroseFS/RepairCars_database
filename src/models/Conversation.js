const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  latitude: Number,
  longitude: Number
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    type: messageSchema
  }
}, {
  timestamps: true
});

// Atualizar lastMessage antes de salvar
conversationSchema.pre('save', function(next) {
  if (this.messages.length > 0) {
    this.lastMessage = this.messages[this.messages.length - 1];
  }
  next();
});

// ✅ ADICIONADO: Virtual para converter _id para id
conversationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

conversationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Conversation', conversationSchema);