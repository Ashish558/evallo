import React from "react";
import Loader from "../Loader";

export default function SecondaryButton({
  children,
  className,
  style,
  onClick,
  type,
  loading,
  disabled,
}) {
  return (
    <button
      style={{...style}}
      className={`bg-secondaryLight relative rounded-md py-[8px] text-[#636363] px-6 ${className} disabled:opacity-70`}
      onClick={onClick}
      type={type ? type : "button"}
      disabled={loading === true ? true : disabled}
    >
      {children}
      {loading && <Loader />}
    </button>
  );
}

/*  
  <button
      className={`bg-secondaryLight relative rounded-md text-white py-[7px] text-[#636363] px-6 ${className} disabled:opacity-60`}
      onClick={onClick}
      type={type ? type : "button"}
      disabled={loading === true ? true : false}
    >
      {children}
      {loading && <Loader />}
    </button>

*/
