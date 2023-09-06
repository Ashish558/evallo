import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import DownArrow from "../../assets/icons/down-chevron.svg";
import UpArrow from "../../assets/icons/chevron-up-solid (1).svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function InputSelect({
  parentClassName,
  Icon,
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
  optionType,
  disabled,
  required,
  optionListClassName,
  IconRight,
  DateSelect,
  setSelectedDate,
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));
  const handleOption = () => {
    console.log("handleOption")
    setSelected(!selected);
    if (setSelectedDate) setSelectedDate({ sDate: "", eDate: "" });
  };
  useEffect(() => {
    if (!checkbox) setSelected(false);
  }, [value]);
  const handleChange = (optionType, option, idx) => {
    onChange(optionType, option, idx);
  };

  return (
    <div
      ref={selectRef}
      className={`${selected && "relative z-5000"} ${parentClassName ? parentClassName : ""
        } ${disabled === true ? "pointer-events-none" : ""} `}
    >
      {label && (
        <label className={`font-semibold inline-block mb-1 ${labelClassname}`}>
          {label}
          {required && (
            <span className="text-primaryRed inline-block pl-1">*</span>
          )}
        </label>
      )}

      <div
        className={`py-[10px]  lg:py-[10px]  border border-[#D0D5DD] flex items-center rounded relative  z-50 ${inputContainerClassName ? inputContainerClassName : ""
          } `}
      >
        {Icon && <img src={Icon} className={`mr-5  w-[28px]}`} alt="icon" />}
      

        <div
          className={`outline-0 w-full text-right cursor-default relative ${optionClassName ? optionClassName : ""
            }`}
          name={label}
        >
          {value === "" || !value ? (
            <span className="text-primary-60 mr-5 pl-5 cursor-default  text-[13px]  !text-[calc(15*0.050vw)]  whitespace-nowrap">
              {" "}
              <span > {placeholder}</span>
              {" "}
            </span>
          ) : (
            <span className="mr-5 pl-5 text-[15px] !text-[calc(15*0.050vw)] cursor-default whitespace-nowrap">
              <span >{value}</span>

            </span>
          )}
  {selected ? (
          IconRight ? (
            <FontAwesomeIcon
              className="w-[30px] text-lg cursor-pointer  z-[5000]"
              onClick={handleOption}
              icon={IconRight}
            ></FontAwesomeIcon>
          ) : (
            <img
              src={UpArrow}
              className={`w-[15px]   ${styles.downArrow}`}
              alt="down-arrow"
            />
          )
        ) : IconRight ? (
          <FontAwesomeIcon
            className="w-[30px] text-lg cursor-pointer   z-[5000]"
            onClick={handleOption}
            icon={IconRight}
          ></FontAwesomeIcon>
        ) : (
          <img
            src={DownArrow}
            className={`w-[15px]  ${styles.downArrow}`}
            alt="down-arrow"
          />
        )}
        </div>
        {selected && (
          <div
            className={`scrollbar-content relative !z-[9999999999] scrollbar-vertical  shadow-md ${styles.options} shadow-[0px_0px_3px_0px_#00000040]`}
          >

            {optionData?.map((option, idx) => {
              return (
                <div
                  className="outline-0 border-0 relative !z-[9999999999] py-2 px-[26px] flex items-center justify-start"
                  key={idx}
                  onClick={() => handleChange(optionType, option, idx)}
                >
                  <p className={`${optionListClassName} relative !z-[9999999999]`}>
                    {optionType === "object" ? option.name : option}
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
                        checked={checkbox.match.includes(option) ? true : false}
                        name="student"
                      />
                    </div>
                  )}
                </div>
              );
            })}
           
            {DateSelect &&<> <p className="px-[26px] text-center text-[15px] underline underline-offset-4 font-semibold py-[15px] !text-[calc(15*0.050vw)]">Custom</p>
            { DateSelect}
            </>}
          </div>
        )}
      </div>
    </div>
  );
}
