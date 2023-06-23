import React from "react";
import Loader from "../Loader";

export default function SecondaryButton({
  children,
  className,
  onClick,
  type,
  loading,
}) {
  return (
    <button
      className={`bg-secondaryLight relative rounded-md text-white py-[7px] text-[#636363] px-6 ${className} disabled:opacity-60`}
      onClick={onClick}
      type={type ? type : "button"}
      disabled={loading === true ? true : false}
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
