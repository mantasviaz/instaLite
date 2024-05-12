import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

import heartFilledLogo from '../assets/logos/heart-fill.svg';
import heartLogo from '../assets/logos/heart.svg';

function ImagePostPage({ post }) {
  const [comment, setComment] = useState('');
  const [likedPost, setLikedPost] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState();
  const [comments, setComments] = useState([]);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(post.image_url);
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
  const handleLike = () => {
    setLikedPost(!likedPost);
  };

  return (
    <div className='flex-center flex-1'>
      <div className='flex h-[85%] w-[80%]'>
        <div className='flex-center test-green h-full w-[60%] bg-black'>
          <img
            src={post.image_url}
            alt='Post Image'
            className='h-full object-contain'
          />
        </div>
        <div className='flex-start w-[40%] flex-col border-2'>
          <div className='flex-center w-full border-b-2 p-3 flex-col'>
            <div className='flex-start w-full'>
              <img
                src={post.image_url}
                alt='User Profile Image'
                className='mr-3 h-[48px] w-[48px] rounded-full'
              />
              <span
                className='text-md cursor-pointer font-semibold hover:font-bold'
                onClick={() => navigate(`/user/${post.userId}`)}
              >
                {post.User.username}
              </span>
            </div>
            <p className='text-left w-full text-sm mt-2'>{post.text}</p>
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
          <div className='flex-start w-full p-2'>
            <img
              src={!likedPost ? heartLogo : heartFilledLogo}
              alt='Like Button'
              className='mr-3 h-[24px] w-[24px] cursor-pointer'
              onClick={handleLike}
            />
            <span>{numOfLikes} Likes</span>
          </div>
          <form
            onSubmit={handleCommentSubmit}
            className='flex-center w-full px-3 py-2'
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
            {comment.length > 0 && <button className='ml-2 h-5 text-[13px] font-semibold text-blue-400'>Post</button>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImagePostPage;
