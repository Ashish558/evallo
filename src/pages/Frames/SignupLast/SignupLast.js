import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import SCheckbox from "../../../components/CCheckbox/SCheckbox";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
import InputSelect from "../../../components/InputSelect/InputSelect";
import { useNavigate } from "react-router-dom";

export default function SignupLast({
  setFrames,
  setcurrentStep,
  hearAboutUs,
  setHearAboutUs,
  handleSignup,
  setSolutions,
  solutions,
  loading,
  rateUs,
  setRateUs,
}) {
  const [disabled, setDisabled] = useState(false);

  const numbers = Array.from({ length: 10 }, (_, index) => index + 1);
  const handleCheckboxChange = (text, arr, setValue) => {
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
  };
  const navigate= useNavigate()
  const handleSubmit = () => {
    handleSignup();
    navigate("/signup?step=5")
 
  };

  const handleBack = () => {
    
    navigate("/signup?step=3")
    setFrames((prev) => {
      return { ...prev, furtherDetails: true, requirements: false };
    });
  };

  useEffect(() => {
    let checkCount = 0;
    solutions.map((item) => {
      if (item.checked === true) {
        checkCount += 1;
      }
    });
  }, [solutions]);

  useEffect(() => {
    setcurrentStep(4);
  }, []);

  return (
    <div className="mt-[-23px] px-[40px]">
      <div className="flex justify-center">
        <div className='h-[1px] bg-[#EBEBEB] mx-[70px] w-full mb-[25px]'>

        </div>
      </div>
      <div className="mb-7 mt-1">
        <p className="font-medium tracking-wider mb-[10px] text-[18.6px] text-[#26435F]">
          Select the solutions you are looking for:
        </p>

        <div className="grid grid-cols-2 mb-2 gap-x-8 gap-y-1">
          {solutions?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 "
                onClick={() =>
                  handleCheckboxChange(item.text, solutions, setSolutions)
                }
              >

                <SCheckbox
                  checked={item.checked}
                  className="scale-[1.27]"
                  onChange={() =>
                    handleCheckboxChange(item.text, solutions, setSolutions)
                
                  }
                />
                <div className="">
                  <p className="!text-base   font-normal text-[#26435F]  leading-5 mb-1">
                    {item.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-[20px] ml-7'>

        </div>
        <p className="font-medium tracking-wider mb-6 text-[18.6px] text-[#26435F]">How did you hear about us?</p>
        <div className="grid grid-cols-2 mb-0 w-3/6">
          {hearAboutUs?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-5 mr-4"
                onClick={() =>
                  handleCheckboxChange(item.text, hearAboutUs, setHearAboutUs)
                }
              >
                <SCheckbox
                  checked={item.checked}
                  className="scale-[1.27]"
                  onChange={() =>
                    handleCheckboxChange(item.text, hearAboutUs, setHearAboutUs)
                  }
                />
                <p className="!text-base font-normal text-[#26435F]  leading-5 mb-[3px]">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-5'>

        </div>
        <p className="font-medium mb-[15px] text-[18.6px]  text-[#26435F]">
          On a scale of 1-10 (Bad to Great), how would you rate your sign up experience?
        </p>
        <InputSelectNew
          value={rateUs}
          parentClassName="w-[145px] my-2 "
          optionContainerClassName=""
          optionsEachClassName="py-[7px]"
          optionData={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}

          placeholder="Select"
          placeholderClass="!text-[#B3BDC7] !text-[18.67px]"
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
          inputContainerClassName="py-1 text-sm h-[53px] border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[6px] !px-[13px] "
          inputClassName="ml-80"

          onChange={(e) => setRateUs(e)}
        />

        <div>
          <div className='h-[1px] bg-[#EBEBEB]  mb-[50px] mt-[33px] w-[91.5%] mx-auto'>

          </div>
        </div>
      </div>

      <div className="flex items-center mt-[32px] mb-[45px] justify-between">
        <SecondaryButton
          children="Go back"
          className="text-[18.67px]    bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] !py-[12.5px] font-medium !px-[35px] rounded-5"
          onClick={handleBack}
        />
        <PrimaryButton
          children="Submit"
          className={`text-[18.67px] bg-[#FFA28D] disabled:opacity-60 !py-[12.5px] font-medium !px-[40.5px]   text-white   relative rounded-5
           
          `}
          onClick={() => handleSubmit()}
          loading={loading}
        // disabled={disabled}
        />
      </div>
    </div>
  );
}
