import React from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";

const BubbleChart = () => {
  return (
    <div className="flex justify-center items-center border border-gray-200 p-20 mt-[6px]">
      <div className="w-full max-w-screen-lg">
        <div className="flex justify-center w-full">
          <Bubble
            data={bubbleChartData}
            options={{
              title: {
                display: true,
                text: "Bubble Chart",
                fontSize: 20,
              },
              legend: {
                display: true,
                position: "right",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BubbleChart;
