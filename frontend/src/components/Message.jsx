import React from 'react';
import { useUserContext } from '../hooks/useUserContext';
import dateDifference from '../helper/DateDifference';

function Message({ username, message, time }) {
  const { user } = useUserContext();
  const timeStamp = dateDifference(new Date(time));
  return (
    <>
      <p className={`${user.username === username ? 'text-right' : 'text-left'} text-xs`}>{timeStamp}</p>
      <div className={`${user.username === username ? 'self-end' : 'self-start'} max-w-[50%] max-h-48 flex flex-col `}>
        <p className={`${user.username === username ? 'text-white bg-sky-500' : 'bg-[#EFEFEF] text-black'} text-pretty text-white bg-sky-500 py-2 px-4 my-2 rounded-3xl`}>{message}</p>
      </div>
    </>
  );
}

export default Message;
