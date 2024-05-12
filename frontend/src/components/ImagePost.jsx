import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import dateDifference from '../helper/DateDifference';

import heartFilledLogo from '../assets/logos/heart-fill.svg';
import heartLogo from '../assets/logos/heart.svg';
import commentLogo from '../assets/logos/chat-left.svg';

function ImagePost({ post }) {
  const [likedPost, setLikedPost] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState();
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
    <div className='my-2 w-[26rem] border-b-2 pb-2 font-sans'>
      {/* Header div  */}
      <div className='flex-between mb-2'>
        <div className='flex-center cursor-pointer'>
          <img
            src={post.image_url}
            alt='Profile Picture'
            className='h-[24px] w-[24px] rounded-full'
          />
          <h1
            className='ml-2 text-xs font-bold hover:font-extrabold'
            onClick={() => navigate(`/user/${post.userId}`)}
          >
            {post.User.username}
          </h1>
        </div>
        <p className='text-[12px] text-neutral-500'>{dateDifference(new Date(post.created_at))}</p>
      </div>
      <div className='h-[30rem] w-[26rem] bg-black flex-center'>
        <img
          className='rounded border-0 border-white object-contain h-full'
          src={post.image_url}
          alt='Post Image'
        />
      </div>
      {/* Text Content */}
      <div
        className='text-xs my-4'
        onClick={() => navigate(`/user/${post.userId}`)}
      >
        <b className='mr-1 cursor-pointer'>{post.User.username}</b>
        {post.text}
      </div>
      {/* Button divs with like button, comment, maybe share and save */}
      <div className='flex-start my-2'>
        <img
          src={!likedPost ? heartLogo : heartFilledLogo}
          alt='Like Button'
          className='h-[24px] w-[24px] cursor-pointer'
          onClick={handleLike}
        />
        <img
          src={commentLogo}
          alt='Comment Logo'
          className='ml-2 h-[24px] w-[24px] origin-top cursor-pointer'
        />
      </div>
    </div>
  );
}

export default ImagePost;
