import React, { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';

import ChatBox from '../components/ChatBox';
import FriendList from './FriendList';
import GroupChat from '../components/GroupChat';
import GroupChatBox from '../components/GroupChatBox';

function Chat({ socket }) {
  const [userClicked, setUserClicked] = useState(null);
  const [clickedGroupChat, setClickedGroupChat] = useState(null);
  const { user } = useUserContext();

  useEffect(() => {
    console.log({ userClicked, clickedGroupChat });
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
        />
        <GroupChat
          setClickedGroupChat={setClickedGroupChat}
          setUserClicked={setUserClicked}
        />
      </div>
      {userClicked && (
        <ChatBox
          socket={socket}
          clickedUser={userClicked}
          setUserClicked={setUserClicked}
        />
      )}
      {clickedGroupChat && (
        <GroupChatBox
          socket={socket}
          clickedGroupChat={clickedGroupChat}
          setClickedGroupChat={setClickedGroupChat}
        />
      )}
    </div>
  );
}

export default Chat;
