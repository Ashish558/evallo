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
  biggerText,
  iconClass,
  optionsEachClassName,
  value,
  placeholderClass,
  inputClassName,
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
  arrowWidth,
  ICON2,
  labelIcon,
  customFontSize
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));

  useEffect(() => {

    setSelected(false)
  }, [value]);
  const handleOptionSelect = (option, idx) => {
    onChange(optionType === "object" ? option : option, idx);

  }

  return (
    <div
      ref={selectRef}
      className={`${selected && "relative z-5000"} ${parentClassName ? parentClassName : ""
        } ${disabled === true ? "pointer-events-none" : ""} `}
      onClick={() => setSelected(!selected)}
    >
      {label && (
        <label className={`font-semibold  inline-block ${biggerText ? "text-lg" : 'text-base-17-5'} ${labelClassname}`}>
          {label}
          {required && (
            <span className="text-primaryRed inline-block pl-1">*</span>
          )}
        </label>
      )}
      {labelIcon && <img src={labelIcon} className={`mr-6 inline-block ${iconClass} `} alt="icon" />}

      <div
        className={`py-[10px] px-[21px] flex items-center rounded-10 relative cursor-pointer  z-50 ${inputContainerClassName ? inputContainerClassName : ""
          } `}
      >
        {Icon && !ICON2 && <img src={Icon} className={`mr-6 inline-block ${iconClass} `} alt="icon" />}

        {!selected && !ICON2 && !Icon && !labelIcon ?
          <img
            src={IconDemography ? countryDA : DownArrow}
            className={`${arrowWidth ? arrowWidth : 'w-[15px]'} ${styles.downArrow}`}
            alt="down-arrow"
            onClick={() => setSelected(!selected)}
          /> : !Icon && !ICON2 && !labelIcon && <img
            src={IconDemography ? countryDA : UpArrow}
            className={` ${arrowWidth ? arrowWidth : 'w-[15px]'}  ${styles.downArrow}`}
            alt="down-arrow"
            onClick={() => setSelected(!selected)}
          />

        }
        <div
          className={`outline-0 w-full mr-3 relative ${optionClassName ? optionClassName : ""
            }`}
          name={label}
        >
         {value === "" || !value ? (
            <span className={`text-[#667085] text-base-17-5 whitespace-nowrap ${false ? 'mr-0' : 'mr-10'}  ${placeholderClass} `}>
              {" "}
              {placeholder}{" "}
            </span>
          ) : (
            <span className={`mr-10 ${customFontSize?customFontSize:'text-base-17-5'} whitespace-nowrap ${false ? 'mr-0' : 'mr-10'}  ${placeholderClass} `}>{value}</span>
          )}
          {ICON2 && <img src={ICON2} className={`ml-4 inline-block ${iconClass} mt-[-5px] `} alt="icon" />}

        </div>
        {selected && (
          <div
            className={`scrollbar-content scrollbar-vertical shadow-md w-full  max-h-[165px] ${styles.options} ${optionContainerClassName} custom-scroller shadow-[0px_0px_3px_0px_#00000040] text-base-17-5`}
          >
            {optionData?.map((option, idx) => {
              // //console.log('option', option);
              // //console.log('checkbox.match', checkbox.match);
              return (
                <div
                  className={`outline-0 border-0 py-2.5  px-4 flex flex-wrap items-center justify-between ${optionsEachClassName} text-base-17-5 `}
                  key={idx}
                  onClick={() => handleOptionSelect(option, idx)}
                >
                  <p className={`${optionListClassName} ${customFontSize?customFontSize:"text-base-17-5"}  `}>
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
