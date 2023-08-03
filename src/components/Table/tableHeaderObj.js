import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
import styles from "./styles.module.css";
export function TableHeaderNew({ header, checkedHeader, Handler}) {
 
  const handleCheckboxChange = () => {
    Handler();
  };
  return (
    <th
      className={`px-2 py-3 font-semibold  cursor-pointer ${
        header.className ? header.className : ""
      }`}
    >
      <div className="flex ">
        {header.text === "Full Name" ? (
         
            <label
              className={`${styles["checkbox-label"]} block text-[#26435F] font-medium`}
            >
              <input
                type="checkbox"
                checked={checkedHeader}
                onChange={handleCheckboxChange}
              />
              <span
                className={`${styles["custom-checkbox"]} ${
                  checkedHeader ? "checked" : ""
                }`}
              ></span>
            </label>
          
        ) : (
          ""
        )}
        <span onClick={() => header.onCick && header.onCick()} className="">
          {header.text}
        </span>
      </div>
    </th>
  );
}
