const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descricao: {
    type: String,
    required: true
  },
  conteudo: {
    type: String,
    required: true
  },
  data: {
    type: String,
    required: true
  },
  dataPublicacao: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: null
  },
  categoria: {
    type: String,
    enum: ['Geral', 'Promoções', 'Workshops', 'Dicas', 'Novidades', 'Manutenção'],
    default: 'Geral'
  },
  autor: {
    type: String,
    default: 'RepairCars Oficina'
  },
  tags: [{
    type: String
  }],
  destaque: {
    type: Boolean,
    default: false
  },
  visualizacoes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para busca por texto
newsSchema.index({ 
  titulo: 'text', 
  descricao: 'text', 
  conteudo: 'text',
  tags: 'text'
});

module.exports = mongoose.model('News', newsSchema);