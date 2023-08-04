import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import styles from "../EventModal/style.module.css";
import { Country, State } from "country-state-city";
import Dropdown from "./Commons/Dropdown";
import style from "./styles.module.css";

const grades = [6, 7, 8, 9, 10, 11, 12, "College"];
const companyType = [
  "Sole proprietorship",
  "Partnership",
  " Limited liability company (LLC)",
  " C Corporation",
  "S Corporation",
  "B Corporation",
  " Close corporation",
  " Nonprofit corporation",
  "Cooperative",
  "Private Limited Company",
  "Public",
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
    console.log(c);
    const state = country.filter((x) => x.name === c);
    const currentState = state.map((s) => s.states);

    setStates(currentState);
    setValues({
      ...values,
      country: c,
    });
  };

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
      companyType: e.target.value,
    });
  };
  return (
    <div className="mt-5 mb-3">
      <div className="">
        <InputField
          disabled={true}
          placeholder=""
          parentClassName=" min-w-[118px] w-full mb-6"
          inputClassName="bg-transparent text-sm font-bold"
          type="text"
          value={values.company}
        />

        <div className="flex items-center mb-1">
          {/* <label>Company Type</label> */}
          <div className="flex flex-col h-min mt-2">
            <label className="">Company Type</label>
            <div className={style.changeOption}>
              <select
                onChange={(e) => handleCompanyTypeChange(e)}
                className="form-control  text-[13px]"
              >
                <option value="0">Other</option>
                {companyType.map((c, id) => {
                  return (
                    <>
                      <option key={id} value={c}>
                        {c}
                      </option>
                    </>
                  );
                })}
              </select>
            </div>
          </div>
          {/* <InputField
            label="Company Type"
            required={true}
            placeholder=""
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
          /> */}
          <InputField
            label="Website"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[full] ml-[50px] mt-2"
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
        <div className="flex items-center mt-3 gap-5">
          <InputField
            label="Address"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[350px] "
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

          <div className={style.changeOption}>
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
          </div>
        </div>
        <div className="flex items-center mt-3 gap-5">
          <div className={style.changeOption}>
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
          </div>
          <InputField
            label="City"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[248px] mt-2"
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
            label="Zip Code"
            required={true}
            placeholder=""
            parentClassName="w-full max-w-[248px] mt-2"
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
        </div>

        <div className="flex items-center mt-12 justify-between">
          <SecondaryButton
            children="Go Back"
            className="text-sm mr-6 bg-white text-[#a3aDC7] border-[1.5px] border-[#D0D5DD] "
            onClick={handleBack}
          />
          <PrimaryButton
            children="Next"
            className={` w-full bg-[#FFA28D] disabled:opacity-70 max-w-[110px]   rounded text-white text-sm font-medium relative 
           
            `}
            onClick={() => handleSubmit()}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
