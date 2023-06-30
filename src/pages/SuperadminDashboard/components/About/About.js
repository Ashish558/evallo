import React from "react";
import icon from "../../../../assets/icons/VectorchevronRight.svg";
import whatsapp from "../../../../assets/icons/ri_whatsapp-fill.svg";
import linkedin from "../../../../assets/icons/mdi_linkedin.svg";
import Profile from "../../../../assets/icons/Ellipse 445staticpfp.svg";
import { aboutCardContents } from "../AllOrgs/staticData";
import AboutCard from "../AboutCard/AboutCard";
import InputSelect from "../../../../components/InputSelect/InputSelect";
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
  return (
    <>
      <div className="flex flex-col gap-3 p-3 w-[790px] bg-white shadow-xs rounded-md border border-gray-300">
        <div className="flex justify-between border-b-[1.5px] border-b-gray-300">
          <span className="flex gap-5 items-center text-[15px]">
            <a className="">About </a>

            <a className="">Org Settings </a>
            <a className="">Action Log </a>
            <a className=""> Signup Details</a>
          </span>
          <span className="flex flex-col justify-end items-end gap-1">
            <button className="bg-[#FFA28D] p-1 px-3   rounded-md text-xs text-white">
              {"12 Days"}
            </button>
            <p className="text-[#FFA28D] text-xs">1 May - May 12, 2023</p>
          </span>
        </div>
        <div className="flex flex-col gap-4 border-b-[1.5px] border-b-gray-300">
          <div className="flex  justify-between  p-2 px-3 text-sm  text-[#517CA8]">
            <div className="">
              <span className="w-[100px] mr-5">Org Type:</span>
              <span className="font-semibold">Private</span>
            </div>
            <div className="">
              <span className="w-[100px] mr-5">Location:</span>
              <span className="font-semibold">
                Bangalore, Karnataka , India
              </span>
            </div>
            <div className="">
              <span className="w-[100px] mr-5">Address:</span>
              <span className="font-semibold">B-21 New mall</span>
            </div>
          </div>
          <div className="flex gap-10  p-2 px-3 text-sm  text-[#517CA8]">
            <div className="">
              <span className="w-[100px] break-words mr-5">Year founded:</span>
              <span className="font-semibold">2002</span>
            </div>
            <div className="">
              <span className="w-[100px] mr-5">Services provides:</span>
              <span className="font-semibold">It service</span>
            </div>
          </div>
          <div className="flex gap-10  p-2 px-3 text-sm  text-[#517CA8]">
            <div className="">
              <span className="w-[100px] break-words mr-5">Website:</span>
              <span className="font-semibold">www.sevensquare.com</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-b-[1.5px] border-b-gray-300">
          <div className="flex  justify-between  p-2 px-3 text-sm  text-[#517CA8]">
            <div className="">
              <span className="w-[100px] mr-5">Subscription:</span>
              <span className="font-semibold">Taken</span>
            </div>
          </div>
          <div className="flex gap-10  p-2 px-3 text-sm  text-[#517CA8]">
            <div className="">
              <span className="w-[100px] mr-5">Status:</span>
              <span className="font-semibold">Loream isum</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col p-2 px-3 gap-2">
            <span className=" ">
              <p className="text-xs "># Tutor</p>
              <p className="font-bold">206</p>
            </span>
            <span className=" ">
              <p className="text-xs "># Tutor</p>
              <p className="font-bold">206</p>
            </span>
          </div>
          <div className="flex gap-2 ">
            {aboutCardContents.map((item, idx) => {
              return <AboutCard {...item} />;
            })}
          </div>
          <div className="bg-[#26435F] flex-1 flex flex-col rounded-md p-2 text-white ">
            <span className="flex text-xs justify-between">
              <p className="text-xs w-[50px]">Revenue Generated</p>
              <InputSelect
                placeholder="weekly"
                parentClassName="text-xs p-0 rounded-lg m-0"
                  value={""}
                inputContainerClassName="bg-[#26435F]  p-0 m-0 rounded-lg"
                optionClassName="w-[50px] text-xs px-0 mr-0 py-[1.5px]"
                //   onChange={(e) =>
                //     setValues({
                //       ...values,
                //       orgType: e,
                //     })
                //   }
                //   error={error.orgType}
              />
            </span>
            <span className="mt-3 text-center font-semibold text-lg">Week: $2000</span>
          </div>
        </div>
      </div>
    </>
  );
};
