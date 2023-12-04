import React from "react";
import { aboutCardContents } from "../AllOrgs/staticData";
import AboutCard from "../AboutCard/AboutCard";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import { useGetTotalHoursMutation } from "../../../../app/services/superAdmin";
import { useEffect } from "react";
import { useState } from "react";

import RangeDate from "../../../../components/RangeDate/RangeDate";

const SubFrame0 = ({ userData }) => {
  const [fetchTotalhours, status] = useGetTotalHoursMutation()
  const [totalHours, setTotalHours] = useState({})

  useEffect(() => {
    fetchTotalhours({ orgId: userData.associatedOrg }).then((res) => {
      console.log(res)
      setTotalHours(res?.data)
    }).catch(err => {
      console.log(err)
    })
  }, [userData]);

  const handleRangeData = ()=>{

  }

  return (
    <div className="flex flex-col gap-5 ">
      <div className="">
        <div className="grid gap-x-[15%] gap-y-[18%] grid-cols-3 ml-[5%] mr-[7%]  text-base-18 text-[#517CA8] mt-[42px] ">
          <div className="text-left w-[275px] ">
            <span className=" pr-3 font-light">Org Type:</span>
            <span className="">{userData?.companyType}</span>
          </div>
          <div className="text-left font-light w-[275px]">
            <span className="pr-3">Location: </span>
            <span className="">
              {userData?.city}, {userData?.state}, {userData?.country}
            </span>
          </div>
          <div className="text-left font-light">
            <span className="   pr-3">Address:</span>
            <span className="">{userData?.address}</span>
          </div>
          <div className="text-left font-light">
            <span className="pr-3">Year founded:</span>
            <span className="">
              {new Date(userData?.createdAt).getFullYear()}
            </span>
          </div>
          {console.log(userData)}
          <div className="text-left col-span-2 font-light">
            <span className="pr-3">Services provides:</span>
            <span className="">IT service</span>
          </div>
          <div className="text-left font-light">
            <span className="pr-3">Website:</span>
            <span className="">{userData?.website}</span>
          </div>
        </div>
      </div>
      <div className="h-[1.33px] bg-gray-300 w-full mt-[40px]"></div>
      <div className="flex flex-col gap-4 pl-[5%]">
        <div className="flex  justify-between  py-2 pr-3 text-base-18  text-[#517CA8]">
          <div className="">
            <span className=" mr-3 font-light">Subscription:</span>
            <span className="">Taken</span>
          </div>
        </div>
        <div className="flex gap-10  py-2 pr-3 text-base-18  text-[#517CA8]">
          <div className="">
            <span className=" mr-3 font-light">Status:</span>
            <span className="">{userData?.userStatus}</span>
          </div>
        </div>
      </div>
      <div className="h-[1.33px] bg-gray-300 w-full "></div>
      <div className="flex w-full flex-grow-1 overflow-x-auto custom-scroller-2">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-full flex flex-col justify-end items-end ">
              <div className="w-[75px] h-[25.333px] bg-[#FFA28D] rounded-[2.667px] text-white me-6 flex justify-center items-center" >
                12 Days
              </div>
              <div>
              <RangeDate
              optionClassName="!w-min"
              inputContainerClassName="!w-min "
              handleRangeData={handleRangeData}
            />
              </div>
          </div>
            <div className="w-full flex justify-between items-center pr-6 ps-[56px]">
            <div className="flex h-[160px] flex-col justify-evenly items-center py-2 pr-3 gap-2 text-[#26435F]">
              <span className="w-full h-1/2 flex flex-col justify-start items-center">
                <p className="text-[0.8333vw] w-full text-left"># Tutors</p>
                <p className="font-medium text-[1.3542vw]">
                  {totalHours?.totalTutor}
                </p>
              </span>
              <span className="w-full h-1/2 flex flex-col justify-start items-center">
                <p className="text-[0.8333vw]"># Students</p>
                <p className="font-medium text-[1.3542vw]">
                  {totalHours?.totalStudent}
                </p>
              </span>
            </div>
            <div className="flex gap-3">
              {aboutCardContents.map((item, idx) => {
                return (
                  <AboutCard
                    heading={item.heading}
                    text={totalHours ? totalHours[item.key] : ""}
                  />
                );
              })}
            </div>
            <div className="bg-[#26435F] w-[15vw] h-[160px] rounded-md py-[26px] px-[3%] text-white ">
              <span className="flex text-xs justify-between">
                <p className="text-[0.8333vw] w-[50px] font-medium mb-[22px]">
                  Revenue Generated
                </p>
                {/* <InputSelect
              placeholder="weekly"
              parentClassName="text-xs p-0 rounded-lg m-0"
              value={""}
              inputContainerClassName="bg-[#26435F]  p-0 !m-0 rounded-lg"
              optionClassName="w-[50px] text-xs !px-0 !mr-0 !py-[1.5px]"
          
            /> */}
              </span>
              <span className="text-[1.5104vw] font-medium">
                ${totalHours?.totalPrice}
              </span>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SubFrame0;
