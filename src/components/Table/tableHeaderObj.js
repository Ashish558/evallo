import React, { useEffect, useState } from "react";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import InputSelect from "../InputSelect/InputSelect";
import sort from "./../../assets/icons/sort.webp";
import styles from "./styles.module.css";
import SCheckbox from "../CCheckbox/SCheckbox";
export function TableHeaderNew({ header, checkedHeader, dataFor, Handler, noArrow }) {
  const [flag, setFlag] = useState(header?.className ? header.className.includes('no-arrow') : false)
  const handleCheckboxChange = (c) => {
    Handler(c);
  };

  return (
    <th
      className={`px-6 py-[20px] font-medium whitespace-nowrap  text-center  cursor-pointer ${header.className ? header.className : ""
        } ${flag ? styles["no-arrow"] : ''}`}
    >
      <div className={`flex  ${header.text === "Email" || header.text === "Phone"  ?"justify-start":"justify-center"} items-center ${noArrow ? '' : `${dataFor=="allTests"? styles.markerCustom: (header.willDisplayDownArrow || header.willDisplayDownArrow === undefined) ? styles.marker : styles.upArrow}`}`}
      onClick={() =>header.text === "Full Name" && dataFor === 'allUsers'?null: header.onCick && header.onCick()}
      >
        {header.text === "Full Name" && dataFor === 'allUsers' ? (


<SCheckbox   checked={checkedHeader}
              onChange={handleCheckboxChange} 
              
              />
          // <label
          //   className={`${styles["checkbox-label"]} block text-[#26435F] font-medium`}
          // >
          //   <input
          //     type="checkbox"
          //     checked={checkedHeader}
          //     onChange={handleCheckboxChange}
          //   />
          //   <span
          //     className={`${styles["custom-checkbox"]} ${checkedHeader ? "checked" : ""
          //       }`}
          //   ></span>
          // </label>

        ) : (
          ""
        )}
         {header.text === "Full Name" && dataFor === 'allUsers' ?
          <div onClick={() =>header.onCick && header.onCick()}>
            <span className="text-center text-[17.5px]">
                      {header.text}
                    </span>
            </div>
         :
         <span className="text-center text-[17.5px]">
         {header.text}
       </span>
}
      </div>
    </th>
  );
}
