import React, { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';

import ChatBox from '../components/ChatBox';
import FriendList from './FriendList';
import GroupChat from '../components/GroupChat';

function Chat({ socket }) {
  const [userClicked, setUserClicked] = useState(null);
  const [chatIdClicked, setChatIdClicked] = useState(null);
  const [clickedGroupChat, setClickedGroupChat] = useState(false);
  const { user } = useUserContext();

  useEffect(() => {
    console.log({ chatIdClicked, clickedGroupChat });
  });

  return (
    <div className='flex-1 flex'>
      <div className='w-[30%] border-r-2'>
        <div className='border-b-2 p-5'>
          {user && <h1 className='font-bold cursor-pointer'>{user.username}</h1>}
          <div className='mt-2'>
            <span className='text-xs font-semibold'>Friends</span>
          </div>
        </div>
        <FriendList
          setUserClicked={setUserClicked}
          setClickedGroupChat={setClickedGroupChat}
          setChatIdClicked={setChatIdClicked}
        />
        <GroupChat
          setChatIdClicked={setChatIdClicked}
          setClickedGroupChat={setClickedGroupChat}
          setUserClicked={setUserClicked}
        />
        <button
          onClick={async () => {
            await socket.emit('send_notifications', { userId: 8, notification: 'Send chat request', type: 'chat' });
          }}
        >
          Send Notificaitons
        </button>
      </div>
      <ChatBox
        socket={socket}
        clickedUser={userClicked}
        setUserClicked={setUserClicked}
        clickedChatId={chatIdClicked}
        clickedGroupChat={clickedGroupChat}
        setClickedGroupChat={setClickedGroupChat}
      />
    </div>
  );
}

export default Chat;
