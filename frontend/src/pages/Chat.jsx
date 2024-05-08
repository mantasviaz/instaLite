import React, { useEffect, useState } from 'react';
import { useUserContext } from '../hooks/useUserContext';

import ChatBox from '../components/ChatBox';
import FriendList from './FriendList';

function Chat({ socket }) {
  const [userClicked, setUserClicked] = useState(null);
  const { user } = useUserContext();

  return (
    <div className='flex-1 flex'>
      <div className='w-[30%] border-r-2'>
        <div className='border-b-2 p-5'>
          {user && <h1 className='font-bold cursor-pointer'>{user.username}</h1>}
          <div className='mt-2'>
            <span className='text-xs font-semibold'>Messages</span>
          </div>
        </div>
        <FriendList setUserClicked={setUserClicked} />
      </div>
      {userClicked !== null && (
        <ChatBox
          socket={socket}
          clickedUser={userClicked}
        />
      )}
    </div>
  );
}

export default Chat;
