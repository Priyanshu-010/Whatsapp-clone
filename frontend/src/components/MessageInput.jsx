import { useState } from 'react';

function MessageInput({ socket, wa_id }) {
  const [message, setMessage] = useState('');
  const [user_name] = useState('User'); // Default username

  const sendMessage = () => {
    if (message && wa_id) {
      const msg = {
        text: message,
        wa_id,
        from: 'user',
        timestamp: Date.now(),
        user_name,
      };
      console.log('Attempting to send message:', msg);
      socket.emit('sendMessage', msg);
      console.log('Message emitted:', msg);
      setMessage('');
    } else {
      console.log('Send failed: message or wa_id is empty', { message, wa_id });
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center">
        <button className="mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">😊</button>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-whatsapp-green dark:bg-gray-700 dark:border-gray-600"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-whatsapp-green text-white rounded-full hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;