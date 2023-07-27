import React, { useEffect } from "react";
import SAdminNavbar from "../../components/sAdminNavbar/sAdminNavbar";
import styles from "./styles.module.css";
import OrgCard from "./orgCard/orgCard";
import orgStyles from "./orgCard/orgcard.module.css";
import Table from "./Table/table";
import { orgData, tableHeaders } from "./temp";
import { useLazyGetAllOrgUsersQuery } from "../../app/services/users";
import { useLazyGetLatestOrgQuery } from "../../app/services/superAdmin";
import Chart from "./DataChart/Chart";
import Chart2 from "./DataChart/Chart2";
import Index from "./FinancialStats/Index1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowDown19,
  faArrowDown91,
  faArrowRightFromBracket,
  faCaretDown,
  faDollar,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import image from "../../assets/images/Vector.png";
import image1 from "../../assets/images/Vector (1).png";
import image2 from "../../assets/images/Vector (2).png";
import image3 from "../../assets/images/Vector (3).png";
import image4 from "../../assets/images/Vector (4).png";
import image5 from "../../assets/images/Vector (5).png";
import image6 from "../../assets/images/Vector (6).png";
import Demography from "./Demographies/Demography1";
import axios from "axios";
import { useState } from "react";
import {
  useGetAllOrgStatsQuery,
  useGetUserStatsByRoleQuery,
} from "../../app/services/superAdmin";
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
  const [fetchUserData, setUserData] = useLazyGetLatestOrgQuery();
  const { data: OrgStats } = useGetAllOrgStatsQuery();
  const [currentUser, setCurrentUser] = useState();
  const [totalUsers, setTotalUsers] = useState({
    admin: null,
    parent: null,
    tutor: null,
    student: null,
    contributor: null,
  });
  const { data: userAdminStats } = useGetUserStatsByRoleQuery({
    role: "admin",
  });
  const { data: userParentStats } = useGetUserStatsByRoleQuery({
    role: "parent",
  });
  const { data: userTutorStats } = useGetUserStatsByRoleQuery({
    role: "tutor",
  });
  const { data: userContributorStats } = useGetUserStatsByRoleQuery({
    role: "contributor",
  });
  const { data: userStudentStats } = useGetUserStatsByRoleQuery({
    role: "student",
  });

  const getLatestOrgs = async () => {
    fetchUserData().then((result) => {
      try {
        let arr = [];
        for (let i = 0; i < result?.data?.data?.length; i++) {
          if (result?.data?.data[i].role === "admin") {
            let date = new Date(result.data.data[i].createdAt).toDateString();

            let temp = {
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

        if (arr.length > 0) setOrgSignUpData(arr);
      } catch (e) {}
    });
  };
  useEffect(() => {
    setTotalUsers({
      admin: userAdminStats,
      parent: userParentStats,
      tutor: userTutorStats,
      student: userStudentStats,
      contributor: userContributorStats,
    });

    setCurrentUser({
      name: "admin",

      ...userAdminStats,
    });
    getLatestOrgs();
  }, [
    userAdminStats,
    userParentStats,
    userTutorStats,
    userStudentStats,
    userContributorStats,
  ]);
  const handleCurrentUser = (item) => {
    setCurrentUser({
      name: item.text.toLowerCase(),
      ...totalUsers[`${item.text.toLowerCase()}`],
    });
  };
  return (
    <div className={styles.container}>
      <div className=" mt-[60px] bg-#2E2E2E mx-[80px] pb-7">
        <p className="text-[#24A3D9]">Dashboard</p>
        <div className="flex mt-7">
          <section className="flex flex-col">
            <div>
              <p className={styles.subheading}> Organizations </p>
              <div className={`flex ${styles.orgCard}`}>
                <div className={`${orgStyles.container}`}>
                  <p className={orgStyles.heading}> Total # of Orgs</p>
                  <p className={orgStyles.text}>
                    {" "}
                    {OrgStats?.total_no_of_orgs}{" "}
                  </p>
                </div>

                <div className={`${orgStyles.container}`}>
                  <p className={orgStyles.heading}> C:I Ratio</p>
                  <p className={orgStyles.text}> {OrgStats?.ci_ratio} </p>
                </div>
                <div className={`${orgStyles.container}`}>
                  <p className={orgStyles.heading}> 12 Days</p>
                  <p className={orgStyles.text}> {OrgStats?.days_12} </p>
                </div>
                <div className={`${orgStyles.container}`}>
                  <p className={orgStyles.heading}> Inactive</p>
                  <p className={orgStyles.text}>{OrgStats?.inactive} </p>
                </div>
              </div>
            </div>
            <div className="w-full">
              <p className="mt-[20px] mb-2.5 font-medium text-[#26435F]">
                {" "}
                User Stats{" "}
              </p>
              <div className={styles.userStatsContainer}>
                <div className="flex">
                  {userTypes.map((item, id) => {
                    return (
                      <div
                        key={id}
                        onClick={() => handleCurrentUser(item)}
                        className={` bg-white border-b cursor-pointer border-[#000000] ${
                          styles.userStat
                        } ${
                          currentUser?.name === item.text.toLowerCase()
                            ? styles.selected
                            : ""
                        } `}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                </div>
                <div className="bg-[#F5F8FA]">
                  <div
                    className={`flex w-full bg-white ${styles.customBorder}`}
                  >
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        {currentUser?.name
                          ? currentUser[`${currentUser.name}`]
                          : ""}
                      </p>
                      <p className="text-xs text-[#26435F]">Total</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        {currentUser?.no_of_active_users}
                      </p>
                      <p className="text-xs text-[#26435F]">Active</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        {currentUser?.no_of_new_users}
                      </p>
                      <p className="text-xs text-[#26435F]">New</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        {currentUser?.no_of_avg_logins}
                      </p>
                      <p className="text-xs text-[#26435F] "># Avg. Logins</p>
                    </div>
                    <div className="w-1/5 flex flex-col items-center pt-3 pb-2">
                      <p className={`${styles.statHead} text-xl font-semibold`}>
                        {currentUser?.no_of_avg_session_duration}
                      </p>
                      <p className="text-xs text-[#26435F] text-center">
                        # Avg. Session duration
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center  justify-around pt-3 pb-2 text-[#26435F] bg-[#FFFFFF] mt-4 ${styles.customBorder}`}
                  >
                    <div>
                      <p className="font-medium text-xl">
                        {currentUser?.no_of_test_assigned}
                      </p>
                      <p className="text-xs"># of Tests Assigned</p>
                    </div>
                    <div>
                      <p className="font-medium text-xl">
                        {currentUser?.no_of_test_created}
                      </p>
                      <p className="text-xs"># of Tests Created</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="flex-1 px-5 mx-6 ">
            <p className="text-[#26435F] font-medium text-sm">
              {" "}
              Latest Org Signup{" "}
            </p>
            <Table
              data={orgSignUpData}
              tableHeaders={tableHeaders}
              maxPageSize={5}
            />
          </section>
        </div>
        <p className="text-[#26435F] font-medium mt-9">Daily active users</p>
        <Chart />
        <Index />
        <div className="flex items-center mt-[50px]">
          <p className="text-[#26435F] font-semibold ">
            Financial Stats chart{" "}
          </p>
          <p className="text-[#26435F] pl-[15px] pt-1">
            <FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon>
          </p>
        </div>
        <Chart2 />
        <p className="text-[#26435F] font-semibold mt-[50px]">
          User demography
        </p>
        <Demography></Demography>
      </div>
    </div>
  );
}

export default React.memo(SuperadminDashboard);
