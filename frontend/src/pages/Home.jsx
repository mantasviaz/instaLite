import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Test posts
import image_post_test from '../test/image-post';
import text_posts from '../test/text-post';

import ImagePost from '../components/ImagePost';
import CreatePost from '../components/CreatePost';
import TextPost from '../components/TextPost';
import { useUserContext } from '../hooks/useUserContext';

import InfiniteScroll from 'react-infinite-scroll-component';

function Home() {
  const [feed, setFeed] = useState([]);
  const [imageFeed, setImageFeed] = useState([]);
  const { user, dispatch } = useUserContext();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchFeed = async () => {
    setLoading(true);

    console.log('calling!!');

    try {
      const response = await axios.get(`http://localhost:3000/api/allposts?page=${page}`);

      setPosts(old => [...old, ...response.data]);
      setPage(old => old + 1);

      console.log(page, response);

      console.log('HAS', hasMore);

      setHasMore(response.data?.length > 0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

    const getImageFeed = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/imagepost');
        console.log(response);
        setImageFeed(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div
      id='scrollableDiv'
      className='flex-start max-h-full flex-1 flex-col overflow-y-auto'
    >
      <CreatePost />
      {/* These buttons are to test the context */}
      {/* <button
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
          const jsonResponse = { username: 'Test1', userId: 12 };
          localStorage.setItem('user', JSON.stringify(jsonResponse));
          dispatch({ type: 'LOGIN', payload: jsonResponse });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: 12, status: 'online' });
        }}
      >
        LOGIN TEST 4
      </button>
      <button
        onClick={async () => {
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
          const response = await axios.post('http://localhost:3000/api/users/status', { userId: user.userId, status: 'offline' });
        }}
      >
        LOGOUT
      </button> */}

      <InfiniteScroll
        dataLength={posts.length}
        next={() => {console.log('try'); fetchFeed();}}
        loader={<p>LOADING EL OH EL</p>}
        hasMore={hasMore}
        endMessage={<p>THATS ALL HEHEHAHA</p>}
        scrollableTarget='scrollableDiv'
      >
        {posts.map((post, idx) => (
        post.image_url ? (
          <ImagePost
            post={post}
            key={idx}
          />
        ) : (
          <TextPost
            post={post}
            key={idx}
          />
        )
        )
        )}
      </InfiniteScroll>

      {/* {imageFeed.length > 0 &&
        imageFeed.map((post, idx) => (
          <ImagePost
            post={post}
            key={idx}
          />
        ))}
      {feed.length > 0 &&
        feed.map((post, idx) => (
          <TextPost
            post={post}
            key={idx}
          />
        ))} */}
    </div>
  );
}

export default Home;
