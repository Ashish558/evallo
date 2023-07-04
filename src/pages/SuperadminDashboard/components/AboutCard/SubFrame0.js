import React from 'react'
import { aboutCardContents } from "../AllOrgs/staticData";
import AboutCard from "../AboutCard/AboutCard";
import InputSelect from "../../../../components/InputSelect/InputSelect";

const SubFrame0 = () => {
  return (
    <div className="flex flex-col gap-5">

       
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
  )
}

export default SubFrame0