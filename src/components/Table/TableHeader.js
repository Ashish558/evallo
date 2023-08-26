import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
import styles from "./styles.module.css"
export function TableHeader({ header, dataFor, onClick, setSorted, Icon }) {

  const [flag, setFlag] = useState(dataFor === "studentTestsReportSmall" || dataFor === "studentTestsReport" ? true : false)
  return dataFor === "assignedTestsStude" || dataFor === "invoice" ? (
    <th
      className={`px-1 py-[16px]  whitespace-nowrap text-[16px] font-[500] bg-[#7152EB] text-white ${header === "Full Name" || header === "Name" ? "text-left pl-7" : ""
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
      className={`px-6 py-[18px] font-medium whitespace-nowrap  ${header === "Full Name" || header === "Name" || header === "Student Name"
        ? "text-left pl-7"
        : ""
        } ${dataFor === "allUsers" ? "text-sm" : "text-sm"} ${flag ? styles["no-arrow"] : ''}
       `}
    >
      <div
        className={`flex items-center justify-center font-medium  ${header === "Full Name" ||
          header === "Name" ||
          header === "Student Name"
          ? "text-left pl-7"
          : ""
          } ${dataFor === "allUsers" ? "text-[17.5px]" : "text-[17.5px]"}
       `}
      >
        {" "}
        {header}
      </div>
    </th>
  );
}
