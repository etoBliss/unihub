import Message from '../models/Message.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: 'Receiver user not found' });
    }

    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
    });

    const savedMessage = await message.save();
    const populated = await savedMessage.populate([
      { path: 'sender', select: 'name email role department' },
      { path: 'receiver', select: 'name email role department' }
    ]);

    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: `Send message error: ${error.message}` });
  }
};

export const getConversation = async (req, res) => {
  const { userId } = req.params;

  try {
    // Retrieve conversation history between req.user._id and userId
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name email role department')
    .populate('receiver', 'name email role department')
    .sort({ createdAt: 1 });

    // Mark retrieved messages sent to current user as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { $set: { read: true } }
    );

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: `Fetch conversation error: ${error.message}` });
  }
};

export const getInbox = async (req, res) => {
  const myId = new mongoose.Types.ObjectId(req.user._id);

  try {
    // Fetch all unique conversations for the user
    // We group messages by the conversation partner's ID
    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name email role department')
    .populate('receiver', 'name email role department');

    const conversationMap = new Map();

    for (const msg of messages) {
      const partner = msg.sender._id.toString() === myId.toString() ? msg.receiver : msg.sender;
      const partnerId = partner._id.toString();

      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
          unreadCount: 0
        });
      }

      // Count unread messages received by me
      if (msg.receiver._id.toString() === myId.toString() && !msg.read) {
        const conversation = conversationMap.get(partnerId);
        // Only increment if we are summing up unread messages from this specific partner
        conversation.unreadCount += 1;
      }
    }

    const inbox = Array.from(conversationMap.values());
    return res.json(inbox);
  } catch (error) {
    return res.status(500).json({ message: `Fetch inbox error: ${error.message}` });
  }
};
