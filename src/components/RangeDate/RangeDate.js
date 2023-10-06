import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import InputSelect from "./InputSelectDate";
import { calculateDateRange, getModifiedDate } from "./utils";
import styles from "./rangeDate.module.css";
import downR from "../../assets/YIcons/downR.svg"
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";


const RangeDate = ({ removeUnderline,handleRangeData ,optionClassName,className,manualHide ,inputContainerClassName}) => {
  const { dateFormat } = useSelector(state => state.user)
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
    else if (option.days === 365) {
      startDate = new Date(now.getFullYear(), 0, 2)
        .toISOString()
        .split("T")[0];
      endDate = new Date()
        .toISOString()
        .split("T")[0];
    }
    else if (option.days === 700) {
      startDate = new Date(now.getFullYear()-1, 0, 2)
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
    }
    else if (option.days === 1000) {
      startDate = new Date(2023, 0, 2)
        .toISOString()
        .split("T")[0];
      endDate = new Date()
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
// console.log(temp[0])
  const parts = newDateformat.split(" - ");
  const firstPart =  getFormattedDate(parts[1], dateFormat); 
  const secondPart =  getFormattedDate(parts[0], dateFormat); 
  const latestDateFormat=secondPart + " - " +firstPart 


  
  const [startFull, endFull] = latestDateFormat.split(" - ");
  
 
  const [, , endYear] = endFull.split("-");
  
  
  const [startMonth, startDay] = startFull.split("-");
  
  
  const formattedStartDate = `${startMonth}-${startDay}`;
  const formattedDateRange = `${formattedStartDate} - ${endFull}`;
  // console.log(formattedDateRange);
  

  return (
    <div className={`flex text-xs  !text-[calc(15*0.050vw)] ${className}`}>
      <p className="font-semibold text-[#FFA28D]"> </p>

      <InputSelect
        placeholder="Select"
        valueClassName={`${removeUnderline?"":"font-medium border-b border-b-[#FFA28D]"} `}
        parentClassName="border-none text-xs text-[#26435F] w-fit relative z-[500] !text-[calc(17*0.050vw)]"
        labelClassname="text-sm !text-[calc(17*0.050vw)]"
        inputContainerClassName={`border-none  !text-[calc(17*0.050vw)] whitespace-nowrap font-semibold text-[#FFA28D] ${inputContainerClassName}  ${styles["text"]}`}
        inputClassName={`border-none w-fit bg-transparent font-semibold text-[#FFA28D] !text-[calc(17*0.050vw)]`}
        value={formattedDateRange}
        optionListClassName="text-[#517CA8] underline underline-offset-2"
        optionClassName={`${optionClassName} relative !text-[calc(17*0.050vw)]`}
        optionData={[
          { name: "Lifetime", days:1000 },
          { name: "Last 7 Days", days: 7 },
          { name: "Last 30 Days", days: 30 },
          { name: "This Year", days: 60 },
          // {name:"Current Year",days: 365 },
          // {name:"Last Year",days: 700},
          // {name:"Life Time",days:1000}
        ]}
        optionType={"object"}
        setSelectedDate={setSelectedDate}
        onChange={handleQuickOptions}
        IconRight={downR}
        DateSelect={
           !manualHide &&
          <div className="flex relative flex-col hover:bg-white items-center pt-2 z-5000 border-b  ">
            <div className="text-[9px] text-[#517CA8]  w-full px-[26px]">
              <label htmlFor="sdate">Start Date</label>
              
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="sdate"
                className="rounded-md  p-1 text-[#FFA28D]"
                value={selectDate.sDate}
                max={selectDate.eDate}
                onChange={(e) => handleLocalDate(e.target.value, "sDate")}
              />
            <div className="text-[9px] text-[#517CA8]  w-full px-[26px] pt-[15px]">
              <label htmlFor="edate">End Date</label>
              </div>
              <input
                type="date"
                min={selectDate.sDate}
                name="edate"
                className="rounded-md  text-[#FFA28D] p-1 w-[120px]"
                value={selectDate.eDate}
                placeholder="Start Date"
                onChange={(e) => handleLocalDate(e.target.value, "eDate")}
              />
            </div>
            <div className="w-full flex px-[26px]">
              <p className="ml-[0px]">
                <button
                  disabled={!selectDate.eDate || !selectDate.sDate}
                  className={`${!selectDate.eDate || !selectDate.sDate ? "opacity-75 font-normal" : ""
                    } rounded-[4px] bg-[#FFA28D] py-1 px-4 mt-5 mb-[17px]  text-white hover:shadow-sm hover:scale-105 font-normal`}
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
