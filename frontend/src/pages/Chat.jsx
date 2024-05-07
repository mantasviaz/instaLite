import React from 'react';
import { useUserContext } from '../hooks/useUserContext';

import ChatBox from '../components/ChatBox';

function Chat({ socket }) {
  const { user } = useUserContext();
  return (
    <div className='flex-1 flex'>
      <div className='w-[30%] border-r-2'>
        <div className='border-b-2 p-5'>
          <h1 className='font-bold cursor-pointer'>{user.username}</h1>
          <div className='mt-2'>
            <span className='text-xs font-semibold'>Messages</span>
          </div>
        </div>
      </div>
      <ChatBox socket={socket} />
    </div>
  );
}

export default Chat;
