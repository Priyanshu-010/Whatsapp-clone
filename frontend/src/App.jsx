import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import { fetchConversations } from './redux/slices/chatSlice';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';

function App() {
  const dispatch = useDispatch();
  const selectedChat = useSelector((state) => state.chat.selectedChat);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);


  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList />
      {selectedChat ? (
        <ChatWindow />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a chat to start messaging</p>
        </div>
      )}
    </div>
  )
}

export default App
