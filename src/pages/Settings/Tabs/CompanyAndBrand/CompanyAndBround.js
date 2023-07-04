import React from "react";
import InputField from "../../../../components/InputField/inputField";
import PrimaryButton from "../../../../components/Buttons/PrimaryButton";
import {CheckboxNew} from "../../../../components/Checkbox/CheckboxNew";
import InputSelect from "../../../../components/InputSelect/InputSelect";
import {studentServedData,instructionFormat} from "../staticData"
import logo from "../../../../assets/icons/Frame 31070.svg";
import { useState } from "react";
const CompanyAndBround = () => {

const [studentServed,setStudentServed]= useState(studentServedData)
const [instructions,setInstructions]= useState(instructionFormat)
const handleCheckboxChange = (text, arr, setValue) => {
  console.log(arr)
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
    //9285186833
  };

  return (
    <div>
      <div className="flex flex-col gap-10 w-[900px] ">
        <div className="flex gap-5">
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Account Type"
          />
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Company Type"
          />
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Support Email"
          />
          <InputField
            placeholder=""
            parentClassName="text-xs text-[#26435F]"
            inputContainerClassName=" bg-white"
            inputClassName="bg-transparent"
            label="Role / Position"
          />
        </div>
        <div className="flex gap-5 flex-1">
          <div>
            <img src={logo} className="ml-[-25px]"/>
          </div>
          <div className="flex flex-col  gap-3 flex-1 py-auto">
            <div className="flex gap-5 items-center justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
                label="Website"
              />
              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] w-[60%]"
                inputContainerClassName=" bg-white"
                inputClassName="bg-transparent"
                label="Company Type"
              />
            </div>
            <div className="flex gap-5 items-center justify-between">
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
                label="Street Address"
              />
              <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] w-[60%]"
                inputContainerClassName=" bg-white"
                inputClassName="bg-transparent"
                label="Country"
              />
            </div>
            <div className="flex gap-5 items-center justify-between">
             
                <InputSelect
                placeholder="Select"
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white"
                inputClassName="bg-transparent"
                label="Company Type"
              />
              <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
                label="City"
              />
               <InputField
                placeholder=""
                parentClassName="text-xs text-[#26435F] w-full"
                inputContainerClassName=" bg-white "
                inputClassName="bg-transparent"
                label="Zip Code"
              />
            </div>
          </div>

        </div>
        <div className="flex gap-5 mt-3 border-b-[2px] border-b-[#CBD6E2] pb-5">
         
          <div className="flex flex-col rounded-sm w-[200px] flex-wrap gap-3 bg-white p-3">
          <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm">Format Of Instructions</h1>
            {
                instructions.map((item,id)=>(
                    <CheckboxNew item={item} key={id} boxData={instructions} setBoxData={setInstructions} handleCheckboxChange={handleCheckboxChange}/>
                ))
            }
         
          </div>
          <div className="flex flex-col rounded-sm w-[500px] h-[200px] flex-wrap gap-3 p-3 bg-white">
          <h1 className="mt-[-35px]  text-[#26435F] font-semibold text-sm">Students Served</h1>
            {
                studentServed.map((item,id)=>(
                    <CheckboxNew item={item} key={id} boxData={studentServed} setBoxData={setStudentServed} handleCheckboxChange={handleCheckboxChange}/>
                ))
            }
         
          </div>
        </div>
        <div className="" >
        <h1 className="mt-[-30px] text-[#26435F] font-semibold text-sm my-3">Signup Form Details</h1>
        <div className="w-full h-[200px] bg-white" >

        </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyAndBround;
