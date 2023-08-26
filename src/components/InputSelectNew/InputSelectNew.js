import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import DownArrow from "../../assets/icons/down-chevron.svg";
import countryDA from "../../assets/icons/Layer 2countryda.svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import UpArrow from "../../assets/icons/upArrow.svg";
export default function InputSelectNew({
  parentClassName,
  Icon,
  optionsEachClassName,
  value,
  placeholder,
  label,
  labelClassname,
  optionData,
  inputContainerClassName,
  onChange,
  radio,
  checkbox,
  optionClassName,
  optionContainerClassName,
  optionType,
  disabled,
  required,
  placeHolderClass,
  IconDemography,
  optionListClassName,
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  useEffect(() => {
   
    setSelected(false)
  }, [value]);
  const handleOptionSelect=(option,idx)=>{
    onChange(optionType === "object" ? option : option, idx);
    
  }

  return (
    <div
      ref={selectRef}
      className={`${selected && "relative z-5000"} ${
        parentClassName ? parentClassName : ""
      } ${disabled === true ? "pointer-events-none" : ""} `}
      onClick={() => setSelected(!selected)}
    >
      {label && (
        <label className={`font-semibold  inline-block ${labelClassname}`}>
          {label}
          {required && (
            <span className="text-primaryRed inline-block pl-1">*</span>
          )}
        </label>
      )}

      <div
        className={`py-[10px] px-[21px] flex items-center rounded-10 relative cursor-pointer  z-50 ${
          inputContainerClassName ? inputContainerClassName : ""
        } `}
      >
        {Icon && <img src={Icon} className="mr-6" alt="icon" />}

        {!selected ?
          <img
            src={IconDemography?countryDA:DownArrow}
            className={`w-[15px] ${styles.downArrow}`}
            alt="down-arrow"
            onClick={() => setSelected(!selected)}
          />:<img
          src={IconDemography?countryDA:UpArrow}
          className={`w-[15px] ${styles.downArrow}`}
          alt="down-arrow"
          onClick={() => setSelected(!selected)}
        />

        }
        <div
          className={`outline-0 w-full mr-3 relative ${
            optionClassName ? optionClassName : ""
          }`}
          name={label}
        >
          {value === "" ? (
            <span className={`text-primary-60 ${placeHolderClass}`}> {placeholder} </span>
          ) : (
            value
          )}
        </div>
        {selected && (
          <div
            className={`scrollbar-content scrollbar-vertical shadow-md w-full max-h-[165px] ${styles.options} ${optionContainerClassName}`}
          >
            {optionData?.map((option, idx) => {
              // console.log('option', option);
              // console.log('checkbox.match', checkbox.match);
              return (
                <div
                  className={`outline-0 border-0 py-2.5  px-4 flex items-center justify-between ${optionsEachClassName}`}
                  key={idx}
                  onClick={()=> handleOptionSelect(option,idx)}
                >
                  <p className={optionListClassName}>
                    {optionType !== undefined && optionType === "object"
                      ? option.value
                        ? option.value
                        : option.name
                      : option}
                  </p>
                  {radio && (
                    <input
                      type="radio"
                      name="name"
                      checked={option === value ? true : false}
                    />
                  )}
                  {checkbox && (
                    <div className="flex">
                      <CCheckbox
                        checked={
                          checkbox.match.includes(option.value) ? true : false
                        }
                        name="student"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
