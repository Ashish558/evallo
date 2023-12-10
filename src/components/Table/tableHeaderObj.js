import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import SCheckbox from "../CCheckbox/SCheckbox";
export function TableHeaderNew({
  header,
  checkedHeader,
  dataFor,
  Handler,
  noArrow,
  wrapperClassName
}) {
  const [flag, setFlag] = useState(
    header?.className ? header.className.includes("no-arrow") : false
  );
  const handleCheckboxChange = (c) => {
    Handler(c);
  };
  const downArrow = (<svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none"><path d="M9.35616 13.4537C9.1998 13.4538 9.04693 13.4991 8.91662 13.5839C8.78632 13.6687 8.68435 13.7893 8.62344 13.9306C8.56253 14.0719 8.54537 14.2277 8.57411 14.3785C8.60285 14.5293 8.67621 14.6685 8.78504 14.7787L13.0313 19.0756C13.1055 19.1505 13.1943 19.2101 13.2924 19.2508C13.3905 19.2915 13.4959 19.3125 13.6024 19.3125C13.709 19.3125 13.8144 19.2915 13.9125 19.2508C14.0106 19.2101 14.0994 19.1505 14.1736 19.0756L18.4199 14.7787C18.5287 14.6685 18.602 14.5293 18.6308 14.3785C18.6595 14.2277 18.6424 14.0719 18.5815 13.9306C18.5205 13.7893 18.4186 13.6687 18.2883 13.5839C18.158 13.4991 18.0051 13.4538 17.8487 13.4537H14.3986L14.3986 6.03182C14.3986 5.82462 14.3147 5.62591 14.1654 5.47939C14.0161 5.33288 13.8136 5.25057 13.6024 5.25057C13.3913 5.25057 13.1888 5.33288 13.0395 5.47939C12.8902 5.62591 12.8063 5.82462 12.8063 6.03182L12.8063 13.4537H9.35616Z" fill="white"/></svg>)
  const upArrow = (<svg style={{rotate:"180deg"}} xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 27 26" fill="none"><path d="M9.35616 13.4537C9.1998 13.4538 9.04693 13.4991 8.91662 13.5839C8.78632 13.6687 8.68435 13.7893 8.62344 13.9306C8.56253 14.0719 8.54537 14.2277 8.57411 14.3785C8.60285 14.5293 8.67621 14.6685 8.78504 14.7787L13.0313 19.0756C13.1055 19.1505 13.1943 19.2101 13.2924 19.2508C13.3905 19.2915 13.4959 19.3125 13.6024 19.3125C13.709 19.3125 13.8144 19.2915 13.9125 19.2508C14.0106 19.2101 14.0994 19.1505 14.1736 19.0756L18.4199 14.7787C18.5287 14.6685 18.602 14.5293 18.6308 14.3785C18.6595 14.2277 18.6424 14.0719 18.5815 13.9306C18.5205 13.7893 18.4186 13.6687 18.2883 13.5839C18.158 13.4991 18.0051 13.4538 17.8487 13.4537H14.3986L14.3986 6.03182C14.3986 5.82462 14.3147 5.62591 14.1654 5.47939C14.0161 5.33288 13.8136 5.25057 13.6024 5.25057C13.3913 5.25057 13.1888 5.33288 13.0395 5.47939C12.8902 5.62591 12.8063 5.82462 12.8063 6.03182L12.8063 13.4537H9.35616Z" fill="white"/></svg>)
  
  
  return dataFor==="assignedTests"?(<th className={`pt-[26.25px] pb-[24.25px] text-white text-[17.5px] leading-3 font-medium ${header.text==="Due On"||header.text==="Completion"||header.text==="Score"?"text-center":" text-left pl-[30px]"}`}>
    <div className={``}>{header.text}</div>
  </th>):
  dataFor==="allTests"?(<th className={`pt-[26.25px] pb-[24.25px] text-white text-[17.5px] leading-[25px] font-medium ${header.text==="Assignment Name"?"text-left pl-[65.6px]":header.text==="Total Assignments"?"text-center":" text-left"}`}>
  <div onClick={() => header.onCick && header.onCick()} className={`flex items-center gap-0 ${header.text==="Total Assignments"&&"justify-center"}`}><p className={`${header.text==="Type"? 'pl-11':''}`}>{header.text}</p>{
    header.noArrow?"":
     header.willDisplayDownArrow=== null||header.text.lenght===0?"":
                header.willDisplayDownArrow ||
                header.willDisplayDownArrow === undefined
                  ? downArrow
                  : upArrow
              }</div>
  </th>):
  (
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
          header.text === "Assignment" || header.text === "Service"
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
            <span className="text-center text-[17.5px] ">{header.text}</span>
          </div>
        ) : (
          <div className={`text-[17.5px] ${header.text === "Score" ? "text-center" : "text-left" }`}>{header.text}</div>
        )}
      </div>
    </th>
  );
}
