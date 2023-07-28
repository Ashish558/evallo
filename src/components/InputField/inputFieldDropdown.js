import React, { useState } from "react";
import EyeIcon from "../../assets/form/eye-open.svg";
import Message from "./Message/Message";
import { useEffect } from "react";

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
  onBlur,
}) {
  const [inputType, setInputType] = useState(type);
  const [searchCode, setSearchCode] = useState("")
  const [dialCode, setDialCode] = useState([]);
  const handleCodeSearch=(e)=>{
    setSearchCode(e.target.value)
    let arr=dialCode.filter((item)=>{
        return item?.dial_code.includes(e.target.value);
    })
    console.log(arr)
    setDialCode(arr)
  }
  useEffect(() => {
    fetch("countryCode.json")
      .then((res) => res.json())
      .then((data) => setDialCode(data));
  }, []);

    return (
        <div className={`relative text-sm ${parentClassName && parentClassName}`}>
            {label && <label
                className={`inline-block font-semibold ${labelClassname} ml-0`}
            >
                {label}
                {required && (
                    <span className="text-primaryRed inline-block pl-1">*</span>
                )}
            </label>}
            <div
                className={`py-[13px] px-[14px] lg:py-[9px] lg:px-[16px] flex items-center rounded border border-[#D0D5DD] ${inputContainerClassName ? inputContainerClassName : ""} ${disabled === true ? 'cursor-not-allowed' : ''} `}
            >
                <div >
                    <select className="bg-[#EAF5FA] min-w-[20px] text-[black] focus:outline-none rounded-sm text-sm" name="country_code" >
                        <option value="0"></option>
                        {
                            dialCode.map(code => {
                                return (
                                    <option value={code?.dial_code}>{code?.dial_code}</option>
                                )
                            })
                        }
                    </select>
                </div>
                {Icon && <img src={Icon} className={`mr-5 ${iconSize === 'medium' ? 'w-[24px]' : 'w-[28px]'}`} alt="Icon" />}
                {inputLeftField && inputLeftField}
                {prefix &&
                    <span className="mr-3">{prefix}</span>}
                <input
                    className={`outline-0 w-full pl-2 text-sm ${inputClassName ? inputClassName : ""} ${disabled === true ? 'cursor-not-allowed' : ''} `}
                    placeholder={placeholder}
                    type={inputType ? inputType : "text"}
                    onChange={(e) => onChange !== undefined ? onChange(e) : ""}
                    value={value}
                    required={isRequired ? true : false}
                    disabled={disabled !== undefined ? disabled : false}
                    onKeyDown={onKeyDown ? onKeyDown : () => { }}
                    minLength={minLength && minLength}
                    maxLength={maxLength && maxLength}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
                {type === 'password' && <img src={EyeIcon} className="ml-4 w-[20px] cursor-pointer"
                    onClick={() => inputType === 'password' ? setInputType('text') : setInputType('password')} alt="Eye-icon"
                />}
                {IconRight && <img src={IconRight} className={`ml-4 cursor-pointer ${iconSize === "medium" && "w-[24px]"}`} alt="Icon-right" />}
                {right && right}
            </div>
            {error !== undefined && error !== '' &&
                <Message error={error} type='danger' />
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
      {error !== undefined && error !== "" && (
        <Message error={error} type="danger" />
      )}
    </div>
  );
}
