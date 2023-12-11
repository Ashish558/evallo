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
import { getFormattedDate, getMonthName } from "../../utils/utils";
import DateIcon from "../../assets/icons/solar_calendar-date-outline.svg"

const RangeDate = ({ removeUnderline,allorg, handleRangeData, optionClassName, className, manualHide, inputContainerClassName, iconRightClass,icon }) => {

  const [dateFormat, setDateFormat] = useState("dd/mm/yy")
  const { organization: organization2 } = useSelector((state) => state.organization)
  useEffect(() => {
    if (organization2 && organization2?.settings) {
      setDateFormat(organization2?.settings?.dateFormat)
    }
  }, [organization2])
  const [startDate, setStartDate] = useState(() => calculateDateRange()[0]);
  const [selectDate, setSelectedDate] = useState({
    sDate: "",
    eDate: "",
  });
  const [redDate,setRedDate] = useState(null);
  const handleLocalDate = (e, value) => {
    setRedDate(e);
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
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (option.days === 31) {
      startDate = new Date(now.getFullYear(), now.getMonth(), 2)
        .toISOString()
        .split("T")[0];
      endDate = now.toISOString().split("T")[0];
    } else if (option.days === 60) {
      startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
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
      startDate = new Date(now.getFullYear() - 1, 0, 2)
        .toISOString()
        .split("T")[0];
      endDate = new Date(now.getFullYear(), 0, 1)
        .toISOString()
        .split("T")[0];
    }
    else if (option.days === 1000) {
      startDate = new Date(2000, 0, 2)
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
//  console.log({selectDate})
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
  if (false && firsYear[2] === temp[3]) {
    newDateformat = firsYear[0] + " " + firsYear[1]

  }
  newDateformat += " - " + temp[0] + " " + temp[1] + " " + temp[2] + ", " + temp[3]
  // console.log(temp[0])
  const parts = newDateformat.split(" - ");
  const firstPart = getFormattedDate(parts[1], dateFormat);
  const secondPart = getFormattedDate(parts[0], dateFormat);
  const latestDateFormat = secondPart + " - " + firstPart



  let [startFull, endFull] = latestDateFormat.split(" - ");


  const [, , endYear] = startFull.split("-");


  const [startMonth, startDay] = startFull.split("-");

  const formatDate= (value)=>{
    
    const [ month, day, year] = value.split("-");
    const monthName = getMonthName(day-1);
  //   console.log(
  //    { 
  //      value : value,
  //      day : day,
  //      month : month,
  //      year : year,
  //      monthName :monthName
  //     }
  //  );
    
    const formattedDate = `${monthName}` + " " + `${year}` + `,` + `${month}`;
    return formattedDate
   }

  const formattedStartDate =formatDate(`${startMonth}-${startDay}-${endYear}`);
  endFull=formatDate(endFull)
  const formattedDateRange = `${formattedStartDate}  -  ${endFull}`;
  // console.log(formattedDateRange);


  return (
    <div className={`flex text-[15px] ${className}`}>
      <p className="font-semibold text-[#FFA28D]"> </p>

      <InputSelect
        placeholder="Select"
        valueClassName={`${removeUnderline ? "" : "font-semibold text-[15px]"} ${allorg?"!text-gray-500 ":"text-[#FFA28D]"} cursor-pointer items-center`}
        parentClassName="border-none text-xs text-[#26435F] w-fit relative z-[500] text-[17.5px] items-center"
        labelClassname="text-sm text-[17.5px]"
        inputContainerClassName={`border-none text-[17.5px] whitespace-nowrap font-normal ${allorg?"":"text-[#FFA28D]"} text-[#FFA28D] ${inputContainerClassName}  ${styles["text"]} `}
        inputClassName={`placeholder:uppercase border-none w-fit bg-transparent font-semibold ${allorg?"":"text-[#FFA28D]"} text-[17.5px]`}
        value={formattedDateRange}
        optionListClassName="text-[#517CA8] underline underline-offset-2"
        optionClassName={`${optionClassName} relative text-[17.5px]`}
        optionContainerClassName={`${allorg?"translate-x-[30px]":""} !rounded-5  border-[#FFA28D] border-[1px] py-2 scrollbar-content`}
        optionPadding="!py-1"
        optionData={[
          { name: "Lifetime", days: 1000 },
          { name: "Last 7 Days", days: 7 },
          { name: "Last 30 Days", days: 30 },
          {name:"Current Month",days: 31 },
          { name: "This Year", days: 365 },
          
          // {name:"Last Year",days: 700},
          // {name:"Life Time",days:1000}
        ]}
        valueClass={"mr-0"}
        optionType={"object"}
        setSelectedDate={setSelectedDate}
        onChange={handleQuickOptions}
        IconRight={allorg?(icon===null||icon===undefined)?DateIcon:icon:downR}
        IconRightClass={`${allorg?iconRightClass??"w-[50px] h-[20px] ml-[-10px]":""}`}
        DateSelect={
          !manualHide &&
          <div className={`flex relative flex-col hover:bg-white items-center pt-2 z-5000 border-b`}>
            <div className="text-[9px] text-[#517CA8] w-full px-[26px]">
              <label htmlFor="sdate">Start Date</label>

            </div>
            <div className="flex flex-col">
              <input
                type="date"
                name="sdate"
                className="rounded-md  p-1 text-[#FFA28D] py-1 px-[26px] uppercase"
                 placeholder="MM/DD/YYYY"
                value={selectDate.sDate}
                max={selectDate.eDate}
                onChange={(e) => handleLocalDate(e.target.value, "sDate")}
              />
              <div className="text-[9px] text-[#517CA8] w-full px-[26px] pt-[15px]">
                <label htmlFor="edate">End Date</label>
              </div>
              <input
                type="date"
                min={selectDate.sDate}
                name="edate"
                className="rounded-md  text-[#FFA28D] py-1 px-[26px] uppercase"
                value={selectDate.eDate}
                
                 placeholder="MM/DD/YYYY"
                onChange={(e) => handleLocalDate(e.target.value, "eDate")}
              />
            </div>
            <div className="w-full flex px-[26px]">
              <p className="ml-[0px]">
                <button
                  disabled={!selectDate.eDate || !selectDate.sDate}
                  className={`${!selectDate.eDate || !selectDate.sDate ? "opacity-75 font-normal" : ""
                    } rounded-[4px] bg-[#FFA28D] py-1 px-4 mt-5 mb-[17px]  text-white hover:shadow-sm hover:scale-105 font-normal cursor-pointer`}
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
