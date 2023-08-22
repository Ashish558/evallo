import ActionLog from "./ActionLog";
import FinancialStats from "./FinancialStats";

export default function Index1({dateRange}) {
  return (
    <div className="flex justify-center items-baseline h-40vh mt-8 gap-12">
      <FinancialStats dateRange={dateRange}/>
      <ActionLog dateRange={dateRange}/>
    </div>
  );
}
