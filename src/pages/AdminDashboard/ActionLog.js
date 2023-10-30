import styles from "./style.module.css";
import { useGetSpecificActionLogQuery } from "../../app/services/adminDashboard";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../utils/utils";
export default function ActionLog({ actionLog, className }) {
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
      sortedData.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
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
    setSortedAction(newarr);
  }, [actionLog]);
  let headerDate = sortedAction[currentElementIndex]
    ? new Date(sortedAction[currentElementIndex]?.createdAt).toDateString()
    : new Date().toDateString();
  if (headerDate) {
    headerDate = headerDate.split(" ");
    let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
    headerDate = temp;
  }

  return (
    <div
      className={`flex flex-col h-[330px] max-h-[500px]  shadow-[0px_0px_2px_rgba(0,0,0,0.25)]  rounded-5 bg-[#FFFFFF] w-[65.1042vw] ${className}`}
    >
      <div className=" border-b-[1.6px]  border-b-[#CBD6E2] ">
        <p className="uppercase  pl-[29px] pt-[16px] pb-2 text-[#26435F] text-base-20">
          {getFormattedDate(headerDate, dateFormat)}
        </p>
      </div>
      <ul
        onScroll={handleScroll}
        className="list-disc rounded-b-md overflow-y-scroll  custom-scroller h-full "
      >
        {sortedAction?.map((item, index) => {
          let date = new Date(item.createdAt);
          const offset = date.getTimezoneOffset() * 60000;
          if (offset > 0) {
            // startDate = startDate + offset
            date = new Date(date.getTime() + offset);
          }
          const hours = date.getHours();
          const minutes = date.getMinutes()
          let ampm = "AM";
          if (hours >= 12) {
            ampm = "PM";
          }
          return (
            <>
              <div key={index} className="flex h-[57px] pl-5 relative ">
                <p className="text-[#517CA8] pt-6 !font-medium text-[14px] mr-2 w-[calc(143*0.050vw)] text-center !text-[calc(17.5*0.050vw)] whitespace-nowrap">
               {
                item?.message &&
                <>
                {hours}:{minutes} {ampm}
                </>
               }
                    
                  {item?.topDate && item?.message && (
                    <span className="text-xs ml-5 top-0 text-[#FFA28D] absolute  backdrop-blur-sm ">
                      {" "}
                      {getFormattedDate(item?.topDate, dateFormat)}
                    </span>
                  )}
                </p>
                <div className={`pt-5 ${styles.actionBorder}`}>
                  <div className={styles.circle}>
                    <div className={styles.circle2}></div>
                  </div>
                  <p className="pl-4  font-medium text-[#517CA8] text-[15.5px] !text-[calc(17.5*0.050vw)]">
                    {item?.message}
                  </p>
                </div>
              </div>
            </>
          );
        })}
      </ul>
    </div>
  );
}
