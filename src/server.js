const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/repaircars', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('❌ Erro na conexão com MongoDB:', error);
});

db.once('open', () => {
  console.log('✅ Conectado ao MongoDB com sucesso!');
});

// Rotas
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/news', require('./routes/news')); // ✅ ADICIONADO
app.use('/api/locations', require('./routes/locations'));
app.use('/api/payments', require('./routes/payments'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'API RepairCars Online', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      contacts: '/api/contacts',
      conversations: '/api/conversations',
      news: '/api/news',
      locations: '/api/locations',
      payments: '/api/payments'
    }
  });
});

// Rota para verificar status do banco de dados
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.json({
      status: 'API Online',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'API Online', 
      database: 'error',
      error: error.message 
    });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  console.error('🚨 Erro na API:', error);
  
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo deu errado'
  });
});

app.listen(PORT, () => {
  console.log(`🚗 RepairCars API rodando na porta ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   - http://localhost:${PORT}/api/contacts`);
  console.log(`   - http://localhost:${PORT}/api/conversations`);
  console.log(`   - http://localhost:${PORT}/api/news`);
  console.log(`   - http://localhost:${PORT}/api/locations`);
  console.log(`   - http://localhost:${PORT}/api/payments`);
});