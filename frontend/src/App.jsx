import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FriendList from "./pages/FriendList";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="relative flex h-screen w-screen">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/friends" element={<FriendList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
