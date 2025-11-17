const express = require('express');
const Contact = require('../models/Contact');
const router = express.Router();

// GET /api/contacts - Listar todos os contatos
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ name: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/contacts - Criar novo contato
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, role, notes } = req.body;
    
    // Validar email único
    const existingContact = await Contact.findOne({ email });
    if (existingContact) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const contact = new Contact({
      name,
      phone,
      email,
      role: role || 'Cliente',
      notes
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/contacts/:id - Buscar contato por ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contato não encontrado' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;