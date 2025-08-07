import { io } from './server.js';
import Message from './models/Message.js';

export const setupSocket = () => {
  io.on('connection', (socket) => {
    socket.on('joinChat', (wa_id) => {
      socket.join(wa_id);
    });

    socket.on('sendMessage', async (messageData) => {
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
      await message.save();
      io.to(wa_id).emit('newMessage', message);
    });
  });
};