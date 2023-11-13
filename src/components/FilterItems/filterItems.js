import React, { useEffect, useState } from "react";
import CrossIcon from "../../assets/icons/cross.svg";
import SingleItem from "./SingleItem";
import styles from "./style.module.css";

export default function FilterItems({
  items,
  setData,
  onRemoveFilter,
  className,
  isString,
  keyName,
  onlyItems,
  sliceText,
  filteredTests,
  image,
  fetchData,
  api,
  baseLink,
}) {
 // console.log({items,filteredTests, keyName})
  const printTestName=(item)=>{
    let testName=item;
    filteredTests?.map((test)=>{
      if(test?._id===item){
        testName=test?.value
      }
    })
    return testName
  }
  return onlyItems && !filteredTests ? (
    items?.map((item, idx) => {
      return (
        <SingleItem
          idx={idx}
          image={image}
          item={item}
          keyName={keyName}
          onRemoveFilter={onRemoveFilter}
          className={className}
          sliceText={sliceText}
          isString={isString}
          fetchData={fetchData}
          baseLink={baseLink}
          onlyItems={onlyItems}
        />
      );
    })
  ) : (
    <div className="flex items-center flex-wrap ">
      {items?.map((item, idx) => {
        return (
          <div
            key={idx}
            className={`mr-3 ${
              className ? className : ""
            } bg-[#26435F1A] py-1 px-3 rounded-7 group ${styles.filterItem} m-1`}
          >
            <p className="text-[#26435F] text-[16px] text-base-15">
              {isString ? filteredTests?printTestName(item): item : item.text}
            </p>
            <img
              className={styles.icon}
              src={CrossIcon}
              alt="cross-icon"
              onClick={() =>
                keyName
                  ? onRemoveFilter(item, keyName, idx)
                  : onRemoveFilter(item)
              }
            />
          </div>
        );
      })}
    </div>
  );
}
