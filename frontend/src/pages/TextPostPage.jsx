import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';

import heartFilledLogo from '../assets/logos/heart-fill.svg';
import heartLogo from '../assets/logos/heart.svg';
import testImage from '../assets/test/ameer-umar-test.jpg';
import twitterLogo from '../assets/logos/twitter.svg';

import text_posts from '../test/text-post';
// import comments from '../test/comments';

function TextPostPage({ post }) {
  const [comment, setComment] = useState('');
  const [numOfLikes, setNumOfLikes] = useState();
  const [likedPost, setLikedPost] = useState(false);
  const [comments, setComments] = useState([]);
  const { user } = useUserContext();

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/comments/posts/${post.postId}/comments`);
        console.log(response);
        setComments(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getLike = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/likes/${post.postId}/${user.userId}`);
        setLikedPost(response.data === 'liked' ? true : false);
      } catch (error) {
        console.log(error);
      }
    };

    const getNumOfLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/likes/${post.postId}`);
        setNumOfLikes(response.data.num_of_likes);
      } catch (error) {
        console.log(error);
      }
    };
    getLike();
    getNumOfLikes();
    getComments();
  }, []);

  const handleLike = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/likes/${post.postId}`, {
        userId: user.userId,
        isLike: likedPost,
      });

      let updatedNumOfLikes = numOfLikes;
      if (!likedPost) {
        updatedNumOfLikes++;
      } else {
        updatedNumOfLikes--;
      }

      setNumOfLikes(updatedNumOfLikes);
      setLikedPost(!likedPost);

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event) => {
    setComment(event.target.value);
  };

  const handleInput = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    // Handle Comment Submit
    try {
      const response = await axios.post(`http://localhost:3000/api/comments/posts/${post.postId}/comments`, {
        userId: user.userId,
        text: comment,
      });
      console.log(response);
      setComment('');
      setComments((prevComments) => [...prevComments, response.data]);
      console.log(comments);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnterSubmit = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
  };
  return (
    <>
      {post && (
        <div className='flex-center flex-1'>
          <div className='flex h-full w-[40%] flex-col border-2 test-blue'>
            <div className='h-[32%] w-full border-b-2 p-4 test-red'>
              <div className='flex-start mb-2'>
                <img
                  src={post.User.username === 'Twitter' ? twitterLogo : testImage}
                  alt='User Profile Image'
                  className={`mr-5 ${post.User.username === 'Twitter' ? 'h-[48px] w-[48px]' : 'h-[64px] w-[64px]'} rounded-full`}
                />
                <span className='cursor-pointer text-lg font-semibold hover:font-bold'>{post.User.username}</span>
              </div>
              <p className='text-sm flex-1'>{post.text}</p>
              <div className='flex-start mt-3'>
                <img
                  src={!likedPost ? heartLogo : heartFilledLogo}
                  alt='Like Button'
                  className='mr-3 h-[24px] w-[24px] cursor-pointer'
                  onClick={handleLike}
                />
                <span>{numOfLikes}</span>
              </div>
            </div>
            <div className='no-scrollbar overflow-y-auto px-8 flex-1'>
              {comments.map((comment, idx) => (
                <p
                  className='my-2 text-sm'
                  key={idx}
                >
                  <strong className='mr-2 cursor-pointer'>{comment.User.username}</strong>
                  {comment.text}
                </p>
              ))}
            </div>
            <form
              onSubmit={handleCommentSubmit}
              className='flex-center mb-2 w-full px-3 py-2'
            >
              <textarea
                placeholder='Add a comment...'
                className='no-scrollbar max-h-[100px] flex-1 resize-none overflow-visible text-xs outline-none'
                onChange={handleChange}
                onInput={handleInput}
                onKeyDown={handleEnterSubmit}
                maxLength={500}
                rows={1}
                value={comment}
              />
              {comment.length > 0 && <button className='ml-2 h-5 text-[13px] font-semibold text-blue-400 hover:text-blue-500'>Post</button>}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default TextPostPage;
