import React from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";

const BubbleChart2 = () => {
  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center border border-gray-200 p-4 mt-[6px] rounded-md">
      < div className="w-full max-w-screen-lg " >
        <div className="flex justify-center w-full">
          <Bubble
            data={bubbleChartData}
            options={{
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Weeks',
                    padding: { top: 40 },
                    color: '#24A3D9',
                    font: {
                      weight: 500,
                      size: 14,
                    },
                  },
                  ticks: {
                    color: '#507CA8',
                    font: {
                      weight: 500,
                      size: 14,
                    },
                  },
                },
                y: {
                  display: true,
                  title: {
                    display: true,
                    text: 'DAY',
                    padding: { bottom: 40 },
                    color: '#24A3D9',
                    font: {
                      weight: 500,
                      size: 14,
                    },
                  },
                  ticks: {
                    color: '#507CA8',
                    font: {
                      weight: 500,
                      size: 14,
                    },
                  },
                },

              },

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
      </div >
    </div >
  );
};

export default BubbleChart2;
