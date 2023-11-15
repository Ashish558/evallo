import React, { useRef, useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import Message from "./Message/Message";
import { useEffect } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import downArrow from "../../assets/icons/signup-dropdown.svg";
import upArrow from "../../assets/icons/upArrow.svg";
import styles from "./styles.module.css";

export default function InputFieldDropdown({
  parentClassName,
  inputContainerClassName,
  Icon,
  biggerText,
  iconSize,
  value,
  placeholder,
  codeClassName,
  codeColor,
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
  CodeClass,
  totalErrors,
  onFocus,
  onBlur,
  studentCode,
  arrowClassName,
}) {
  const [inputType, setInputType] = useState(type);

  const [searchCode, setSearchCode] = useState("");
  const [dialCode, setDialCode] = useState([]);
  const [toggleOptions, setToggleOptions] = useState(false);
  const selectRef = useRef();
  useOutsideAlerter(selectRef, () => setToggleOptions(false));

  useEffect(() => {
    setToggleOptions(false);
  }, [value]);
  const [showDiv, setShowDiv] = useState(true);
  const divRef = useRef();
  const [showDiv2, setShowDiv2] = useState(true);
  const divRef2 = useRef();
  const handleClose = () => setShowDiv(false);
  useOutsideAlerter(divRef, handleClose);
  const handleClose2 = () => setShowDiv2(false);
  useOutsideAlerter(divRef2, handleClose2);
  useEffect(() => {
    if (error?.length > 0) setShowDiv(true);
    if (codeError?.length > 0) setShowDiv2(true);
  }, [error, totalErrors]);
  useEffect(() => {
    setShowDiv(false);
    setShowDiv2(false);
  }, [value]);

  const handleCodeSearch = (e) => {
    setSearchCode(e.target.value);
    let arr = dialCode.filter((item) => {
      return item?.dial_code.includes(e.target.value);
    });
    console.log(arr);
    setDialCode(arr);
  };
  useEffect(() => {
    fetch("/countryCode.json")
      .then((res) => res.json())
      .then((data) => {
        console.log({ data });
        // data.sort((a, b) => {
        //   return (
        //     parseInt(a.dial_code.split("+")[1]) -
        //     parseInt(b.dial_code.split("+")[1])
        //   );
        // });
        data.sort((a, b) => {
          if (a.code < b.code) {
            return -1;
          }
          if (a.code > b.code) {
            return 1;
          }
          return 0;
        });
        setDialCode(data);
      });
  }, []);

  return (
    <div className={`relative text-sm ${parentClassName && parentClassName} `}>
      {label && (
        <label
          className={`inline-block font-semibold ${
            biggerText ? "text-lg" : "text-base-17-5"
          }  ${labelClassname} ml-0 `}
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
        {studentCode && (
          <input
            type="text"
            onChange={(e) =>
              handleCodeChange({ target: { value: e.target.value } })
            }
            value={codeValue}
            className="!w-[50px] outline-0 text-400 !py-1 text-base-17-5 bg-transparent  pl-2 text-sm"
          />
        )}
        {!studentCode && (
          <div
            ref={selectRef}
            className={`relative flex justify-between gap-3  max-w-[130px] ${CodeClass} `}
            onClick={() => setToggleOptions(!toggleOptions)}
          >
            <div
              className={` flex justify-between cursor-pointer gap-2   items-center rounded-[3px]  bg-[#EAF5FA]  text-[black] focus:outline-none  px-2 text-sm ${
                codeValue
                  ? "  pr-4 h-[28px]"
                  : "w-[50px] pl-[18px] justify-between h-[28px] pr-4"
              } text-base-17-5 !text-[#667085] ${codeClassName}`}
            >
              {codeValue && <span className=" ">{codeValue}</span>}

              <img
                src={toggleOptions ? downArrow : downArrow}
                className={`inline-block ${
                  toggleOptions ? "transform -scale-y-100" : ""
                }  ${arrowClassName ? arrowClassName : "h-3 w-3"}`}
                alt="down"
              />
            </div>

            <div
              className={`${
                toggleOptions ? "" : "hidden"
              } whitespace-nowrap absolute text-xs mt-[40px]  shadow-lg border border-gray-300  z-[1] h-[300px] rounded-[4px] overflow-y-auto flex flex-col bg-[#EAF5FA] w-[85px] text-[black] focus:outline-none rounded-sm `}
              name="country_code"
            >
              {toggleOptions &&
                dialCode?.map((code, id) => {
                  return (
                    <span
                      className="hover:bg-blue-400 px-1 cursor-default hover:text-white"
                      key={id}
                      value={code?.dial_code}
                      onClick={(e) =>
                        handleCodeChange({ target: { value: code?.dial_code } })
                      }
                    >
                      {code?.code} {code?.dial_code}
                    </span>
                  );
                })}
            </div>
          </div>
        )}
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
          } ${disabled === true ? "cursor-not-allowed" : ""} text-base-17-5 ${
            styles["input"]
          } `}
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
