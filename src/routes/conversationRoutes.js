const express = require('express');
const Conversation = require('../models/Conversation');
const Contact = require('../models/Contact');
const router = express.Router();

// GET /api/conversations - Listar conversas com última mensagem
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .populate('participants', 'name email phone')
      .populate('lastMessage.sender', 'name')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations - Criar nova conversa
router.post('/', async (req, res) => {
  try {
    const { participants } = req.body;
    
    // Verificar se já existe conversa com esses participantes
    const existingConversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length }
    });

    if (existingConversation) {
      return res.json(existingConversation);
    }

    const conversation = new Conversation({ participants });
    await conversation.save();
    
    await conversation.populate('participants', 'name email phone');
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/conversations/:id/messages - Buscar mensagens da conversa
router.get('/:id/messages', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('messages.sender', 'name email');

    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }

    res.json(conversation.messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/conversations/:id/messages - Enviar mensagem
router.post('/:id/messages', async (req, res) => {
  try {
    const { sender, text, latitude, longitude } = req.body;
    
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversa não encontrada' });
    }

    const newMessage = {
      sender,
      text,
      latitude,
      longitude,
      timestamp: new Date()
    };

    conversation.messages.push(newMessage);
    await conversation.save();

    await conversation.populate('messages.sender', 'name email');
    const savedMessage = conversation.messages[conversation.messages.length - 1];
    
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;