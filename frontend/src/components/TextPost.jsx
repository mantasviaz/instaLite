import React, { useState } from "react";

import testImage from "../assets/test/ameer-umar-test.jpg";
import heartFilledLogo from "../assets/logos/heart-fill.svg";
import heartLogo from "../assets/logos/heart.svg";
import commentLogo from "../assets/logos/chat-left.svg";

function TextPost({ username, content, num_of_likes }) {
  const [comment, setComment] = useState("");
  const [likedPost, setLikedPost] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(num_of_likes);

  function handleCommentSubmit(event) {
    event.preventDefault();
    // Handle Comment Submit
    setComment("");
  }

  const handleInput = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  const handleEnterSubmit = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      setComment("");
    }
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleLike = () => {
    let updatedNumOfLikes = numOfLikes;
    if (!likedPost) {
      updatedNumOfLikes++;
    } else {
      updatedNumOfLikes--;
    }

    setNumOfLikes(updatedNumOfLikes);
    setLikedPost(!likedPost);
  };
  return (
    <div className="my-2 w-[26rem] border-b-2 pb-2 font-sans text-xs">
      <div className="flex-start">
        <img
          src={testImage}
          alt="User Profile Image"
          className="mr-2 h-[24px] w-[24px] rounded-full"
        />
        <h1 className="cursor-pointer font-semibold hover:font-bold">
          {username}
        </h1>
      </div>

      <p className="my-2">{content}</p>
      <div className="flex-start my-2">
        <img
          src={!likedPost ? heartLogo : heartFilledLogo}
          alt="Like Button"
          className="h-[18px] w-[18px] cursor-pointer"
          onClick={handleLike}
        />
        <span className="mx-1">{numOfLikes}</span>
        <img
          src={commentLogo}
          alt="Comment Logo"
          className="ml-2 h-[18px] w-[18px] origin-top cursor-pointer"
        />
      </div>
      <form onSubmit={handleCommentSubmit} className="flex-center mt-2">
        <textarea
          placeholder="Add a comment..."
          className="no-scrollbar max-h-[100px] flex-1 resize-none overflow-visible text-xs outline-none"
          onChange={handleChange}
          onInput={handleInput}
          onKeyDown={handleEnterSubmit}
          maxLength={500}
          rows={1}
          value={comment}
        />
        {comment.length > 0 && (
          <button className="ml-2 h-5 text-[13px] font-semibold text-blue-400">
            Post
          </button>
        )}
      </form>
    </div>
  );
}

export default TextPost;
