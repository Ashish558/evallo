import React from "react";
import { aboutCardContents } from "../AllOrgs/staticData";
import AboutCard from "../AboutCard/AboutCard";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import { useGetTotalHoursMutation } from "../../../../app/services/superAdmin";
import { useEffect } from "react";
import { useState } from "react";

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
  }, [userData])
  return (
    <div className="flex flex-col gap-5 ">
      <div className="">
        <div className="grid gap-x-[17%] gap-y-[20%] grid-cols-3  ml-[5%] mr-[9%]  text-base-18 text-[#517CA8] mt-[42px] ">
          <div className="text-left">
            <span className=" pr-3 font-light">Org Type:</span>
            <span className="">{userData?.companyType}</span>
          </div>
          <div className="text-left font-light">
            <span className="   pr-3">Location: </span>
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
          <div className="text-left col-span-2 font-light">
            <span className="pr-3">Services provides:</span>
            <span className="">
              IT service
            </span>
          </div>
          <div className="text-left font-light">
            <span className="pr-3">Website:</span>
            <span className="">{userData?.website}</span>
          </div>
        </div>
      </div>
      <div className="h-[1.33px] bg-gray-300 w-full mt-[40px]"></div>
      <div className="flex flex-col gap-4  pl-[5%]">
        <div className="flex  justify-between  p-2 px-3 text-base-18  text-[#517CA8]">
          <div className="">
            <span className=" mr-3 font-light">Subscription:</span>
            <span className="">Taken</span>
          </div>
        </div>
        <div className="flex gap-10  p-2 px-3 text-base-18  text-[#517CA8]">
          <div className="">
            <span className=" mr-3 font-light">Status:</span>
            <span className="">{userData?.userStatus}</span>
          </div>
        </div>
      </div>
      <div className="h-[1.33px] bg-gray-300 w-full "></div>
      <div className="flex gap-3 w-full overflow-x-auto custom-scroller-2 mt-[85px] ml-[5%]">
        <div className="flex flex-col p-2 px-3 gap-2 text-[#26435F]">
          <span className=" ">
            <p className="text-[0.8333vw]"># Tutors</p>
            <p className="font-medium text-[1.3542vw]">{totalHours?.totalTutor}</p>
          </span>
          <span className=" ">
            <p className="text-[0.8333vw]"># Students</p>
            <p className="font-medium text-[1.3542vw]">{totalHours?.totalStudent}</p>
          </span>
        </div>
        <div className="flex gap-3">
          {aboutCardContents.map((item, idx) => {
            return <AboutCard heading={item.heading} text={totalHours ? totalHours[item.key] : ''} />;
          })}
        </div>
        <div className="bg-[#26435F] w-[15vw] rounded-md py-[26px] px-[3%] text-white ">
          <span className="flex text-xs justify-between">
            <p className="text-[0.8333vw] w-[50px] font-medium mb-[22px]">Revenue Generated</p>
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
  );
};

export default SubFrame0;
