import React, { useState } from "react";
import testImg from "../assets/test/ameer-umar-test.jpg";

function FriendItem({ username, status }) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handleRemove = () => {
    console.log("REMOVE FRIEND");
    // TO DO
    // Add API to remove friend
  };

  const handleProfile = () => {
    console.log("PROFILE CLICK");
    // TO DO
    // Navigate to user profile
  };

  return (
    <div className="flex-start my-2 h-20 w-72">
      <div className="relative mr-3 h-[42px] w-[42px]">
        <img
          src={testImg}
          alt="Friend's Profile Picture"
          className="h-[42px] w-[42px] rounded-full"
        />
        <div
          className={`absolute right-0 top-0 h-3 w-3 rounded-full bg-${status === "online" ? "green" : "stone"}-500`}
        ></div>
      </div>
      <div className="flex-between flex-1">
        <span className="cursor-pointer text-sm" onclick={handleProfile}>
          {username}
        </span>
        {!confirmRemove ? (
          <button
            className="rounded-md bg-stone-200 px-3 py-1 text-xs hover:bg-stone-300"
            onClick={() => setConfirmRemove(!confirmRemove)}
          >
            Remove
          </button>
        ) : (
          <div className="flex items-center justify-end">
            <button
              className="mr-2 rounded-md bg-red-400 px-3 py-1 text-xs hover:bg-red-500"
              onClick={handleRemove}
            >
              Confirm
            </button>
            <button
              className="rounded-md bg-stone-200 px-3 py-1 text-xs hover:bg-stone-300"
              onClick={() => setConfirmRemove(!confirmRemove)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendItem;
