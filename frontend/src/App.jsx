import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FriendList from "./pages/FriendList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TextPostPage from "./pages/TextPostPage";
import FriendList from "./pages/FriendList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import TextPostPage from "./pages/TextPostPage";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
