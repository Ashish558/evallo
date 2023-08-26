import styles from "./styles.module.css";
import {
  useGetActionLogQuery,
  useGetActionLogRangeMutation,
} from "../../../app/services/superAdmin";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
function ActionLog({ dateRange }) {
  const [actionLogData, fetchStatus] = useGetActionLogRangeMutation();

  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [extraElement, setExtraElement] = useState(0);
  const [sortedAction, setSortedAction] = useState([]);
  const [actionLog, setActionLog] = useState([]);
  const ref = useRef();

  const handleScroll = (e) => {
   

    const elementHeight = e.target.scrollHeight / actionLog?.length;

   
    const index = Math.floor(e.target.scrollTop / elementHeight);
    
    let headerDate =
      sortedAction?.length > 0 && sortedAction[index]
        ? new Date(sortedAction[index]?.createdAt).toDateString()
        : new Date().toDateString();
    if (headerDate) {
      headerDate = headerDate.split(" ");
      let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
      headerDate = temp;
    }
    ref.current.textContent = headerDate;
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
  useEffect(() => {
    if (dateRange === "" || !dateRange) return;
    const fetchActivity = () => {
      actionLogData(dateRange).then((res) => {
        console.log("actionlog", { dateRange }, { res: res?.data });
        setActionLog(res?.data?.actions);
      });
    };
    fetchActivity();
  }, [dateRange]);
  let headerDate = sortedAction[currentElementIndex]
    ? new Date(sortedAction[currentElementIndex]?.createdAt).toDateString()
    : new Date().toDateString();
  if (headerDate) {
    headerDate = headerDate.split(" ");
    let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
    headerDate = temp;
  }
  return (
    <div className="">
      <h2 className="font-semibold mb-1 text-[#26435F]">Action Log</h2>

      <div
        style={{
         
          boxShadow: "0px 0px 2.6666667461395264px 0px #00000040",

          // Set the desired height of the div here
        }}
        className="flex flex-col   rounded-5 bg-[#FFFFFF]"
      >
        <div className="border-b-[2px]  border-b-[#CBD6E2]">
          <p
            ref={ref}
            className="uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]"
          >
            {headerDate}
          </p>
        </div>
        <ul
         
          onScroll={handleScroll}
          className="list-disc h-[300px] overflow-y-scroll rounded-b-md min-w-[600px] max-h-[17.6rem] "
        >
          {sortedAction?.map((item, index) => (
            <div key={index} className="flex ml-2 h-[57px] pl-5 relative">
              <p className="text-[#4A556C] pt-6 font-medium text-xs mr-6 w-[80px]">
                {item?.message &&
                  new Date(item.createdAt)
                    .toLocaleTimeString()
                    .split(":")
                    .slice(0, 2)
                    .join(":") +
                    " " +
                    new Date(item.createdAt).toLocaleTimeString().split(" ")[1]}
                {item.topDate && item?.message && (
                  <span className="text-xs ml-5 top-0 text-[#FFA28D] absolute backdrop-blur-sm ">
                    {" "}
                    {item?.topDate}
                  </span>
                )}
              </p>
              <div className={`pt-5 ${styles.actionBorder}`}>
                <div className={styles.circle}>
                  <div className={styles.circle2}></div>
                </div>
                <p className="pl-4 text-sm font-medium text-[#4A556C]">
                  {item.message}
                </p>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default React.memo(ActionLog);
