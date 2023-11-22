import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import DownArrow2 from "../../assets/YIcons/Vectordrop.svg";
import DownArrow from "../../assets/icons/down-chevron.svg";
import UpArrow from "../../assets/icons/chevron-up-solid (1).svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import questionMark from "../../assets/images/question-mark.svg";
import { useSelector } from "react-redux";

export default function InputSelect({
  parentClassName,
  Icon,
  hideRight,
  value,
  downArrow22,
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
  tableDropdown,
  customArrow,
  customArrowClassName,
  questionMarkIcon,
  questionMarkMargin
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  // console.log(selectRef)
  const [scrollToLetter, setScrollToLetter] = useState(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    if (scrollToLetter) {
      const regex = new RegExp(`^${scrollToLetter}`, 'i');
      let index = 0
      const element = optionData?.find((item, idx) => {
        if (optionType === "object") {
          if (regex.test(item.name)) {
            index = idx
          }
          return regex.test(item.name)
        } else {
          if (regex.test(item)) {
            index = idx
          }
          return regex.test(item)
        }
      });
      if (element && optionsRef.current) {
        const itemHeight = 35.93;
        optionsRef.current.scrollTop = itemHeight * index;
      }
      setScrollToLetter(null); // Reset scrollToLetter
    }
  }, [scrollToLetter, optionData]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      setScrollToLetter(e.key);
    };
    if (selected) {
      window.addEventListener('keydown', handleKeyPress);
    } else {
      window.removeEventListener('keydown', handleKeyPress);
    }
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selected]);

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
              <img className={`${questionMarkMargin ? questionMarkMargin : `ml-3`}`} questionMarkIcon src={questionMarkIcon ? questionMarkIcon : questionMark} alt=""></img>
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
        {IconSearch && <img src={IconSearch} className={`mr-2 mt-[3px]  w-[28px]}`} alt="IconLeft" />}
        {selected ? (
          IconRight ? (
            IconRight
          ) : !IconLeft && !hideRight && (
            <img
              src={customArrow ? customArrow : downArrow22 ? DownArrow2 : DownArrow}
              className={`${customArrow ? `${customArrowClassName ? customArrowClassName : "w-[20px] h-[20px]"}` : `w-[15px] h-[12px]`}   ${styles.downArrow}`}
              alt="down-arrow"
            />
          )
        ) : IconRight ? (
          IconRight
        ) : !IconLeft && !hideRight && (
          <img
            src={customArrow ? customArrow : downArrow22 ? DownArrow2 : DownArrow}
            className={`${customArrow ? `${customArrowClassName ? customArrowClassName : "w-[20px] h-[20px]"}` : `w-[15px] h-[12px]`} ${styles.downArrow} `}
            alt="down-arrow"
          />
        )}

        <div
          className={`outline-0 w-full relative ${optionClassName ? optionClassName : ""
            }`}
          name={label}
        >
          {value === "" || !value ? (
            <span className={`text-[#667085] text-base-17-5 whitespace-nowrap ${tableDropdown ? 'mr-0' : 'mr-10'}  ${placeholderClass} `}>
              {" "}
              {placeholder}{" "}
            </span>
          ) : (
            <span className={`mr-10 text-base-17-5 whitespace-nowrap ${tableDropdown ? 'mr-0' : 'mr-10'}  ${placeholderClass} `}>{value}</span>
          )}
        </div>
        {selected && (
          <div
            onClick={handleOption}
            ref={optionsRef}
            className={` custom-scroller  scrollbar-vertical   shadow-[0px_0px_3px_0px_#00000040] ${styles.options} $`}
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
