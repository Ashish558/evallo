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
  ) : (
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
       `}
    >
      <div
        className={` ${headerWidth ? headerWidth : ""} ${
          noArrow
            ? ""
            : `${
                dataFor == "allOrgs"
                  ? styles.markerCustomAllOrgs
                  : `${styles.marker} justify-center`
              }`
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
       `}
      >
        {" "}
        {header}
        {/* {header==="Q No."&&<p >(Raw Score)</p>} */}
      </div>
    </th>
  );
}
