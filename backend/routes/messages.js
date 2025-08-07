import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Process incoming message payload
router.post('/webhook/message', async (req, res) => {
  try {
    const { wa_id, msg_id, from, to, text, timestamp, user_name } = req.body;
    const message = new Message({
      wa_id,
      msg_id,
      from,
      to,
      text,
      timestamp: new Date(timestamp * 1000),
      user_name,
    });
    await message.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update message status
router.post('/webhook/status', async (req, res) => {
  try {
    const { msg_id, status } = req.body;
    const message = await Message.findOneAndUpdate(
      { msg_id },
      { status },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a specific user
router.get('/messages/:wa_id', async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all conversations (grouped by wa_id)
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      { $group: { _id: '$wa_id', user_name: { $first: '$user_name' } } },
    ]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;