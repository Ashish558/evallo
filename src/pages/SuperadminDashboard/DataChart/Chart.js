import React, { useRef } from "react";
import { Scatter } from "react-chartjs-2";
import { ChartData, bubbleChartData } from "./ChartData";
import {
  useGetUserDailyActivityQuery,
  useGetUserDailyActivityRangeMutation,
} from "../../../app/services/superAdmin";
import moment from "moment";
import { groupDatesIntoWeeks, convertToChart } from "../utils";
import { useEffect } from "react";
import { useState } from "react";
import arrow from "../../../assets/icons/arrow-chart.svg";
import "chartjs-adapter-moment";
import arrow1 from "../../../assets/icons/arrow-up-chart.svg";
import styles from './styles.module.css'
import {Chart, LinearScale, PointElement, Tooltip, Legend, TimeScale} from "chart.js"; 

Chart.register(LinearScale, PointElement, Tooltip, Legend, TimeScale); 
const BubbleChart = ({ dateRange }) => {
  const [userDailyActivity, setDailyActivity] = useState([]);
  const [userDailyActivityData, status] =
    useGetUserDailyActivityRangeMutation();
  const [dayDifference, setDayDifference] = useState(0);
  const [dailyuserData, setDailyUserData] = useState("");
  const [chartData, setChartData] = useState("");
  console.log(chartData);
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
  const [minDate, setMinDate] = useState(moment());
  useEffect(() => {
    if (userDailyActivity?.length >= 0) {
      let rolesData = {
        admin: [],
        tutor: [],
        parent: [],
        student: [],
        superadmin: [],
      };
      let date2 = dateRange?.startDate;

      let minDate2 = moment();

      userDailyActivity?.map((d) => {
        if (
          d?.role &&
          rolesData[d?.role] &&
          new Date(d?.datetime) >= new Date(date2)
        ) {
          let date2 = new Date(d?.datetime);
          date2.setDate(new Date(d?.datetime).getDate() - 0);
          minDate2 = Math.min(minDate2, date2);
          rolesData[d.role].push({
            date: d.datetime,
            count: d.count,
            totalHours: d.totalHours,
          });
        }
      });
      const minDate3 = moment.min(minDate2);
      const currentDate = moment(); // Current date
      // Calculate the difference in days
      setDayDifference(currentDate.diff(minDate3, "days"));
      setMinDate(minDate3);
      Object.keys(rolesData).forEach((key) => {
        rolesData[key] =
          rolesData[key].length > 0 ? groupDatesIntoWeeks(rolesData[key]) : [];
      });
      console.log("dailyActivity rolesData", rolesData);
      let mainData = convertToChart(rolesData, userDailyActivity);
      setChartData(mainData);
    }
  }, [userDailyActivity, dateRange]);
  
  return (
    <div className="bg-[#FFFFFF] relative flex flex-col justify-center items-center border-[1.3px] border-[#FFF]  mt-[6px] rounded-[5.33px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)]">
      <div className="flex  gap-[3%] p-5  pl-[100px] w-full flex-1 border-b border-[1.33px_solid_#EBEBEB]">
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]">
          <span className="bg-[#26435F] inline-block  rounded-full w-3 h-3  "></span>{" "}
          Admin
        </div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]">
          <span className="bg-[#FF7714] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span>{" "}
          Tutor
        </div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]">
          <span className="bg-[#24FF00] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span>{" "}
          Parents
        </div>
        <div className="flex items-center text-[#507CA8] gap-5 !text-[16px]">
          <span className="bg-[#26435F] inline-block  rounded-full w-3 h-3 text-[#507CA8] "></span>{" "}
          Students
        </div>
      </div>

      <div className={`flex mt-6 relative max-w-full justify-center w-full p-4 ${styles.canvas}`}>
        <Scatter
          data={chartData ? chartData : bubbleChartData}
          // data={chartData}
          height={460}
          options={{
            responsive: true,
            maintainAspectRatio: false,

            layout: {
              padding: {
                top: 20,
                bottom: 20,
              },
            },
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "week", // Display x-labels in weeks
                  displayFormats: {
                    week: "WW ",
                  },
                },
                min: minDate,

                display: true,
                title: {
                  display: true,
                  text: "Weeks",
                  padding: { top: 40 },
                  color: "#24A3D9",
                  font: {
                    weight: 500,
                    size: 18,
                  },
                },

                ticks: {
                  callback: function (value, index, ticks) {
                    // Customize the tick labels here
                    return "week " + (index + 1);
                  },

                  color: "#507CA8",
                  font: {
                    weight: 400,
                    size: 12,
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
                suggestedMin: 0,
                suggestedMax: 60,
                stepSize: 10,
                ticks: {
                  color: "#507CA8",
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
                    family: "Lexend",
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
        <p>past {dayDifference ? dayDifference + 2 : dayDifference} days</p>
      </div>
      <div className="absolute bottom-[60px] left-[51%]">
        <img src={arrow} alt="" />
      </div>
      <div className="absolute top-[44.7%] left-[40px] design:top-[47%]">
        <img className="h-[60px]" src={arrow1} alt="" />
      </div>
    </div>
  );
};

export default React.memo(BubbleChart);
