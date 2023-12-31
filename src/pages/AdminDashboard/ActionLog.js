import styles from "./style.module.css";
import { useGetSpecificActionLogQuery } from "../../app/services/adminDashboard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";
import { getMonthName } from "../../utils/utils";

export default function ActionLog({ actionLog, className,width }) {
  const [dateFormat, setDateFormat] = useState("dd/mm/yy");
  const { organization: organization2 } = useSelector(
    (state) => state.organization
  );
  useEffect(() => {
    if (organization2 && organization2?.settings) {
      setDateFormat(organization2?.settings?.dateFormat);
    }
  }, [organization2]);

  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [extraElement, setExtraElement] = useState(0);
  const [sortedAction, setSortedAction] = useState([]);

  const handleScroll = (e) => {
    const elementHeight = e.target.scrollHeight / actionLog?.length;

    const index = Math.floor(e.target.scrollTop / elementHeight);
    setCurrentElementIndex(index);
  };
  useEffect(() => {
    setCurrentElementIndex(0);
    const sorting = (newarr, extra) => {
      let sortedData = [...actionLog];
      // sortedData.sort((a, b) => {
      //   return a.createdAt - b.createdAt;
      // });
      let i = 0,
        j = 0;
      let check = 0;

      while (j < sortedData.length && check <= 2 * sortedData.length) {
        check++;
        if (
          new Date(sortedData[i].createdAt).toDateString() ===
          new Date(sortedData[j].createdAt).toDateString()
        ) {
          j++;
        } else {
          extra++;
          let k = j - 1;
          sortedData[k] = {
            ...sortedData[k],
            topDate: new Date(sortedData[k]?.createdAt).toDateString(),
          };
          while (k >= i) newarr.push(sortedData[k--]);
          i = j;
        }
      }
      let k = j - 1;
      sortedData[k] = {
        ...sortedData[k],
        topDate: new Date(sortedData[k]?.createdAt).toDateString(),
      };
      while (k >= i) newarr.push(sortedData[k--]);
      i = j;
      return extra;
    };
    let newarr = [];
    let extra = 1;
    extra = sorting(newarr, extra);
    setExtraElement(extra);
    let actions = actionLog.map(action => {
      return {...action,topDate: new Date(action?.createdAt).toDateString(),}
    })
    
    setSortedAction(actions);
  }, [actionLog]);
  let headerDate = sortedAction[currentElementIndex]
    ? new Date(sortedAction[currentElementIndex]?.createdAt).toDateString()
    : new Date().toDateString();
  if (headerDate) {
    headerDate = headerDate.split(" ");
    let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
    headerDate = temp;
  }

  //  format monthName date, year
  const formatDate= (value)=>{
    
    let [ year, month, day] = value.split("-");
     if(dateFormat==="dd/mm/yy"){
      [ day, month,  year] = value.split("-");
     }
    else  if(dateFormat==="mm/dd/yy"){
      [ month, day, year] = value.split("-");
     }
else [ year, month, day] = value.split("-");
    const monthName = getMonthName(month-1);
    
    let formattedDate = `${monthName}` + " " + `${year}` + `,` + `${day}`;
   
    return formattedDate
   }
  
  return (
    <div
      className={`flex flex-col h-[330px] max-h-[500px]  shadow-[0px_0px_2px_rgba(0,0,0,0.25)]  rounded-5 bg-[#FFFFFF] ${width??"w-[1250px]"} ${className}`}
    >
      <div className=" border-b-[1.6px]  border-b-[#CBD6E2] ">
        <p className="uppercase  pl-[29px] pt-[20px] pb-[16.5px] text-[#26435F] text-[20px] font-normal">
          {formatDate(getFormattedDate(headerDate, dateFormat))}
        </p>
      </div>
      <ul
        onScroll={handleScroll}
        className="list-disc rounded-b-md overflow-y-scroll  custom-scroller h-full "
      >
        {sortedAction?.map((item, index) => {
          let date = new Date(item.createdAt);
          const offset = date.getTimezoneOffset() * 60000;
          // if (offset > 0) {
          //   date = new Date(date.getTime() + offset);
          // }
          let hours = date.getHours();
          var minutes = date.getMinutes();

          if(0 <= minutes && minutes < 10){
            minutes = `0` + minutes;
          }

          let ampm = "AM";
          if (hours >= 12) {
            hours-=12
            ampm = "PM";
          }
          if(ampm === "PM" && hours === 0){
            hours = 12
          }
          return (
            
              <div key={index} className="flex h-[57px] relative ">
                <p className="text-[#517CA8] pt-6 !font-light text-[15px] mr-2 w-[137px] text-center whitespace-nowrap">
               {
                item?.message &&
                <>
                {hours}:{minutes} {ampm}
                </>
               }
                    
                  {item?.topDate && item?.message && (
                    <span className="text-xs ml-5 top-0 text-[#FFA28D] absolute  backdrop-blur-sm ">
                      {" "}
                      {/* {getFormattedDate(item?.topDate, dateFormat)} */}
                    </span>
                  )}
                </p>
                <div className={`pt-5 ${styles.actionBorder}`}>
                  <div className={styles.circle}>
                    <div className={styles.circle2}></div>
                  </div>
                  <p className="pl-4  font-normal text-[#517CA8] text-[17.5px]">
                    {item?.message}
                  </p>
                </div>
              </div>
          
          );
        })}
      </ul>
    </div>
  );
}
