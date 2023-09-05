import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import DownArrow from "../../assets/icons/down-chevron.svg";
import UpArrow from "../../assets/icons/chevron-up-solid (1).svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import questionMark from "../../assets/images/question-mark.svg";
export default function InputSelect({
  parentClassName,
  Icon,
  value,
  placeholder,
  placeholderClass,
  label,
  labelClassname,
  optionData,
  inputContainerClassName,
  onChange,
  radio,
  checkbox,
  optionClassName,
  optionType,
  disabled,
  required,
  optionListClassName,
  IconRight,
  IconLeft,
  DateSelect,
  IconSearch,
  tableDropdown
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  // console.log(selectRef)
  useOutsideAlerter(selectRef, () => setSelected(false));
  const handleOption = () => {
    setSelected(!selected);
  };
  const handleToggleSelected = () => {
    setSelected(!selected);
  }
  useEffect(() => {
    if (!checkbox) setSelected(false);
  }, [value]);
  const handleChange = (optionType, option, idx) => {
    onChange(optionType === "object" ? option : option, idx);
  };

  return (
    <div
      ref={selectRef}
      className={`${selected && "relative z-5000"} ${parentClassName ? parentClassName : ""
        } ${disabled === true ? "pointer-events-none" : ""} `}
      onClick={handleToggleSelected}
    >

      {
        placeholder === 'Time Zones' || <div className="flex items-center">
          {label && (
            <label
              className={`font-medium ${label == 'User Type' && 'text-sm'} text-[#26435F] inline-block  ${labelClassname}`}
            >
              {label}
              {required && (
                <span className="text-primaryRed inline-block pl-1">*</span>
              )}
            </label>
          )}
          <div>
            {label == "Default Time Zone" && (
              <img className="ml-3" src={questionMark} alt=""></img>
            )}
          </div>
        </div>
      }


      <div
        onClick={() => setSelected(true)}
        className={`py-[13px] px-[21px]  flex items-center rounded relative cursor-pointer z-50 ${inputContainerClassName ? inputContainerClassName : ""
          } `}
      >
        {Icon && <img src={Icon} className={`mr-5  w-[28px]}`} alt="icon" />}
        {IconLeft && <img src={IconLeft} className={`mr-5  w-[28px]}`} alt="IconLeft" />}
        {IconSearch && <img src={IconSearch} className={`mr-5  w-[28px]}`} alt="IconLeft" />}
        {selected ? (
          IconRight ? (
            IconRight
          ) : !IconLeft && (
            <img
              src={UpArrow}
              className={`w-[15px] h-[12px]  ${styles.downArrow}`}
              alt="down-arrow"
            />
          )
        ) : IconRight ? (
          IconRight
        ) : !IconLeft && (
          <img
            src={DownArrow}
            className={`w-[15px] h-[12px]   ${styles.downArrow}`}
            alt="down-arrow"
          />
        )}

        <div
          className={`outline-0 w-full relative ${optionClassName ? optionClassName : ""
            }`}
          name={label}
        >
          {value === "" || !value ? (
            <span className={`text-[#667085] text-[17.5px] whitespace-nowrap ${tableDropdown ? 'mr-0' : 'mr-10'} ${placeholderClass} text-base-17-5`}>
              {" "}
              {placeholder}{" "}
            </span>
          ) : (
            <span className={`mr-10 text-[17.5px] whitespace-nowrap ${tableDropdown ? 'mr-0' : 'mr-10'}  ${placeholderClass} text-base-17-5`}>{value}</span>
          )}
        </div>
        {selected && (
          <div
            onClick={handleOption}
            className={`scrollbar-content  scrollbar-vertical  shadow-lg shadow-[0px_0px_3px_0px_#00000040] ${styles.options} $`}
          >
            {DateSelect && DateSelect}
            {optionData?.map((option, idx) => {
              return (
                <div
                  className="outline-0 border-0 text-[17.5px] py-2 px-4 flex items-center justify-between text-base-15"
                  key={idx}
                  onClick={() => handleChange(optionType, option, idx)}
                >
                  <div className={`${optionListClassName}`}>
                    {optionType === "object" ? option.name : option}
                  </div>
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
                        checked={checkbox.match.includes(option.value ? option.value : option) ? true : false}
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
