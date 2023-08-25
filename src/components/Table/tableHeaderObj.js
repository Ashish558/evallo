import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
import styles from "./styles.module.css";
export function TableHeaderNew({ header, checkedHeader, dataFor, Handler }) {
  const [flag, setFlag] = useState(header?.className ? header.className.includes('no-arrow') : false)
  const handleCheckboxChange = () => {
    Handler();
  };

  return (
    <th
      className={`px-1 py-3 font-medium whitespace-nowrap  text-center  cursor-pointer ${header.className ? header.className : ""
        } ${flag ? styles["no-arrow"] : ''}`}
    >
      <div className="flex justify-center">
        {header.text === "Full Name" && dataFor === 'allUsers' ? (

          <label
            className={`${styles["checkbox-label"]} block text-[#26435F] font-medium`}
          >
            <input
              type="checkbox"
              checked={checkedHeader}
              onChange={handleCheckboxChange}
            />
            <span
              className={`${styles["custom-checkbox"]} ${checkedHeader ? "checked" : ""
                }`}
            ></span>
          </label>

        ) : (
          ""
        )}
        <span onClick={() => header.onCick && header.onCick()} className="text-center">
          {header.text}
        </span>
      </div>
    </th>
  );
}
