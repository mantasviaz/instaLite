import React, { useState } from 'react';
import axios from 'axios';
import testImg from '../assets/test/ameer-umar-test.jpg';
import { useUserContext } from '../hooks/useUserContext';

function FriendItem({ userId, username, status, setUserClicked, setClickedGroupChat, setChatIdClicked }) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [removed, setRemoved] = useState(false);
  const { user } = useUserContext();

  const handleRemove = async () => {
    console.log('REMOVE FRIEND');
    // TO DO
    // Add API to remove friend
    try {
      const response = await axios.delete(`http://localhost:3000/api/friendships/friends/${user.userId}/${userId}`);
      if (response.status === 200) {
        setRemoved(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfile = () => {
    if (status === 'offline') {
      window.alert('Cannot chat with someone offline');
    } else {
      setUserClicked(userId);
      setClickedGroupChat(false);
      setChatIdClicked(null);
    }
    console.log('CLIKCED ', userId);
  };

  return (
    !removed && (
      <div className='flex-start h-20 w-[95%]'>
        <div className='relative mr-3 h-[42px] w-[42px]'>
          <img
            src={testImg}
            alt="Friend's Profile Picture"
            className='h-[42px] w-[42px] rounded-full'
          />
          <div className={`absolute right-0 top-0 h-3 w-3 rounded-full bg-${status === 'online' ? 'green' : 'stone'}-500`}></div>
        </div>
        <div className='flex-between flex-1'>
          <span
            className='cursor-pointer text-sm'
            onClick={handleProfile}
          >
            {username}
          </span>
          {!confirmRemove ? (
            <button
              className='rounded-md bg-stone-200 px-3 py-1 text-xs hover:bg-stone-300'
              onClick={() => setConfirmRemove(!confirmRemove)}
            >
              Remove
            </button>
          ) : (
            <div className='flex items-center justify-end'>
              <button
                className='mr-2 rounded-md bg-red-400 px-3 py-1 text-xs hover:bg-red-500'
                onClick={handleRemove}
              >
                Confirm
              </button>
              <button
                className='rounded-md bg-stone-200 px-3 py-1 text-xs hover:bg-stone-300'
                onClick={() => setConfirmRemove(!confirmRemove)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}

export default FriendItem;
