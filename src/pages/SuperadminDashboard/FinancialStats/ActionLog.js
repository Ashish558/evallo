import styles from "./styles.module.css";
import { useGetActionLogQuery } from "../../../app/services/superAdmin";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
export default function ActionLog() {
  const { data: actionLogData, isSuccess: fetchStatus } = useGetActionLogQuery();
  
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [extraElement, setExtraElement] = useState(0);
  const [sortedAction, setSortedAction] = useState([]);
  const [actionLog,setActionLog]=useState([])
  console.log("action", actionLog);
  useEffect(()=>{
 if(actionLogData?.actions?.length>0){
  setActionLog(actionLogData?.actions)
 }
  },[actionLogData])
  const handleScroll = (e) => {
    // Get the height of each element row

    const elementHeight = e.target.scrollHeight / actionLog?.length;

    // Calculate the index of the current element at the top of the visible area
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

  return (
    <div className="">
      <div className="flex flex-col border border-solid border-gray-200 rounded-5 bg-[#FFFFFF]">
        <div className="  border border-solid border-gray-200">
          <p className="uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]">
            {sortedAction[currentElementIndex]
              ? new Date(
                  sortedAction[currentElementIndex]?.createdAt
                ).toDateString()
              : new Date().toDateString()}
          </p>
        </div>
        <ul
          style={{
            overflow: "scroll",
            height: "300px", // Set the desired height of the div here
          }}
          onScroll={handleScroll}
          className="list-disc overflow-y-scroll min-w-[600px] max-h-[17.6rem] "
        >
          <div className="h-[1px] bg-[#CBD6E2]" />
          {sortedAction?.map((item, index) => (
            <>
              <div key={index} className="flex ml-2 h-[57px] pl-5 relative">
                <p className="text-[#4A556C] pt-5 font-medium text-xs mr-6 w-[80px]">
                  {new Date(item.createdAt).toLocaleTimeString()}
                  {item.topDate && (
                    <span className="text-xs ml-5 top-0 text-[#FFA28D] absolute z-5000 backdrop-blur-sm ">
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
            </>
          ))}
        </ul>
      </div>
    </div>
  );
}
