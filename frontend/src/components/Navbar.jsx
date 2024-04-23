import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Logos
import instagramLogo from "../assets/logos/instagram.svg";
import homeLogo from "../assets/logos/home.svg";
import searchLogo from "../assets/logos/search.svg";
import compassLogo from "../assets/logos/compass.svg";
import reelsLogo from "../assets/logos/reels.svg";
import messageLogo from "../assets/logos/message.svg";
import notifcationsLogo from "../assets/logos/heart.svg";
import addLogo from "../assets/logos/plus-square.svg";
import listLogo from "../assets/logos/list.svg";

import Search from "./Search";

// Test Profile Img
import testProfileImg from "../assets/test/phuc-lai-test.jpg";

function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex-between w-24 flex-col border-r-2 px-2">
        <img
          src={instagramLogo}
          alt="Instagram Logo"
          className="nav-logo mt-8"
          onClick={() => navigate("/home")}
        />
        <div className="flex-between h-96 cursor-pointer flex-col">
          <img
            src={homeLogo}
            alt="Home Logo"
            className="nav-logo"
            onClick={() => navigate("/home")}
          />
          <img
            src={searchLogo}
            alt="Search Logo"
            className="nav-logo"
            onClick={() => {
              setSearchIsOpen(!searchIsOpen);
              setSidebar("search");
            }}
          />
          <img src={compassLogo} alt="Compass Logo" className="nav-logo" />
          <img src={reelsLogo} alt="Reels Logo" className="nav-logo" />
          <img src={messageLogo} alt="Message Logo" className="nav-logo" />
          <img
            src={notifcationsLogo}
            alt="Notifications Logo"
            className="nav-logo"
          />
          <img src={addLogo} alt="Add Logo" className="nav-logo" />
          <img
            src={testProfileImg}
            alt="Profile Picture"
            className="nav-logo rounded-full"
          />
        </div>
        <img src={listLogo} alt="List Logo" className="nav-logo mb-8" />
      </div>
      <img
        src={listLogo}
        alt="List Logo"
        className="mb-8 h-[32px] w-[32px] cursor-pointer"
      />
    </div>
  );
}

export default Navbar;
