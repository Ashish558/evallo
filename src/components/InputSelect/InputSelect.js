import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import DownArrow from "../../assets/icons/down-chevron.svg";
import UpArrow from "../../assets/icons/chevron-up-solid (1).svg";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import CCheckbox from "../CCheckbox/CCheckbox";

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
  DateSelect
}) {
  const [selected, setSelected] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setSelected(false));
  const handleOption = () => {
    setSelected(!selected);
  };
  useEffect(() => {
    if (!checkbox) setSelected(false);
  }, [value]);

  return (
    <div
      ref={selectRef}
      className={`${selected && "relative z-5000"} ${
        parentClassName ? parentClassName : ""
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
        onClick={()=>setSelected(true)}
        className={`py-[10px] px-[14px]  lg:py-[10px] lg:px-[16px] border border-[#D0D5DD] flex items-center rounded relative cursor-pointer z-50 ${
          inputContainerClassName ? inputContainerClassName : ""
        } `}
      >
        {Icon && <img src={Icon} className={`mr-5  w-[28px]}`} />}
        {selected ? (
          IconRight ? (
            IconRight
          ) : (
            <img
              src={UpArrow}
              className={`w-[15px]  ${styles.downArrow}`}
              alt="down-arrow"
            />
          )
        ) : IconRight ? (
          IconRight
        ) : (
          <img
            src={DownArrow}
            className={`w-[15px]  ${styles.downArrow}`}
            alt="down-arrow"
          />
        )}

        <div
          className={`outline-0 w-full relative ${
            optionClassName ? optionClassName : ""
          }`}
          name={label}
        >
          {value === "" || !value ? (
            <span className="text-primary-60 text-[13px]  mr-10 whitespace-nowrap">
              {" "}
              {placeholder}{" "}
            </span>
          ) : (
            <span className="mr-10 text-[13px] whitespace-nowrap">{value}</span>
          )}
        </div>
        {selected && (
          <div
          onClick={handleOption}
            className={`scrollbar-content scrollbar-vertical  shadow-sm ${styles.options} $`}
          >
              {DateSelect&&DateSelect}
            {optionData?.map((option, idx) => {
              return (
                <div
                  className="outline-0 border-0 py-2.5 px-4 flex items-center justify-between"
                  key={idx}
                  onClick={() => {
                    onChange(
                      optionType === "object" ? option.name : option,
                      idx
                    );
                   
                  }}
                >
                
                  <p className={optionListClassName}>
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
          </div>
        )}
      </div>
    </div>
  );
}
