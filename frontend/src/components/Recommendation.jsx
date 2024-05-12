import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';

function RecommendationItem({ recommendation, socket }) {
  const { user } = useUserContext();

  const sendFriendReq = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/friendships/friends/${user.userId}`, {
        user_id_2: recommendation.recommendId,
      });
      socket.emit('send_notifications', {
        userId: recommendation.recommendId,
        type: 'friend_request',
        notification: `${user.username} has send you a friend request`,
        timestamp: Date.now(),
        senderId: user.userId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex-between px-4 py-2 border-2 my-4'>
      <p className='text-lg'>{recommendation.User.username}</p>
      <button
        className='bg-blue-200 px-3 py-1 rounded-2xl text-xs hover:bg-blue-300'
        onClick={sendFriendReq}
      >
        Follow
      </button>
    </div>
  );
}

function Recommendation({ isOpen, socket }) {
  const { user } = useUserContext();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const getRecommendation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/recommendation/${user.userId}`);
        console.log(response);
        setRecommendations(response.data);
        console.log(recommendations);
      } catch (error) {
        console.log(error);
      }
    };
    getRecommendation();
  }, []);

  return (
    <div
      className={`absolute left-24 flex h-full flex-col items-center rounded-2xl border-solid bg-white shadow-[rgba(0,0,0,0.1)_5px_0px_10px_0px] ${!isOpen ? 'w-0 opacity-0 transition-min-width' : 'w-96 opacity-100 transition-max-width'} z-10 duration-500`}
    >
      <h1 className='w-full p-7 text-left text-3xl font-semibold border-b-2'>Who to Follow</h1>
      <div className='w-full px-7 my-2 overflow-y-auto'>
        {recommendations.length > 0 &&
          recommendations.map((r, idx) => (
            <RecommendationItem
              recommendation={r}
              socket={socket}
              key={idx}
            />
          ))}
      </div>
    </div>
  );
}

export default Recommendation;
