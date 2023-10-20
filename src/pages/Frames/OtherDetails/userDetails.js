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

const GradesData = [
  "Nursery",
  "Lower Kindergarten",
  "Upper Kindergarten",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "College 1st Year",
  "College 2nd Year",
  "College 3rd Year",
  "College 4th Year",
];
export default function UserDetails({
  setFrames,
  persona,
  setcurrentStep,
  newLoader,
  otherDetails,

  setOtherDetails,
  detailsError,
  handleSignup,
  setDetailsError,
  
  resetDetailsErrors,
  isAddedByAdmin,
  customFields,
  values,
  stepTwoDisabled
}) {
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
      } else if (!customFields || customFields?.length === 0 ) {
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
      <div className={`flex justify-between items-start  ${stepTwoDisabled ? 'pointer-events-none cursor-not-allowed' :''} `}>
        <div className="w-[325px]">
        <InputField
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border h-[54px]"
          biggerText={true}
          parentClassName="mb-[30px]  relative w-full "
          required={persona === "student" ? true : false}
          label={`${personaText} First name`}
          labelClassname="text-[#26435F] !font-medium  mb-1 "
          value={otherDetails.FirstName}

          onChange={(e) => {

            e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

            setOtherDetails({
              ...otherDetails,
              FirstName: e.target.value,
            });
          }}
          totalErrors={detailsError}
          error={detailsError.FirstName}
        />
        </div>
        <div className="w-[325px]">
        <InputField
         biggerText={true}
          parentClassName="mb-6 relative w-full "
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border  h-[54px]"
          label={`${personaText} Last name`}
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] !font-medium  mb-1 "
          value={otherDetails.LastName}
          onChange={(e) => {

            e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);

            setOtherDetails({
              ...otherDetails,
              LastName: e.target.value,
            });
          }}
          totalErrors={detailsError}
          error={detailsError.LastName}
        />
        </div>
      </div>
      <div className={`flex justify-between  mb-[30px]  ${stepTwoDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}>
        <div className="w-[375px]">
        <InputField
        biggerText={true}
          parentClassName=" relative w-full "
          label={`${personaText} Email `}
          inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-[17.5px] h-[55px]"
          required={persona === "student" ? true : false}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-[17.5px]"
          value={otherDetails.Email}
          onChange={(e) =>
            setOtherDetails({ ...otherDetails, Email: e.target.value })
          }
          totalErrors={detailsError}
          error={detailsError.Email}
        />
        </div>
        <div className="w-[275px]">
       <InputFieldDropdown
          biggerText={true}
          parentClassName=""
          label={`${personaText} Phone  ${persona !== "parent" ? "" : ""} `}
          labelClassname="text-[#26435F] !font-medium  mb-1 text-[17.5px]"
          inputContainerClassName="border  border-[#D0D5DD] pt-3   pb-3 relative border text-[17.5px] h-[54px]"
          inputClassName=""
          required={persona === "student" ? true : false}
          codeValue={otherDetails.PphoneCode}
          handleCodeChange={(e) =>

            setOtherDetails({ ...otherDetails, PphoneCode: e.target.value, })
          }
          value={otherDetails.Phone}
          onChange={(e) => {
            const inputText = e.target.value;
            const numberOnly = inputText.replace(/\D/g, '')
            setOtherDetails({ ...otherDetails, Phone: numberOnly })
          }}
          totalErrors={detailsError}
          error={detailsError.Phone}
          codeError={detailsError.PphoneCode}
        />
       </div>
      </div>

      <InputField
        biggerText={true}
        parentClassName={`mb-[51px] relative w-full ${stepTwoDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}
        label={`School Name `}
        inputContainerClassName="border border-[#D0D5DD] pt-3 pb-3 border text-[17.5px] h-[52px]"
        labelClassname="text-[#26435F] !font-semibold   mb-1 text-[17.5px]"
        value={otherDetails.schoolName}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, schoolName: e.target.value })
        }
        totalErrors={detailsError}
        error={detailsError.schoolName}
      />
      <InputSelect
        IconLeft={leftDrop}
        parentClassName={`mb-[30px]  ${stepTwoDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}
        optionData={GradesData}
        label={`Student's Grade`}
        labelClassname="text-[#26435F] !font-semibold  mb-1 text-[17.5px] "
        inputContainerClassName="border text-[17.5px] border-[#D0D5DD] py-1 relative border !h-[49px] !w-[215px]"
        inputClassName="ml-80"
        required={persona === "student" ? true : false}
        value={otherDetails.grade}
        onChange={(e) => setOtherDetails({ ...otherDetails, grade: e })}
        totalErrors={detailsError}
        error={detailsError.grade}
      />

      <InputField
        labelClassname="mb-1 text-[#26435F] !font-medium"
        label="Referral Code"
        placeholder=""
        biggerText={true}
        parentClassName={`text-[17.5px]  flex-1 ${stepTwoDisabled ? 'pointer-events-none cursor-not-allowed' :''}`}
        inputContainerClassName="border border-[#D0D5DD] py-1 relative border h-[56px]"
        value={otherDetails.referalCode}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, referalCode: e.target.value })
        }
      />

      <div className={style.shy}>
        <div className="flex items-center">
         <div className="pt-1">
         <CCheckbox checked={!otherDetails.referalCode||otherDetails.referalCode?.trim()?.length === 0}
            onChange={() => setOtherDetails({ ...otherDetails, referalCode: "" })} />
         </div>

          <span className="ml-1  text-[#507CA8] text-[17.5px] pt-1">
            I don't have one
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-[50px] mb-[33px]">
        {!isAddedByAdmin && (
          <SecondaryButton
            children="Go back"
            className="!py-[12.5px] font-medium !px-[35px] rounded-5 bg-white text-[#B3BDC7] border-[1.3px] border-[#D0D5DD]  h-[53px]  "
            onClick={handleBack}
          />
        )}
        <PrimaryButton
        loading={newLoader}
          children={!customFields||customFields?.length===0?"Submit":"Next"}
          className={` bg-[#FFA28D] text-center items-center justify-center disabled:opacity-60    text-[#FFF] !py-[12.5px] font-medium !px-[40.5px]  relative h-[53px] rounded-5`}
          onClick={() => handleClick()}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
