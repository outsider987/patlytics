/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import ConfimModal from "../components/Modal/Confim";

const Hedaer = ({ className, ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <header
      className={`flex items-center justify-between opacity-100 h-[86px] sm:h-[64px] md:h-[64px] fixed left-0 right-0 top-0 z-10 px-12 sm:px-[18px] md:px-[18px] border-b border-solid border-[rgba(255,255,255,0.2)] ${className}`}
    >
      <a href="/" className="sm:w-[120px] md:w-[120px]  ">
        {/* <img src={TitleImage.src} width={174} alt="Home" /> */}
        <h1>Patlytics</h1>
      </a>
    </header>
  );
};

export default Hedaer;
