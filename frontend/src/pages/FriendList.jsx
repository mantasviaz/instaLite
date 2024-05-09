import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Test
// import friends from '../test/friends';

import FriendItem from '../components/FriendItem';
import { useUserContext } from '../hooks/useUserContext';

function FriendList({ setUserClicked, setClickedGroupChat, setChatIdClicked }) {
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
  }, [user]);

  return (
    <div className='flex max-h-[75%] flex-1 flex-col items-center justify-start overflow-y-auto test-blue'>
      {friends.map((friend, idx) => (
        <FriendItem
          key={idx}
          userId={friend.userId}
          username={friend.username}
          status={friend.status}
          setUserClicked={setUserClicked}
          setClickedGroupChat={setClickedGroupChat}
          setChatIdClicked={setChatIdClicked}
        />
      ))}
    </div>
  );
}

export default FriendList;
