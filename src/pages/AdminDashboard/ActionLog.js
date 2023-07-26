import styles from "./style.module.css";
import { useGetSpecificActionLogQuery } from "../../app/services/adminDashboard";
export default function ActionLog() {
  let { data: actionLog, isSuccess: fetchStatus } =
    useGetSpecificActionLogQuery();

  return (
    <div className="ml-3">
      <div className="flex flex-col border border-solid border-gray-200 bg-[#FFFFFF]">
        <div className="  border border-solid border-gray-200">
          <p className="uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]">
            {actionLog?.actions[0]
              ? new Date(actionLog?.actions[0]?.createdAt).toDateString()
              : new Date().toDateString()}
          </p>
        </div>
        <ul className="list-disc overflow-y-scroll min-w-[600px] max-h-[17.6rem]">
          <div className="h-[1px] bg-[#CBD6E2]" />
          {actionLog?.actions?.map((item, index) => (
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
