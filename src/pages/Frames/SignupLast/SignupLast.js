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
   otherDetails
}) {

   const [disabled, setDisabled] = useState(false)

   const handleCheckboxChange = (text, arr, setValue) => {
      const temp = arr.map((topic) => {
         return topic.text === text
            ? { ...topic, checked: !topic.checked }
            : { ...topic };
      });
      setValue(temp);
   };

   const handleSubmit = () => {
      setFrames((prev) => {
         return { ...prev, signupLast: false, signupSuccessful: true };
      });
   };

   const handleBack = () => {
      setFrames((prev) => {
         return { ...prev, services: false, questions: true };
      });
   };

   useEffect(() => {
      let checkCount = 0
      hearAboutUs.map(item => {
         if (item.checked === true) {
            checkCount += 1
         }
      })
      if (checkCount === 0  || otherDetails.aboutScore.trim() === '') {
         setDisabled(true)
      } else {
         setDisabled(false)
      }
   }, [hearAboutUs, otherDetails])

   useEffect(() => {
      setcurrentStep(6);
   }, []);

   return (
      <div className="mb-7">
         <div className="mb-120">
            <p className="font-medium mb-6">How did you hear about us?</p>
            <div className="grid grid-cols-1 mb-6">
               {hearAboutUs.map((item, idx) => {
                  return (
                     <div
                        key={idx}
                        className="flex items-center mb-7 mr-6"
                        onClick={() =>
                           handleCheckboxChange(
                              item.text,
                              hearAboutUs,
                              setHearAboutUs
                           )
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
                        <p className="font-medium text-lg text-sm opacity-90 leading-5">
                           {item.text}
                        </p>
                     </div>
                  );
               })}
            </div>
         </div>

         <div className="flex items-center mt-16">
            <SecondaryButton
               children="Back"
               className="text-lg pt-3 pb-3 text-white mr-6 w-140"
               onClick={handleBack}
            />
            <PrimaryButton
               children="Next"
               className="text-lg pt-3 pb-3 font-semibold text-white mr-6 w-140 disabled:opacity-70"
               onClick={() => handleSubmit()}
               disabled={disabled}
            />
         </div>
      </div>
   );
}
