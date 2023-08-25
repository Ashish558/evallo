import React, { useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import Message from "./Message/Message";
import { useRef } from "react";
import { useEffect } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";

export default function InputField({
  parentClassName,
  inputContainerClassName,
  Icon,
  IconRight2Click,
  iconSize,
  refS,
  IconRight2,
  value,
  placeholder,
  label,
  labelClassname,
  IconRight,
  IconLeft,
  inputClassName,
  inputLeftField,
  onChange,
  type,
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
  defaultValue
}) {
  const [inputType, setInputType] = useState(type);
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  const handleClose = () => setShowDiv(false)
  useOutsideAlerter(divRef, handleClose)

  useEffect(() => {
    setShowDiv(true)
  }, [error])

  
  return (
    <div className={`relative text-sm ${parentClassName && parentClassName}`}>
      {label && (
        <label
          className={`inline-block text-sm font-semibold ${labelClassname} ml-0`}
        >
          {label}
          {required && (
            <span className="text-primaryRed inline-block pl-1">*</span>
          )}
        </label>
      )}
      <div
        className={`py-[13px] px-[14px] lg:py-[9px] lg:px-[16px] flex items-center rounded  ${inputContainerClassName ? inputContainerClassName : ""
          } ${disabled === true ? "cursor-not-allowed" : ""} `}
      >
        {Icon && (
          <img
            src={Icon}
            alt='field-icon'
            className={`mr-5 ${iconSize === "medium" ? "w-[24px]" : "w-[28px]"
              }`}
          />
        )}

        {inputLeftField && inputLeftField}

        {prefix && <span className="mr-3">{prefix}</span>}

        {IconRight && (
          <div className="group relative w-fit">
            <img
              src={IconRight}
              alt='icon-right'
              className={` cursor-pointer ${iconSize === "medium" && "w-[24px]"
                }`}

            />
            {Tooltip}
          </div>
        )}
        <input
          className={`outline-0 w-full text-sm pl-1 ${inputClassName ? inputClassName : ""
            } ${disabled === true ? "cursor-not-allowed" : ""} `}
          placeholder={placeholder}
          type={inputType ? inputType : "text"}
          onChange={(e) => (onChange !== undefined ? onChange(e) : "")}
          value={value}
          ref={refS}
          defaultValue={defaultValue}
          required={isRequired ? true : false}
          disabled={disabled !== undefined ? disabled : false}
          onKeyDown={onKeyDown ? onKeyDown : () => { }}
          minLength={minLength && minLength}
          maxLength={maxLength && maxLength}
          onMouseEnter={onMouseEnter}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {IconLeft && (
          <div className="group relative w-fit">
            <img
              src={IconLeft}
              alt='icon-left'
              className={` cursor-pointer ${iconSize === "medium" && "w-[24px]"
                }`}

            />
            {Tooltip}
          </div>
        )}
        {type === "password" && (
          <img
            src={EyeIcon}
            className="ml-4 w-[20px] cursor-pointer"
            alt='eye-active'
            onClick={() =>
              inputType === "password"
                ? setInputType("text")
                : setInputType("password")
            }
          />
        )}
        
         {IconRight2 &&<img onClick={DateIconClick} className="ml-3 cursor-pointer scale-[0.80]" src={IconRight2} alt="right icon"/>}
        {right && right}
      </div>

      <div ref={divRef}>
        {error !== undefined && error !== '' &&
          <div >
            {showDiv && (
              <div>
                <Message error={error} type='danger' />
              </div>
            )}
          </div>
        }
      </div>

    </div>
  );
}
