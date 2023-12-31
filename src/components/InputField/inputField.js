import React, { useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import EyeIcon2 from "../../assets/form/eye2.svg";
import Message from "./Message/Message";
import { useRef } from "react";
import { useEffect } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import questionMark from "../../assets/icons/red_query.svg";
import styles from "./styles.module.css";

export default function InputField({
  parentClassName,
  parentStyle,
  inputContainerClassName,
  Icon,
  hideTooltip,
  dateBody,
  IconRight2Click,
  iconSize,
  pattern,
  removeResponsive,
  refS,
  IconRight2,
  value,
  placeholder,
  label,
  labelClassname,
  IconRight,
  iconRIghtClassName,
  IconLeft,
  inputClassName,
  inputLeftField,
  onChange,
  type,
  IconRight2Class,
  right,
  required,
  isRequired,
  style,
  disabled,
  error,
  onKeyDown,
  maxLength,
  minLength,
  prefix,
  onFocus,
  Tooltip,
  DateIconClick,
  onBlur,
  onMouseEnter,
  defaultValue,
  totalErrors,
  iconPadding,
  biggerText,
  min,
  customEyeIconSize,
  calenderIconClass,
  max
}) {
  //console.log({ hideTooltip })
  const [inputType, setInputType] = useState(type);
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  const handleClose = () => setShowDiv(false);
  useOutsideAlerter(divRef, handleClose);

  useEffect(() => {
    setShowDiv(true);
  }, [error, totalErrors]);
  useEffect(() => {
    setShowDiv(false);
  }, [value]);

  return (
    <div className={`relative text-sm ${parentClassName && parentClassName}`} style={{...parentStyle}} >
      {label && (
        <label
          className={`${
            biggerText ? "text-lg" : "text-[16.5px]"
          }  inline-block  font-semibold ${labelClassname} ml-0 `}
        >
          <span className="inline-block !cursor-default">{label}</span>
          {label === "Support Email" && (
            <div className="group relative">
              <img
                src={questionMark}
                className="inline-block cursor-pointer"
                alt=""
              />
              <div className="absolute  top-0 left-6 z-5000 w-[450px] rounded-[13px] bg-[rgba(0,0,0,0.80)] group-hover:!bg-opacity-100  text-white  whitespace-normal pt-[20px] pb-[24px] px-[15px] scale-0 group-hover:scale-100">
                <h3 className="text-[#517CA8] text-left text-[0.8333vw] py-0 font-medium mb-1">
                  Support Email
                </h3>
                <span className=" !text-justify text-[0.6948vw] font-light w-full">
                  Your clients (parents & students) will see this email in all
                  automated communication as well as notifications. In case of
                  any difficulties, your team will be their first point of
                  contact, so please ensure that this email is active and you
                  have access to the inbox.
                  <br />
                  <span className="">
                    When parents receive reminders, updates, or any other
                    communication from Evallo, this email will be shown to them
                    in case they want to reach out regarding any inquiries. This
                    can be a general contact email, or an inquiry email that you
                    use for all operational communication with your clients.
                  </span>
                </span>
              </div>
            </div>
          )}
          {required && (
            <span className="text-primaryRed inline-block pl-1">*</span>
          )}
        </label>
      )}
      <div
        className={`py-[13px] px-[21px]  flex items-center rounded  ${
          inputContainerClassName ? inputContainerClassName : ""
        } ${disabled === true ? "cursor-not-allowed" : ""} `}
      >
        {Icon && (
          <img
            src={Icon}
            alt="field-icon"
            className={`mr-5 ${
              iconSize === "medium" ? "w-[24px]" : "w-[28px]"
            }`}
          />
        )}

        {inputLeftField && inputLeftField}

        {prefix && <span className="mr-3">{prefix}</span>}
        {dateBody && dateBody}
        {IconRight && !hideTooltip && (
          <div className={`group relative w-fit ${iconRIghtClassName}`}>
            <img
              src={IconRight}
              alt="icon-right"
              className={` cursor-pointer ${
                iconSize === "medium" && "w-[24px]"
              } ${iconRIghtClassName}`}
            />
            {Tooltip}
          </div>
        )}
        <input
          className={`outline-0 w-full text-[17.5px]  ${
            iconPadding ? iconPadding : "pl-1"
          } placeholder:text-[17.5px] ${
            inputClassName ? inputClassName : ""
          } ${disabled === true ? "cursor-not-allowed" : ""} ${
            removeResponsive ? "" : "text-[17.5px]"
          } ${styles["inut"]} `}
          placeholder={placeholder}
          type={inputType ? inputType : "text"}
          onChange={(e) => (onChange !== undefined ? onChange(e) : "")}
          onInput={(e) => (onChange !== undefined ? onChange(e) : "")}
          value={value}
          min={min}
          pattern={pattern && pattern}
          ref={refS}
          defaultValue={defaultValue}
          required={isRequired ? true : false}
          disabled={disabled !== undefined ? disabled : false}
          onKeyDown={onKeyDown ? onKeyDown : () => {}}
          minLength={minLength && minLength}
          maxLength={maxLength && maxLength}
          onMouseEnter={onMouseEnter}
          onFocus={onFocus}
          onBlur={onBlur}
          max={max ? max : ''}
        />
        {IconLeft && !hideTooltip && (
          <div className="group w-fit absolute top-50 right-[12.5px] end-0 me-[10px]">
            <img
              src={IconLeft}
              alt="icon-left"
              className={` cursor-pointer ${
                iconSize === "medium" && "w-[24px]"
              }`}
            />
            {Tooltip}
          </div>
        )}
        {type === "password" && (
          <img
            src={inputType === "password" ? EyeIcon : EyeIcon2}
            className={`ml-4 ${customEyeIconSize ? customEyeIconSize :  "w-[22.45px] h-[22.45px]"} cursor-pointer ${
              inputType === "password" ? "" : "opacity-[0.7]"
            }`}
            alt="eye-active"
            onClick={() =>
              inputType === "password"
                ? setInputType("text")
                : setInputType("password")
            }
          />
        )}

        {IconRight2 && (
          <img
            onClick={DateIconClick}
            className={`ml-3 cursor-pointer scale-[0.80] ${IconRight2Class} w-[24.5px] h-[24.5px] `}
            src={IconRight2}
            alt="right icon"
          />
        )}
        {right && right}
      </div>

      <div ref={divRef}>
        {error !== undefined && error !== "" && (
          <div>
            {showDiv && (
              <div>
                <Message error={error} type="danger" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
