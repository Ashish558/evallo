import React from "react";
import Loader from "../Loader";

export default function PrimaryButton({
  children,
  className,
  style,
  onClick,
  disabled,
  roundedClass,
  type,
  iconClassName,
  loading,
  Icon,
}) {
  return (
    <button
      style={{...style}}
      className={`bg-primary relative flex items-center justify-center  ${
        roundedClass ? roundedClass : "rounded-md"
      } ${className ? className : "px-6 py-2" } disabled:opacity-60 `}
      onClick={onClick}
      disabled={loading === true ? true : disabled}
      type={type ? type : "button"}
    >
      {Icon && <img src={Icon} className={`mr-1 ${iconClassName}`} alt="next icon" />}
      {children}
      {loading && <Loader />}
    </button>
  );
}
