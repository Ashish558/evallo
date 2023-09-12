import React from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";
import arrow from '../../../assets/icons/arrow-chart.svg'
import arrow1 from '../../../assets/icons/arrow-up-chart.svg'

const BubbleChart2 = () => {
  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center border border-gray-200 p-4 mt-[6px] rounded-md relative">

      <div className="flex  max-w-full justify-center w-full">
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
                    size: 18,
                  },
                },
                ticks: {
                  color: '#507CA8',
                  font: {
                    weight: 400,
                    size: 16,
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
                    size: 18,
                  },
                },
                ticks: {
                  color: '#507CA8',
                  font: {
                    weight: 400,
                    size: 16,
                  },
                },
              },

            },
            plugins: {


              legend: {
                display: true,
                position: "top",
                align: "center",

                labels: {

                  usePointStyle: true,
                  font: {
                    size: 15,
                    family: 'Arial',
                  },
                  marginBottom: 10,
                  labelSpacing: 100,
                  boxWidth: 100,

                  pointStyle: "circle",

                  radius: 7,
                },
              },
            },
            title: {
              display: true,
              text: "Bubble Chart",
              fontSize: 20,
            },

          }}
        />
      </div>
      <div className="absolute bottom-[5%] flex items-center font-medium text-lg left-[7%] text-[#26435F]">
        <div className="bg-[rgba(38,67,95,1)] w-[40px] h-[11px] mr-[13px]"></div>
        <p>past 12 days</p>
      </div>
      <div className="absolute bottom-[6.5%] left-[50.2%]"><img src={arrow} alt="" /></div>
      <div className="absolute top-[40%] left-[3%]"><img src={arrow1} alt="" /></div>
    </div >
  );
};

export default BubbleChart2;
