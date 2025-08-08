import { useState, useEffect } from 'react';
import MessageInput from './MessageInput';

function ChatWindow({ socket, wa_id }) {
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(wa_id);

  useEffect(() => {
    setSelectedConversation(wa_id);
  }, [wa_id]);

  useEffect(() => {
    if (selectedConversation) {
      socket.emit('joinChat', selectedConversation);
      console.log('Joined chat room in ChatWindow:', selectedConversation);
    }
  }, [selectedConversation, socket]);

  useEffect(() => {
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('newMessage');
  }, [socket]);

  const conversationMessages = messages.filter((msg) => msg.wa_id === selectedConversation);

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600 dark:text-gray-400">
          {selectedConversation?.[0] || 'C'}
        </div>
        <div className="font-semibold text-sm">{selectedConversation || 'Select a chat'}</div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {conversationMessages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble max-w-[70%] p-3 mb-2 rounded-lg ${
              msg.from === 'user' ? 'bg-green-500 text-white ml-auto' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <MessageInput socket={socket} wa_id={selectedConversation} />
    </div>
  );
}

export default ChatWindow;