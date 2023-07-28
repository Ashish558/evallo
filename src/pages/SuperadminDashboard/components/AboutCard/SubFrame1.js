import React, { useEffect,useState } from "react";
import styles from "./orgcard.module.css";
import { useGetSpecificActionLogMutation } from "../../../../app/services/superAdmin";
const SubFrame2 = ({id}) => {
  const [fetchAction,fetchActionStatus]= useGetSpecificActionLogMutation()
  const [actionLog,setActionLog] = useState([])
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [sortedAction, setSortedAction] = useState([]);

  useEffect(()=>{
   const fetchFunction=()=>{
    const body={
      orgId:id
    }
      fetchAction(body).then((res)=>{
      
      if(res?.data?.actions){
        setActionLog(res?.data?.actions)
      }
      }).catch((err)=>{
        console.log(err)
      });
   }
   fetchFunction();
  },[])
 
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
    setSortedAction(newarr);
  }, [actionLog]);

  return (
    <div>
      {" "}
      <ul className="list-disc overflow-y-scroll -translate-y-3 h-[350px]">
        <div className="h-[1px] bg-[#CBD6E2]" />
        {sortedAction?.map((item, index) => (
            // <li key={index} className="flex">
            //   <span className="mr-4 text-gray-500">{item.slice(0, 12)}</span>
            //   <span>{item.slice(12)}</span>
            // </li>
            <div key={index} className="flex ml-2 h-[57px] pl-5 relative">
              <p className="text-[#4A556C] pt-5 font-medium text-xs mr-6 w-[80px]">
              {new Date(item.createdAt).toLocaleTimeString()}
              {item.topDate && (
                    <span className="text-xs ml-2 top-0 text-[#FFA28D] absolute z-5000 backdrop-blur-sm ">
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
  );
};

export default SubFrame2;
