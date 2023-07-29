import React from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";
import { useGetUserDailyActivityQuery } from "../../../app/services/superAdmin";
import { groupDatesIntoWeeks, convertToChart } from "../utils";
import { useEffect } from "react";
import { useState } from "react";
const BubbleChart = () => {
  const { data: userDailyActivity, isSuccess: dailyActivityAccess } =
    useGetUserDailyActivityQuery();
  const [dailyuserData, setDailyUserData] = useState("");
  const [chartData, setChartData] = useState("");
  const plugin = {
    beforeInit(chart) {
      console.log("be");
      // reference of original fit function
      const originalFit = chart.legend.fit;

      // override the fit function
      chart.legend.fit = function fit() {
        // call original function and bind scope in order to use `this` correctly inside it
        originalFit.bind(chart.legend)();
        // increase the width to add more space
        this.width += 20;
      };
    },
  };
  useEffect(() => {
    if (dailyActivityAccess) {
      let rolesData = {
        admin: [],
        tutor: [],
        parent: [],
      };

      userDailyActivity?.data.map((d) => {
        rolesData[d.role].push({
          date: d.datetime,
          count: d.count,
          totalHours: d.totalHours,
        });
      });

      Object.keys(rolesData).forEach((key) => {
        rolesData[key] =
          rolesData[key].length > 0 ? groupDatesIntoWeeks(rolesData[key]) : [];
      });
      // console.log(rolesData);
      let mainData = convertToChart(rolesData);
      setChartData(mainData);
      // setDailyUserData({
      //   ...userDailyActivity,
      // });
    }
  }, [dailyActivityAccess]);
  // console.log(chartData)
  return (
    <div className="bg-[#FFFFFF] flex justify-center items-center border-[1.5px] border-gray-200 p-4 mt-[6px] rounded-md">
      <div className="w-full max-w-screen-lg">
        <div className="flex justify-center w-full">
          <Bubble
            data={chartData ? chartData : bubbleChartData}
            options={{
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: "Weeks",
                    padding: { top: 40 },
                    color: "#24A3D9",

                    font: {
                      weight: 500,
                      size: 14,
                    },
                  },
                  ticks: {
                    // stepSize: 1,
                    // callback: (value) => {
                    //   if (Number.isInteger(value)) {
                    //     return value;
                    //   }
                    //   return null;
                    // },
                    color: "#507CA8",
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
                    text: "Hours",
                    padding: { bottom: 40 },
                    color: "#507CA8",
                    font: {
                      weight: 500,
                      size: 12,
                    },
                  },
                  ticks: {
                    color: "#507CA8",
                    font: {
                      weight: 500,
                      size: 12,
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
                layout: {
                  padding: {
                      left: 0,
                      right: 10,
                      top: 10,
                      bottom: 0
                  }
              },
              },
              layout: {
                padding: {
                    left: 0,
                    right: 10,
                    top: 10,
                    bottom: 0
                }
            },
              plugins: {
                legend: {
                  display: true,
                  position: "top", // Place legends at the top
                  align: "center", // Align legends to the left
                 padding:0.2,
                  labels: {
                   
                   
                    usePointStyle: true,
                    layout: {
                      padding: {
                          left: 0,
                          right: 10,
                          top: 10,
                          bottom: 0
                      }
                  },
                    boxWidth: 100,

                    pointStyle: "circle",

                    radius: 7,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default BubbleChart;
