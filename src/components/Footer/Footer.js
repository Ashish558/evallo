import React from "react";

export default function Footer({myRef}) {
  return (
    // <div className="">
    <footer style={{transformOrigin:"bottom left"}} ref={myRef} className="bg-[#26435F] text-[#FFFFFF] pt-[23px] pb-[25px] w-[1920px] bottom-[0] design:ml-[calc(50vw-960px)] pl-[92px] pr-[54px]">
      <div className="flex text-[16px] leading-[19.2px] font-medium justify-between">
        <p className="">
          Copyright © Evallo Digital Products LLC Limited
        </p>
        <div className="flex mr-[45px] text-[16px] leading-[19.2px]">
          <a href="http://evallo.org/tou">Terms Of Usage</a>
          <a href="http://evallo.org/privacy-policy" className="">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
    // </div>
  );
}
