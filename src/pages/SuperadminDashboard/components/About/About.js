import React from "react";
import icon from "../../../../assets/icons/VectorchevronRight.svg";
import whatsapp from "../../../../assets/icons/ri_whatsapp-fill.svg";
import linkedin from "../../../../assets/icons/mdi_linkedin.svg";
import Profile from "../../../../assets/icons/Ellipse 445staticpfp.svg";
import { useState } from "react";
import SubFrame0 from "../AboutCard/SubFrame0";
import SubFrame2 from "../AboutCard/SubFrame1";
const About = () => {
  return (
    <>
      <div className="pl-16 pt-7 mb-12">
        <div className="flex gap-2 text-sm mb-10">
          <span>All Orgs</span>
          <img src={icon} alt="" />
          <span className="text-[#24A3D9]">About</span>
        </div>
        <div className="flex gap-2">
          <ProfileLeft />
          <ProfileRight />
        </div>
      </div>
    </>
  );
};

export default About;

const ProfileLeft = () => {
  return (
    <>
      <div className="flex flex-col gap-3 p-3 w-[400px] bg-white shadow-xs rounded-md border border-gray-300">
        <div className="flex gap-3 items-center">
          <img src={Profile} alt="" />
          <span className="flex flex-col text-sm text-[#517CA8]">
            <span className="flex  ">
              <p className="mr-6 w-[90px]">First name : </p>
              <p className="font-semibold"> Vishesh </p>
            </span>
            <span className="flex ">
              <p className="mr-6 w-[90px]">last name : </p>{" "}
              <p className="font-semibold"> Patel </p>
            </span>
            <span className="flex ">
              <p className="mr-6 w-[90px]">Role : </p>
              <p className="font-semibold"> CEO</p>
            </span>
          </span>
          <span className="flex gap-3 items-start">
            <img src={whatsapp} alt="" />
            <img src={linkedin} alt="" />
          </span>
        </div>
        <div className="flex bg-[#FBF9FF] rounded-md p-2 px-3 text-sm  text-[#517CA8]">
          <span className="w-[100px]">Email:</span>
          <span className="font-semibold">AdminVisheshpatel@123gmail.com</span>
        </div>
        <div className="flex  bg-[#FBF9FF] rounded-md p-2 px-3 text-sm text-[#517CA8]">
          <span className="w-[100px]">Phone:</span>
          <span className="font-semibold">999303601X</span>
        </div>
        <div className="flex  bg-[#FBF9FF] rounded-md p-2 px-3 text-sm  text-[#517CA8]">
          <span className="w-[130px]">Bio:</span>
          <span className="w-fit break-words font-semibold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris ni
          </span>
        </div>
        <div className="text-center">
          <button className="bg-[#FFA28D] p-2 px-3 rounded-md text-xs text-white">
            Admin portal
          </button>
        </div>
      </div>
    </>
  );
};

const ProfileRight = () => {
  const [subFrame, setSubFrame] = useState(0);
  return (
    <>
      <div className="flex flex-col gap-3 p-3 w-[790px] bg-white shadow-xs rounded-md border border-gray-300">
        <div className="flex rounded-sm justify-between border-b-[1.5px] border-b-gray-300">
          <span className="flex cursor-pointer gap-5 items-end py-0 relative z-20 translate-y-[2.4px] text-[15px] font-semibold">
            <a
              onClick={() => setSubFrame(0)}
              className={`px-2 py-1 rounded-sm ${subFrame===0?'border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] ':''}`}
            >
              About{" "}
            </a>

            <a onClick={() => setSubFrame(1)} className={`px-2 py-1 rounded-sm ${subFrame===1?'border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] ':''}`}>
              Org Settings{" "}
            </a>
            <a onClick={() => setSubFrame(2)} className={`px-2 py-1 rounded-sm ${subFrame===2?'border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] ':''}`}>
              Action Log{" "}
            </a>
            <a onClick={() => setSubFrame(3)} className={`px-2 py-1 rounded-sm ${subFrame===3?'border-b-[3px]  border-b-[#FFA28D]  text-[#FFA28D] ':''}`}>
              {" "}
              Signup Details
            </a>
          </span>
          <span className="flex flex-col justify-end items-end gap-1">
            <button className="bg-[#FFA28D] p-1 px-3   rounded-md text-xs text-white">
              {"12 Days"}
            </button>
            <p className="text-[#FFA28D] text-xs">1 May - May 12, 2023</p>
          </span>
        </div>
        {subFrame === 0 ? (
          <SubFrame0 />
        ) : subFrame === 1 ? (
          <></>
        ) : subFrame === 2 ? (
          <SubFrame2 />
        ) : subFrame === 3 ? (
          <></>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
