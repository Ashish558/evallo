import React from "react";

export default function FinancialStats() {
  const financialData = [
    { title: "Card 1", value: "$100" },
    { title: "Card 2", value: "$200" },
    { title: "Card 3", value: "$300" },
    { title: "Card 4", value: "$400" },
    { title: "Card 5", value: "$500" },
    { title: "Card 6", value: "$600" },
    { title: "Card 7", value: "$700" },
    { title: "Card 8", value: "$800" },
  ];

  return (
    <div className="h-1/2 w-1/2">
      <h2 className="text-2xl font-bold mb-4">FinancialStats</h2>
      <div className="grid grid-cols-2 gap-4 w-150 border border-solid border-grey-200 p-5">
        <div className="bg-blue-700 rounded p-4 shadow w-150 h-150">
          <h3 className="text-lg font-bold text-white">
            {financialData[0].title}
          </h3>
          <p className="text-gray-100">{financialData[0].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150 h-50">
          <h3 className="text-lg font-bold text-gray-100">{financialData[1].title}</h3>
          <p className="text-gray-100">{financialData[1].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold text-gray-100">{financialData[2].title}</h3>
          <p className="text-gray-100">{financialData[2].value}</p>
        </div>
        <div className="bg-blue-700 rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold text-gray-100">{financialData[3].title}</h3>
          <p className="text-gray-100">{financialData[3].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[4].title}</h3>
          <p className="text-gray-500">{financialData[4].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[5].title}</h3>
          <p className="text-gray-500">{financialData[5].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[6].title}</h3>
          <p className="text-gray-500">{financialData[6].value}</p>
        </div>
        <div className="bg-white rounded p-4 shadow w-150">
          <h3 className="text-lg font-bold">{financialData[7].title}</h3>
          <p className="text-gray-500">{financialData[7].value}</p>
        </div>
      </div>
    </div>
  );
}
