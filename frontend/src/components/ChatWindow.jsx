import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages } from '../redux/slices/chatSlice';
import MessageInput from './MessageInput';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const ChatWindow = () => {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const messages = useSelector((state) => state.chat.messages);

  useEffect(() => {
    if (selectedChat) {
      dispatch(fetchMessages(selectedChat._id));
      socket.emit('joinChat', selectedChat._id);
      socket.on('newMessage', (message) => {
        dispatch({ type: 'chat/addMessage', payload: message });
      });
    }
  }, [selectedChat, dispatch]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b bg-white">
        <h2 className="text-lg font-semibold">{selectedChat?.user_name || selectedChat?._id}</h2>
        <p className="text-sm text-gray-500">{selectedChat?._id}</p>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-4 p-3 rounded-lg max-w-xs ${
              msg.from === 'user' ? 'ml-auto bg-blue-500 text-white' : 'mr-auto bg-white'
            }`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-gray-400">
              {new Date(msg.timestamp).toLocaleString()} • {msg.status}
            </p>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatWindow;