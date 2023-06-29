import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#26435F] text-[#FFFFFF] py-[18px] w-full  bottom-5%  absolute">
      <div className="flex  text-xs font-medium justify-between">
        <p className="ml-[74px]">
          Copyright © Sevenimagine Education Private Limited
        </p>
        <div className="flex mr-[45px]">
          <a href="http://evallo.org/tou">Terms of Usage</a>
          <a href="http://evallo.org/privacy-policy" className="ml-6">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
