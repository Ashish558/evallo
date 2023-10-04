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

  const handleSubmit = () => {
    handleSignup();
    // setFrames((prev) => {
    //   return { ...prev, signupLast: false, signupSuccessful: true };
    // });
  };

  const handleBack = () => {
    setFrames((prev) => {
      return { ...prev, signupLast: false, furtherDetails: true };
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
    <div className="mt-[-23px]">
      <div className="flex justify-center">
        <div className='h-[1px] bg-[#EBEBEB] mx-[6px] w-full mb-[25px]'>

        </div>
      </div>
      <div className="mb-7">
        <p className="font-semibold tracking-wider mb-2 text-sm text-[#26435F]">
          Select the solutions you are looking for:
        </p>

        <div className="grid grid-cols-2 mb-2 gap-x-8">
          {solutions?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 mr-6"
                onClick={() =>
                  handleCheckboxChange(item.text, solutions, setSolutions)
                }
              >
                
                <SCheckbox
                      checked={item.checked}
                      className="scale-[0.8]"
                      
                    />
                <p className="text-[13px] whitespace-nowrap  font-medium text-[#26435F] opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-4'>

        </div>
        <p className="font-semibold tracking-wider mb-2 text-sm text-[#26435F]">How did you hear about us?</p>
        <div className="grid grid-cols-2 mb-0">
          {hearAboutUs?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-5 mr-6"
                onClick={() =>
                  handleCheckboxChange(item.text, hearAboutUs, setHearAboutUs)
                }
              >
                 <SCheckbox
                      checked={item.checked}
                      className="scale-[0.8]"
                      
                    />
                <p className="text-[13px] font-medium text-[#26435F] opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-4'>

        </div>
        <p className="font-semibold mb-1 text-sm  text-[#26435F]">
          On a scale of 1-10 (Bad to Great), how would you rate your sign up
          experience?
        </p>
        <InputSelectNew
            value={rateUs}
            parentClassName="w-[150px] my-2 "
            optionContainerClassName="text-[14px] "
            optionsEachClassName="py-[7px]"
            optionData={[1,2,3,4,5,6,7,8,9,10]}

            placeholder={""}
            
            labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
            inputContainerClassName="py-1 text-sm h-[44.9px] border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[6px]"
            inputClassName="ml-80"
         
            onChange={(e) => setRateUs(e)}
          />
      
        <div>
          <div className='h-[1px] bg-[#EBEBEB]  mb-5 mt-5'>

          </div>
        </div>
      </div>

      <div className="flex items-center mt-5 justify-between">
        <SecondaryButton
          children="Go Back"
          className="text-sm mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
          onClick={handleBack}
        />
        <PrimaryButton
          children="Submit"
          className={` w-full bg-[#FFA28D] disabled:opacity-60 max-w-[110px]    rounded text-white text-sm font-medium relative 
           
          `}
          onClick={() => handleSubmit()}
          loading={loading}
        // disabled={disabled}
        />
      </div>
    </div>
  );
}
