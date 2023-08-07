import React from "react";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import styles from "./style.module.css";

import Table from "../../components/Table/Table";
import ActionLog from "./ActionLog";

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
} from "../../app/services/adminDashboard";
import { tutorTableHeaders } from "./staticData";
import { useState } from "react";
import RangeDate from "../../components/RangeDate/RangeDate";
import ArrowDown from "../../assets/Dashboard/sort-down.svg";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: latestSignUp } = useGetLatestSignUpQuery();
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
    if (latestSignUp?.data) setUserData(latestSignUp?.data);
  }, [latestSignUp]);

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
      className: "text-left pl-6",
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
        // setTutorPerformance(res?.data?.all_tutors);
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
        // setPopularServices(res?.data?.all_services);
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
        console.log(res?.data);

        setFilteredActionLog(res?.data?.actions);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className="mx-7 mt-[28px] bg-#2E2E2E">
        <div className="mt-[42px] flex justify-center">
          <div className="w-full mx-[80px]">
            <p className="text-[#24A3D9] mb-3">
              {organization?.company +
                "  >  " +
                firstName +
                "  " +
                lastName +
                "  >  "}
              <span className="font-semibold">Dashboard</span>
            </p>

            <div className="flex justify-between items-center ">
              <p className="font-bold text-[#26435F]">BUSINESS OVERVIEW </p>

              <RangeDate handleRangeData={handleRevenue} />
            </div>
          </div>
        </div>

        <section className="flex justify-center ">
          <div className={styles.mainBox}>
            <div className="grid grid-cols-2 gap-5 px-2">
              <div className={`${styles.gridBorder} `}>
                <div className="flex  justify-evenly gap-4">
                  <div className="w-[160px]">
                    <div className="flex justify-between items-center mb-1 text-[#26435F] text-sm">
                      <p className="   font-medium">Completed Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>
                        <span className="absolute  -top-10 left-10  w-[300px] scale-0 rounded-lg bg-[rgba(31,41,55,0.9)] p-2 text-xs text-white group-hover:scale-100">
                          <h3 className="text-[#22A699] text-[16px] py-1 font-semibold mb-1">
                            Completed Revenue
                          </h3>
                          This value is calculated by adding up all the revenue
                          generated from sessions that have been marked as
                          “Completed” for the selected date range.
                          <br /> Note that the revenue is calculated by
                          multiplying a Tutor’s Service Rate by the Session
                          Duration and adding all those values up.
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center rounded-md items-center text-2xl font-bold bg-[#22A69933] box-border ${styles.boxBorder1}`}
                    >
                      <p className="text-[#38C980]">
                        ${cRevenue?.completedRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[170px] flex-1 ">
                    <div className="flex justify-between rounded-md items-center mb-1 text-[#26435F] text-sm">
                      <p className="font-medium">Leaked Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>
                        <span className="absolute  -top-10 left-10  w-[300px] scale-0 rounded-lg bg-[rgba(31,41,55,0.9)] p-2 text-xs text-white group-hover:scale-100">
                          <h3 className="text-[#FF5175] text-[16px] py-1 font-semibold mb-1">
                            Leaked Revenue
                          </h3>
                          This value is calculated by adding up all the revenue
                          lost from sessions that have been marked as “Canceled”
                          or “Partial” for the selected date range.
                          <br />
                          Note that the revenue is calculated by multiplying a
                          Tutor’s Service Rate by the Session Duration and
                          adding all those values up.
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex rounded-md justify-center items-center text-2xl font-semibold bg-[#FF517533] box-border ${styles.boxBorder2}`}
                    >
                      <p className="text-[#FF7979]">
                        ${lRevenue?.canceledRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[170px] flex-1">
                    <div className="flex justify-between items-center mb-1 text-[#26435F] text-sm">
                      <p className="   font-medium">Impending Revenue</p>
                      <div className="group relative">
                        <p>
                          <FontAwesomeIcon
                            icon={faQuestionCircle}
                          ></FontAwesomeIcon>
                        </p>
                        <span className="absolute  -top-10 left-10  w-[300px] scale-0 rounded-lg bg-[rgba(31,41,55,0.9)] p-2 text-xs text-white group-hover:scale-100">
                          <h3 className="text-[#7152EB] text-[16px] py-1 font-semibold mb-1">
                            Impending Revenue
                          </h3>
                          This value is calculated by adding up all the revenue
                          lost from sessions that have been marked as
                          “Scheduled” for the selected date range.
                          <br />
                          Note that the revenue is calculated by multiplying a
                          Tutor’s Service Rate by the Session Duration and
                          adding all those values up.
                        </span>
                      </div>
                    </div>
                    <div
                      className={`h-[106px] flex rounded-md justify-center items-center text-2xl font-semibold bg-[#7152EB33] box-border ${styles.boxBorder3}`}
                    >
                      <p className="text-[#7152EB]">
                        ${iRevenue?.impendingRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.gridBorder2}`}>
                <div className="flex px-8 gap-x-8 justify-evenly">
                  <div className="w-[170px] flex-1 ">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Unpaid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5 text-sm shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[170px] flex-1 ">
                    <div className=" mb-2">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Paid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5 text-sm shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[170px] flex-1">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-[#26435F80]">
                        Cancelled Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106px] flex justify-center items-center rounded-5 text-sm shadow-box text-[#667085] bg-[#F5F8FA]`}
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
            <div className="mt-[30px] w-screen mx-[120px]">
              <div className="mt-2 h-[1px] bg-[#00000033]"></div>
            </div>
          </div>
          <div className="w-[screen] mx-[80px] mt-[42px] text-[#26435F]">
            <div className="flex justify-between items-center ">
              <p className="font-bold">USER OVERVIEW </p>

              <div className="flex font-semibold text-[#FFA28D] text-xs">
                <RangeDate handleRangeData={handleUserStats} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 mt-[30px] mx-[80px] gap-x-5">
            <div className="col-span-3">
              <p className=" mb-1 font-semibold text-[#26435F]">User Stats</p>
              <div className={styles.sidebox}>
                <div className="pl-[19px]  pt-5 rounded ">
                  <p className="text-[#26435F]">Active / Total Students</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      {userStats?.student.activeUsers.count}
                      {" / "}
                    </span>
                    <span className="text-[#24A3D9]">
                      {userStats
                        ? userStats?.student.activeUsers.count +
                          userStats?.student.inactiveUsers.count
                        : "Loading.."}
                    </span>
                  </p>
                </div>
                <div className={`  pl-[19px] pt-7 rounded `}>
                  <p className="text-[#26435F]">Active / Total Tutors</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      {userStats?.tutor.activeUsers.count}
                      {" / "}
                    </span>
                    <span className="text-[#24A3D9]">
                      {userStats
                        ? userStats?.tutor.activeUsers.count +
                          userStats?.tutor.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
                <div className={`  pl-[19px] pt-7 rounded pb-6`}>
                  <p className="text-[#26435F]">Active / Total Parents</p>
                  <p className="text-xl">
                    <span className="font-bold text-[#FFA28D] text-3xl">
                      {userStats?.parent.activeUsers.count}
                      {" / "}
                    </span>
                    <span className="text-[#24A3D9]">
                      {userStats
                        ? userStats?.parent.activeUsers.count +
                          userStats?.parent.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="col-span-9 pl-3">
              <p className="mb-1 font-semibold text-[#26435F]">ACTION LOG</p>
              <ActionLog
                actionLog={filteredActionLog ? filteredActionLog : [""]}
              />
            </div>
          </div>
        </section>

        <section className="mt-[30px] mx-[80px]">
          <p className="font-semibold text-[#26435F] ">Latest Sign-ups</p>

          <div className="">
            <Table
              data={userData}
              AdminLatestSignUp={true}
              headerObject={true}
              // Icon={
              //   <img src={ArrowDown} alt="down" className="flex-shrink-0" />
              // }
              tableHeaders={latestSignUpHeaders}
              maxPageSize={5}
            />
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[30px] w-screen mx-[120px]">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[screen] mx-[80px] mt-[42px] text-[#26435F]">
          <div className="flex justify-between items-center ">
            <p className="font-bold uppercase">Client Success Overview </p>

            <RangeDate handleRangeData={handlePopularServices} />
          </div>
        </div>

        <section className="mt-[10px] mx-[80px]">
          <div className="grid grid-cols-4">
            <div className="col-span-3 pr-7 border-r border-[#CBD6E2]">
              <p className="font-semibold text-[#26435F] text-[14px]">
                Popular services
              </p>
              <Table
                data={popularServices}
                // Icon={<img src={ArrowDown} alt="down" className="" />}
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

            <div className="pl-7">
              <p className="mt-1 mb-[10px] font-semibold text-[#26435F] text-[14px] ">
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

        <section className="mt-[30px] mx-[80px]">
          <div className="grid grid-cols-2 gap-x-[40px]">
            <div className="flex scale-[0.98] justify-between gap-4 mt-2 text-sm text-[#26435F]">
              <div>
                <p className="font-semibold text-[13px]">
                  Total # Of referrals
                </p>
                <div
                  className={`mt-1 h-[67px] bg-[rgba(255,162,141,0.2)] ${styles.smallBox}`}
                >
                  <p className="text-[#FFA28D] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    {improvementStats.no_of_referrals}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[13px]">
                  Average SAT improvement
                </p>
                <div
                  className={`w-[170px] mt-1 h-[67px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    {improvementStats.avg_sat_improvement
                      ? improvementStats.avg_sat_improvement
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[13px]">
                  Average ACT improvement
                </p>
                <div
                  className={`w-[170px] mt-1 h-[67px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-semibold text-3xl flex items-center text-center">
                    {improvementStats.avg_act_improvement
                      ? improvementStats.avg_act_improvement
                      : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex scale-[0.961]  mt-2 whitespace-nowrap gap-4  text-xs justify-between text-[#667085]">
              <div>
                <p>Average GRE Improvement</p>
                <div
                  className={`w-[150px] mt-2 h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average GMAT Improvement</p>
                <div
                  className={`w-[150px] mt-2 h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average IELTS Improvement</p>
                <div
                  className={`w-[150px] mt-2 h-[67px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <div className="mt-[41px] w-screen mx-[120px]">
            <div className="mt-2 h-[1px] bg-[#00000033]"></div>
          </div>
        </div>
        <div className="w-[screen] mx-[80px]  mt-[42px] text-[#26435F]">
          <div className="flex justify-between items-center ">
            <p className="font-bold uppercase">Tutor Performence Overview </p>

            <RangeDate handleRangeData={handleTutorPerformance} />
          </div>
        </div>
        <section className="overflow-x-auto scrollbar-content mx-[80px] my-7  scroll-m-1 ">
          <div className="mr-2 w-max ">
            <Table
              data={tutorPerformanceData}
              // Icon={<img src={ArrowDown} alt="down" className="" />}
              tableHeaders={tutorTableHeaders}
              maxPageSize={5}
            />
          </div>

          <div className="flex justify-center">
            <div className="mt-[36px] mb-[44px] bg-[#CBD6E2] h-[1px] w-[100px]"></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
