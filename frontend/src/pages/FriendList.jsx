import React, { useEffect } from "react";

// Test
import friends from "../test/friends";

import FriendItem from "../components/FriendItem";

function FriendList() {
  useEffect(() => {
    // TO DO
    // Create API Call to get all friends
  }, []);

  return (
    <div className="flex max-h-full flex-1 flex-col items-center justify-start overflow-y-auto">
      <h1 className="m-4 text-4xl font-semibold">Your Friends</h1>
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
