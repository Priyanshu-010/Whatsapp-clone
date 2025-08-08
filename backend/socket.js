// socket.js
import Message from './models/Message.js';

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinChat', (wa_id) => {
      socket.join(wa_id);
      console.log(`User ${socket.id} joined room: ${wa_id}`);
    });

    socket.on('sendMessage', async (messageData) => {
      console.log('Received sendMessage:', messageData);
      const { wa_id, text, user_name } = messageData;
      const message = new Message({
        wa_id,
        msg_id: `msg_${Date.now()}`,
        from: 'user',
        to: wa_id,
        text,
        timestamp: new Date(),
        user_name,
      });
      try {
        await message.save();
        console.log('Message saved:', message);
        io.to(wa_id).emit('newMessage', message);
        console.log(`Emitted newMessage to room ${wa_id}:`, message);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });
  });
};