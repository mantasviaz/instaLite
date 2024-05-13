import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUserContext } from '../hooks/useUserContext';

import test_image from '../assets/test/phuc-lai-test.jpg';
import cakeLogo from '../assets/logos/cake2.svg';
import friendsLogo from '../assets/logos/person-check.svg';
import addFriendLogo from '../assets/logos/person-add.svg';
import pendingFriendLogo from '../assets/logos/person-exclamation.svg';
import settingsLogo from '../assets/logos/gear.svg';

import dateDifference from '../helper/DateDifference';

function UserProfile({ socket }) {
  const [isFriends, setIsFriends] = useState('nothing');
  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const convertBirthday = (birthday) => {
    const date = new Date(birthday);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return formattedDate;
  };

  useEffect(() => {
    const getFriendshipStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/friendships/friends/${userId}/${user.userId}`);
        console.log(response);
        setIsFriends(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
        console.log(response);
        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/posts/user/${userId}`);
        console.log(response);
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      if (userId != user.userId) {
        getFriendshipStatus();
      }
      getUserData();
      getPosts();
    }
  }, [user]);

  const sendFriendReq = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/friendships/friends/${user.userId}`, {
        user_id_2: userId,
      });
      socket.emit('send_notifications', {
        userId: userId,
        type: 'friend_request',
        notification: `${user.username} has send you a friend request`,
        timestamp: Date.now(),
        senderId: user.userId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && (
        <div className='flex-1 flex-start flex-col overflow-y-auto'>
          <div className='w-[70%]'>
            <div className='h-48 p-5 flex border-b-2'>
              <img
                src={test_image}
                alt='Profile Picture'
                className='rounded-full h-36 w-36 mr-8'
              />
              <div className='w-[50%] flex flex-col justify-center'>
                <p className='text-3xl font-semibold'>{userData.username}</p>
                <p className='text-xl'>{`${userData.first_name} ${userData.last_name}`}</p>
                <div className='flex text-xl'>
                  <img
                    src={cakeLogo}
                    alt='Birthday Icon'
                    className='mr-2'
                  />
                  <p>{convertBirthday(userData.birthday)}</p>
                </div>
                <p className='text-xl'>{`${posts.length} posts`}</p>
              </div>
              <div className='flex-1'>
                {isFriends === 'friends' && (
                  <img
                    src={friendsLogo}
                    alt='Friends Logo'
                    className='user-profile-logo'
                  />
                )}
                {isFriends === 'pending' && (
                  <img
                    src={pendingFriendLogo}
                    alt='Waiting on Request'
                    className='user-profile-logo'
                  />
                )}
                {isFriends === 'not_friends' && (
                  <img
                    src={addFriendLogo}
                    alt='Add Friends'
                    className='user-profile-logo'
                    onClick={sendFriendReq}
                  />
                )}
                {userId == user.userId && (
                  <img
                    src={settingsLogo}
                    alt='Settings Logo'
                    className='user-profile-logo'
                    onClick={() => navigate('/profile')}
                  />
                )}
              </div>
            </div>
            <div className='min-h-96'>
              {posts.map((post, idx) => (
                <>
                  {post.image_url ? (
                    <div
                      key={idx}
                      className='p-5 hover:bg-slate-100 cursor-pointer border-b-2 '
                      onClick={() => navigate(`/post/${post.postId}`)}
                    >
                      <p>{dateDifference(new Date(post.created_at))}</p>
                      <p>
                        {post.text} <span></span>
                      </p>
                      <div className='flex-center w-full'>
                        <div className='flex-center bg-black w-[65%]'>
                          <img
                            src={post.image_url}
                            alt='User Post Image'
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className='p-5 hover:bg-slate-100 cursor-pointer border-b-2'
                      onClick={() => navigate(`/post/${post.postId}`)}
                    >
                      <p>{dateDifference(new Date(post.created_at))}</p>
                      <p>
                        {post.text} <span></span>
                      </p>
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UserProfile;
