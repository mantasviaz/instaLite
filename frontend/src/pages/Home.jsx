import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Test posts
import image_post_test from '../test/image-post';
import text_posts from '../test/text-post';

import ImagePost from '../components/ImagePost';
import CreatePost from '../components/CreatePost';
import TextPost from '../components/TextPost';
import { useUserContext } from '../hooks/useUserContext';

function Home() {
  const [feed, setFeed] = useState([]);
  const { user, dispatch } = useUserContext();

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/feed');
        console.log(response);
        setFeed(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFeed();
  }, []);

  return (
    <div className='flex-start max-h-full flex-1 flex-col overflow-y-auto'>
      <CreatePost />
      {/* These buttons are to test the context */}
      <button
        onClick={async () => {
          const jsonResponse = { username: 'Twitter', userId: 4 };
          localStorage.setItem('user', JSON.stringify(jsonResponse));
          dispatch({ type: 'LOGIN', payload: jsonResponse });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: 4, status: 'online' });
        }}
      >
        LOGIN TEST 1
      </button>
      <button
        onClick={async () => {
          const jsonResponse = { username: 'Twitter2', userId: 8 };
          localStorage.setItem('user', JSON.stringify(jsonResponse));
          dispatch({ type: 'LOGIN', payload: jsonResponse });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: 8, status: 'online' });
        }}
      >
        LOGIN TEST 2
      </button>
      <button
        onClick={async () => {
          const jsonResponse = { username: 'Test123', userId: 11 };
          localStorage.setItem('user', JSON.stringify(jsonResponse));
          dispatch({ type: 'LOGIN', payload: jsonResponse });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: 11, status: 'online' });
        }}
      >
        LOGIN TEST 3
      </button>
      <button
        onClick={async () => {
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: user.userId, status: 'offline' });
        }}
      >
        LOGOUT
      </button>
      {feed.length > 0 &&
        feed.map((post, idx) => (
          <TextPost
            post={post}
            key={idx}
          />
        ))}
      {/* {feed.length > 0 &&
        image_post_test.map((post, idx) => (
          <ImagePost
            username={post.username}
            text={post.text}
            img_link={post.img}
            created_date={post.created_at}
            key={idx}
          />
        ))} */}
    </div>
  );
}

export default Home;
