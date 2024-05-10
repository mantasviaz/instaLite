import React, { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';
import axios from 'axios';

function GroupChatItem({ setClickedGroupChat, setUserClicked, chatId, name }) {
  const handleClick = () => {
    setClickedGroupChat(chatId);
    setUserClicked(null);
    console.log({ chatId, name });
  };
  return (
    <p
      onClick={handleClick}
      className='cursor-pointer hover:bg-slate-100 text-lg border-2 p-5 m-2'
    >
      {name}
    </p>
  );
}

function GroupChat({ setClickedGroupChat, setUserClicked }) {
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
    <div className='flex flex-1 flex-col justify-start'>
      <h2 className='text-normal font-semibold px-5 mt-2'>Group Chats</h2>
      <div className=' overflow-y-auto'>
        {groupChats.map((gc, idx) => (
          <GroupChatItem
            key={idx}
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
