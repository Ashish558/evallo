import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import SCheckbox from "../CCheckbox/SCheckbox";
export function TableHeaderNew({
  header,
  checkedHeader,
  dataFor,
  Handler,
  noArrow,
  wrapperClassName,
}) {
  const [flag, setFlag] = useState(
    header?.className ? header.className.includes("no-arrow") : false
  );
  const handleCheckboxChange = (c) => {
    Handler(c);
  };

  return dataFor === "assignedTests" ? (
    <th
      className={`pt-[26.25px] pb-[24.25px] text-white text-[17.5px] leading-3 font-medium 
      ${
        header.text === "Test Name" ? "relative" : ""
      } 
      ${
        header.text === "Due Date" ? "relative" : ""
      } 
      ${
        header.text === "Completion" ||
        header.text === "Score"
          ? "text-center"
          : " text-left pl-[30px]"
      }`}
    >
      <div
        className={` ${
          header.text === "Student Name" ? "text-end mr-[20px]" : ""
        }

        ${
          header.text === "Tutor" ? "text-left w-[100px]" : ""
        }

        ${
          header.text === "Test Name"
            ? "w-full flex justify-start items-center text-left h-full absolute left-0 top-0"
            : ""
         }
         ${
          header.text == "Due On" ? "w-[100px] px-[7px]" : ""
        }
        
        `}
      >
        {header.text}
      </div>
    </th>
  ) : (
    <th
      className={`px-6 py-[20px] font-normal whitespace-nowrap text-white text-center cursor-pointer ${
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
          header.text === "Full Name" ||
          header.text === "Assignment Name" ||
          header.text === "Assignment" ||
          header.text === "Service"
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
                  ? styles.marker
                  : header.willDisplayDownArrow === null
                  ? ""
                  : styles.upArrow
              }`
        } ${wrapperClassName ?? wrapperClassName} `}
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
            <span className="text-center text-[17.5px]">{header.text}</span>
          </div>
        ) : (
          <div
            className={` text-[17.5px] ${
              header.text === "Score" ? "text-center" : "text-left"
            }`}
          >
            {header.text}
          </div>
        )}
      </div>
    </th>
  );
}
