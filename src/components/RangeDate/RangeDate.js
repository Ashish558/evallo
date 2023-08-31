import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputSelect from "./InputSelectDate";
import { calculateDateRange, getModifiedDate } from "./utils";
import styles from "./rangeDate.module.css";

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
  let temp = startDate.split("-");

  let newDateformat = temp[0];
  temp = temp[1].split(" ")
  let firsYear = newDateformat.split(" ")
  if (firsYear[2] === temp[3]) {
    newDateformat = firsYear[0] + " " + firsYear[1]

  }
  newDateformat += " - " + temp[0] + " " + temp[1] + " " + temp[2] + ", " + temp[3]

  return (
    <div className="flex text-xs ">
      <p className="font-semibold text-[#FFA28D]"> </p>

      <InputSelect
        placeholder="Select"
        parentClassName="border-none text-xs text-[#26435F] w-fit"
        labelClassname="text-sm"
        optionClassName=""
        optionListClassName="text-[15px] font-medium text-[#517CA8] underline underline-offset-2"
        inputContainerClassName={`border-none w-[300px] font-semibold text-[#FFA28D]  ${styles["text"]}`}
        inputClassName={`border-none w-fit bg-transparent font-semibold text-[#FFA28D] `}
        value={newDateformat}
        optionData={[
          { name: "Today", days: 0 },
          { name: "Last 7 Days", days: 7 },
          { name: "Current Month", days: 30 },
          { name: "Last Month", days: 60 },
        ]}
        optionType={"object"}
        setSelectedDate={setSelectedDate}
        onChange={handleQuickOptions}
        IconRight={faCaretDown}
        DateSelect={
          <div className="flex flex-col hover:bg-white items-center pt-2 z-5000 border-b ">
            <div className=" text-black flex flex-col w-full justify-start">
              <div className="flex flex-col px-[26px] justify-start  ">
                <label className="text-[#517CA8] text-[9px]" htmlFor="sdate">Start Date</label>

                <input
                  type="date"
                  name="sdate"
                  className="rounded-md  p-1 text-[#FFA28D]"
                  value={selectDate.sDate}
                  max={selectDate.eDate}
                  onChange={(e) => handleLocalDate(e.target.value, "sDate")}
                />
              </div>
            </div>
            <div className="flex flex-col  justify-start  mt-[15px]">
              <label className="text-[#517CA8] text-[9px]" htmlFor="edate">End Date</label>
              <input
                type="date"
                min={selectDate.sDate}
                name="edate"
                className="rounded-md text-[#FFA28D] p-1 w-[120px]"
                value={selectDate.eDate}
                placeholder="Start Date"
                onChange={(e) => handleLocalDate(e.target.value, "eDate")}
              />
            </div>
            <div className="w-full flex justify-start">
              <p className="ml-[26px]">
                <button
                  disabled={!selectDate.eDate || !selectDate.sDate}
                  className={`${!selectDate.eDate || !selectDate.sDate ? "opacity-75" : ""
                    } rounded-md bg-[#FFA28D] py-1 px-4 mt-5 mb-[17px]  text-white hover:shadow-sm hover:scale-105`}
                  onClick={handleStartDate}
                >
                  Submit
                </button>
              </p>
            </div>
          </div>
        }
      />
      <p></p>
    </div>
  );
};

export default React.memo(RangeDate);
