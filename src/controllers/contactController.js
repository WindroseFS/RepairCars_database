const Contact = require('../models/Contact');

exports.create = async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).json(contact);
};

exports.list = async (req, res) => {
  const items = await Contact.find().sort('-createdAt');
  res.json(items);
};

exports.get = async (req, res) => {
  const item = await Contact.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.update = async (req, res) => {
  const item = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.remove = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
