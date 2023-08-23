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
          inputContainerClassName="pt-3 pb-3 border "
          parentClassName="mb-6  relative flex-1"
          required={persona === "student" ? true : false}
          label={`${personaText} First Name`}
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm"
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
          parentClassName="mb-6 relative flex-1"
          inputContainerClassName="pt-3 pb-3 border"
          label={`${personaText} Last Name`}
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm"
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
      <div className="flex justify-between gap-5 items-center">
        <InputField
          parentClassName="mb-6 relative flex-1"
          label={`${personaText} Email `}
          inputContainerClassName="pt-3 pb-3 border"
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm"
          value={otherDetails.Email}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, Email: e.target.value })
          }
          error={detailsError.Email}
        />
        <InputFieldDropdown
          parentClassName="mb-6 w-[200px]"
          label={`${personaText} Phone  ${persona !== "parent" ? "" : ""} `}
          labelClassname="text-[#26435F] font-bold  mb-1 text-sm"
          inputContainerClassName="pt-3   pb-3 relative border"
          inputClassName="ml-2"
          required={persona === "student" ? true : false}
          codeValue={otherDetails.PphoneCode}
          handleCodeChange={(e) =>
            setOtherDetails({ ...otherDetails, PphoneCode: e.target.value, })
          }
          value={otherDetails.Phone}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, Phone: e.target.value })
          }
          error={detailsError.Phone}
        />
      </div>

      <InputField
        parentClassName="mb-6 relative flex-1"
        label={`Student School `}
        inputContainerClassName="pt-3 pb-3 border"
        labelClassname="text-[#26435F] font-bold  mb-1 text-sm"
        value={otherDetails.schoolName}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, schoolName: e.target.value })
        }
        error={detailsError.schoolName}
      />
      <InputSelect
        IconLeft={leftDrop}
        parentClassName="mb-6 w-[200px]"
        optionData={["5","6","7","8","9","10","11","12"]}
        label={`Student's Grade`}
        labelClassname="text-[#26435F] font-bold  mb-1 text-sm "
        inputContainerClassName="py-1 relative border"
        inputClassName="ml-80"
        required={persona === "student" ? true : false}
       
        value={otherDetails.grade}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, grade: e})
        }
        error={detailsError.grade}
      />
     
        <InputField
          labelClassname="mb-1 text-[#26435F] font-bold"
          label="Referral Code"
          placeholder=""
          parentClassName=" text-xs flex-1"
          value={otherDetails.referalCode}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, referalCode: e.target.value })
          }
        />

        <div className={style.shy}>
          <label className={`${style["checkbox-label"]} block mt-7 py-auto `}>
            <input
              type="checkbox"
              checked={otherDetails.referalCode?.trim()?.length === 0 || otherDetails.referalCode===""}
              //  onChange={handleCheckboxChangeReferral}
            />
            <span
            onClick={()=>{
              setOtherDetails({...otherDetails,referalCode:""})
            }}
              className={`${style["custom-checkbox"]} ${
                otherDetails.referalCode?.trim()?.length === 0 ? "checked" : ""
              }`}
            ></span>
            <span className="ml-2 font-medium text-[#507CA8]">
              I don't have one
            </span>
          </label>
        </div>
   
      <div className="flex justify-between items-center mt-16">
        {!isAddedByAdmin && (
          <SecondaryButton
            children="Go Back"
            className="text-sm mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
            onClick={handleBack}
          />
        )}
        <PrimaryButton
          children="Next"
          className={`w-full bg-[#FFA28D] text-center items-center justify-center disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative `}
          onClick={() => handleClick()}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
