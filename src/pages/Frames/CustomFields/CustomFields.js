import React, { useEffect } from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import styles from "./customFields.module.css";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

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

  const handleChange = (_id, value) => {
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
  console.log("customFields", customFields);
  return (
    <div>
      <div className="w-full flex flex-col gap-y-6 max-w-full mb-4">
        {customFields.map((item) => {
          return (
            <div key={item._id}>
              {item.dataType === "Paragraph" ? (
                <InputField
                  label={item.name}
                  required={true}

                  placeholder={item.name}
                  biggerText={true}
                  labelClassname={"!text-base-17-5 text-[#26435F] !font-medium"}
                  parentClassName="w-full"
                  inputClassName="bg-transparent !text-sm !px-2 !py-3 !ml-[-20px] border rounded-[5px] border-[#D0D5DD]"
                  type="text"
                  value={item.value}
                  onChange={(e) =>
                    handleParagraphChange(item._id, e.target.value)
                  }
                />
              ) : item.dataType === "Dropdown" ? (
                <InputSelect
                  label={item.name}
                  required={true}
                  placeholder={item.name}
                  labelClassname={styles["label"]}
                  parentClassName="w-full"
                  inputClassName="bg-transparent text-xs"
                  type="text"
                  value={item.value}
                  onChange={(e) =>
                    handleParagraphChange(item._id, e)
                  }
                />
              ) : item.dataType === "Checkboxes" ? (
                <div>
                  <p className="!text-base-17-5 text-[#26435F] mb-3 !font-medium"> {item.name} </p>
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
                          <CCheckbox
                            checked={checked}
                            value={option}
                            onChange={(val) => handleChange(item._id, val)}
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


          onClick={() => handleSignup()}
        />

      </div>

    </div>
  );
}
