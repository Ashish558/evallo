import styles from "./styles.module.css";
import { useGetActionLogQuery } from "../../../app/services/superAdmin";
import { useSelector } from "react-redux";
export default function ActionLog() {
  const { data: actionLog, isSuccess: fetchStatus } = useGetActionLogQuery();
  //console.log("action", actionLog);

  return (
    <div className="ml-3">
      <h2 className=" font-semibold text-[#26435F] mb-1">ActionLog</h2>
      <div className="flex flex-col border border-solid border-gray-200 bg-[#FFFFFF]">
        <div className="mr-5   border border-solid border-gray-200">
          <p className="uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]">
          {new Date(actionLog?.action[0].createdAt).toDateString()}
          </p>
        </div>
        <ul className="list-disc overflow-y-scroll min-w-[600px] max-h-[17.6rem]">
          <div className="h-[1px] bg-[#CBD6E2]" />
          {actionLog?.action.map((item, index) => (
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
    </div>
  );
}
