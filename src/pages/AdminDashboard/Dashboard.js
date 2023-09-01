import React from "react";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import styles from "./style.module.css";

import Table from "../../components/Table/Table";
import ActionLog from "./ActionLog";
import Table2 from "../SuperadminDashboard/Table/table"
import {
  useGetAllRevenueMutation,
  useGetImpendingRevenueMutation,
  useGetLatestSignUpQuery,
  useGetLeakedRevenueMutation,
  useGetUserStatsQuery,
  useLazyGetTutorPerformanceQuery,
  useLazyGetPopularServicesQuery,
  useLazyGetImprovementStatsQuery,
  useGetFilteredActionLogMutation,
  useGetLatestSignUpRangeMutation,
} from "../../app/services/adminDashboard";
import { tutorTableHeaders } from "./staticData";
import { useState } from "react";
import RangeDate from "../../components/RangeDate/RangeDate";
import ArrowDown from "../../assets/Dashboard/sort-down.svg";
import { useEffect } from "react";

const Dashboard = () => {
  const [latestSignUp, latsestStatus] = useGetLatestSignUpRangeMutation();
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { data: userStats } = useGetUserStatsQuery();

  const [completedRevenue, completedRevenueStatus] = useGetAllRevenueMutation();
  const [leakedRevenue, leakedRevenueStatus] = useGetLeakedRevenueMutation();
  const [impendingRevenue, impendingRevenueStatus] =
    useGetImpendingRevenueMutation();
  const [cRevenue, setCRevenue] = useState("");
  const [lRevenue, setLRevenue] = useState("");
  const [iRevenue, setIRevenue] = useState("");
  const [fetchTutorPerformanceData, fechedTutorPerformanceStatus] =
    useLazyGetTutorPerformanceQuery();
  const [tutorPerformanceData, setTutorPerformance] = useState([]);
  const [fetchPopularServicesData, fechedPopularServicesStatus] =
    useLazyGetPopularServicesQuery();
  const [popularServices, setPopularServices] = useState([]);
  const [fetchImprovementStats, fetchImprovementStatsStatus] =
    useLazyGetImprovementStatsQuery();
  const [improvementStats, setImprovementStats] = useState([]);
  const [fetchFilteredActionLog, fetchFilteredActionLogStatus] =
    useGetFilteredActionLogMutation();
  const [filteredActionLog, setFilteredActionLog] = useState([]);
  const [userData, setUserData] = useState([]);
  const handleFetchRevenue = (fetchMutation, body, setValue) => {
    fetchMutation(body)
      .then((res) => {
        setValue(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    latestSignUp({ startDate: "", endDate: "" }).then((res) => {
      if (!res?.error) {
        console.log("latest", { res })
        setUserData(res?.data?.data ? res?.data?.data : []);
      }
    })

  }, []);

  const sortByName = () => {
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }
        return 0;
      });
      console.log({ arr });
      return arr;
    });
  };
  const sortByType = () => {
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (a.role < b.role) {
          return -1;
        }
        if (a.role > b.role) {
          return 1;
        }
        return 0;
      });

      return arr;
    });
  };
  const sortByDate = () => {
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        return new Date(b.lastSignUp) - new Date(a.lastSignUp);
      });
      return arr;
    });
  };
  const latestSignUpHeaders = [
    {
      id: 1,
      text: "Full Name",
      className: "text-left pl-8",
      onCick: sortByName,
    },
    {
      id: 2,
      text: "User Type",
      onCick: sortByType,
    },
    {
      id: 3,
      text: "Email",
    },
    {
      id: 4,
      text: "Phone",
    },
    {
      id: 5,
      text: "Assigned Tutor",
    },
    {
      id: 6,
      text: "Lead Status",
    },
    {
      id: 7,
      text: "Tutor Status",
    },
    {
      id: 8,
      text: "Services",
    },
    {
      id: 9,
      text: "Date Added",
      onCick: sortByDate,
    },
  ];
  const convertDateToRange = (startDate) => {
    let startD = startDate.split("-")[0];

    startD = new Date(startD);
    startD = startD.setDate(startD.getDate() + 1);
    startD = new Date(startD).toISOString().split("T")[0];

    let endD = startDate.split("-")[1];
    endD = new Date(endD);
    endD = endD.setDate(endD.getDate() + 1);
    endD = new Date(endD).toISOString().split("T")[0];
    const body = { startDate: startD, endDate: endD };

    return body;
  };
  const handleRevenue = (startDate) => {
    const body = convertDateToRange(startDate);
    handleFetchRevenue(completedRevenue, body, setCRevenue);
    handleFetchRevenue(leakedRevenue, body, setLRevenue);
    handleFetchRevenue(impendingRevenue, body, setIRevenue);
  };
  const handleTutorPerformance = (startDate) => {
    const body = convertDateToRange(startDate);

    fetchTutorPerformanceData(body)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handlePopularServices = (startDate) => {
    const body = convertDateToRange(startDate);

    fetchPopularServicesData(body)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
    handleImprovementStats(startDate);
  };
  const handleImprovementStats = (startDate) => {
    const body = convertDateToRange(startDate);

    fetchImprovementStats(body)
      .then((res) => {
        console.log(res?.data);
        setImprovementStats(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleUserStats = (startDate) => {
    const body = convertDateToRange(startDate);

    fetchFilteredActionLog(body)
      .then((res) => {
        console.log("actionlog", res);
        if (res?.data?.actions)
          setFilteredActionLog(res?.data?.actions);
        else {
          setFilteredActionLog([{ createdAt: body.startDate }]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className=" mt-[28px] bg-#2E2E2E">
        <div className="mt-[50px] flex justify-center">
          <div className="w-[83.33vw]">
            <p className="text-[#24A3D9] mb-[30px] text-xl">
              {organization?.company +
                "  >  " +
                firstName +
                "  " +
                lastName +
                "  >  "}
              <span className="font-semibold">Dashboard</span>
            </p>


            <div className="flex justify-between items-center ">
              <p className="font-bold text-[#FFA28D] text-xl">BUSINESS OVERVIEW </p>

              <RangeDate handleRangeData={handleRevenue} />
            </div>
          </div>
        </div>

        <section className="flex justify-center w-[83.33vw] mx-auto">
          <div className={styles.mainBox}>
            <div className="grid grid-cols-2 px-[1.95vw] ">
              <div className={`${styles.gridBorder} `}>
                <div className="flex pr-[1.8vw]   justify-between whitespace-nowrap">
                  <div className="w-[11.083vw] ">
                    <div className="flex justify-between items-center mb-[10px] text-[#26435F] text-sm">
                      <p className="   font-medium text-[0.916vw]">Completed Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>

                        <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-lg bg-[rgba(31,41,55,0.9)]  text-[13px] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                          <h3 className="text-[#22A699] text-[16px] py-1 font-medium mb-1">
                            Completed Revenue
                          </h3>
                          <span className="font-light">
                            This value is calculated by adding up all the revenue
                            generated from sessions that have been marked as
                            “Completed” for the selected date range.
                            <br /> Note that the revenue is calculated by
                            multiplying a Tutor’s Service Rate by the Session
                            Duration and adding all those values up.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center rounded-md items-center text-[1.57vw] font-bold bg-[#22A69933] box-border ${styles.boxBorder1}`}
                    >
                      <p className="text-[#38C980]">
                        ${cRevenue?.completedRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[11.083vw]">
                    <div className="flex justify-between rounded-md items-center mb-[10px] text-[#26435F] text-sm ">
                      <p className="font-medium text-[0.916vw]">Leaked Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>
                        <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-lg bg-[rgba(31,41,55,0.9)]  text-[13px] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                          <h3 className="text-[#FF5175] text-[16px] py-1 font-medium mb-1">
                            Leaked Revenue
                          </h3>
                          <span className="font-light">
                            This value is calculated by adding up all the revenue
                            lost from sessions that have been marked as “Canceled”
                            or “Partial” for the selected date range.
                            <br />
                            Note that the revenue is calculated by multiplying a
                            Tutor’s Service Rate by the Session Duration and
                            adding all those values up.</span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex rounded-md justify-center items-center text-[1.57vw] font-semibold bg-[#FF797933] box-border ${styles.boxBorder2}`}
                    >
                      <p className="text-[#FF7979]">
                        ${lRevenue?.canceledRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[11.083vw]">
                    <div className="flex justify-between items-center mb-[10px] text-[#26435F] text-sm">
                      <p className="   font-medium text-[0.916vw]">Impending Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>
                        <span className="absolute  -top-10 left-10 z-20 w-[333px]  scale-0 rounded-lg bg-[rgba(31,41,55,0.9)]  text-[13px] text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                          <h3 className="text-[#7152EB] text-[16px] py-1 font-medium mb-1">
                            Impending Revenue
                          </h3>
                          <span className="font-light">
                            This value is calculated by adding up all the revenue
                            lost from sessions that have been marked as
                            “Scheduled” for the selected date range.
                            <br />
                            Note that the revenue is calculated by multiplying a
                            Tutor’s Service Rate by the Session Duration and
                            adding all those values up.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex rounded-md justify-center items-center text-[1.57vw] font-semibold bg-[#7152EB33] box-border ${styles.boxBorder3}`}
                    >
                      <p className="text-[#7152EB]">
                        ${iRevenue?.impendingRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.gridBorder2}`}>
                <div className="flex pl-[1.8vw]   justify-between whitespace-nowrap">
                  <div className="w-[11.083vw] text-[0.916vw]">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80]">
                        Unpaid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[11.083vw] text-[0.916vw]">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80]">
                        Paid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[11.083vw] text-[0.916vw]">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80]">
                        Cancelled Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-center">
            <div className="mt-[50px] w-[78.125vw]">
              <div className="mt-2 h-[1px] bg-[#00000033]"></div>
            </div>
          </div>
          <div className=" w-[83.33vw] mt-[40px] text-[#FFA28D] mx-auto">
            <div className="flex justify-between items-center ">
              <p className="font-bold text-xl">USERS OVERVIEW </p>

              <div className="flex font-semibold text-[#FFA28D] text-xs">
                <RangeDate handleRangeData={handleUserStats} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 !h-[350px] mt-[18px] w-[83.33vw] gap-x-5 mx-auto">
            <div className="col-span-3  !whitespace-nowrap">
              <p className=" mb-1 font-semibold text-[#26435F] text-xl ">User Stats</p>
              <div className={`${styles.sidebox}`}>
                <div className="pl-[38px]  pt-6 rounded ">
                  <p className="text-[#26435F] text-md ">Active / Total Students</p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl">
                      {userStats?.student.activeUsers.count}
                      <span className="font-medium" > {" / "}</span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px]">
                      {userStats
                        ? userStats?.student.activeUsers.count +
                        userStats?.student.inactiveUsers.count
                        : "Loading.."}
                    </span>
                  </p>
                </div>
                <div className={`  pl-[38px] pt-7 rounded `}>
                  <p className="text-[#26435F] text-md">Active / Total Tutors</p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl">
                      {userStats?.tutor.activeUsers.count}
                      <span className="font-medium" > {" / "}</span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px]">
                      {userStats
                        ? userStats?.tutor.activeUsers.count +
                        userStats?.tutor.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
                <div className={`  pl-[38px] pt-7 rounded pb-6`}>
                  <p className="text-[#26435F] text-md">Active / Total Parents</p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl">
                      {userStats?.parent.activeUsers.count}
                      <span className="font-medium" > {" / "}</span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px]">
                      {userStats
                        ? userStats?.parent.activeUsers.count +
                        userStats?.parent.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-9 h-[330px] pl-[17.5px]">
              <p className="mb-1 font-semibold text-[#26435F] text-xl">Action Log</p>
              <ActionLog
                actionLog={filteredActionLog ? filteredActionLog : [""]}
              />
            </div>
          </div>
        </section>

        <section className="mt-[30px] w-[83.33vw] mx-auto">
          <p className="font-semibold text-[#26435F] translate-y-[10px] text-xl mb-2">Latest Sign-ups</p>

          <div className="">
            <Table
              data={userData}
              AdminLatestSignUp={true}
              headerObject={true}

              tableHeaders={latestSignUpHeaders}
              maxPageSize={5}
            />
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[40px] w-[78.125vw] mx-auto">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[83.33vw] mx-auto mt-[52px] text-[#26435F]">
          <div className="flex justify-between items-center translate-y-[10px] ">
            <p className="font-bold uppercase text-[#FFA28D] text-xl">Client Success Overview </p>

            <RangeDate inputContainerClassName="!w-[500px]" optionClassName="!w-[500px]" handleRangeData={handlePopularServices} />
          </div>
        </div>

        <section className="mt-[10px] mx-auto w-[83.33vw]">
          <div className="grid grid-cols-[60.2vw,23vw]">
            <div className="">
              <p className="font-semibold text-[#26435F] translate-y-[10px] text-[17.5px] mb-2">
                Popular Services
              </p>
              <div className=" pr-[1.5625vw] border-r-[1.7px] border-[#CBD6E2]">
                <Table
                  data={popularServices}
                  hidePagination={true}
                  tableHeaders={[
                    "Service",
                    "Actively Using",
                    "Total Used",
                    "Scheduled Hours",
                    "Completed Hours",
                    "% of Business",
                  ]}
                  maxPageSize={5}
                />
              </div>
            </div>
            <div className="pl-[1.5625vw]">
              <p className=" mb-[17px] translate-y-[10px] font-semibold text-[#26435F] text-[17.5px] ">
                Star Clients
              </p>
              <div>
                <div
                  className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#E5E8EA]`}
                >
                  <p>Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-[37px] mx-auto w-[83.33vw]">
          <div className="grid grid-cols-2 gap-x-[5.46875vw]">
            <div className="flex  justify-between gap-x-[1.953125vw]  mt-2 text-sm text-[#26435F]">
              <div>
                <p className="font-semibold text-[0.9114583333vw]">
                  Total # Of Referrals
                </p>
                <div
                  className={`mt-1  h-[72px] bg-[rgba(255,162,141,0.2)] ${styles.smallBox}`}
                >
                  <p className="text-[#FFA28D] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
                    {improvementStats.no_of_referrals}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[0.9114583333vw]">
                  Average SAT Improvement
                </p>
                <div
                  className={` mt-1 h-[72px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
                    {improvementStats.avg_sat_improvement
                      ? improvementStats.avg_sat_improvement
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[0.9114583333vw]">
                  Average ACT Improvement
                </p>
                <div
                  className={` mt-1 h-[72px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
                    {improvementStats.avg_act_improvement
                      ? improvementStats.avg_act_improvement
                      : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex   mt-2 whitespace-nowrap   text-[0.78125vw] justify-between text-[#667085]">
              <div>
                <p>Average GRE Improvement</p>
                <div
                  className={`w-[11.328125vw] mt-1 h-[72px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average GMAT Improvement</p>
                <div
                  className={`w-[11.328125vw] mt-1 h-[72px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average IELTS Improvement</p>
                <div
                  className={`w-[11.328125vw] mt-1 h-[72px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[51px] w-[78.125vw] mx-auto">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[83.33vw] mx-auto  mt-[42px] text-[#FFA28D] ">
          <div className="flex justify-between items-center  translate-y-[15px] mb-[16px]">
            <p className="font-bold uppercase text-xl">Tutor Performence Overview </p>

            <RangeDate handleRangeData={handleTutorPerformance} />
          </div>
        </div>
        <section className="mx-auto  w-[83.33vw]">

          <Table
            headerWidth="w-[150px] whitespace-normal"
            data={tutorPerformanceData}
            tableHeaders={tutorTableHeaders}
            maxPageSize={5}
          />


          <div className="flex justify-center">
            <div className="mt-[36px] mb-[44px] bg-[#CBD6E2] h-[1px] w-[100px]"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
