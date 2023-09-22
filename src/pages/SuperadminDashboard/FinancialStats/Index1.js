import ActionLog from "./ActionLog";
import FinancialStats from "./FinancialStats";

export default function Index1({dateRange}) {
  return (
    <div className="flex justify-center items-baseline  mt-[58px] gap-x-[60px]">
      <FinancialStats dateRange={dateRange}/>
      <ActionLog dateRange={dateRange}/>
    </div>
  );
}
