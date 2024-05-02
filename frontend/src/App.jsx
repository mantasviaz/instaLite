import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import FriendList from "./pages/FriendList";
import ImagePostPage from "./pages/ImagePostPage";
import TextPostPage from "./pages/TextPostPage";

function App() {
  return (
    <div className="relative flex h-screen w-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/friends" element={<FriendList />} />
          <Route path="/image-post" element={<ImagePostPage />} />
          <Route path="/text-post" element={<TextPostPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
