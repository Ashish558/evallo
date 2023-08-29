import React from "react";
import Loader from "../Loader";

export default function PrimaryButton({
  children,
  className,
  onClick,
  disabled,
  roundedClass,
  type,
  loading,
  Icon,
}) {
  return (
    <button
      className={`bg-primary relative flex items-center justify-center  ${
        roundedClass ? roundedClass : "rounded-md"
      } text-white  px-6 ${className} disabled:opacity-60 py-2`}
      onClick={onClick}
      disabled={loading === true ? true : disabled}
      type={type ? type : "button"}
    >
      {Icon && <img src={Icon} className="mr-1" alt="next icon" />}
      {children}
      {loading && <Loader />}
    </button>
  );
}
