import React, { useRef, useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import Message from "./Message/Message";
import { useEffect } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";

export default function InputFieldDropdown({
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
  codeError,
  type,
  right,
  required,
  isRequired,
  style,
  codeValue,
  handleCodeChange,
  disabled,
  error,
  onKeyDown,
  maxLength,
  minLength,
  prefix,
  totalErrors,
  onFocus,
  onBlur,
}) {
  const [inputType, setInputType] = useState(type);
  const [searchCode, setSearchCode] = useState("")
  const [dialCode, setDialCode] = useState([]);
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  const [showDiv2, setShowDiv2] = useState(true);
  const divRef2 = useRef();
  const handleClose = () => setShowDiv(false)
  useOutsideAlerter(divRef, handleClose)
  const handleClose2 = () => setShowDiv2(false)
  useOutsideAlerter(divRef2, handleClose2)
  useEffect(() => {
    if(error?.length>0)
    setShowDiv(true)
  if(codeError?.length>0)
  setShowDiv2(true)
  }, [error,value,totalErrors])

  const handleCodeSearch=(e)=>{
    setSearchCode(e.target.value)
    let arr=dialCode.filter((item)=>{
        return item?.dial_code.includes(e.target.value);
    })
    console.log(arr)
    setDialCode(arr)
  }
  useEffect(() => {
    fetch("/countryCode.json")
      .then((res) =>  res.json())
      .then((data) =>{
        console.log({data})
        data.sort((a, b) =>{
          return parseInt(a.dial_code.split('+')[1]) - parseInt(b.dial_code.split('+')[1]);
        })
      
        setDialCode(data)
      }
      );
  }, []);

  return (
    <div className={`relative text-sm ${parentClassName && parentClassName}`}>
      {label && (
        <label className={`inline-block font-semibold ${labelClassname} ml-0`}>
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
        <div className="">
          
          <select
            onChange={handleCodeChange}
            className="bg-[#EAF5FA] min-w-[20px] text-[black] focus:outline-none rounded-sm text-sm"
            name="country_code"
          >
            <option value="0">{codeValue}</option>
            {dialCode?.map((code,id) => {
              return <option key={id} value={code?.dial_code}>{code?.dial_code}</option>;
            })}
          </select>
          
        </div>
        <div ref={divRef2} className="relative whitespace-nowrap">
      {codeError !== undefined && codeError !== "" && showDiv2 && (
        <Message error={codeError} type="danger" />
      )}
      </div>
        {Icon && (
          <img
            src={Icon}
            className={`mr-5 ${
              iconSize === "medium" ? "w-[24px]" : "w-[28px]"
            }`}
          />
        )}
        {inputLeftField && inputLeftField}
        {prefix && <span className="mr-3">{prefix}</span>}
        <input
          className={`outline-0 w-full pl-2 text-sm ${
            inputClassName ? inputClassName : ""
          } ${disabled === true ? "cursor-not-allowed" : ""} `}
          placeholder={placeholder}
          type={inputType ? inputType : "text"}
          onChange={(e) => (onChange !== undefined ? onChange(e) : "")}
          value={value}
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
            onClick={() =>
              inputType === "password"
                ? setInputType("text")
                : setInputType("password")
            }
          />
        )}
        {IconRight && (
          <img
            src={IconRight}
            className={`ml-4 cursor-pointer ${
              iconSize === "medium" && "w-[24px]"
            }`}
          />
        )}
        {right && right}
      </div>
      <div ref={divRef}>
      {error !== undefined && error !== "" && showDiv && (
        <Message error={error} type="danger" />
      )}
      </div>
    </div>
  );
}
