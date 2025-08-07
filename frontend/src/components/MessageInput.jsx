import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const MessageInput = () => {
  const [text, setText] = useState('');
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && selectedChat) {
      socket.emit('sendMessage', {
        wa_id: selectedChat._id,
        text,
        user_name: selectedChat.user_name,
      });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
      <div className="flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;