import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from './features/chat/chatSlice';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { io } from 'socket.io-client';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const dispatch = useDispatch();
  const { status, conversations } = useSelector((state) => state.chat);
  const socket = io('http://localhost:3000');
  const [selectedWaId, setSelectedWaId] = useState(conversations[0]?._id || null);

  useEffect(() => {
    dispatch(fetchConversations());
    console.log('Setting up newMessage listener');
    socket.on('newMessage', (msg) => {
      console.log('Received newMessage:', msg);
      dispatch({ type: 'chat/addMessage', payload: msg });
    });

    return () => socket.disconnect();
  }, [dispatch]);

  useEffect(() => {
    if (selectedWaId) {
      socket.emit('joinChat', selectedWaId);
      console.log('Joined chat room:', selectedWaId);
    } else {
      console.log('No wa_id selected, skipping joinChat');
    }
  }, [selectedWaId, socket]);

  if (status === 'loading') return <div className="text-center p-4">Loading...</div>;
  if (status === 'failed') return <div className="text-center p-4">Error loading conversations</div>;

  return (
    <div className="flex flex-col h-screen bg-whatsapp-light dark:bg-whatsapp-dark text-gray-800 dark:text-gray-200">
      <div className="w-full p-2 bg-white dark:bg-gray-800 border-b flex justify-between items-center">
        <div className="font-bold">WhatsApp Clone</div>
        <div className="flex space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">🔍</button>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">⋮</button>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            🌙
          </button>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <ErrorBoundary>
            <ChatList onSelect={setSelectedWaId} />
          </ErrorBoundary>
        </div>
        <div className="w-3/4 flex flex-col">
          <ChatWindow socket={socket} wa_id={selectedWaId} />
        </div>
      </div>
    </div>
  );
}

export default App;