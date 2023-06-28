import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

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
    <div className="">
      <div className="flex justify-center">
        <div className='h-[1px] bg-[#EBEBEB] w-3/4 mb-[30px]'>

        </div>
      </div>
      <div className="mb-7">
        <p className="font-medium mb-2 text-lg text-[#26435F]">
          Select the solutions you are looking for:
        </p>

        <div className="grid grid-cols-2 mb-3">
          {solutions?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 mr-6"
                onClick={() =>
                  handleCheckboxChange(item.text, solutions, setSolutions)
                }
              >
                <div className={`${styles.container} `}>
                  <input
                    checked={item.checked}
                    type="checkbox"
                    name="hearAboutUs"
                    value=""
                  />
                  <span class={styles.checkmark}></span>
                </div>
                <p className="font-medium text-[#26435F] opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-5'>

        </div>
        <p className="font-medium mb-2 text-lg text-[#26435F]">How did you hear about us?</p>
        <div className="grid grid-cols-2 mb-3">
          {hearAboutUs?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-5 mr-6"
                onClick={() =>
                  handleCheckboxChange(item.text, hearAboutUs, setHearAboutUs)
                }
              >
                <div className={`${styles.container} `}>
                  <input
                    checked={item.checked}
                    type="checkbox"
                    name="hearAboutUs"
                    value=""
                  />
                  <span class={styles.checkmark}></span>
                </div>
                <p className=" font-medium text-[#26435F] opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-5'>

        </div>
        <p className="font-medium mb-2 text-lg  text-[#26435F]">
          On a scale of 1-10 (Bad to Great), how would you rate your sign up
          experience?
        </p>
        <div className="w-full max-w-[248px] ">
          {/* <input
            className="bg-transparent text-xs p-1 border border-[#EBEBEB] rounded-md py-3 outline-none pl-3"
            type="number"
            value={rateUs}
            onChange={(e) => {
              if (e.target.value >= 0 && e.target.value <= 10)
                setRateUs(e.target.value);
            }}
          /> */}
          <select className="text-lg w-[207px]  border border-[#EBEBEB] rounded-md py-3 outline-none pl-3 text-[#B3BDC7]">
            <option value="0">Company Type </option>
            {numbers.map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className='h-[1px] bg-[#EBEBEB] w-5/6 mb-5 mt-5'>

          </div>
        </div>
      </div>

      <div className="flex items-center mt-5 justify-between">
        <SecondaryButton
          children="Go Back"
          className="text-lg mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
          onClick={handleBack}
        />
        <PrimaryButton
          children="Submit"
          className={` w-full bg-[#FFA28D] disabled:opacity-60 max-w-[110px]    rounded text-white text-lg font-medium relative 
           
          `}
          onClick={() => handleSubmit()}
          loading={loading}
        // disabled={disabled}
        />
      </div>
    </div>
  );
}
