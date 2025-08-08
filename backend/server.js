import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import messageRoutes from './routes/messages.js';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { setupSocket } from './socket.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:5173'] : process.env.CORS_ORIGIN || 'https://your-deployed-url.com',
    methods: ['GET', 'POST'],
  },
});

app.use(
  cors({
    origin: process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:5173'] : process.env.CORS_ORIGIN || 'https://your-deployed-url.com',
    methods: ['GET', 'POST'],
  })
);
app.use(express.json());
app.use('/api', messageRoutes);

connectDB();

setupSocket(io); // Pass io instance to setupSocket

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };