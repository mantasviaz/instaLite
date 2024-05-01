import React, { useState } from "react";

import testImage from "../assets/test/ameer-umar-test.jpg";
import comments from "../test/comments";
import heartFilledLogo from "../assets/logos/heart-fill.svg";
import heartLogo from "../assets/logos/heart.svg";

function ImagePostPage() {
  const [comment, setComment] = useState("");
  const [likedPost, setLikedPost] = useState(false);

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleInput = (event) => {
    event.target.style.height = "auto";
    event.target.style.height = event.target.scrollHeight + "px";
  };

  function handleCommentSubmit(event) {
    event.preventDefault();
    // Handle Comment Submit
    setComment("");
  }

  const handleEnterSubmit = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  };
  const handleLike = () => {
    setLikedPost(!likedPost);
  };
  return (
    <div className="flex-center flex-1">
      <div className="flex h-[85%] w-[80%]">
        <div className="flex-center test-green h-full w-[60%] bg-black">
          <img
            src={testImage}
            alt="Post Image"
            className="h-full object-contain"
          />
        </div>
        <div className="flex-start w-[40%] flex-col border-2">
          <div className="flex-start w-full border-b-2 p-3">
            <img
              src={testImage}
              alt="User Profile Image"
              className="mr-3 h-[48px] w-[48px] rounded-full"
            />
            <span className="text-md cursor-pointer font-semibold hover:font-bold">
              username2319478012
            </span>
          </div>
          <div className="no-scrollbar overflow-y-auto px-8">
            {comments.map((comment, idx) => (
              <p className="my-2 text-sm" key={idx}>
                <strong className="mr-2 cursor-pointer">
                  {comment.username}
                </strong>
                {comment.comment}
              </p>
            ))}
          </div>
          <div className="flex-start w-full p-2">
            <img
              src={!likedPost ? heartLogo : heartFilledLogo}
              alt="Like Button"
              className="mr-3 h-[24px] w-[24px] cursor-pointer"
              onClick={handleLike}
            />
            <span>1232 Likes</span>
          </div>
          <form
            onSubmit={handleCommentSubmit}
            className="flex-center w-full px-3 py-2"
          >
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
      </div>
    </div>
  );
}

export default ImagePostPage;
