import { useState, useEffect } from 'react';
import MessageInput from './MessageInput';

function ChatWindow({ socket }) {
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect(() => {
    if (messages.length > 0 && !selectedConversation) {
      setSelectedConversation(messages[0].wa_id);
    }
  }, [messages, selectedConversation]);

  const conversationMessages = messages.filter((msg) => msg.wa_id === selectedConversation);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="font-semibold">{selectedConversation || 'Select a chat'}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700">
        {conversationMessages.map((msg, index) => (
          <div
            key={index}
            className={`message-bubble ${msg.from === 'user' ? 'sent' : 'received'} mb-2`}
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