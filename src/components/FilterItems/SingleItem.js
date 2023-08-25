import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import CrossIcon from "../../assets/icons/cross.svg";
import axios from "axios";
import { BASE_URL, getAuthHeader } from "../../app/constants/constants";

export default function SingleItem({
  item,
  image,
  idx,
  className,
  onRemoveFilter,
  keyName,
  sliceText,
  isString,
  fetchData,
  baseLink,
  onlyItems,
}) {
  const [text, setText] = useState("d");

  const fetchTestName = async (item) => {
    axios
      .get(`${BASE_URL}api/test/${item}`, { header: getAuthHeader() })
      .then((res) => {
        setText(res.data.data.test.testName);
      })
      .catch((err) => {
        // console.log(err.response);
      });
  };

  useEffect(() => {
    if (!fetchData) return;
    fetchTestName(item);
  }, [item]);

  return (
    <div
      key={idx}
      className={`mr-3 ${className ? className : ""
        } bg-[#26435f1a]  py-1 px-3 rounded-7 group ${styles.filterItem}`}
    >
      {image && (
        <div className="w-[85px] h-[85px] mx-auto flex justify-center">
          <img
            src={`${baseLink}${item.image}`}
            className="w-full h-full object-contain	"
          />
        </div>
      )}
      <p className="text-[#26435F] text-center text-[15px]">
        {sliceText
          ? item.image.slice(-23)
          : isString
            ? fetchData
              ? text
              : item
            : item.text}
      </p>
      <img
        alt="cross-icon"
        className={styles.icon}
        src={CrossIcon}
        onClick={() =>
          keyName ? onRemoveFilter(item, keyName, idx) : onRemoveFilter(item)
        }
      />
    </div>
  );
}
