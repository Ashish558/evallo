import React, { useEffect, useRef, useState } from "react";

import DownArrow from "../../../assets/icons/down-chevron.svg";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import styles from "../../Signup/signup.module.css";
import { validateOtherDetails } from "../../Signup/utils/util";
import selectStyles from "../../../components/InputSelect/style.module.css"

export default function UserDetails({
   setFrames,
   persona,
   setcurrentStep,
   otherDetails,
   setOtherDetails,
   detailsError,
   setDetailsError,
   resetDetailsErrors
}) {

   const [selected, setSelected] = useState(false);
   const [numberPrefix, setNumberPrefix] = useState('+91')

   const selectRef = useRef();
   useOutsideAlerter(selectRef, () => setSelected(false));

   const handleClick = () => {
      const result = validateOtherDetails(otherDetails)
      // console.log(result);
      const promiseState = async state => new Promise(resolve => {
         resolve(resetDetailsErrors())
      })

      promiseState()
         .then(() => {
            if (result.data !== true) {
               setDetailsError(prev => {
                  return {
                     ...prev,
                     [result.data]: result.message
                  }
               })
            } else {
               // return
               if (persona === "parent") {
                  setFrames((prev) => {
                     return { ...prev, userDetails: false, questions: true };
                  });
               } else {
                  setFrames((prev) => {
                     return { ...prev, userDetails: false, services: true };
                  });
               }
            }

         })
   };

   useEffect(() => {
      if (persona === "parent") {
         setcurrentStep(4);
      } else {
         setcurrentStep(3);
      }
   }, []);

   const handleBack = () => {
      if (persona === "parent") {
         setFrames((prev) => {
            return { ...prev, userDetails: false, services: true };
         });
      } else {
         setFrames((prev) => {
            return { ...prev, userDetails: false, selectPersona: true };
         });
      }
   };

   let personaText = persona === "parent" ? "Student" : "Parent";

   return (
      <div className="w-full">
         <div className="flex">
            <InputField
               placeholder="First Name"
               inputContainerClassName='pt-3 pb-3 border'
               parentClassName="mb-6 mr-5"
               required={persona === "student" ? true : false}
               label={`${personaText} First Name`}
               labelClassname="ml-2 mb-2"
               value={otherDetails.FirstName}
               onChange={(e) =>
                  setOtherDetails({
                     ...otherDetails,
                     FirstName: e.target.value,
                  })
               }
               error={detailsError.FirstName}
            />
            <InputField
               placeholder="Last Name"
               parentClassName="mb-6"
               inputContainerClassName='pt-3 pb-3 border'
               label={`${personaText} Last Name`}
               required={persona === "student" ? true : false}
               labelClassname="ml-2 mb-2"
               value={otherDetails.LastName}
               onChange={(e) =>
                  setOtherDetails({
                     ...otherDetails,
                     LastName: e.target.value,
                  })
               }
               error={detailsError.LastName}
            />
         </div>

         <InputField
            placeholder="Email address"
            parentClassName="mb-6"
            label={`${personaText} Email Address`}
            inputContainerClassName='pt-3 pb-3 border'
            required={persona === "student" ? true : false}
            labelClassname="ml-2 mb-2"
            value={otherDetails.Email}
            onChange={(e) =>
               setOtherDetails({ ...otherDetails, Email: e.target.value })
            }
            error={detailsError.Email}
         />
         <InputField
            placeholder="Phone Number"
            parentClassName="mb-6"
            label={`${personaText} Phone Number ${persona !== "parent" ? "(For tutor correspondence)" : ""
               } `}
            labelClassname="ml-2 mb-2"
            inputContainerClassName="pt-3 pb-3 relative border"
            inputClassName="ml-80"
            required={persona === "student" ? true : false}
            inputLeftField={
               <div ref={selectRef}
                  className={`${selected && "relative z-5000"} ${styles.phoneNumberField} `}
                  onClick={() => setSelected(!selected)}
               >
                  <div
                     className={`py-[16px] w-full px-2 pl-3 flex justify-center items-center rounded-10 relative cursor-pointer z-50`}
                  >
                     {
                        <img
                           src={DownArrow}
                           className={selectStyles.downArrow}
                           style={{ right: '16px' }}
                           alt="down-arrow"
                           onClick={() => setSelected(true)}
                        />
                     }
                     <div className="outline-0 relative font-medium mr-4" name={'nm'}>
                        {numberPrefix}
                     </div>
                     {selected && (
                        <div className={`scrollbar-content scrollbar-vertical ${selectStyles.options}`} style={{ top: '100%' }} >
                           {['+91s', '+1'].map((option, idx) => {
                              return (
                                 <div
                                    className="outline-0 border-0 py-2 px-4"
                                    key={idx}
                                    onClick={() => {
                                       setNumberPrefix(option)
                                    }}
                                 >
                                    {" "}
                                    {option}{" "}
                                 </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
               </div>
            }

            value={otherDetails.Phone}
            onChange={(e) =>
               setOtherDetails({ ...otherDetails, Phone: e.target.value })
            }
            error={detailsError.Phone}
         />

         <div className="flex items-center mt-120">
            <SecondaryButton
               children="Back"
               className="text-lg pt-3 pb-3 text-white mr-6 w-140"
               onClick={handleBack}
            />
            <PrimaryButton
               children="Next"
               className="text-lg pt-3 pb-3 font-semibold text-white mr-6 w-140"
               onClick={() => handleClick()}
            />
         </div>
      </div>
   );
}
