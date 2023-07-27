import React, { useEffect,useState } from "react";
import styles from "./orgcard.module.css";
import { useGetSpecificActionLogMutation } from "../../../../app/services/superAdmin";
const SubFrame2 = ({id}) => {
  const [fetchAction,fetchActionStatus]= useGetSpecificActionLogMutation()
  const [actionLog,setActionLog] = useState([])
 
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
 
  return (
    <div>
      {" "}
      <ul className="list-disc overflow-y-scroll -translate-y-3 h-[350px]">
        <div className="h-[1px] bg-[#CBD6E2]" />
        {actionLog?.map((item, index) => (
            // <li key={index} className="flex">
            //   <span className="mr-4 text-gray-500">{item.slice(0, 12)}</span>
            //   <span>{item.slice(12)}</span>
            // </li>
            <div key={index} className="flex ml-2 h-[57px] pl-5">
              <p className="text-[#4A556C] pt-5 font-medium text-xs mr-6 w-[80px]">
              {new Date(item.createdAt).toLocaleTimeString()}
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
