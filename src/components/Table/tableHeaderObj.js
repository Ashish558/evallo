import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import SCheckbox from "../CCheckbox/SCheckbox";
export function TableHeaderNew({
  header,
  checkedHeader,
  dataFor,
  Handler,
  noArrow,
}) {
  const [flag, setFlag] = useState(
    header?.className ? header.className.includes("no-arrow") : false
  );
  const handleCheckboxChange = (c) => {
    Handler(c);
  };

  return (
    <th
      className={`px-6 py-[20px] font-medium whitespace-nowrap text-white text-center  cursor-pointer ${
        header.className ? header.className : ""
      } ${flag ? styles["no-arrow"] : ""} bg-[#26435F]`}
    >
      <div
        className={`flex 
        ${header.text === "Student Name" ? "ml-[40px] text-left " : ""} 
        ${header.text === "Assignment Name" ? "ml-[12px]" : ""} 
        ${
          header.text === "Email" ||
          header.text === "Phone" ||
          header.text === "Assignment Name" ||
          header.text === "Assignment"
            ? `justify-start ${
                header.text === "Assignment" ? "ps-6 overflow-hidden" : ""
              }`
            : "justify-center"
        } items-center ${
          noArrow || header.noArrow
            ? ""
            : `${
                header.willDisplayDownArrow ||
                header.willDisplayDownArrow === undefined
                  ? styles.marker: header.willDisplayDownArrow === null?""
                  : styles.upArrow
              }`
        }`}
        onClick={() =>
          header.text === "Full Name" && dataFor === "allUsers"
            ? null
            : header.onCick && header.onCick()
        }
      >
        {header.text === "Full Name" && dataFor === "allUsers" ? (
          <SCheckbox checked={checkedHeader} onChange={handleCheckboxChange} />
        ) : (
          ""
        )}
        {header.text === "Full Name" && dataFor === "allUsers" ? (
          <div onClick={() => header.onCick && header.onCick()}>
            <span className="text-center text-[17.5px] ">{header.text}</span>
          </div>
        ) : (
          <div className={`text-[17.5px] ${header.text === "Score" ? "text-center" : "text-left w-full" }`}>{header.text}</div>
        )}
      </div>
    </th>
  );
}
