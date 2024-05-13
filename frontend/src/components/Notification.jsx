import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import closeLogo from '../assets/logos/x.svg';
import dateDifference from '../helper/DateDifference';
import { useUserContext } from '../hooks/useUserContext';

function NotificationItem({ data, notifications, setNotifications, socket }) {
  const { user } = useUserContext();

  const removeNotification = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/notification/${data.notificationId}`);
      console.log(response);
      if (response.status === 200) {
        setNotifications(notifications.filter((n) => n.notificationId !== data.notificationId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/friendships/friends/${user.userId}`, {
        user_id_2: data.senderId,
        status: 'friends',
      });
      removeNotification();
      socket.emit('send_notifications', {
        userId: response.data.user_id_1 == user.userId ? response.data.user_id_2 : response.data.user_id_1,
        type: 'friend_status',
        notification: `${user.username} has accepted your friend request`,
        timestamp: Date.now(),
        senderId: user.userId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const denyFriendRequest = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/friendships/friends/${user.userId}/${data.senderId}`);
      console.log(response);
      removeNotification();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='w-[95%] text-left border-2 px-7 py-4 my-2 rounded-lg hover:bg-slate-100'>
      <div className='w-full flex-between h-6'>
        <span className='text-sm'>{dateDifference(new Date(data.created_at))}</span>
        <img
          src={closeLogo}
          alt='Close Logo'
          className='cursor-pointer w-5 h-5 hover:w-6 hover:h-6'
          onClick={removeNotification}
        />
      </div>
      <div className='text-sm'>{data.text}</div>
      {data.type === 'friend_request' && (
        <div className='mt-2'>
          <button
            className='bg-green-400 rounded-2xl px-4 text-xs py-1 mr-4 hover:bg-green-500'
            onClick={acceptFriendRequest}
          >
            Accept
          </button>
          <button
            className='bg-red-400 rounded-2xl px-4 text-xs py-1 hover:bg-red-500'
            onClick={denyFriendRequest}
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}

function Notification({ isOpen, notifications, setNotifications }) {
  return (
    <div
      className={`absolute left-24 flex h-full flex-col items-center rounded-2xl border-solid bg-white shadow-[rgba(0,0,0,0.1)_5px_0px_10px_0px] ${!isOpen ? 'w-0 opacity-0 transition-min-width' : 'w-96 opacity-100 transition-max-width'} z-10 duration-500`}
    >
      <h1 className='w-full p-7 text-left text-3xl font-semibold border-b-2'>Notifications</h1>
      <div className='flex-1 w-full overflow-y-auto flex-start flex-col'>
        {notifications.map((n, idx) => (
          <NotificationItem
            data={n}
            key={idx}
            setNotifications={setNotifications}
            notifications={notifications}
          />
        ))}
      </div>
    </div>
  );
}

export default Notification;
