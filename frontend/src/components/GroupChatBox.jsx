import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import axios from 'axios';

import Message from './Message';
import { useUserContext } from '../hooks/useUserContext';

import addLogo from '../assets/logos/person-add.svg';
import closeLogo from '../assets/logos/x.svg';

function GroupChatBox({ socket, clickedGroupChat, setClickedGroupChat }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [userIsTyping, setUserIsTyping] = useState('');
  const [inviteBox, setInviteBox] = useState(false);
  const [usersBox, setUsersBox] = useState(false);
  const [userInvited, setUserInvited] = useState(null);
  const [users, setUsers] = useState([]);
  const { user } = useUserContext();
  const scrollableDivRef = useRef(null);

  const clickYes = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/chats/requests', {
        chatId: clickedGroupChat,
        userId: user.userId,
      });

      console.log(response);
      if (response.status === 200) {
        setStatus('joined');
        socket.emit('send_notifications', {
          userId: clickedUser,
          type: 'chat',
          notification: `${user.username} accepted your group chat request`,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clickNo = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/chats/decline', {
        chatId: clickedGroupChat,
        userId: user.userId,
      });
      if (response.status === 200) {
        setClickedGroupChat(null);
        socket.emit('send_notifications', {
          userId: clickedUser,
          type: 'chat',
          notification: `${user.username} declined your group chat request`,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getChat = async () => {
      console.log(clickedGroupChat);
      if (!clickedGroupChat) return;
      try {
        const response = await axios.get(`http://localhost:3000/api/chats/groupchats/${clickedGroupChat}/users`);
        console.log(response);
        setName(response.data[0].Chat.name);
        setUsers(response.data);
        const currUser = response.data.filter((u) => u.userId === user.userId); // Current User
        const usersStatus = [...response.data.map((u) => u.status)];
        const joinedUsers = usersStatus.filter((status) => status === 'joined');
        setStatus(currUser[0].status === 'pending' ? 'pending' : joinedUsers.length > 2 ? 'joined' : 'waiting');
      } catch (error) {
        console.log(error);
      }
    };

    const getMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chats/${clickedGroupChat}/messages`);
        console.log(response);
        // Sort by timestamp
        const sortedMessages = response.data.sort((a, b) => a.timestamp - b.timestamp);
        const messages = sortedMessages.map((msg) => {
          return { message: msg.text, username: msg.User.username, time: msg.timestamp };
        });
        setMessageHistory(messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
    getChat();
    socket.emit('join_room', clickedGroupChat);
  }, []);

  // Automatically scroll to the bottom
  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      // Update messageHistory state with the new message
      setMessageHistory((prevMessageHistory) => [...prevMessageHistory, { message: data.message, username: data.author, time: data.time }]);
    });

    socket.on('user_is_typing', (data) => {
      setUserIsTyping(data.username);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_is_typing');
    };
  }, [socket]);

  const handleMessageSend = async (event) => {
    event.preventDefault();
    const messageBody = {
      room: clickedGroupChat,
      author: user.username,
      userId: user.userId,
      message: message,
      time: new Date(Date.now()),
    };

    await socket.emit('send_message', messageBody);
    setMessageHistory([...messageHistory, { message: message, username: user.username, time: messageBody.time }]);
    console.log(messageHistory);
    setMessage('');
    socket.emit('user_typing', { room: clickedGroupChat, username: '' });
  };

  const handleInput = (event) => {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
  };

  const handleEnterSubmit = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      handleMessageSend(event);
    }
  };

  const handleInvite = async (event) => {
    event.preventDefault();
    try {
      console.log({
        chatId: clickedGroupChat,
        username: userInvited,
        userId: user.userId,
      });
      const response = await axios.post('http://localhost:3000/api/chats/send', {
        chatId: clickedGroupChat,
        username: userInvited,
        userId: user.userId,
        groupChatName: name,
      });
      console.log(response);
      socket.emit('send_notifications', {
        userId: response.data.userId,
        type: 'chat_request',
        notification: `${user.username} has invited you to a group chat called ${name}`,
        timestamp: Date.now(),
      });
      setInviteBox(false);
    } catch (error) {
      window.alert(error.response.data.error);
    }
    console.log('INVITE');
  };

  return (
    <>
      <div className='w-[70%] relative'>
        {status === 'waiting' ? (
          <div className='h-full w-full flex-center'>Waiting for all user to accept...</div>
        ) : status === 'pending' ? (
          <div className='flex-center h-full w-full flex-col'>
            <div className='w-[25%] flex-center flex-col'>
              <h1>Do you want to join this group chat?</h1>
              <div className='flex-between w-full my-4'>
                <button
                  className='rounded-2xl bg-green-400 px-7 py-1'
                  onClick={clickYes}
                >
                  Yes
                </button>
                <button
                  className='rounded-2xl bg-red-400 px-7 py-1'
                  onClick={clickNo}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {inviteBox && (
              <div className='absolute w-full h-48 top-1/3 flex-center'>
                <form className='bg-stone-200 flex-center flex-col py-6 px-10 rounded-3xl relative'>
                  <img
                    src={closeLogo}
                    alt='Close Logo'
                    className='w-6 h-6 absolute left-[88%] top-[5%] cursor-pointer'
                    onClick={() => setInviteBox(false)}
                  />
                  <h1 className='mb-4 '>Who do you want to invite?</h1>
                  <input
                    type='text'
                    placeholder='Enter a username...'
                    className='p-2 rounded-md outline-none'
                    onChange={(event) => setUserInvited(event.target.value)}
                  />
                  <button onClick={handleInvite}>Send</button>
                </form>
              </div>
            )}

            {usersBox && (
              <div className='absolute w-full h-48 top-1/3 flex-center'>
                <div className='bg-stone-200 flex-center flex-col py-6 px-10 rounded-3xl relative'>
                  <img
                    src={closeLogo}
                    alt='Close Logo'
                    className='w-6 h-6 absolute left-[88%] top-[5%] cursor-pointer'
                    onClick={() => setUsersBox(false)}
                  />
                  <h1 className='mb-4 '>{`Users in ${name}`}</h1>
                  {users.map((u) => (
                    <p>{u.User.username}</p>
                  ))}
                </div>
              </div>
            )}

            <div className='h-[10%] flex-between p-5 border-b-2'>
              {name && (
                <span
                  className='cursor-pointer font-semibold text-lg hover:font-bold'
                  onClick={() => setUsersBox(true)}
                >
                  {name}
                </span>
              )}
              <img
                src={addLogo}
                alt='Invite Logo'
                className='w-7 h-7 cursor-pointer'
                onClick={() => setInviteBox(true)}
              />
            </div>
            <div className='h-[90%] flex-start flex-col'>
              <div
                className='flex-1 w-full overflow-y-auto p-5 flex flex-col scroll-auto'
                ref={scrollableDivRef}
              >
                {messageHistory.map((message, idx) => (
                  <Message
                    key={idx}
                    username={message.username}
                    message={message.message}
                    time={message.time}
                  />
                ))}
              </div>
              {userIsTyping !== '' && (
                <p className='text-sm'>
                  <strong>{userIsTyping}</strong> is typing...
                </p>
              )}
              <form
                onSubmit={handleMessageSend}
                className='flex-center mt-2 w-full py-3 px-4'
              >
                <textarea
                  placeholder='Message...'
                  className='no-scrollbar max-h-[100px] flex-1 resize-none overflow-visible text-xs outline-none border-2 rounded-2xl px-3 py-2 h-[auto]'
                  onChange={(event) => {
                    setMessage(event.target.value);
                    if (event.target.value === '') {
                      socket.emit('user_typing', { room: clickedGroupChat, username: '' });
                    } else {
                      socket.emit('user_typing', { room: clickedGroupChat, username: user.username });
                    }
                  }}
                  onInput={handleInput}
                  onKeyDown={handleEnterSubmit}
                  maxLength={500}
                  rows={1}
                  value={message}
                />
                {message.length > 0 && <button className='ml-2 h-5 text-[13px] font-semibold text-blue-400'>Send</button>}
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default GroupChatBox;
