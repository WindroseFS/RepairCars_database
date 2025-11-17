const Conversation = require('../models/Conversation');

exports.create = async (req, res) => {
  const convo = new Conversation(req.body);
  await convo.save();
  res.status(201).json(convo);
};

exports.list = async (req, res) => {
  const items = await Conversation.find().populate('participants').sort('-updatedAt');
  res.json(items);
};

exports.get = async (req, res) => {
  const item = await Conversation.findById(req.params.id).populate('participants messages.sender');
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
};

exports.addMessage = async (req, res) => {
  const convo = await Conversation.findById(req.params.id);
  if (!convo) return res.status(404).json({ error: 'Not found' });
  convo.messages.push(req.body);
  await convo.save();
  res.status(201).json(convo);
};

exports.remove = async (req, res) => {
  await Conversation.findByIdAndDelete(req.params.id);
  res.status(204).end();
};
