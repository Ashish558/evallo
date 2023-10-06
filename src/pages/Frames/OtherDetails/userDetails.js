import React, { useEffect, useRef, useState } from "react";

import DownArrow from "../../../assets/icons/down-chevron.svg";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import styles from "../../Signup/signup.module.css";
import style from "./signup.module.css";
import { validateOtherDetails } from "../../Signup/utils/util";
import selectStyles from "../../../components/InputSelect/style.module.css";
import CustomFields from "../CustomFields/CustomFields";
import InputFieldDropdown from "../../../components/InputField/inputFieldDropdown";
import InputSelect from "../../../components/InputSelect/InputSelect";
import leftDrop from "../../../assets/icons/Polygon 2.svg";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
export default function UserDetails({
  setFrames,
  persona,
  setcurrentStep,
  otherDetails,
  setOtherDetails,
  detailsError,
  handleSignup,
  setDetailsError,
  resetDetailsErrors,
  studentNumberPrefix,
  setStudentNumberPrefix,
  isAddedByAdmin,
  customFields,
  values,
}) 
{

  console.log({values,otherDetails})
  const [selected, setSelected] = useState(false);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (
      otherDetails.FirstName !== "" &&
      otherDetails.LastName !== "" &&
      otherDetails.Email !== "" &&
      otherDetails.Phone !== ""
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [otherDetails]);

  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  const handleClick = () => {
    const result = validateOtherDetails(otherDetails);
    console.log(result);
    const promiseState = async (state) =>
      new Promise((resolve) => {
        resolve(resetDetailsErrors());
      });

    promiseState().then(() => {
      if (result.data !== true) {
        setDetailsError((prev) => {
          return {
            ...prev,
            [result.data]: result.message,
          };
        });
      } else if (customFields?.length === 0 || !customFields) {
        // alert('CustomFields are empty ,please fill those ')
        handleSignup();
      } else if (customFields?.length > 0) {
        // return
        setFrames((prev) => {
          return {
            ...prev,
            userDetails: false,
            customFields: true,
          };
        });
      }
    });
  };

  useEffect(() => {
    setcurrentStep(2);
  }, []);

  const handleBack = () => {
    setcurrentStep(1);
    if (persona === "parent") {
      setFrames((prev) => {
        return { ...prev, userDetails: false, signupActive: true };
      });
    } else {
      setFrames((prev) => {
        return { ...prev, userDetails: false, signupActive: true };
      });
    }
  };

  let personaText = values.role === "parent" ? "Student" : "Parent";
  // alert(personaText)
  return (
    <div className="w-full">
      <div className="flex justify-between gap-8">
        <InputField
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-base-17-5"
          parentClassName="mb-6  relative flex-1"
          required={persona === "student" ? true : false}
          label={`${personaText} First Name`}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5"
          value={otherDetails.FirstName}
          
          onChange={(e) =>{
            
            e.target.value=e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
         
            setOtherDetails({
              ...otherDetails,
              FirstName: e.target.value,
            })
          }
        }
          totalErrors={detailsError} 
          error={detailsError.FirstName}
        />
        <InputField
          parentClassName="mb-6 relative flex-1"
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-base-17-5"
          label={`${personaText} Last Name`}
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5"
          value={otherDetails.LastName}
          onChange={(e) =>{
     
            e.target.value=e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
         
            setOtherDetails({
              ...otherDetails,
              LastName: e.target.value,
            })
          }
        }
          totalErrors={detailsError} 
          error={detailsError.LastName}
        />
      </div>
      <div className="flex justify-between gap-6 items-center">
        <InputField
          parentClassName="mb-6 relative flex-1"
          label={`${personaText} Email `}
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-base-17-5"
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5"
          value={otherDetails.Email}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, Email: e.target.value })
          }
          totalErrors={detailsError} 
          error={detailsError.Email}
        />
        <InputFieldDropdown
          parentClassName="mb-6 w-[230px]"
          label={`${personaText} Phone  ${persona !== "parent" ? "" : ""} `}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5"
          inputContainerClassName="border h-[40px] border-[#D0D5DD] pt-3   pb-3 relative border text-base-17-5"
          inputClassName=""
          required={persona === "student" ? true : false}
          codeValue={otherDetails.PphoneCode}
          handleCodeChange={(e) =>
            
            setOtherDetails({ ...otherDetails, PphoneCode: e.target.value, })
          }
          value={otherDetails.Phone}
          onChange={(e) =>{
            const inputText = e.target.value;
            const numberOnly = inputText.replace(/\D/g, '')
            setOtherDetails({ ...otherDetails, Phone: numberOnly })
          }}
          totalErrors={detailsError} 
          error={detailsError.Phone}
          codeError={detailsError.PphoneCode}
        />
      </div>

      <InputField
        parentClassName="mb-6 relative flex-1"
        label={`Student School `}
        inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-base-17-5"
        labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5"
        value={otherDetails.schoolName}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, schoolName: e.target.value })
        }
        totalErrors={detailsError} 
        error={detailsError.schoolName}
      />
      <InputSelect
        IconLeft={leftDrop}
        parentClassName="mb-6 w-[200px]"
        optionData={["5","6","7","8","9","10","11","12"]}
        label={`Student's Grade`}
        labelClassname="text-[#26435F] !font-medium  mb-1 text-base-17-5 font-semibold"
        inputContainerClassName="border text-base-17-5 border-[#D0D5DD] py-1 relative border"
        inputClassName="ml-80"
        required={persona === "student" ? true : false}
       
        value={otherDetails.grade}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, grade: e})
        }
        totalErrors={detailsError} 
        error={detailsError.grade}
      />
     
        <InputField
          labelClassname="mb-1 text-[#26435F] !font-medium"
          label="Referral Code"
          placeholder=""
          parentClassName=" text-xs flex-1"
          inputContainerClassName="border border-[#D0D5DD] py-1 relative border"
          value={otherDetails.referalCode}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, referalCode: e.target.value })
          }
        />

        <div className={style.shy}>
       <div className="flex items-center mt-2">
         <CCheckbox  checked={otherDetails.referalCode?.trim()?.length === 0 }
                          onChange={()=>  setOtherDetails({...otherDetails,referalCode:""})}/>
        
          <span className="ml-1  text-[#507CA8] text-base-17-5 pt-1">
              I don't have one
            </span>
        </div>
        </div>
   
      <div className="flex justify-between items-center mt-16">
        {!isAddedByAdmin && (
          <SecondaryButton
            children="Go Back"
            className="text-[0.9719vw] mr-6 bg-white text-[#B3BDC7] border-[1.3px] border-[#D0D5DD] font-medium h-[53px] rounded-5 w-[7.6042vw]"
            onClick={handleBack}
          />
        )}
        <PrimaryButton
          children="Next"
          className={` bg-[#FFA28D] text-center items-center justify-center disabled:opacity-60 w-[7.6042vw]   text-[#FFF] text-[0.9719vw]font-medium relative h-[53px] rounded-5`}
          onClick={() => handleClick()}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
