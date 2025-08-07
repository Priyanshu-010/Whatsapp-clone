import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChat } from '../redux/slices/chatSlice';

const ChatList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.chat.conversations);

  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      {conversations.map((conv) => (
        <div
          key={conv._id}
          className="p-4 border-b cursor-pointer hover:bg-gray-100"
          onClick={() => dispatch(setSelectedChat(conv))}
        >
          <h3 className="font-medium">{conv.user_name || conv._id}</h3>
          <p className="text-sm text-gray-500">{conv._id}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatList;