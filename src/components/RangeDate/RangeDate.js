import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputSelect from "../InputSelect/InputSelect";
import { calculateDateRange, getModifiedDate } from "./utils";
import { useEffect } from "react";
import { useState } from "react";

const RangeDate = ({ createdDate, startDate, handleStartDate }) => {
  const data = calculateDateRange(createdDate);
  const [selectDate, setSelectedDate] = useState({
    sDate: "",
    eDate: "",
  });
  const handleLocalDate = (e, value) => {
    setSelectedDate({
      ...selectDate,
      [value]: e,
    });
  };
  const handleFinalDate = () => {
    const requiredDate = getModifiedDate(selectDate);

    handleStartDate(requiredDate);
    setSelectedDate({ sDate: "", eDate: "" });
  };
  useEffect(() => {
    if (data[0]) handleStartDate(data[0]);
  }, []);

  return (
    <div className="flex text-xs ">
      <p className="font-semibold text-[#FFA28D]"> </p>

      <InputSelect
        placeholder="Select"
        parentClassName="border-none text-xs text-[#26435F] w-full"
        labelClassname="text-sm"
        inputContainerClassName="border-none font-semibold text-[#FFA28D] "
        inputClassName="border-none bg-transparent font-semibold text-[#FFA28D]"
        value={startDate}
        optionData={data}
        IconRight={
          <FontAwesomeIcon
            className="pl-3 absolute right-5"
            icon={faCaretDown}
          ></FontAwesomeIcon>
        }
        DateSelect={
          <div   className="flex flex-col items-center z-5000">
            <p className="font-semibold text-black ">
              Check for any start and end date
            </p>
            <div className="flex p-2 justify-between gap-2 ">
              <input
                type="date"
                className="rounded-md bg-[#FFA28D] p-1 text-white"
                value={selectDate.sDate}
                max={selectDate.eDate}
                onChange={(e) => handleLocalDate(e.target.value, "sDate")}
              />
              <input
                type="date"
                min={selectDate.sDate}
                className="rounded-md bg-[#FFA28D] p-1 text-white"
                value={selectDate.eDate}
                onChange={(e) => handleLocalDate(e.target.value, "eDate")}
              />
            </div>
            <button
              disabled={!selectDate.eDate || !selectDate.sDate}
              className={`${
                !selectDate.eDate || !selectDate.sDate ? "opacity-75" : ""
              } rounded-md bg-[#FFA28D] p-1 px-3 my-1 text-white`}
              onClick={handleFinalDate}
            >
              Submit
            </button>
            <p className="font-semibold text-black ">
              Or select from following options
            </p>
          </div>
        }
        onChange={(e) => handleStartDate(e)}
      />
      <p></p>
    </div>
  );
};

export default RangeDate;
