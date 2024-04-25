import React, { useState } from "react";
import profilePic from "../assets/react.svg";
import heartLogo from "../assets/logos/heart.svg";
import heartFilledLogo from "../assets/logos/heart-fill.svg";

function ImagePost({ username, text, img_link, created_date, profile_pic }) {
  const [comment, setComment] = useState("");
  const [likeHover, setLikeHover] = useState(false);

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
      setComment("");
    }
  };

  return (
    <div className="my-2 w-[26rem] border-b-2 pb-2 font-sans">
      {/* Header div  */}
      <div className="flex-between mb-2">
        <div className="flex-center cursor-pointer">
          <img
            src={img_link}
            alt="Profile Picture"
            className="h-[24px] w-[24px] rounded-full"
          />
          <h1 className="ml-2 text-xs font-bold">{username}</h1>
        </div>
        <p className="text-[12px] text-neutral-500">{created_date}</p>
      </div>
      <img
        className="h-[30rem] w-[26rem] rounded border-0 border-white"
        src={img_link}
        alt="Post Image"
      />
      {/* Button divs with like button, comment, maybe share and save */}
      <div className="my-2">
        <img
          src={!likeHover ? heartLogo : heartFilledLogo}
          alt="Like Button"
          className="h-[24px] w-[24px] cursor-pointer"
          onMouseOver={() => setLikeHover(true)}
          onMouseOut={() => setLikeHover(false)}
        />
      </div>
      {/* Text Content */}
      <p className="text-xs">
        <b className="mr-1 cursor-pointer">{username}</b>
        {text}
      </p>
      {/* Comment Section */}
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

export default ImagePost;
