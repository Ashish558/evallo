import React from "react";
import styles from "./orgcard.module.css";
const SubFrame2 = () => {
  const logData = Array.from(
    { length: 50 },
    (_, index) =>
      `May-1,2023 - Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum  horrn has${
        index + 1
      }`
  );
  return (
    <div>
      {" "}
      <ul className="list-disc overflow-y-scroll -translate-y-3 h-[350px]">
        <div className="h-[1px] bg-[#CBD6E2]" />
        {logData.map((item, index) => (
          // <li key={index} className="flex">
          //   <span className="mr-4 text-gray-500">{item.slice(0, 12)}</span>
          //   <span>{item.slice(12)}</span>
          // </li>
          <div key={index} className="flex ml-2 h-[57px] pl-5">
            <p className="text-[#4A556C] pt-5 font-medium text-xs mr-2 w-[150px]">
              May 1 ,2023
            </p>
            <div className={`pt-5 ${styles.actionBorder}`}>
              <div className={styles.circle}>
                <div className={styles.circle2}></div>
              </div>
              <p className="pl-4 text-sm font-medium text-[#4A556C]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit ,sed do
                eiusmod tempor incidut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SubFrame2;
