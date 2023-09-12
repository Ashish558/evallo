import React, { useRef } from "react";
import { Bubble } from "react-chartjs-2";
import { bubbleChartData } from "./ChartData";
import {
  useGetUserDailyActivityQuery,
  useGetUserDailyActivityRangeMutation,
} from "../../../app/services/superAdmin";
import { groupDatesIntoWeeks, convertToChart } from "../utils";
import { useEffect } from "react";
import { useState } from "react";
import arrow from '../../../assets/icons/arrow-chart.svg'
import arrow1 from '../../../assets/icons/arrow-up-chart.svg'
const BubbleChart = ({ dateRange }) => {
  const [userDailyActivity, setDailyActivity] = useState([]);
  const [userDailyActivityData, status] =
    useGetUserDailyActivityRangeMutation();

  const [dailyuserData, setDailyUserData] = useState("");
  const [chartData, setChartData] = useState("");
  console.log(chartData)
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
    if (dateRange === "" || !dateRange) return;
    const fetchActivity = () => {
      userDailyActivityData(dateRange).then((res) => {
        console.log("dailyActivity", { dateRange }, { res: res?.data?.data });
        setDailyActivity(res?.data?.data);
      });
    };
    fetchActivity();
  }, [dateRange]);
  useEffect(() => {
    if (userDailyActivity?.length >= 0) {
      let rolesData = {
        admin: [],
        tutor: [],
        parent: [],
        student: [],
        superadmin: [],
      };

      userDailyActivity?.map((d) => {
        if (d?.role && rolesData[d?.role])
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
      console.log(rolesData);
      let mainData = convertToChart(rolesData, userDailyActivity);
      setChartData(mainData);

    }
  }, [userDailyActivity]);
  console.log(chartData)
  return (
    <div className="bg-[#FFFFFF] relative flex justify-center items-center border-[1.3px] border-[#FFF] p-4 mt-[6px] rounded-[5.33px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)]">
      <div className="flex relative max-w-full justify-center w-full">
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
                    size: 18.667,
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
                    weight: 400,
                    size: 16,
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
                    size: 16,
                  },
                },
                ticks: {
                  color: "#507CA8",
                  font: {
                    weight: 400,
                    size: 16,
                  },
                },
              },
            },

            title: {
              display: true,
              text: "Bubble Chart",
              fontSize: 20,
            },

            layout: {
              padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 0,
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
          }}
        />

      </div>
      <div className="absolute z-20 bottom-[5%] left-[10%] font-medium text-lg flex items-center text-[#26435F]">
        <div className="bg-[rgba(38,67,95,1)] w-[40px] h-[11px] mr-[13px]"></div>
        <p>past 12 days</p>
      </div>
      <div className="absolute bottom-[6.5%] left-[50.5%]"><img src={arrow} alt="" /></div>
      <div className="absolute top-[40%] left-[3.5%]"><img src={arrow1} alt="" /></div>
    </div>
  );
};

export default React.memo(BubbleChart);
