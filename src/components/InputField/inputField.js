import React, { useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import Message from "./Message/Message";
import { useRef } from "react";
import { useEffect } from "react";

export default function InputField({
  parentClassName,
  inputContainerClassName,
  Icon,
  iconSize,
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
  onBlur,
  defaultValue
}) {
  const [inputType, setInputType] = useState(type);
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  useEffect(() => {
     function handleClickOutside(event) {
        if (divRef.current && !divRef.current.contains(event.target)) {
           setShowDiv(false);
        }
     }

     document.addEventListener('click', handleClickOutside);
     return () => {
        document.removeEventListener('click', handleClickOutside);
     };
  }, []);

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
        className={`py-[13px] px-[14px] lg:py-[9px] lg:px-[16px] flex items-center rounded border border-[#D0D5DD] ${
          inputContainerClassName ? inputContainerClassName : ""
        } ${disabled === true ? "cursor-not-allowed" : ""} `}
      >
        {Icon && (
          <img
            src={Icon}
            alt='field-icon'
            className={`mr-5 ${
              iconSize === "medium" ? "w-[24px]" : "w-[28px]"
            }`}
          />
        )}
        {inputLeftField && inputLeftField}
        {prefix && <span className="mr-3">{prefix}</span>}
        <input
          className={`outline-0 w-full text-sm ${
            inputClassName ? inputClassName : ""
          } ${disabled === true ? "cursor-not-allowed" : ""} `}
          placeholder={placeholder}
          type={inputType ? inputType : "text"}
          onChange={(e) => (onChange !== undefined ? onChange(e) : "")}
          value={value}
          defaultValue={defaultValue}
          required={isRequired ? true : false}
          disabled={disabled !== undefined ? disabled : false}
          onKeyDown={onKeyDown ? onKeyDown : () => {}}
          minLength={minLength && minLength}
          maxLength={maxLength && maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
        />
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
        {IconRight && (
            <div className="group relative w-fit">
          <img
            src={IconRight}
            alt='icon-right'
            className={`ml-4 cursor-pointer ${
              iconSize === "medium" && "w-[24px]"
            }`}
          />
          {Tooltip}
          </div>
        )}
        {right && right}
      </div>
      {error !== undefined && error !== '' &&
            <div>
               {showDiv && (
                  <div ref={divRef}>
                     <Message error={error} type='danger' />
                  </div>
               )}
            </div>
         }

    </div>
  );
}
