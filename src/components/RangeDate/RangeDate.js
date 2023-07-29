import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputSelect from "./InputSelectDate";
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
  const handleQuickOptions = (optionType, option, id) => {
    const now = new Date();
    let startDate, endDate;
    if (option.days === 0) {
      startDate = now.toISOString().split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (option.days === 7) {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (option.days === 30) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 2)
        .toISOString()
        .split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (option.days === 60) {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 2)
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
    }
    const selectDate = {
      sDate: startDate.toString(),
      eDate: endDate.toString(),
    };

    const requiredDate = getModifiedDate(selectDate);

    setStartDate(requiredDate);
    handleRangeData(requiredDate);
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
        inputContainerClassName="border-none w-[300px] font-semibold text-[#FFA28D] "
        inputClassName="border-none w-fit bg-transparent font-semibold text-[#FFA28D]"
        value={startDate}
        optionData={[
          { name: "Today", days: 0 },
          { name: "Last 7 Days", days: 7 },
          { name: "Current Month", days: 30 },
          { name: "Last Month", days: 60 },
        ]}
        optionType={"object"}
        setSelectedDate={setSelectedDate}
        onChange={handleQuickOptions}
        IconRight={
          <FontAwesomeIcon
            className="pl-1 absolute right-10"
            icon={faCaretDown}
          ></FontAwesomeIcon>
        }
        DateSelect={
          <div className="flex flex-col hover:bg-white items-center pt-1 z-5000 border-b ">
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
      />
      <p></p>
    </div>
  );
};

export default React.memo(RangeDate);
