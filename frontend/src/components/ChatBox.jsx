import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';

import testProfileImg from '../assets/test/phuc-lai-test.jpg';
import comments from '../test/comments';

import Message from './Message';
import { userReducer } from '../context/UserContext';
import { useUserContext } from '../hooks/useUserContext';

function ChatBox({ socket }) {
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const { user } = useUserContext();
  const scrollableDivRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    socket.emit('join_room', 'test');
  });

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messageHistory]);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      // Update messageHistory state with the new message
      setMessageHistory((prevMessageHistory) => [...prevMessageHistory, { message: data.message, username: data.author, time: data.time }]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [socket]);

  const handleMessageSend = async (event) => {
    event.preventDefault();
    // Handle Comment Submit
    const messageBody = {
      room: 'test',
      author: user.username,
      message: message,
      time: new Date(Date.now()),
    };

    await socket.emit('send_message', messageBody);
    setMessageHistory([...messageHistory, { message: message, username: user.username, time: messageBody.time }]);
    console.log(messageHistory);
    setMessage('');

    /* const response = await axios.post(`http://localhost:3000/api/posts/${postId}/comments`, {
      userId : user.userId,
      text: comment
    }); */
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
  return (
    <div className='w-[70%]'>
      <div className='h-[10%] flex-start p-5 border-b-2'>
        <img
          src={testProfileImg}
          alt='user Profile Picture'
          className='w-10 h-10 rounded-full'
        />
        <span>Chat</span>
      </div>
      <div className='h-[90%] flex-start flex-col'>
        <div
          className='flex-1 w-full overflow-y-auto p-5 flex flex-col scroll-auto'
          ref={scrollableDivRef}
        >
          {messageHistory.map((message, idx) => (
            <Message
              username={message.username}
              message={message.message}
              time={message.time}
            />
          ))}
        </div>
        <form
          onSubmit={handleMessageSend}
          className='flex-center mt-2 w-full py-3 px-4'
        >
          <textarea
            placeholder='Message...'
            className='no-scrollbar max-h-[100px] flex-1 resize-none overflow-visible text-xs outline-none border-2 rounded-2xl px-3 py-2 h-[auto]'
            onChange={(event) => setMessage(event.target.value)}
            onInput={handleInput}
            onKeyDown={handleEnterSubmit}
            maxLength={500}
            rows={1}
            value={message}
          />
          {message.length > 0 && <button className='ml-2 h-5 text-[13px] font-semibold text-blue-400'>Send</button>}
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
