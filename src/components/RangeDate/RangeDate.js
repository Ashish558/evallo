import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputSelect from "../InputSelect/InputSelectDate";
import { calculateDateRange, getModifiedDate } from "./utils";

import { useState } from "react";
import { useEffect } from "react";

const RangeDate = ({ handleRangeData }) => {
  const [startDate, setStartDate] = useState(() => calculateDateRange()[0]);
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
  const handleStartDate = () => {
    const requiredDate = getModifiedDate(selectDate);
    setStartDate(requiredDate);
    handleRangeData(requiredDate);
    setSelectedDate({ sDate: "", eDate: "" });
  };

  useEffect(() => {
    if (startDate) handleRangeData(startDate);
  }, []);
  return (
    <div className="flex text-xs ">
      <p className="font-semibold text-[#FFA28D]"> </p>

      <InputSelect
        placeholder="Select"
        parentClassName="border-none text-xs text-[#26435F] w-fit"
        labelClassname="text-sm"
        inputContainerClassName="border-none w-[260px] font-semibold text-[#FFA28D] "
        inputClassName="border-none w-fit bg-transparent font-semibold text-[#FFA28D]"
        value={startDate}
        optionData={[]}
        setSelectedDate={setSelectedDate}
        IconRight={
          <FontAwesomeIcon
            className="pl-1 absolute right-10"
            icon={faCaretDown}
          ></FontAwesomeIcon>
        }
        DateSelect={
          <div className="flex flex-col hover:bg-white items-center pt-1 z-5000">
            <div className="font-semibold text-black flex w-full justify-around">
              <label htmlFor="sdate">Start Date</label>
              <label htmlFor="edate">End Date</label>
            </div>
            <div className="flex p-1 justify-between gap-5 ">
              <input
                type="date"
                name="sdate"
                className="rounded-md bg-[#FFA28D] p-1 text-white"
                value={selectDate.sDate}
                max={selectDate.eDate}
                onChange={(e) => handleLocalDate(e.target.value, "sDate")}
              />
              <input
                type="date"
                min={selectDate.sDate}
                name="edate"
                className="rounded-md bg-[#FFA28D] p-1 text-white"
                value={selectDate.eDate}
                placeholder="Start Date"
                onChange={(e) => handleLocalDate(e.target.value, "eDate")}
              />
            </div>
            <button
              disabled={!selectDate.eDate || !selectDate.sDate}
              className={`${
                !selectDate.eDate || !selectDate.sDate ? "opacity-75" : ""
              } rounded-md bg-[#FFA28D] py-1 px-4 my-2 mb-3 text-white hover:shadow-sm hover:scale-105`}
              onClick={handleStartDate}
            >
              Submit
            </button>
          </div>
        }
        onChange={(e) => handleStartDate(e)}
      />
      <p></p>
    </div>
  );
};

export default React.memo(RangeDate);
