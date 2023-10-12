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
      <div className="h-[1.33px] bg-gray-300 w-full mt-[35px]"></div>
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
      <div className="h-[1.33px] bg-gray-300 w-full"></div>
      <div className="flex gap-3 w-full overflow-x-auto custom-scroller-2">
        <div className="flex flex-col p-2 px-3 gap-2">
          <span className=" ">
            <p className="text-xs "># Tutors</p>
            <p className="font-bold">{totalHours?.totalTutor}</p>
          </span>
          <span className=" ">
            <p className="text-xs "># Students</p>
            <p className="font-bold">{totalHours?.totalStudent}</p>
          </span>
        </div>
        <div className="flex gap-2 ">
          {aboutCardContents.map((item, idx) => {
            return <AboutCard heading={item.heading} text={totalHours ? totalHours[item.key] : ''} />;
          })}
        </div>
        <div className="bg-[#26435F] flex-1 flex flex-col rounded-md p-2 text-white ">
          <span className="flex text-xs justify-between">
            <p className="text-xs w-[50px]">Revenue Generated</p>
            <InputSelect
              placeholder="weekly"
              parentClassName="text-xs p-0 rounded-lg m-0"
              value={""}
              inputContainerClassName="bg-[#26435F]  p-0 !m-0 rounded-lg"
              optionClassName="w-[50px] text-xs !px-0 !mr-0 !py-[1.5px]"
            //   onChange={(e) =>
            //     setValues({
            //       ...values,
            //       orgType: e,
            //     })
            //   }
            //   error={error.orgType}
            />
          </span>
          <span className="mt-3 text-center font-semibold text-lg">
            {totalHours?.totalPrice}

          </span>
        </div>
      </div>
    </div>
  );
};

export default SubFrame0;
