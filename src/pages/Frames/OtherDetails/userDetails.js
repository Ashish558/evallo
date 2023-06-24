import React, { useEffect, useRef, useState } from "react";

import DownArrow from "../../../assets/icons/down-chevron.svg";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import styles from "../../Signup/signup.module.css";
import { validateOtherDetails } from "../../Signup/utils/util";
import selectStyles from "../../../components/InputSelect/style.module.css";
import CustomFields from "../CustomFields/CustomFields";

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
  customFields
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
    // console.log(result);
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
      } 
      else if(customFields.length===0){
        //alert('CustomFields are empty ,please fill those ')
        handleSignup();
      }
      else if(customFields.length > 0) {
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

  let personaText = persona === "student" ? "Student" : "Parent";
 // alert(personaText)
  return (
    <div className="w-full">
      <div className="flex">
        <InputField
        
          inputContainerClassName="pt-3 pb-3 border"
          parentClassName="mb-6 mr-5 relative"
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
         
          parentClassName="mb-6 relative"
          inputContainerClassName="pt-3 pb-3 border"
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
      
        parentClassName="mb-6 relative"
        label={`${personaText} Email Address`}
        inputContainerClassName="pt-3 pb-3 border"
        required={persona === "student" ? true : false}
        labelClassname="ml-2 mb-2"
        value={otherDetails.Email}
        onChange={(e) =>
          setOtherDetails({ ...otherDetails, Email: e.target.value })
        }
        error={detailsError.Email}
      />
      <InputField
       
        parentClassName="mb-6"
        label={`${personaText} Phone Number ${
          persona !== "parent" ? "(For tutor correspondence)" : ""
        } `}
        labelClassname="ml-2 mb-2"
        inputContainerClassName="pt-3 pb-3 relative border"
        inputClassName="ml-80"
        required={persona === "student" ? true : false}
        inputLeftField={
          <div
            ref={selectRef}
            className={`${selected && "relative z-5000"} ${
              styles.phoneNumberField
            } `}
            onClick={() => setSelected(!selected)}
          >
            <div
              className={`py-[16px] w-full px-2 pl-3 flex justify-center items-center rounded-10 relative cursor-pointer z-50`}
            >
              {
                <img
                  src={DownArrow}
                  className={selectStyles.downArrow}
                  style={{ right: "16px" }}
                  alt="down-arrow"
                  onClick={() => setSelected(true)}
                />
              }
              <div className="outline-0 relative font-medium mr-4" name={"nm"}>
                {studentNumberPrefix}
              </div>
              {selected && (
                <div
                  className={`scrollbar-content scrollbar-vertical ${selectStyles.options}`}
                  style={{ top: "100%" }}
                >
                  {["+1"].map((option, idx) => {
                    return (
                      <div
                        className="outline-0 border-0 py-2 px-4"
                        key={idx}
                        onClick={() => {
                          setStudentNumberPrefix(option);
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
        {!isAddedByAdmin && (
          <SecondaryButton
            children="Back"
            className="text-sm mr-4"
            onClick={handleBack}
          />
        )}
        <PrimaryButton
          children="Next"
          className="text-sm"
          onClick={() => handleClick()}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
