import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import io from 'socket.io-client';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import UserProfile from './pages/UserProfile';
import PostPage from './pages/PostPage';

import { useUserContext } from './hooks/useUserContext';

const socket = io.connect('http://localhost:3001');

function App() {
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      socket.emit('join_notifications', user.userId);
    }
  }, [user]);

  return (
    <div className='relative flex h-screen w-screen'>
      <BrowserRouter>
        {user && <Navbar socket={socket} />}
        <Routes>
          <Route
            path='/home'
            element={<Home />}
          />
          <Route
            path='/'
            element={<Signup />}
          />
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='/:userId'
            element={<Profile />}
          />
          <Route
            path='/chat'
            element={<Chat socket={socket} />}
          />
          <Route
            path='/post/:postId'
            element={<PostPage />}
          />
          <Route
            path='/user/:userId'
            element={<UserProfile socket={socket} />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
