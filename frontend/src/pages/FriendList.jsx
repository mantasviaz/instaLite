import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Test
// import friends from '../test/friends';

import FriendItem from '../components/FriendItem';
import { useUserContext } from '../hooks/useUserContext';

function FriendList() {
  const [friends, setFriends] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    // TO DO
    // Create API Call to get all friends
    const getFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/friendships/friends/${user.userId}`);
        setFriends(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, []);

  return (
    <div className='flex max-h-full flex-1 flex-col items-center justify-start overflow-y-auto'>
      <h1 className='m-4 text-4xl font-semibold'>Your Friends</h1>
      {friends.map((friend, idx) => (
        <FriendItem
          key={idx}
          username={friend.username}
          status={friend.status}
        />
      ))}
    </div>
  );
}

export default FriendList;
