import React, { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import axios from 'axios';

function GroupChatItem({ setChatIdClicked, setClickedGroupChat, setUserClicked, chatId, name }) {
  const handleClick = () => {
    setChatIdClicked(chatId);
    setClickedGroupChat(true);
    setUserClicked(null);
    console.log({ chatId, name });
  };
  return (
    <p
      onClick={handleClick}
      className='cursor-pointer'
    >
      {name}
    </p>
  );
}

function GroupChat({ setChatIdClicked, setClickedGroupChat, setUserClicked }) {
  const [groupChats, setGroupChats] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    const getGroupChats = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chats/groupchats/${user.userId}`);
        console.log(response);
        setGroupChats(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getGroupChats();
    }
  }, [user]);

  return (
    <div className='flex max-h-[25%] flex-1 flex-col items-center justify-start overflow-y-auto test-blue'>
      <h2>Group Chats</h2>
      <div>
        {groupChats.map((gc, idx) => (
          <GroupChatItem
            key={idx}
            setChatIdClicked={setChatIdClicked}
            setClickedGroupChat={setClickedGroupChat}
            chatId={gc.Chat.chatId}
            name={gc.Chat.name}
            setUserClicked={setUserClicked}
          />
        ))}
      </div>
    </div>
  );
}

export default GroupChat;
