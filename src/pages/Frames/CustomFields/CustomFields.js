import React, { useEffect } from "react";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import CCheckbox from "../../../components/CCheckbox/CCheckbox";
import styles from "./customFields.module.css";

export default function CustomFields({
  setcurrentStep,
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

  console.log("customFields", customFields);
  return (
    <div>
      <div className="w-full flex flex-col gap-y-6 max-w-[300px] mb-4">
        {customFields.map((item) => {
          return (
            <div key={item._id}>
              {item.dataType === "String" ? (
                <InputField
                  label={item.name}
                  required={true}
                  placeholder={item.name}
                  labelClassname={styles["label"]}
                  parentClassName="w-full"
                  inputClassName="bg-transparent text-xs"
                  type="text"
                  value={item.value}
                  onChange={(e) =>
                    handleParagraphChange(item._id, e.target.value)
                  }
                />
              ) : item.dataType === "Dropdown" ? (
                <div>
                  <p className="text-sm mb-2 font-medium"> {item.name} </p>
                  <div className="flex flex-row gap-y-4 gap-x-4">
                    {item.Values?.map((option) => {
                      let checked = false;
                      if (item.value) {
                        if (item.value.includes(option)) {
                          checked = true;
                        }
                      }
                      return (
                        <div className="flex items-center">
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
      <PrimaryButton
        children="Signup"
        className="text-sm"
        onClick={() => handleSignup()}
      />
    </div>
  );
}
