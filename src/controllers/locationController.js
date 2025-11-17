const Location = require('../models/Location');

exports.create = async (req, res) => {
  const loc = new Location(req.body);
  await loc.save();
  res.status(201).json(loc);
};

exports.list = async (req, res) => {
  const items = await Location.find().populate('contact').sort('-createdAt');
  res.json(items);
};

exports.get = async (req, res) => {
  const item = await Location.findById(req.params.id).populate('contact');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.update = async (req, res) => {
  const item = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.remove = async (req, res) => {
  await Location.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
