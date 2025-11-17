const Payment = require('../models/Payment');

exports.create = async (req, res) => {
  const p = new Payment(req.body);
  await p.save();
  res.status(201).json(p);
};

exports.list = async (req, res) => {
  const items = await Payment.find().populate('contact').sort('-createdAt');
  res.json(items);
};

exports.get = async (req, res) => {
  const item = await Payment.findById(req.params.id).populate('contact');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.update = async (req, res) => {
  const item = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.remove = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
