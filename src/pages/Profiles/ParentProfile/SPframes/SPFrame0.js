import React from "react";
import referral from "../../../../assets/YIcons/referral.svg";
import time from "../../../../assets/YIcons/time.svg";
import bod from "../../../../assets/YIcons/bod.svg";
import industry from "../../../../assets/YIcons/Groupindustry.svg";
import dropbox from "../../../../assets/YIcons/dropbox.svg";
import accomodations from "../../../../assets/YIcons/VectorLocation.svg";
import clickArrowIcon from "../../../../assets/YIcons/clickArrow.svg";
import { useGetLinkStudentMutation } from "../../../../app/services/users";
import { useEffect } from "react";
import { useState } from "react";
const SPFrame0 = ({ userDetail, settings, toEdit, setToEdit }) => {
  const [getLink, getLinkStatus] = useGetLinkStudentMutation();


  ////console.log({userDetail});
  return (
    <div>
      <div className="bg-white mt-7  !rounded-md   shadow-[0px_0px_2.46px_0px_#00000040]  text-[#24A3D9]">
        <div className="pr-11 pl-7 py-[23px] flex gap-2 justify-between mr-8">
          <div className="flex gap-3  items-center  text-base-17-5 ">
            <span>
              <img
                className="ml-2 !w-7 !h-7 inline-block"
                src={industry}
                alt="arrow down"
              />
            </span>
            <span>
              <p className="font-semibold text-[#24A3D9]">Industry</p>
              <p className=" text-[#517CA8]">
                {userDetail?.industry ? userDetail?.industry : " "}
              </p>
            </span>
          </div>
          <div className="flex gap-3 text-base-17-5 items-center">
            <span>
              <img
                className="ml-2 !w-7 !h-7 inline-block"
                src={referral}
                alt="arrow down"
              />
            </span>
            <span>
              <p className="font-semibold text-[#24A3D9]">Referral code</p>
              <p className=" text-[#517CA8] ">
                {userDetail?.subscriptionCode
                  ? userDetail?.subscriptionCode
                  : "None"}
              </p>
            </span>
          </div>
          <div className="flex gap-3 text-base-17-5 items-center">
            <span>
              <img
                className="ml-2 !w-7 !h-7 inline-block"
                src={time}
                alt="arrow down"
              />
            </span>
            <span>
              <p className="font-semibold text-[#24A3D9]">Time Zone</p>
              <p className=" text-[#517CA8] ">
                {userDetail?.timeZone ? userDetail?.timeZone : "-"}
              </p>
            </span>
          </div>

          <div className="flex gap-3 text-base-17-5 items-center">
            <span>
              <img
                className="ml-2 !w-7 !h-7 inline-block"
                src={bod}
                alt="arrow down"
              />
            </span>
            <span>
              <p className="font-semibold text-[#24A3D9]">Birth Year</p>
              <p className=" text-[#517CA8] ">
                {userDetail?.birthyear ? userDetail?.birthyear : " "}
              </p>
            </span>
          </div>
          <div className="flex gap-3 text-base-17-5 items-center">
            <span>
              <img
                className="ml-2 !w-7 !h-7 inline-block"
                src={accomodations}
                alt="arrow down"
              />
            </span>
            <span>
              <p className="font-semibold text-[#24A3D9]">Location</p>
              <p className=" text-[#517CA8] ">
                {userDetail?.accomodations ? userDetail?.accomodations : "-"}
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame0;
