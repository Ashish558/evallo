import React from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";
import arrow from '../../../assets/icons/arrow-chart.svg'
import arrow1 from '../../../assets/icons/arrow-up-chart.svg'
import styles from './styles.module.css'

import {Chart, LinearScale, PointElement, Tooltip, Legend, TimeScale, CategoryScale} from "chart.js"; 

Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale, CategoryScale); 
const BubbleChart2 = () => {
  const customLegendStyle = {
    position: 'absolute',
    top: '10px', // Adjust top position as needed
    left: '10px', // Adjust left position as needed
  };
  return (
    <div className="bg-[#FFFFFF] flex flex-col justify-center items-center border border-gray-200  mt-[6px] rounded-md relative">
 <div className="flex  gap-[3%] p-5  pl-[100px] w-full flex-1 border-b border-[1.33px_solid_#EBEBEB]">
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]"><span className="bg-[#26435F] inline-block  rounded-full w-3 h-3  "></span> Scheduled</div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]"><span className="bg-[#FF7714] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span> Completed</div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]"><span className="bg-[#24FF00] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span> Missed</div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]"><span className="bg-[#26435F] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span> Cancelled</div>
      
      </div>
      <div className={`flex flex-1 max-w-full justify-center p-4 mt-5 w-full ${styles.financialChart}`}>
        <Bubble
          data={bubbleChartData} 
          options={{
            layout: {
              padding: {
                top: 20,
                bottom:20
              },
            },
            scales: {
              x: {
                type: 'category',
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
                suggestedMin: 0, 
                suggestedMax: 60, 
                stepSize: 10, 
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
                display: false,
                position: "top",
                align: "center",
               

                labels: {
                  // boxHeight:400,
                  usePointStyle: true,
                  // radius: 20,
                  font: {
                    size: 15,
                    family: 'Lexend',
                  },
                  // pointStyleSize:5,
                  // pointStyleHeight:5,

                  pointStyle: "circle",

                },
                  // marginBottom:30,
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
      <div className="absolute bottom-[7%] flex items-center font-medium text-lg left-[7%] text-[#507CA8]">
        <div className="bg-[rgba(38,67,95,1)] w-[40px] h-[11px] mr-[13px]"></div>
        <p>past 12 days</p>
      </div>
      <div className="absolute bottom-[60px] left-[49%]"><img src={arrow} alt="" /></div>
      <div className="absolute top-[44%] design:top-[45%] left-[40px]"><img className="h-[70px]" src={arrow1} alt="" /></div>
    </div >
  );
};

export default BubbleChart2;
