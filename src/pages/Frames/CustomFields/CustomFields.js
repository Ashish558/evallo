import React, { useEffect, useRef, useState } from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import styles from "./customFields.module.css";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import SCheckbox from "../../../components/CCheckbox/SCheckbox";
import useOutsideAlerter from "../../../hooks/useOutsideAlerter";
import Message from "../../../components/InputField/Message/Message";
import MessageLeft from "../../../components/InputField/Message/MessageLeft";

export default function CustomFields({
  setcurrentStep,
  setFrames,
  persona,
  customFields,
  setCustomFields,
  handleSignup,
}) {
  useEffect(() => {
    setcurrentStep(3);
  }, []);
  const [error2, setError2] = useState({});
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  const handleClose = () => setShowDiv(false);
  useOutsideAlerter(divRef, handleClose);

  useEffect(() => {
    setShowDiv(true);
  }, [error2]);
  useEffect(() => {
    setShowDiv(false);
  }, [customFields]);
  const handleChange = (_id, value) => {
    console.log({ _id, value });
    const temp = customFields.map((item) => {
      if (item._id === _id) {
        let updatedValue = [];
        if (item.value) {
          updatedValue = [...item.value];
          if (item.value.includes(value)) {
            updatedValue = updatedValue.filter((item) => item !== value);
          } else {
            updatedValue.push(value);
          }
        } else {
          updatedValue.push(value);
        }
        return {
          ...item,
          value: updatedValue,
        };
      } else {
        return item;
      }
    });
    setCustomFields(temp);
  };
  const handleChangeNew = (_id, value) => {
    console.log({ _id, value });
    const temp = customFields.map((item) => {
      if (item._id === _id) {
        let updatedValue = [];
        if (item.value) {
          updatedValue = [...item.value];
          if (item.value.includes(value)) {
            updatedValue = updatedValue.filter((item) => item !== value);
          } else {
            updatedValue.push(value);
          }
        } else {
          updatedValue.push(value);
        }
        return {
          ...item,
          value: updatedValue,
        };
      } else {
        return item;
      }
    });
    setCustomFields(temp);
  };

  const handleParagraphChange = (_id, value) => {
    const temp = customFields.map((item) => {
      if (item._id === _id) {
        let updatedValue = [];
        if (item.value) {
          updatedValue = [value];
        } else {
          updatedValue = [value];
        }
        return {
          ...item,
          value: updatedValue,
        };
      } else {
        return item;
      }
    });
    setCustomFields(temp);
  };
  const handleBack = () => {
    setcurrentStep(2);
    if (persona === "parent") {
      setFrames((prev) => {
        return { ...prev, userDetails: true, signupActive: false };
      });
    } else {
      setFrames((prev) => {
        return { ...prev, userDetails: true, signupActive: false };
      });
    }
  };
  const handleCheck=()=>{
    let check=-1
    customFields?.map((it,id)=>{
      if(check===-1 && it.required && (!it.value || it?.value?.length===0 || !it?.value[0]|| it?.value[0]?.trim()?.length===0)){
        check=id;
        
      }
      
    })
    if(check>-1){
       setError2({
        [check]:"This field is required."
       })
      return false;
    }
    return true;
  }
  console.log("customFields", customFields);
  return (
    <div>
      <div className="w-full flex flex-col gap-y-6 max-w-full mb-4 ">
        {customFields.map((item,idx) => {
          return (
            <div className="relative" key={item._id}>
              {item.dataType === "String" ? (
                <InputField
                  label={item.name}
                  required={item.required}
                  placeholder={"Single line answer"}
                  biggerText={true}
                  labelClassname={
                    "!text-base-17-5 text-[#26435F] !font-medium mb-1"
                  }
                  parentClassName="w-full !p-0"
                  inputContainerClassName={"!p-0"}
                  inputClassName="bg-transparent !text-sm !px-2 !py-3  border rounded-[5px] border-[#D0D5DD]"
                  type="text"
                  value={item.value}
               
                  onChange={(e) =>
                    handleParagraphChange(item._id, e.target.value)
                  }
                />
              ) : item.dataType === "Paragraph" ? (
                <div className="flex flex-col gap-y-1 ">
                  <p className={"!text-base-17-5 text-[#26435F] !font-medium"}>
                    {item.name}
                  </p>
                  <textarea
                    label={item.name}
                    required={item.required}
                    placeholder={"Paragraph Answer"}
                    className="rounded-[6px] border-[0.98px]  border-[#D0D5DD] p-2 outline-none  !h-[150px] overflow-y-auto"
                    rows="5"
                    value={item.value}
                    onChange={(e) =>
                      handleParagraphChange(item._id, e.target.value)
                    }
                  ></textarea>
                 
                </div>
              ) : item.dataType === "Dropdown" ? (
                <InputSelect
                  label={item.name}
                  required={item.required}
                  placeholder={"Options"}
                  labelClassname={
                    "!text-base-17-5 text-[#26435F] !font-medium mb-1"
                  }
                  parentClassName="w-full"
                  inputContainerClassName={
                    "bg-transparent text-xs rounded-md border border-[#D0D5DD]"
                  }
                  inputClassName="bg-transparent text-xs rounded-sm border border-[#D0D5DD]"
                  type="text"
                  optionData={item?.Values}
                  value={item.value}
                
                  onChange={(e) => handleParagraphChange(item._id, e)}
                />
              ) : item.dataType === "Checkboxes" ? (
                <div>
                  <p className="!text-base-17-5 text-[#26435F] !font-medium mb-1">
                    {" "}
                    {item.name}{" "}
                  </p>
                  <div className="flex flex-row flex-wrap gap-y-4 gap-x-4">
                    {item.Values?.map((option) => {
                      let checked = false;
                      if (item.value) {
                        if (item.value.includes(option)) {
                          checked = true;
                        }
                      }
                      return (
                        <div className="flex items-center text-[#26435F] whitespace-nowrap">
                          <SCheckbox
                            checked={checked}
                            value={option}
                            onChange={(val) => handleChange(item._id, option)}
                          />
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <></>
              )}
               <div className="absolute left-[0px] !w-[200px]" ref={divRef}>
                    {error2!== undefined && error2!==null && error2[idx] && error2[idx] !== "" && (
                      <div>
                        {showDiv && (
                          <div>
                            <MessageLeft error={error2[idx]} type="danger" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between items-center mt-16">
        <SecondaryButton
          children="Go Back"
          className=" mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] w-[7.6042vw] h-[53px] text-[0.9719vw] font-medium"
          onClick={handleBack}
        />

        <PrimaryButton
          children="Submit"
          className={`l bg-[#FFA28D] text-center items-center justify-center disabled:opacity-60 w-[7.6042vw]  rounded text-white text-[0.9719vw] font-medium relative h-[53px]`}
          onClick={() => {if(handleCheck()){handleSignup()}}}
        />
      </div>
    </div>
  );
}
