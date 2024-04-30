import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import FriendList from "./pages/FriendList";

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
