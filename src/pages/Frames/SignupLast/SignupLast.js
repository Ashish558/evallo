import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import styles from "../EventModal/style.module.css";


export default function SignupLast({
  setFrames,
  setcurrentStep,
  hearAboutUs,
  setHearAboutUs,
  handleSignup,
  setSolutions,
  solutions,
  loading
}) {
  const [disabled, setDisabled] = useState(false);


  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange1 = () => {
    setIsChecked(!isChecked);
  };

  const handleCheckboxChange = (text, arr, setValue) => {
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
  };

  const handleSubmit = () => {
    handleSignup()
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
      <div className="mb-7">
        <p className="font-medium mb-2 text-xs">
          Select the solutions you are looking for:
        </p>

        <div className="grid grid-cols-3 mb-6">
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
                <p className="font-medium text-xs text-sm opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>


        <p className="font-medium mb-2 text-xs">How did you hear about us?</p>
        <div className="grid grid-cols-3 mb-6">
          {hearAboutUs?.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mb-3 mr-6"
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
                <p className="font-medium text-xs text-sm opacity-90 leading-5">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
        <div>
          <div className="h-[1px] bg-[#EBEBEB] w-[320px] ">

          </div>

        </div>
        <div className="mt-[15px] flex">
          <div className="mt-1">

            <label className={styles.container}>

              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange1}
              />
              <span class={styles.checkmark}></span>
            </label>
          </div>

          <p className="text-xs font-medium   leading-5 ml-1">
            Selecting this would confirm that you have carefully read through and agree to our <span className="text-[#22BEF5]"><a href="http://evallo.org/tou">Terms of Use</a></span> and <span className="text-[#22BEF5]"><a href="http://evallo.org/privacy-policy">Privacy Policy</a></span>.
          </p>

        </div>
      </div>

      <div className="flex items-center mt-5">
        <SecondaryButton
          children="Back"
          className="text-sm mr-6"
          onClick={handleBack}
        />
        <PrimaryButton
          children="Finish"
          className="text-sm "
          onClick={() => handleSubmit()}
          loading={loading}
        // disabled={disabled}
        />
      </div>
    </div>
  );
}
