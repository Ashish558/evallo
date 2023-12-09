import React, { useRef } from "react";
import { useState } from "react";
import AddIcon from "../../assets/Settings/add-white.svg";

export default function AddTag({
  keyName,
  onAddTag,
  isFile,
  openModal,
  className,
  text,
  hideIcon,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const [size, setSize] = useState(1);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => {
    // console.log(e.target.value.length)
    setValue(e.target.value);
    if (e.target.value.length === 0) return setSize(1);
    setSize(e.target.value.length);
  };

  const handleBlur = () => {
    setIsClicked(false);
    if (value.trim() === "") return;
    if (onAddTag !== undefined) {
      onAddTag(value, keyName);
      setValue("");
    }
  };

  const handleClick = () => {
    if (openModal === true) return onAddTag();
    isFile ? onAddTag() : setIsClicked(true);
  };

  return (
    <button className={`${className ? className : ' bg-primary'} flex justify-center items-center text-white font-medium text-[17.5px] px-[10.75px] py-[9.90px] h-[46px] rounded-7 ${isClicked ? 'justify-center' : ''} gap-x-[6.25px]`}
      onClick={handleClick}
      type="button" >
      {
        !isClicked ?
          <>
            <p className='mr-1 '>
              {text ? text : 'Add Item'}
            </p>
            {
              !hideIcon &&
              <img src={AddIcon} alt='tag-icon' className='w-medium ml-1' />
            }
          </>
          :
          <div className={`w-auto`} >
            <input size={size}
              autoFocus
              ref={inputRef}
              value={value}
              className='w-full outline-0 border-0 bg-transparent transition '
              onChange={handleChange}
              // onKeyDown={e => e.key === 'Enter' && handleBlur}
              onKeyDown={e => e.key === 'Enter' && handleBlur()}
              onBlur={handleBlur} />
          </div>
      }

    </button>
  );
}
