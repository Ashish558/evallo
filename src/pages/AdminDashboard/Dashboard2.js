import React, { useRef } from "react";
import { useSelector } from "react-redux";
import plusIcon from "../../assets/icons/plus.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import styles from "./style.module.css";
import userLogo from "../../assets/icons/users.svg";
import tooltip from "../../assets/icons/tooltip_dashboard.svg";
import Table from "../../components/Table/Table";
import ActionLog from "./ActionLog";
import Table2 from "../SuperadminDashboard/Table/table";
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
import { useNavigate } from "react-router-dom";
import SubscriptionAndExtensionModal from "../Frames/SubscriptionAndExtensionModal/SubscriptionAndExtensionModal";
import { useLazyGetAuthQuery, useLazyGetOrganizationQuery, useLazyGetPersonalDetailQuery } from "../../app/services/users";

const Dashboard = () => {
  const [latestSignUp, latsestStatus] = useGetLatestSignUpRangeMutation();
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { data: userStats } = useGetUserStatsQuery();
  const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
  const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
  console.log({ userStats }); 
  const [completedRevenue, completedRevenueStatus] = useGetAllRevenueMutation();
  const [leakedRevenue, leakedRevenueStatus] = useGetLeakedRevenueMutation();
  const [impendingRevenue, impendingRevenueStatus] =
    useGetImpendingRevenueMutation();
  const [cRevenue, setCRevenue] = useState("");
  const [lRevenue, setLRevenue] = useState("");
  const navigate = useNavigate();
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
  const [isSubscriptionAndExtensionModalActive, SetIsSubscriptionAndExtensionModalActive] = useState(true);
  const [latestSignUp_flag,setlatestsignup_flag]=useState([1,1,1,1,1,1,1,1,1])
  const [popular_Service_flag,setpopular_Service_flag] = useState([1,1,1,1,1,1])
  const [star_client_flag,setstar_client_flag] = useState([1,1,1])
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
        console.log("latestres", { res });
        let date2 = new Date();

        date2.setDate(new Date().getDate() - 77);

        let data = res?.data?.data?.filter(
          (a) => new Date(a.lastSignUp) >= new Date(date2)
        );
        // let data=res?.data?.data?.
        setUserData(data);
      }
    });
  }, []);

  useEffect(() => {
    getPersonalDetail()
    .then(data => {
      console.log("getPersonalDetail");
      console.log(data);
      const user = data.data.data.user;

      getOrgDetails(user.associatedOrg)
      .then(data => {
        console.log("getOrgDetails - attempt with associatedOrg");
        console.log(data);

        if(data.data === null || data.data === undefined ||
          data.data.customerSubscriptions === null || data.data.customerSubscriptions === undefined ||
          data.data.customerSubscriptions.data === null || data.data.customerSubscriptions.data === undefined ||
          data.data.customerSubscriptions.data.length === 0) {
          SetIsSubscriptionAndExtensionModalActive(true);
        } else {
          SetIsSubscriptionAndExtensionModalActive(false);
        }
      })
      .catch(error => {
        console.log("Error in getOrgDetails");
        console.log(error);
      });

    })
    .catch(error => {
      console.log("Error in getPersonalDetail");
      console.log(error);
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
  const sortByString = (key) => {
    console.log('asda',key);
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (plus && plus[key]) {
          if (a[key] < b[key]) {
            return -1;
          }
          if (a[key] > b[key]) {
            return 1;
          }
          return 0;
        } else {
          if (a[key] < b[key]) {
            return 1;
          }
          if (a[key] > b[key]) {
            return -1;
          }
          return 0;
        }
      });
      setPlus({
        ...plus,
        [key]: !plus[key],
      });
      return arr;
    });
    let changeflag=latestSignUp_flag
    switch (key) {
      case 'firstName':
        changeflag[0]=!changeflag[0];
        break;
      case 'role':
        changeflag[1]=!changeflag[1];
        break;
      case 'email':
        changeflag[2]=!changeflag[2];
        break;
      case 'phone':
        changeflag[3]=!changeflag[3];
        break;
      case 'userStatus':
        changeflag[4]=!changeflag[4];
        break;
      case 'assiginedTutors':
        changeflag[6]=!changeflag[6];
        break;
      case 'specialization':
        changeflag[7]=!changeflag[7];
        break;
      default:
        break;
    }
    setlatestsignup_flag(changeflag)
  };
  const sortByString2 = (key) => {
    setPopularServices((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (plus && plus[key]) {
          if (a[key] < b[key]) {
            return -1;
          }
          if (a[key] > b[key]) {
            return 1;
          }
          return 0;
        } else {
          if (a[key] < b[key]) {
            return 1;
          }
          if (a[key] > b[key]) {
            return -1;
          }
          return 0;
        }
      });
      return arr;
    });
  };
  const sortByString3 = (key) => {
    // setPopularServices((prev) => {
    //   let arr = [...prev];
    //   arr = arr.sort(function (a, b) {
    //     if (plus && plus[key]) {
    //       if (a[key] < b[key]) {
    //         return -1;
    //       }
    //       if (a[key] > b[key]) {
    //         return 1;
    //       }
    //       return 0;
    //     } else {
    //       if (a[key] < b[key]) {
    //         return 1;
    //       }
    //       if (a[key] > b[key]) {
    //         return -1;
    //       }
    //       return 0;
    //     }
    //   });
    //   setPlus({
    //     ...plus,
    //     [key]: !plus[key],
    //   });
    //   return arr;
    // });
  };
  const sortByType = () => {
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (plus && plus["role"]) {
          if (a.role < b.role) {
            return -1;
          }
          if (a.role > b.role) {
            return 1;
          }
          return 0;
        } else {
          if (a.role < b.role) {
            return 1;
          }
          if (a.role > b.role) {
            return -1;
          }
          return 0;
        }
      });

      return arr;
    });
    setPlus({
      ...plus,
      role: !plus?.role,
    });
  };
  const [plus, setPlus] = useState({});
  const sortByDate = () => {
    setUserData((prev) => {
      let arr = [...prev];
      arr = arr.sort(function (a, b) {
        if (plus && !plus["lastSignUp"]) {
          return new Date(b.lastSignUp) - new Date(a.lastSignUp);
        }
        return new Date(a.lastSignUp) - new Date(b.lastSignUp);
      });

      return arr;
    });
    setPlus({
      ...plus,
      lastSignUp: !plus?.lastSignUp,
    });
  };
  const star_client=[
    {
      id: 1,
      text: "Client Name",
      willDisplayDownArrow : null,
      onCick: () => {sortByString3("Client Name")
      let finalflag=star_client_flag
        finalflag[0]=!finalflag[0]
        setstar_client_flag(finalflag)},
      },   
    {
      id: 2,
      // willDisplayDownArrow : 0,
      text: "Code",
      willDisplayDownArrow : null,
      onCick: () => {sortByString3("Code")
      let finalflag=star_client_flag
        finalflag[1]=!finalflag[1]
        setstar_client_flag(finalflag)},
      },
    {
      id: 3,
      text: "Referrals",
      willDisplayDownArrow : null,
      onCick: () => {sortByString3("Referrals")
      let finalflag=star_client_flag
        finalflag[2]=!finalflag[2]
        setstar_client_flag(finalflag)},
      },
  ]
  const popular_Service=[
    {
      id: 1,
      text: "Service",
      willDisplayDownArrow : popular_Service_flag[0],
      onCick: () => {sortByString2("service")
      let finalflag=popular_Service_flag
        finalflag[0]=!finalflag[0]
        setpopular_Service_flag(finalflag)},
      },   
    {
      id: 2,
      // willDisplayDownArrow : 0,
      text: "Actively Using",
      willDisplayDownArrow : popular_Service_flag[1],
      onCick: () => {sortByString2("actively_using")
      let finalflag=popular_Service_flag
        finalflag[1]=!finalflag[1]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 3,
      text: "Total Used",
      willDisplayDownArrow : popular_Service_flag[2],
      onCick: () => {sortByString2("total_used")
      let finalflag=popular_Service_flag
        finalflag[2]=!finalflag[2]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 4,
      text: "Scheduled Hours",
      willDisplayDownArrow : popular_Service_flag[3],
      onCick: () => {sortByString2("scheduled_hours")
      let finalflag=popular_Service_flag
        finalflag[3]=!finalflag[3]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 5,
      text: "Completed Hours",
      willDisplayDownArrow : popular_Service_flag[4],
      onCick: () => {sortByString2("completed_hours")
      let finalflag=popular_Service_flag
        finalflag[4]=!finalflag[4]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 6,
      text: "% of Business",
      willDisplayDownArrow : popular_Service_flag[5],
      onCick: () => {sortByString2("percent_of_business")
      let finalflag=popular_Service_flag
        finalflag[5]=!finalflag[5]
        setpopular_Service_flag(finalflag)},
      },

  ]
  const latestSignUpHeaders = [
    {
      id: 1,
      text: "Full Name",
      className: "text-left pl-8",
      willDisplayDownArrow : latestSignUp_flag[0],
      onCick: () => sortByString("firstName"),
    },
    {
      id: 2,
      // willDisplayDownArrow : 0,
      text: "User Type",
      willDisplayDownArrow : latestSignUp_flag[1],
      onCick: () => sortByString("role"),
    },
    {
      id: 3,
      text: "Email",
      willDisplayDownArrow : latestSignUp_flag[2],
      onCick: () => sortByString("email"),
    },
    {
      id: 4,
      text: "Phone",
      willDisplayDownArrow : latestSignUp_flag[3],
      onCick: () => sortByString("phone"),
    },
    {
      id: 5,
      text: "Assigned Tutor",
      willDisplayDownArrow : latestSignUp_flag[4],
      onCick: () => sortByString("userStatus"),
    },
    {
      id: 6,
      text: "Lead Status",
      willDisplayDownArrow : latestSignUp_flag[5],
      onCick: () => {sortByString("userStatus")
    let finalflag=latestSignUp_flag
      finalflag[5]=!finalflag[5]
      setlatestsignup_flag(finalflag)},
    },
    {
      id: 7,
      text: "Tutor Status",
      willDisplayDownArrow : latestSignUp_flag[6],
      onCick: () => sortByString("assiginedTutors"),
    },
    {
      id: 8,
      text: "Services",
      willDisplayDownArr5ow : latestSignUp_flag[7],
      onCick: () => sortByString("specialization"),
    },
    {
      id: 9,
      text: "Date Added",
      willDisplayDownArrow : latestSignUp_flag[8],
      onCick: sortByDate,
    },
  ];
  console.log({ userData });
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
        console.log(res?.data?.all_services, "popular-services");
        setPopularServices(res?.data?.all_services);
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
        if (res?.data?.actions) setFilteredActionLog(res?.data?.actions);
        else {
          setFilteredActionLog([{ createdAt: body.startDate }]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const redirect = (item) => navigate(`/profile/${item.role}/${item._id}`);
 
  return (
    // <div className={styles.container}>
    <>
      {
        isSubscriptionAndExtensionModalActive ? (
          <div className="fixed bg-[#00000080] top-[-50px] left-0 right-0 bottom-[-50px] h-[130vh] z-[1000000]" style={{position: "fixed"}} >
            <SubscriptionAndExtensionModal
              className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4/6 w-9/12"
              OnCheckoutClicked={() => {
                SetIsSubscriptionAndExtensionModalActive(false);
              }}
            />
          </div>
        ) : (<></>)
      }
      <div className={`bg-#2E2E2E`} >
        

        <div className="mt-[50px] flex justify-center">
          <div className="w-[1601px]">
            <p className="text-[#24A3D9] text-[20px] font-normal">
              {organization?.company +
                "  >  " +
                firstName +
                "  " +
                lastName +
                "  >  "}
              <span className="font-semibold">Dashboard</span>
            </p>

            <div className="flex mt-[40px] justify-between items-center ">
              <p className="font-bold  text-[#FFA28D] text-base">
                BUSINESS OVERVIEW{" "}
              </p>

              <RangeDate
                optionClassName="!w-min"
                inputContainerClassName="!w-min "
                handleRangeData={handleRevenue}
              />
            </div>
          </div>
        </div>

        <section className="flex justify-center w-[1601px] mx-auto ">
          <div className={styles.mainBox}>
            <div className="grid grid-cols-2 px-[37.5px]">
              <div className={`${styles.gridBorder} my-auto `}>
                <div className="flex pr-[1.8vw] items-center  my-auto justify-between whitespace-nowrap">
                  <div className="w-[212.5px]  ">
                    <div className="flex justify-between items-center mb-[6px] text-[#26435F] text-sm">
                      <p className="font-medium text-[17.5px] text-[#26435F] leading-[21px]">
                        Completed Revenue
                      </p>
                      <div className="group relative">
                        <p>
                          <img
                            className="w-[18.46px] h-[18.75px]"
                            src={tooltip}
                            alt=""
                          />
                        </p>

                        <span className="absolute  -top-10 left-10 z-20 w-[333.3px]  rounded-[13px] bg-[rgba(0,0,0,0.80)] text-white  whitespace-normal py-5 px-3 scale-0 group-hover:scale-100">
                          <h3 className="text-[#22A699] text-base mb-3 font-medium ">
                            Completed Revenue
                          </h3>
                          <span className="font-light text-[13.3px]">
                            This value is calculated by adding up all the
                            revenue generated from sessions that have been
                            marked as “Completed” for the selected date range.
                            <br /> Note that the revenue is calculated by
                            multiplying a Tutor’s Service Rate by the Session
                            Duration and adding all those values up.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-[106.25px] justify-center rounded-md items-center bg-[#22A69933]  ${styles.boxBorder1px}`}
                    >
                      <p className="text-[#38C980] text-[30px] leading-9 font-bold">
                        ${cRevenue?.completedRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[212.5px] ">
                    <div className="flex justify-between rounded-md items-center mb-[6px] text-[#26435F] text-sm ">
                      <p className="font-medium text-[17.5px] text-[#26435F] leading-[21px]">
                        Leaked Revenue
                      </p>
                      <div className="group relative">
                        <p>
                          <img
                            className="w-[18.46px] h-[18.75px]"
                            src={tooltip}
                            alt=""
                          />
                        </p>
                        <span className="absolute  -top-10 left-10 z-20 w-[333.3px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)]  text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                          <h3 className="text-[#FF5175] text-base font-medium mb-3">
                            Leaked Revenue
                          </h3>
                          <span className="font-light text-[13.3px]">
                            This value is calculated by adding up all the
                            revenue lost from sessions that have been marked as
                            “Canceled” or “Partial” for the selected date range.
                            <br />
                            Note that the revenue is calculated by multiplying a
                            Tutor’s Service Rate by the Session Duration and
                            adding all those values up.
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-[106.25px] rounded-md justify-center items-center bg-[#FF797933]  ${styles.boxBorder2px}`}
                    >
                      <p className="text-[#FF7979] text-[30px] leading-9 font-semibold">
                        ${lRevenue?.canceledRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[212.5px] text-base-17-5">
                    <div className="flex justify-between items-center mb-[6px] text-[#26435F] text-sm">
                      <p className="font-medium text-[17.5px] text-[#26435F] leading-[21px]">
                        Impending Revenue
                      </p>
                      <div className="group relative">
                        <p>
                          <img
                            className="w-[18.46px] h-[18.75px]"
                            src={tooltip}
                            alt=""
                          />
                        </p>
                        <span className="absolute  -top-10 left-10 z-20 w-[333.3px]  scale-0 rounded-[13px] bg-[rgba(0,0,0,0.80)]  text-white group-hover:scale-100 whitespace-normal py-5 px-3">
                          <h3 className="text-[#7152EB] text-base font-medium mb-3">
                            Impending Revenue
                          </h3>
                          <span className="font-light text-[13.3px] ">
                            This value is calculated by adding up all the
                            revenue lost from sessions that have been marked as
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
                      className={`flex h-[106.25px] rounded-md justify-center items-center font-semibold bg-[#7152EB33]  ${styles.boxBorder3px}`}
                    >
                      <p className="text-[#7152EB] text-[30px] leading-9 font-semibold">
                        ${iRevenue?.impendingRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={` my-auto `}>
                <div className="flex pl-[1.8vw]  my-auto items-center  justify-between whitespace-nowrap">
                  <div className="w-[212.5px]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Unpaid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106.25px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[212.5px]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Paid Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106.25px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[212.5px]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Cancelled Invoices
                      </p>
                    </div>
                    <div
                      className={`h-[106.25px] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
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
            <div className=" w-[1500px] mt-[50px]">
              <div className=" h-[1px] bg-[#CBD6E2]"></div>
            </div>
          </div>
          <div className=" w-[1601px] text-[#FFA28D] mx-auto ">
            <div className="flex justify-between items-center mt-[52px] h-min py-0 mb-3 ">
              <p className="font-bold text-[20px] leading-6">USERS OVERVIEW </p>

              <div className="flex font-semibold text-[#FFA28D] text-xs">
                <RangeDate
                  optionClassName="!w-min"
                  inputContainerClassName="!w-min "
                  handleRangeData={handleUserStats}
                />
              </div>
            </div>
          </div>

          <div className="flex  w-[1601px] gap-x-5 mx-auto">
            <div className=" h-full  !whitespace-nowrap ">
              <p className="font-semibold text-[#26435F] mb-1 text-[20px]">
                User Stats
              </p>
              <div className={`${styles.sidebox} h-[330px] w-[312.5px] `}>
                <div className="w-[226px]">
                  <p className="text-[#26435F] text-md text-[20px] leading-6 font-normal">
                    Active / Total Students
                  </p>
                  <p className="text-md mt-2.5">
                    <span className="font-bold text-[#FFA28D] text-[37.5px] leading-[45px]">
                      {userStats?.student.activeUsers.count}
                      <span className="font-normal">
                        {" "}
                        {" / "}
                      </span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px] text-base-25">
                      {userStats
                        ? userStats?.student.activeUsers.count +
                          userStats?.student.inactiveUsers.count
                        : "Loading.."}
                    </span>
                  </p>
                </div>
                <div className={`w-[226px] pt-7 rounded`}>
                  <p className="text-[#26435F] text-md text-base-20">
                    Active / Total Tutor <span className="text-white">###</span>
                  </p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-[37.5px] leading-[45px]">
                      {userStats?.tutor.activeUsers.count}
                      <span className="font-normal">
                        {" "}
                        {" / "}
                      </span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px] text-base-25">
                      {userStats
                        ? userStats?.tutor.activeUsers.count +
                          userStats?.tutor.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
                <div className={`w-[226px] pt-7 rounded`}>
                  <p className="text-[#26435F] text-md text-base-20">
                    Active / Total Parents<span className="text-white">##</span>
                  </p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-[37.5px] leading-[45px]">
                      {userStats?.parent.activeUsers.count}
                      <span className="font-normal">
                        {" "}
                        {" / "}
                      </span>
                    </span>
                    <span className="text-[#24A3D9] text-[25px] text-base-25">
                      {userStats
                        ? userStats?.parent.activeUsers.count +
                          userStats?.parent.inactiveUsers.count
                        : "Loading..."}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="  pl-[17.5px]">
              <p className="font-semibold text-[#26435F] mb-1 text-[20px]">
                Action Log
              </p>
              <ActionLog
                width={"w-[1250px]"}
                actionLog={filteredActionLog ? filteredActionLog : [""]}
              />
            </div>
          </div>
        </section>

        <section className="mt-[70px] w-[1601px] mx-auto ">
          <p className="font-semibold text-[#26435F] text-[20px]">
            Latest Sign-Ups <span className="font-light">(Last 7 Days)</span>
          </p>

          <div className="mt-2">
            <Table
              data={userData}
              AdminLatestSignUp={true}
              noScrollbar={true}
              headerObject={true}
              belowBox={true}
              onClick={{
                redirect,
              }}
              belowBoxHeight="h-[192px]"
              belowBoxText="Invite Parents or Students"
              belowBoxLink="users"
              belowBoxIcon={userLogo}
              tableHeaders={latestSignUpHeaders}
              maxPageSize={5}
              widthFullTable={true}
            />
          </div>
        </section>
        <div className="flex justify-center">
          <div className=" w-[1500px] mt-[20px]">
            <div className=" h-[1px] bg-[#CBD6E2]"></div>
          </div>
        </div>
        <div className=" relative z-[50000] w-[1601px] mx-auto mt-[25px] text-[#26435F]">
          <div className=" relative z-[50000] flex justify-between items-center">
            <p className="font-bold uppercase text-[#FFA28D] mb-1 text-[20px] leading-6">
              Client Success Overview{" "}
            </p>

            <RangeDate
              optionClassName="!w-min"
              inputContainerClassName="!w-min "
              handleRangeData={handlePopularServices}
            />
          </div>
        </div>

        <section className="mt-[10px] mx-auto w-[1601px]">
          <div className="grid grid-cols-[1158.75px,441.25px]">
            <div className="relative">
              <p className="font-semibold text-[#26435F] text-[17.5px]">
                Popular Services
              </p>
              <div className="text-base-17-5 mt-2 pr-[32px]">
                <Table
                  dataFor="popularServices"
                  noScrollbar={true}
                  data={popularServices}
                  hidePagination={true}
                  headerObject={true}
                  tableHeaders={popular_Service}
                  belowBox={true}
                  belowBoxText="Add New Services"
                  belowBoxLink="settings"
                  belowBoxIcon={plusIcon}
                  belowBoxHeight="h-[168px]"
                  maxPageSize={5}
                  widthFullTable={true}
                  theadWidth={"w-[1126.25px]"}
                />
              </div>
            </div>
            <div className=" relative">
              <p className="pl-[32px] font-semibold text-[#26435F] text-[17.5px]">
                Star Clients
              </p>
              <div className="relative pl-[30px] mt-2">
                {/* <div
                  className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#E5E8EA]`}
                >
                  <p>Coming soon</p>
                </div> */}
                <Table
                  noArrow={false}
                  noScrollbar={true}
                  headerWidth="!px-1.5"
                  dummyRowStarClients={popularServices}
                  data={[]}
                  hidePagination={true}
                  tableHeaders={star_client}
                  headerObject={true}
                  maxPageSize={5}
                  belowBox={true}
                  belowBoxText="Add Referral Codes"
                  belowBoxLink="settings"
                  belowBoxIcon={plusIcon}
                  belowBoxHeight="h-[168px]"
                  widthFullTable={true}
                  theadWidth={"w-[411.25px]"}
                />
              </div>
              <div className="h-[90%] absolute bottom-0 left-0 bg-[#CBD6E2] top-[55%] transform -translate-y-1/2 w-px"></div>
            </div>
          </div>
        </section>

        <section className="mt-[37px] mx-auto w-[1601px]">
          <div className="grid grid-cols-2 gap-x-[105px]">
            <div className="flex  justify-between gap-x-[37.5px]  mt-2 text-sm text-[#26435F]">
              <div>
                <p className="font-semibold text-[17.5px] leading-[21px]">
                  Total # Of Referrals
                </p>
                <div
                  className={`mt-1 h-[72.5px] max-w-[245px] min-w-[245px] bg-[rgba(255,162,141,0.2)] ${styles.smallBox}`}
                >
                  <p className="text-[#FFA28D] h-full w-full justify-center font-bold text-[37.5px] flex items-center text-center">
                    {improvementStats?.no_of_referrals}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[17.5px] leading-[21px]">
                  Average SAT Improvement
                </p>
                <div
                  className={`mt-1 h-[72.5px] max-w-[245px] min-w-[245px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[37.5px] flex items-center text-center">
                    {improvementStats?.avg_sat_improvement
                      ? improvementStats?.avg_sat_improvement
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[17.5px] leading-[21px]">
                  Average ACT Improvement
                </p>
                <div
                  className={` mt-1 h-[72.5px] max-w-[245px] min-w-[245px] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[37.5px] flex items-center text-center">
                    {improvementStats?.avg_act_improvement
                      ? improvementStats?.avg_act_improvement
                      : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-end whitespace-nowrap   text-base-15 justify-between text-[#667085]">
              <div>
                <p className="leading-3">Average GRE Improvement</p>
                <div
                  className={`w-[217.5px] mt-2 h-[72.5px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p className="leading-3">Average GMAT Improvement</p>
                <div
                  className={`w-[217.5px] mt-2 h-[72.5px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p className="leading-3">Average IELTS Improvement</p>
                <div
                  className={`w-[217.5px] mt-2 h-[72.5px] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <div className=" w-[1500px] mt-[50px]">
            <div className=" h-[1px] bg-[#CBD6E2]"></div>
          </div>
        </div>
        <div className=" relative z-[50000] w-[1601px] mx-auto  mt-[13px] text-[#FFA28D] ">
          <div className=" relative z-[50000] flex justify-between items-center  translate-y-[15px] mb-[10px]">
            <p className="font-bold uppercase mb-1 text-base-17-5">
              Tutor Performance Overview{" "}
            </p>

            <RangeDate
              optionClassName="!w-min"
              inputContainerClassName="!w-min "
              handleRangeData={handleTutorPerformance}
            />
          </div>
        </div>

        <section className="mx-auto  w-[1601px]">
          <Table
            headerWidth="w-[150px] whitespace-normal !px-5"
            data={tutorPerformanceData}
            tableHeaders={tutorTableHeaders}
            maxPageSize={5}
            belowBox={true}
            belowBoxText="Invite Tutors"
            belowBoxLink="users"
            belowBoxIcon={userLogo}
            belowBoxHeight="h-[143px]"
            // customScrollBarClass={"scrollbar-content1"}
          />

          <div className="flex justify-center">
            <div className="mt-[36px] mb-[44px] bg-[#CBD6E2] h-[1px] w-[100px]"></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default React.memo(Dashboard);
