import React, { useEffect,useState } from "react";
import styles from "./orgcard.module.css";
import { useGetSpecificActionLogMutation } from "../../../../app/services/superAdmin";
import Loader from "../../../../components/Loader";
const SubFrame2 = ({id}) => {
  const [fetchAction,fetchActionStatus]= useGetSpecificActionLogMutation()
  const [actionLog,setActionLog] = useState([])
  const [currentElementIndex, setCurrentElementIndex] = useState(0);
  const [sortedAction, setSortedAction] = useState([]);
 const [loading,setLoading] = useState(false)
 
  useEffect(()=>{
   const fetchFunction=()=>{
    setLoading(true)
    const body={
      orgId:id
    }
      fetchAction(body).then((res)=>{
        setLoading(false)
      if(res?.data?.actions){
        setActionLog(res?.data?.actions)
      }
      }).catch((err)=>{
        setLoading(false)
        console.log(err)
      });
   }
   fetchFunction();
  },[])
 
  
  useEffect(() => {
    setCurrentElementIndex(0);
    const sorting = (newarr, extra) => {
      let sortedData = [...actionLog];
      sortedData.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
      let date2=new Date();

      date2.setDate(new Date().getDate() - 12);
   
      sortedData=sortedData?.filter(a => new Date(a.createdAt) >= new Date(date2))
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
      <ul className="list-disc overflow-y-scroll custom-scroller -translate-y-2 h-[350px]">
        
        {!loading ? sortedAction?.map((item, index) => (
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
                      {/* {item?.topDate} */}
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
          )):loading&&<Loader size={"50px"}/> }
         
      </ul>
    </div>
  );
};

export default SubFrame2;
