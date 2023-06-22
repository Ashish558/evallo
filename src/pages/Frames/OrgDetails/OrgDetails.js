import React, { useEffect, useState } from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import InputField from "../../../components/InputField/inputField";
import InputSelect from "../../../components/InputSelect/InputSelect";
import styles from "../EventModal/style.module.css";
import { Country, State } from 'country-state-city';
import Dropdown from './Commons/Dropdown';
import style from './styles.module.css';

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

  const countryData = Country.getAllCountries().map(city => ({
    value: city.name,
    displayValue: city.name
  
}))





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

const [country,setCountry] =useState([])
const [states,setStates] =useState([])

const handleState=(c)=>{
console.log(c)
const state=country.filter(x=>x.name===c)

const currentState = state.map(s=>s.states)
setStates(currentState)
console.log(currentState)
// console.log(country)
}

  useEffect(() => {
    setcurrentStep(2);
    fetch('countryData.json')
    .then((res) => res.json())
    .then((data) => setCountry(data));
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
          disabled={true}
          placeholder=""
          parentClassName=" min-w-[118px] w-max mb-6"
          inputClassName="bg-transparent text-sm font-bold"
          type="text"
          value={values.company}
         
        />
        <div className="flex items-center">
          <InputField
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
          />
          <InputField
            label="Website"
            required={true}
            placeholder=""
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
            label="Address"
            required={true}
            placeholder=""
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
         

      <div className={style.changeOption }>
        
      <select className="form-control mt-5 text-xs" onChange={(e)=>handleState(e.target.value)}>
          <option value="0">Select Country</option>
{
  country.map((c,index)=>{
    return(
      <option key={index} value={c?.name}>{c?.name}</option>

    )
  })
}

         </select>
      </div>
   
        </div>
        <div className="flex items-center gap-x-5">
         
                <div className={style.changeOption }>
        
        <select className="form-control mt-7 text-xs">
            <option value="0">Select State</option>
            {
  states.map((s,id)=>{
    return(
     <>
     {
      s.map((state,id)=>{
        return(
          <option key={id} value={state?.name}>{state?.name}</option>
        )
      })
     }
     </>

    )
  })
}
  
           </select>
        </div>
        <InputField
            label="City"
            required={true}
            placeholder=""
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
          <InputField
            label="Zip"
            required={true}
            placeholder=""
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
