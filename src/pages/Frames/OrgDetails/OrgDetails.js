import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import styles from "../EventModal/style.module.css";
import { Country, State } from "country-state-city";
import Dropdown from "./Commons/Dropdown";
import style from "./styles.module.css";
import InputFieldDropdown from "../../../components/InputField/inputFieldDropdown";
import InputSelectNew from "../../../components/InputSelectNew/InputSelectNew";
import lockIcon from "../../../assets/icons/lock.svg"
const grades = [6, 7, 8, 9, 10, 11, 12, "College"];
const companyType = [
  "Sole proprietorship",
  "Partnership",
  "Limited liability company (LLC)",
  "C Corporation",
  "S Corporation",
  "B Corporation",
  "Close corporation",
  "Nonprofit corporation",
  "Cooperative",
  "Private Limited Company",
  "Public",
  "Other",
];
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

  const countryData = Country.getAllCountries().map((city) => ({
    value: city.name,
    displayValue: city.name,
  }));

  const handleSubmit = () => {
    if (!handleEmpty(values?.company) || !handleEmpty(values?.companyType) || !handleEmpty(values?.website) || !handleEmpty(values?.address)
      || !handleEmpty(values?.country) || !handleEmpty(values?.city) || !handleEmpty(values?.state) || !handleEmpty(values?.zip)) {
      alert("Please Fill All The Fields!")
      return
    }
    setFrames((prev) => {
      console.log(prev);
      return {
        ...prev,
        orgDetails: false,
        furtherDetails: true,
      };
    });
  };

  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);


  const handleState = (c) => {
    console.log("country", c);
    const state = country.filter((x) => x.name === c);
    const currentState = state[0]?.states;

    setStates(currentState);
    console.log({ state });
  };

  useEffect(() => {
    console.log("ref", { cc: values.country });
    if (values?.country) handleState(values?.country);
  }, [values.country, country]);

  useEffect(() => {
    setcurrentStep(2);
    fetch("countryData.json")
      .then((res) => res.json())
      .then((data) => setCountry(data));
  }, []);

  const handleBack = () => {
    setFrames((prev) => {
      return { ...prev, orgDetails: false, signupActive: true };
    });
    setcurrentStep(1);
  };
  const handleCompanyTypeChange = (e) => {
    setValues({
      ...values,
      companyType: e,
    });
  };
  const [checkFields, setCheckFields] = useState()
  const handleEmpty = (field) => {
    if (!field || field?.trim(" ")?.length === 0) return false

    return true
  }

  return (
    <div className="mt-2 mb-3">
      <div className="">
        <InputField
          required={true}
          disabled={true}
          placeholder=""
          right={<img src={lockIcon} alt="lock" />}
          parentClassName=" min-w-[118px] w-full "
          inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[44px] text-md "
          inputClassName="!text-[rgba(179,189,199,1)] bg-transparent text-sm font-semibold"
          type="text"
          value={values.company}
        />

        <div className="flex items-center mt-5">
          {/* <label>Company Type</label> */}
          <InputSelectNew
            value={values.companyType}
            parentClassName="w-[500px]"
            optionContainerClassName="text-[13px] "
            optionsEachClassName="py-[7px]"
            optionData={companyType}
            placeholder={"Select"}
            label={`Company Type`}
            labelClassname="text-[#26435F] font-bold  mb-1 !text-sm "
            inputContainerClassName="py-1 text-sm h-[44.9px] border  border-[#D0D5DD] my-0 mt-[-2px] rounded-[5px]"
            inputClassName="ml-80"
            required={persona === "student" ? true : false}
            onChange={(e) => handleCompanyTypeChange(e)}
          />

          <InputField
            required={true}
            label="Website"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[full] ml-[50px] "
            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[44px] text-md"
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
        <div className="flex items-center mt-5 gap-5">
          <InputField
            required={true}
            label="Address"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[350px] "
            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[44px] text-md"
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
          <InputSelectNew
            parentClassName="w-[500px]"
            optionContainerClassName="text-[13px]  max-h-[250px] h-[250px] "
            optionsEachClassName="py-[5px]"
            optionData={country}
            optionType="object"
            placeholder={"Select"}
            label={`Country`}
            labelClassname="text-[#26435F] font-bold   !text-sm "
            inputContainerClassName="py-1 text-sm h-[44px] border border-[#D0D5DD] my-0 mt-[-3px] rounded-[4.3px]"
            inputClassName="ml-80"
            required={persona === "student" ? true : false}
            value={values.country}
            onChange={(e) =>
              setValues({
                ...values,
                country: e.name,
                state: "",
              })
            }
          />
          {/* <div className={style.changeOption}>
            <div className="flex flex-col h-min ml-[40px]">
              <label className="">Country</label>
              <select
                className="form-control text-[13px] pl-3"
                onChange={(e) => handleState(e.target.value)}
                value={values.country}
              >
                <option value="0">Country</option>
                {country.map((c, index) => {
                  return (
                    <option key={index} value={c?.name}>
                      {c?.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div> */}
        </div>

        <div className="flex justify-between items-center mt-[18px] gap-7">
          <InputSelectNew
            parentClassName="!w-[700px] "
            optionContainerClassName="text-[13px]   max-h-[180px]"
            optionsEachClassName="py-[5px]"
            optionData={states}
            placeholder={"Select"}
            optionType="object"
            placeholderClass="!mr-2"
            label={`State`}
            labelClassname="text-[#26435F] font-bold   !text-sm "
            inputContainerClassName="py-1 text-sm   h-[44px] border border-[#D0D5DD] my-0 mt-[-3px] rounded-[4.3px] "
            inputClassName="  ml-80"
            required={persona === "student" ? true : false}
            value={values?.state?.length < 20 ? values.state : values.state?.slice(0, 20) + "..."}
            onChange={(e) =>
              setValues({
                ...values,
                state: e.name,
              })
            }
          />
          {/* <div className={style.changeOption}>
            <div className="flex flex-col h-min mt-[7px]">
              <label className="">State</label>
              <select
                className="form-control  text-[13px]"
                value={values.state}
                onChange={(e) =>
                  setValues({
                    ...values,
                    state: e.target.value,
                  })
                }
              >
                <option value="0">State</option>
                {states.map((s, id) => {
                  return (
                    <>
                      {s.map((state, id) => {
                        return (
                          <option key={id} value={state?.name}>
                            {state?.name}
                          </option>
                        );
                      })}
                    </>
                  );
                })}
              </select>
            </div>
          </div> */}
          <InputField
            required={true}
            label="City"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[248px]"
            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[44px] text-md"
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
          <InputField
            required={true}
            label="Zip Code"
            labelClassname={"!text-sm"}
            biggerText={true}
            placeholder=""
            parentClassName="w-full max-w-[248px] "
            inputContainerClassName=" border px-[-10px] border-[#D0D5DD]   rounded-md py-[9px] h-[44px] text-md"
            inputClassName="bg-transparent text-xs custom-scroller-2"
            placeholderClass="!mx-1 custom-scroller-2"
            type="text"
            value={values.zip}
            onChange={(e) =>
              setValues({
                ...values,
                zip: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-center mt-12 justify-between">
          <SecondaryButton
            children="Go Back"
            className="text-sm mr-6 bg-white text-[#cad0db] border-[1.5px] border-[#D0D5DD] py-2"
            onClick={handleBack}
          />
          <PrimaryButton
            children="Next"
            className={` w-full flex justify-center bg-[#FFA28D] disabled:opacity-70 max-w-[110px] py-[9px] rounded text-white text-sm font-medium relative 
           
            `}
            onClick={() => handleSubmit()}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
