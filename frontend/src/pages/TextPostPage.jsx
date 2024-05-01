import React, { useState } from "react";

import testImage from "../assets/test/ameer-umar-test.jpg";

import text_posts from "../test/text-post";
import comments from "../test/comments";

function TextPostPage() {
  const [comment, setComment] = useState("");
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
  return (
    <div className="flex-center flex-1">
      <div className="flex h-full w-[40%] flex-col border-2">
        <div className="h-[30%] w-full border-b-2 p-4">
          <div className="flex-start mb-2">
            <img
              src={testImage}
              alt="User Profile Image"
              className="mr-5 h-[64px] w-[64px] rounded-full"
            />
            <span className="cursor-pointer text-lg font-semibold hover:font-bold">
              {text_posts[0].username}
            </span>
          </div>
          <p className="text-sm">{text_posts[0].text}</p>
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
        <form
          onSubmit={handleCommentSubmit}
          className="flex-center mb-2 w-full px-3 py-2"
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
  );
}

export default TextPostPage;
