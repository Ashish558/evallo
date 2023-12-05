import React, { useEffect } from "react";

import styles from "./styles.module.css";
import moment from "moment";
import orgStyles from "./orgCard/orgcard.module.css";
import Table from "./Table/table";
import { orgData, tableHeaders } from "./temp";
import {
  useGetAllOrgStatsRangeMutation,
  useGetLatestOrgRangeMutation,
  useLazyGetLatestOrgQuery,
} from "../../app/services/superAdmin";
import Chart from "./DataChart/Chart";
import Chart2 from "./DataChart/Chart2";
import Index from "./FinancialStats/Index1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faq2 from "../../assets/YIcons/Vectorfinantia.svg";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

import Demography from "./Demographies/Demography1";

import { useState } from "react";
import { useGetUserStatsByRoleRangeMutation } from "../../app/services/superAdmin";
import RangeDate from "../../components/RangeDate/RangeDate";
import { convertDateToRange } from "./utils";
import { useSelector } from "react-redux";
const orgContents = [
  {
    heading: "Total # of Orgs",
    text: "350",
  },
  {
    heading: "C:I Ratio",
    text: "350",
  },
  {
    heading: "11 days",
    text: "350",
  },
  {
    heading: "Inactive",
    text: "350",
  },
];

const userTypes = [
  {
    text: "Admin",
    selected: true,
  },
  {
    text: "Contributor",
    selected: false,
  },
  {
    text: "Student",
    selected: false,
  },
  {
    text: "Parent",
    selected: false,
  },
  {
    text: "Tutor",
    selected: false,
  },
];

function SuperadminDashboard() {
  const [orgSignUpData, setOrgSignUpData] = useState([]);
  const [fetchUserData, setUserData] = useGetLatestOrgRangeMutation();
  const [OrgStatsData, OrgStatsStatus] = useGetAllOrgStatsRangeMutation();
  const [OrgStats, setOrgStats] = useState({});
  const [dateRange, setDateRange] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [dayDifferencesDash, setDayDifferenceDash] = useState(0);
  const [totalUsers, setTotalUsers] = useState({
    admin: null,
    parent: null,
    tutor: null,
    student: null,
    contributor: null,
  });
  const [userAdminStats, adminstatsStaus] = useGetUserStatsByRoleRangeMutation(
    {}
  );

  const getLatestOrgs = async (body) => {
    fetchUserData(body).then((result) => {
      try {
        console.log("latest", { body, result });
        let arr = [];
        for (let i = 0; i < result?.data?.data?.length; i++) {
          if (result?.data?.data[i].role === "admin") {
            let date = new Date(result.data.data[i].createdAt).toDateString();

            let temp = {
              _id: result.data.data[i]?._id,
              date: date,
              name: result.data.data[i].company
                ? result.data.data[i].company
                : "Not Available",
              status: result.data.data[i].userStatus,
              type: result.data.data[i].subscription
                ? result.data.data[i].subscription
                : "none",
              admin:
                result.data.data[i].firstName +
                " " +
                result.data.data[i].lastName,
            };
            arr.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
            arr.push(temp);
          }
        }

        setOrgSignUpData(arr);
      } catch (e) { }
    });
  };
  useEffect(() => {
    if (dateRange?.startDate) {
      let counter = 0;
      let arr = totalUsers;
      Object.keys(totalUsers).forEach(async (key) => {
        const body = {
          role: key,
          ...dateRange,
        };
        userAdminStats(body).then((res) => {
          counter++;

          arr = { ...arr, [key]: res?.data };
          console.log({ counter, arr });
          if (counter === 5) {
            setTotalUsers(arr);
          }
        });
      });
    }
  }, [dateRange]);

  useEffect(() => {
    setCurrentUser({
      name: "admin",

      ...totalUsers["admin"],
    });
  }, [totalUsers]);
  const handleCurrentUser = (item) => {
    setCurrentUser({
      name: item.text.toLowerCase(),
      ...totalUsers[`${item.text.toLowerCase()}`],
    });
  };
  const handleDataRange = (startDate) => {
    const body = convertDateToRange(startDate);

    OrgStatsData(body).then((res) => {
      console.log({ res });
      setOrgStats(res?.data);
    });

    const minDate2 = body.startDate;
    const minDate3 = moment.min(minDate2);
    const currentDate = moment(body.endDate); // Current date
    // Calculate the difference in days
    setDayDifferenceDash(currentDate.diff(minDate3, "days"));
    getLatestOrgs(body);
    setDateRange(body);
  };

  return (
    <div className={styles.container}>
      <div className="mt-[34px] bg-#2E2E2E mx-auto pb-7 px-[150px]">
        <div className="flex justify-between">
          <p className="text-[#24A3D9]">Dashboard</p>

          <RangeDate
            optionClassName="!w-min"
            inputContainerClassName="!w-min "
            super={true}
            handleRangeData={handleDataRange}
          />
        </div>

        <div className="flex  justify-between mt-7 ">
          <section className="">
            <div className="w-[587.5px] whitespace-nowrap ">
              <p className={`${styles.subheading} `}> Organizations </p>
              <div className={`flex mr-0 ${styles.orgCard} mt-1.5 justify-evenly items-center`}>
                <div className={`  ${orgStyles.container}`}>
                  <p className={`${orgStyles.heading} `}>
                    {" "}
                    Total # of Orgs
                  </p>
                  <p className={`${orgStyles.text} `}>
                    {" "}
                    {OrgStats?.total_no_of_orgs}{" "}
                  </p>
                </div>

                <div className={`${orgStyles.container}`}>
                  <p className={`${orgStyles.heading} `}>
                    {" "}
                    C:I Ratio
                  </p>
                  <p className={`${orgStyles.text} `}>
                    {" "}
                    {OrgStats?.ci_ratio}{" "}
                  </p>
                </div>
                <div className={`${orgStyles.container} `}>
                  <p className={`${orgStyles.heading} `}>
                    {" "}
                    {dayDifferencesDash} Days
                  </p>
                  <p className={`${orgStyles.text} `}>
                    {" "}
                    {OrgStats?.days_12}{" "}
                  </p>
                </div>
                <div className={`${orgStyles.container} `}>
                  <p className={`${orgStyles.heading} `}>
                    {" "}
                    Inactive
                  </p>
                  <p className={`${orgStyles.text} `}>
                    {OrgStats?.inactive}{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-[40px] w-[585px]">
              <p className="w-full font-semibold text-[#26435F] mb-[4px] text-[21.33px]">
                {" "}
                User Stats{" "}
              </p>
              <div className={styles.userStatsContainer}>
                <div
                  style={{
                    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25) ",
                  }}
                  className="flex overflow-hidden rounded-t-5"
                >
                  {userTypes.map((item, id) => {
                    return (
                      <div
                        key={id}
                        onClick={() => handleCurrentUser(item)}
                        className={`  bg-white border-b-[1.4px] overflow-hidden relative cursor-pointer border-[rgb(10,30,40,0.27)] ${styles.userStat} h-[54px]`}
                      >
                        <span
                          className={` ${currentUser?.name === item.text.toLowerCase()
                              ? "text-[#FFA28D]"
                              : ""
                            } `}
                        >
                          {item.text}
                        </span>
                        {currentUser?.name === item.text.toLowerCase() ? (
                          <p className="border-b-[4px] relative  rounded-t translate-y-[11px]  border-b-[#FFA28D]  text-[#FFA28D] "></p>
                        ) : (
                          ""
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-[#F5F8FA]">
                  <div
                    className={`flex w-full bg-white ${styles.customBorder}`}
                  >
                    <div className="w-1/5 flex flex-col items-center pt-[5px] pb-2">
                      <p
                        className={`${styles.statHead} text-[26.667px] font-semibold`}
                      >
                        {currentUser?.name
                          ? currentUser[`${currentUser.name}`]
                          : ""}
                      </p>
                      <p className=" text-[#26435F] ml-[-3px]">
                        Total
                      </p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-[5px] pb-2">
                      <p
                        className={`${styles.statHead} text-[26.667px] font-semibold`}
                      >
                        {currentUser?.no_of_active_users}
                      </p>
                      <p className=" text-[#26435F]">Active</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-[5px] pb-2">
                      <p
                        className={`${styles.statHead} text-[26.667px] font-semibold`}
                      >
                        {currentUser?.no_of_new_users}
                      </p>
                      <p className=" text-[#26435F]">New</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-[5px] pb-2">
                      <p
                        className={`${styles.statHead} text-[26.667px] font-semibold`}
                      >
                        {currentUser?.no_of_avg_logins}
                      </p>
                      <p className=" text-center text-[#26435F] ">
                        Avg. # of logins
                      </p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-[5px] pb-2">
                      <p
                        className={`${styles.statHead} text-[26.667px] font-semibold`}
                      >
                        {currentUser?.avg_session_duration}
                        <span className="text-xs">min</span>
                      </p>
                      <p className=" text-[#26435F] text-center">
                        Avg. Session duration
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center  justify-start gap-12 pl-7 pt-1 pb-2 h-[80px] text-[#26435F] bg-[#FFFFFF] mt-[24px] ${styles.customBorder}`}
                  >
                    <div>
                      <p className="font-semibold text-[26.667px]">
                        {currentUser?.no_of_test_assigned}
                      </p>
                      <p className="text-[0.97vw] font-medium ">
                        # of Tests Assigned
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-[26.667px]">
                        {currentUser?.no_of_test_created}
                      </p>
                      <p className="text-[0.97vw] font-medium">
                        # of Tests Created
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="  overflow-auto">
            <p className="text-[#26435F] -mt-1 mb-[-7px] font-semibold text-[21.33px]">
              {" "}
              Latest Org Signup{" "}
            </p>
            <Table
              className="!text-[18.6px] !font-normal"
              noArrow={true}
              data={orgSignUpData}
              tableHeaders={tableHeaders}
              maxPageSize={6}
            />
          </section>
        </div>
        <p className="text-[#26435F] font-semibold mt-9 mb-[-1px] text-[21.33px]">
          Daily Active Users
        </p>
        <Chart
          dateRange={dateRange}
          setDayDifferenceDash={setDayDifferenceDash}
        />
        <Index dateRange={dateRange} />
        <div className="flex items-center mt-[50px] ">
          <p className="text-[#26435F] font-semibold text-[21.33px]">
            Financial Stats Chart{" "}
          </p>
          <p className="text-[#26435F] pl-[15px] pt-1">
            <img
              src={faq2}
              className="w-[18px] h-[18px] translate-y-[-2px]"
              alt="faq"
            />
          </p>
        </div>
        <Chart2 />
        <p className="text-[#26435F] font-semibold mt-[50px] text-[21.33px]">
          User demography
        </p>
        <Demography dateRange={dateRange}></Demography>
      </div>
    </div>
  );
}

export default React.memo(SuperadminDashboard);
