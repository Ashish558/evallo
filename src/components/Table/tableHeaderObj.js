import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
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
      className={`px-4 py-[20px] font-medium whitespace-nowrap  text-center  cursor-pointer ${
        header.className ? header.className : ""
      } ${flag ? styles["no-arrow"] : ""}`}
    >
      <div
        className={`flex  ${header.wrapperClassName ? header.wrapperClassName : '' } ${
          header.text === "Email" || header.text === "Phone" || header.text === "Assignment Name" || header.text === "Assignment" ||
          header.text === "Full Name"
            ? `justify-start ${header.text === "Assignment" ? "ps-6 overflow-hidden" : ""}`
            : "justify-center"
        } items-center ${
          noArrow || header.noArrow
            ? ""
            : `${
                header.willDisplayDownArrow ||
                header.willDisplayDownArrow === undefined
                  ? styles.marker
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
            <span className="text-center text-[17.5px]">{header.text}</span>
          </div>
        ) : (
          <div className=" text-[17.5px] text-left text-white">
            {header.text}
          </div>
        )}
      </div>
    </th>
  );
}
