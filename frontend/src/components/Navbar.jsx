import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Logos
import instagramLogo from "../assets/instagram.svg";
import homeLogo from "../assets/home.svg";
import searchLogo from "../assets/search.svg";
import compassLogo from "../assets/compass.svg";
import reelsLogo from "../assets/reels.svg";
import messageLogo from "../assets/message.svg";
import notifcationsLogo from "../assets/heart.svg";
import addLogo from "../assets/plus-square.svg";
import listLogo from "../assets/list.svg";

import Search from "./Search";

function Navbar() {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [sidebar, setSidebar] = useState("");

  const navigate = useNavigate();
  return (
    <>
      <div className="flex w-24 flex-col items-center justify-between border-r-2 px-2">
        <img
          src={instagramLogo}
          alt="Instagram Logo"
          className="mt-8 h-[32px] w-[32px] cursor-pointer"
          onClick={() => navigate("/home")}
        />
        <div className="flex h-96 cursor-pointer flex-col justify-between">
          <img
            src={homeLogo}
            alt="Home Logo"
            className="h-[32px] w-[32px] cursor-pointer"
            onClick={() => navigate("/home")}
          />
          <img
            src={searchLogo}
            alt="Search Logo"
            className="h-[32px] w-[32px] cursor-pointer"
            onClick={() => {
              setSearchIsOpen(!searchIsOpen);
              setSidebar("search");
            }}
          />
          <img
            src={compassLogo}
            alt="Compass Logo"
            className="h-[32px] w-[32px]"
          />
          <img
            src={reelsLogo}
            alt="Reels Logo"
            className="h-[32px] w-[32px] cursor-pointer"
          />
          <img
            src={messageLogo}
            alt="Message Logo"
            className="h-[32px] w-[32px] cursor-pointer"
          />
          <img
            src={notifcationsLogo}
            alt="Notifications Logo"
            className="h-[32px] w-[32px] cursor-pointer"
          />
          <img
            src={addLogo}
            alt="Add Logo"
            className="h-[32px] w-[32px] cursor-pointer"
          />
        </div>
        <img
          src={listLogo}
          alt="List Logo"
          className="mb-8 h-[32px] w-[32px] cursor-pointer"
        />
      </div>
      {sidebar === "search" ? <Search isOpen={searchIsOpen} /> : <></>}
    </>
  );
}

export default Navbar;
