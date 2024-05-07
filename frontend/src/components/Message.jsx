import React from 'react';
import { useUserContext } from '../hooks/useUserContext';

function Message({ username, message }) {
  const { user } = useUserContext();
  return <div className={`${user.username === username ? 'text-right' : 'text-left'}`}>{message}</div>;
}

export default Message;
