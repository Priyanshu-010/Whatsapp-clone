import { useSelector } from 'react-redux';

function ChatList({ onSelect }) { // Accept onSelect prop
  const conversations = useSelector((state) => state.chat.conversations || []);

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Chats</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100%-60px)]">
        {conversations.map((conv) => {
          const messages = conv.messages || [];
          const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;
          return (
            <div
              key={conv._id}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => onSelect(conv._id)} // Call onSelect with wa_id
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="font-medium">{latestMessage?.user_name || 'Unknown'}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{latestMessage?.text || 'No message'}</div>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {latestMessage?.timestamp ? new Date(latestMessage.timestamp * 1000).toLocaleTimeString() : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ChatList;