import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
import styles from "./styles.module.css";
export function TableHeader({
  header,
  dataFor,
  onClick,
  setSorted,
  Icon,
  headerWidth,
  noArrow,
}) {
  const [flag, setFlag] = useState(
    dataFor === "studentTestsReportSmall" || dataFor === "studentTestsReport"
      ? true
      : false
  );
  return dataFor === "assignedTestsStude" || dataFor === "invoice" ? (
    <th
      className={`px-[6px] py-[16px]  whitespace-nowrap text-[16px] font-[500] bg-[#7152EB] text-white ${
        header === "Full Name" || header === "Name" ? "text-left pl-7" : ""
      } 
      `}
    >
      {header === "Due Date" && (
        <label htmlFor="check">
          <img
            className="absolute right-5 top-0 bottom-0 m-auto cursor-pointer"
            onClick={onClick}
            src={sort}
            alt="sort"
            width={10}
            height={10}
          />
        </label>
      )}{" "}
      {header}
      <input
        type="checkbox"
        id="check"
        className="absolute invisible"
        onChange={(e) => setSorted(e.target.checked)}
      />
    </th>
  ) :
  
  dataFor==="testsDetailQuestions"?(<th className={`pt-[13px] pb-[12.5px] bg-[#26435F] text-left text-[17.5px] leading-[25px] font-normal text-white ${header==="Q. Image"&&"!max-w-[110px]"}`}>
    <div className={`${header==="Q No. (Raw Score)"&&"ml-[27px] w-[104px] flex flex-col text-center rounded-l-[5px]"} ${header==="Q. Image"&&"!max-w-[110px]"}`}>
        {header==="Q No. (Raw Score)"?<><p>Q No.</p><p>(Raw Score)</p></>:<p>{header}</p>}
    </div>
  </th>)
  :
  (
    <th
      className={`${
        headerWidth ? headerWidth : "px-6"
      }  py-[15px] font-medium whitespace-nowrap  ${
        header === "Full Name" || header === "Name" || header === "Student Name"
          ? "text-left pl-7 "
          : ""
      } ${dataFor === "allUsers" ? "text-sm" : "text-sm"} ${
        flag ? styles["no-arrow"] : ""
      }
      ${dataFor==="allOrgs"&&"rounded-[5.333px,0,0,5.333px]"}
       `}
    >
      <div
        className={`${headerWidth ? headerWidth : ""}
        ${header === "Org Name"&&dataFor == "allOrgs" && "!pl-[73px] w-[346px]"}
        ${header === "A Name"&&dataFor == "allOrgs" && "!w-[286px]"}
        ${header === "A Phone"&&dataFor == "allOrgs" && "w-[187px]"}
        ${header=== "Country"&&dataFor == "allOrgs"&&"w-[176px]"}
        ${header=== "Type"&&dataFor == "allOrgs"&&"!w-[266px]"} ${
          noArrow||header==="Type"
            ? ""
            : `${
                dataFor == "allOrgs"
                  ? styles.markerCustomAllOrgs
                  : `${styles.marker} justify-center`
              }
        `
          } 
        flex items-center font-medium 
         ${
          header === "Full Name" ||
          header === "Name" ||
          header === "Student Name"
            ? "text-left pl-7"
            : ""
        } ${dataFor === "allUsers" ? "text-[17.5px]" : "text-[17.5px]"}
        ${header==="Tutor Name"||header==="Tutor Status"||header==="Average Hourly Rate"?"!p-[0]":""}
        ${header === "Q No." && "flex-col"}
        ${header === "Correct Answer" && "justify-center text-center"}
        ${header === "Student Response" && "justify-center text-center"}
        ${header === "Accuracy" && "justify-center text-center"}


        ${header == "Email" && dataFor === "assignedStudents" && "w-full flex justify-start text-left"}
       `}
      >
        {header}
      </div>
    </th>
  );
}
