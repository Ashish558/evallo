import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import styles from "../EventModal/style.module.css";

const grades = [6, 7, 8, 9, 10, 11, 12, "College"];

export default function OrgDetails({
  setFrames,
  persona,
  setcurrentStep,
  setValues,
  values,
}) {
  const handleCheckboxChange = (text, arr, setValue) => {
    const temp = arr.map((topic) => {
      return topic.text === text
        ? { ...topic, checked: !topic.checked }
        : { ...topic };
    });
    setValue(temp);
  };
  const [disabled, setDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleSubmit = () => {
    setFrames((prev) => {
      console.log(prev);
      return {
        ...prev,
        orgDetails: false,
        furtherDetails: true,
      };
    });
  };

  useEffect(() => {
    setcurrentStep(2);
  }, []);

  const handleBack = () => {
    setFrames((prev) => {
      return { ...prev, orgDetails: false, signupActive: true };
    });
  };

  return (
    <div className="mt-5 mb-3">
      <div className="">
        <InputField
          required={true}
          placeholder="Org name"
          parentClassName="w-full max-w-[118px] mb-6"
          inputClassName="bg-transparent text-xs"
          type="text"
          value={values.orgName}
          onChange={(e) =>
            setValues({
              ...values,
              orgName: e.target.value,
            })
          }
        />
        <div className="flex items-center">
          <InputField
            label="Company Type"
            required={true}
            placeholder="Company Type"
            parentClassName="w-full max-w-[248px]"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.companyType}
            onChange={(e) =>
              setValues({
                ...values,
                companyType: e.target.value,
              })
            }
          />
          <InputField
            label="Website"
            required={true}
            placeholder="website"
            parentClassName="w-full max-w-[248px] ml-4"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.website}
            onChange={(e) =>
              setValues({
                ...values,
                website: e.target.value,
              })
            }
          />
        </div>
        <div className="flex items-center gap-x-5">
          <InputField
            label="address"
            required={true}
            placeholder="address"
            parentClassName="w-full max-w-[248px]"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.address}
            onChange={(e) =>
              setValues({
                ...values,
                address: e.target.value,
              })
            }
          />
          <InputSelect
            required={true}
            value={values.country}
            label="Country"
            labelClassname="ml-3"
            onChange={(val) => setValues({ ...values, country: val })}
            optionData={grades}
            inputContainerClassName="border text-xs"
            inputClassName="appearance-none font-medium"
            placeholder="Select"
            parentClassName="w-full max-w-150"
            type="select"
          />
        </div>
        <div className="flex items-center gap-x-5">
          <InputSelect
            required={true}
            value={values.state}
            label="State"
            labelClassname="ml-3"
            onChange={(val) => setValues({ ...values, state: val })}
            optionData={grades}
            inputContainerClassName="border text-xs"
            inputClassName="appearance-none font-medium"
            placeholder="Select"
            parentClassName="w-full max-w-150"
            type="select"
          />
          <InputField
            label="zip"
            required={true}
            placeholder="zip"
            parentClassName="w-full max-w-[248px]"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.zip}
            onChange={(e) =>
              setValues({
                ...values,
                zip: e.target.value,
              })
            }
          />
          <InputField
            label="city"
            required={true}
            placeholder="city"
            parentClassName="w-full max-w-[248px]"
            inputClassName="bg-transparent text-xs"
            type="text"
            value={values.city}
            onChange={(e) =>
              setValues({
                ...values,
                city: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center mt-12">
          <SecondaryButton
            children="Back"
            className="text-sm mr-6"
            onClick={handleBack}
          />
          <PrimaryButton
            children="Next"
            className="text-sm disabled:opacity-70"
            onClick={() => handleSubmit()}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
