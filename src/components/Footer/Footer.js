import React from "react";

export default function Footer({myRef}) {
  return (
    // <div className="">
    <footer style={{transformOrigin:"bottom left"}} ref={myRef} className="bg-[#26435F] text-[#FFFFFF] py-[18px] w-[1920px] design:ml-[calc(50vw-960px)]">
      <div className="flex text-base font-medium justify-between">
        <p className="ml-[74px]">
          Copyright © Evallo Digital Products LLC Limited
        </p>
        <div className="flex mr-[45px] text-base">
          <a href="http://evallo.org/tou">Terms Of Usage</a>
          <a href="http://evallo.org/privacy-policy" className="ml-6">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
    // </div>
  );
}
