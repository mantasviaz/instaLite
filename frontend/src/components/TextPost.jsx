import React, { useEffect, useState } from 'react';
import axios from 'axios';

import testImage from '../assets/test/ameer-umar-test.jpg';
import heartFilledLogo from '../assets/logos/heart-fill.svg';
import heartLogo from '../assets/logos/heart.svg';
import commentLogo from '../assets/logos/chat-left.svg';
import twitterLogo from '../assets/logos/twitter.svg';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../hooks/useUserContext';

function TextPost({ post, num_of_likes }) {
  const [likedPost, setLikedPost] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(num_of_likes);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div className='my-2 w-[26rem] border-b-2 pb-2 font-sans text-xs'>
      <div className='flex-start'>
        <img
          src={post.User.username === 'Twitter' ? twitterLogo : testImage}
          alt='User Profile Image'
          className='mr-2 h-[24px] w-[24px] rounded-full'
        />
        <h1 className='cursor-pointer font-semibold hover:font-bold'>{post.User.username}</h1>
      </div>

      <p className='my-2 pb-2'>{post.text}</p>
      <div className='flex-start my-2'>
        <img
          src={!likedPost ? heartLogo : heartFilledLogo}
          alt='Like Button'
          className='h-[18px] w-[18px] cursor-pointer'
          onClick={handleLike}
        />
        <span className='mx-1'>{numOfLikes}</span>
        <img
          src={commentLogo}
          alt='Comment Logo'
          className='ml-2 h-[18px] w-[18px] origin-top cursor-pointer'
          onClick={() => navigate(`/post/${post.postId}`)}
        />
      </div>
    </div>
  );
}

export default TextPost;
