import React, { useEffect, useRef, useState } from "react";
import SeacrchIcon from "../../assets/icons/search.svg";
import dropdownIcon from "../../assets/icons/dropDownIcon.svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import styles from "../InputSelect/style.module.css";

export default function InputSearch({
  parentClassName,
  inputContainerClassName,
  Icon,
  rightIcon,
  value,
  placeholder,
  label,
  labelClassname,
  IconRight,
  inputClassName,
  inputLeftField,
  onChange,
  type,
  right,
  required,
  optionData,
  optionClassName,
  onOptionClick,
  optionPrefix,
  checkbox,
  disabled,
  IconSearch,
  onOptionClose,
  dropDownIconStatus,
  onBlur
}) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const inputRef = useRef();
  const handleClose = () => {
    setOptionsVisible(false);
  };
  useEffect(() => {
    if (optionsVisible === false && onOptionClose) {
      onOptionClose();
    }
  }, [optionsVisible]);

  useOutsideAlerter(inputRef, handleClose);

  return (
    <div className={`${parentClassName && parentClassName}`}>
      <label className={`inline-block font-semibold bg-pink-400 ${labelClassname} w-2/3`}>
        {label}
        {required && (
          <span className="text-primaryRed inline-block pl-1">*</span>
        )}
      </label>
      <div
        ref={inputRef}
        className={`py-3 px-6 flex relative items-center rounded-5 ${
          inputContainerClassName ? inputContainerClassName : ""
        }`}
      >
        {Icon && (
          <img
            onClick={() => setOptionsVisible(!optionsVisible)}
            className="mr-4 cursor-pointer"
            src={Icon}
          />
        )}
        {IconRight && (
          <img
            onClick={() => setOptionsVisible(!optionsVisible)}
            className="mr-4 cursor-pointer"
            src={IconRight}
            alt="search"
          />
        )}
        {inputLeftField && inputLeftField}
        <input
          disabled={disabled}
          className={`outline-0 w-full ${
            inputClassName ? inputClassName : ""
          } ${styles["input"]} `}
          placeholder={placeholder}
          value={value}
          type={type ? type : "text"}
          onChange={(e) => (onChange !== undefined ? onChange(e) : "")}
          onFocus={() => setOptionsVisible(true)}
          onBlur={onBlur ? onBlur : () => {}}
          // onBlur={()=> setOptionsVisible(false)}
        />
        {IconSearch ? (
          <img
            src={SeacrchIcon}
            onClick={() => setOptionsVisible(!optionsVisible)}
            className="ml-4 cursor-pointer"
            alt="SeacrchIcon"
          />
        ) : (
          ""
        )}

        {dropDownIconStatus && (
          <img src={dropdownIcon} alt="dropDown" className="mr-[2px]" />
        )}

        {right && right}
        {rightIcon && (
          <img
            onClick={() => setOptionsVisible(!optionsVisible)}
            className="cursor-pointer z-[50] relative"
            src={rightIcon}
            alt="drop"
          />
        )}
        {optionsVisible && (
          <div
            className={`${styles.options} custom-scroller scrollbar-vertical shadow-xl rounded-t-none ${optionClassName}`}
          >
            {optionData?.map((option, idx) => {
              return (
                <div
                  className="outline-0  border-0 py-2 px-4 flex justify-between"
                  key={idx}
                  onClick={() => {
                    return checkbox
                      ? onOptionClick(option)
                      : (onOptionClick(option), handleClose());
                  }}
                >
                  <p>{option.value}</p>
                  <p
                    className={`text-sm opacity-60 ${
                      checkbox ? "mr-auto ml-4" : ""
                    }`}
                  >
                    {option?._id && optionPrefix
                      ? `${optionPrefix}${option?._id.slice(-5)}`
                      : option?._id && option?._id.slice(-5)}
                  </p>
                  {checkbox && (
                    <div className="flex mb-3">
                      <CCheckbox
                        checked={
                          option &&
                          option?._id &&
                          checkbox?.match?.includes(option?._id)
                            ? true
                            : false
                        }
                        name="student"
                        // onChange={() =>
                        //    setData({
                        //       ...data,
                        //       recurring: !data.recurring,
                        //    })}
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
