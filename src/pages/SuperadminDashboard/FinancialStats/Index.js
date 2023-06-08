import ActionLog from "./ActionLog";
import FinancialStats from "./FinancialStats";

export default function Index() {
  return (
    <div className="flex justify-center items-baseline h-40vh mt-8">
      <FinancialStats />
      <ActionLog />
    </div>
  );
}
