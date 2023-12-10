import React from "react";
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
import SubscriptionAndExtensionModal from "../Frames/SubscriptionAndExtensionModal/SubscriptionAndExtensionModal";
import { useLazyGetAuthQuery, useLazyGetOrganizationQuery, useLazyGetPersonalDetailQuery } from "../../app/services/users";
import { BASE_URL } from "../../app/constants/constants";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [latestSignUp, latsestStatus] = useGetLatestSignUpRangeMutation();
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { data: userStats } = useGetUserStatsQuery();
  // const [] = useLazyGetPersonalDetailQuery();
  const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
  const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
  const [getAuth, getAuthResp] = useLazyGetAuthQuery();

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

  useEffect(() => {
    // return;
    /* getAuth()
    .then(data => {
      console.log("getAut");
      console.log(data);
    })
    .catch(error => {
      console.log("error in getAuth");
      console.log(error);
    }); */
  }, []);

  useEffect(() => {
    fetch("https://testapi.evallo.org/api/v1/auth/login/success", {
      method: "GET",
      credentials: "include",
    })
    .then(response => response.json())
    .then(data => {
      console.log("auth/login/success api");
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    })
    .catch(error => {
      console.log(error);
    })
  }, []);

  useEffect(() => {
    fetch("https://testapi.evallo.org/api/user?role=tutor", {
      method: "GET"
    })
    .then(response => response.json())
    .then(data => {
      console.log("tutor api");
      console.log(data);
    })
    .catch(error => {
      console.log(error);
    })
    .catch(error => {
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
  
  function sortByString2(key, ascending) {
    const sortOrder = ascending ? 1 : -1;
    const array = [...popularServices];
    array.sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
      console.log(aValue,bValue);
      if (aValue < bValue) {
        return -1 * sortOrder;
      } else if (aValue > bValue) {
        return 1 * sortOrder;
      } else {
        return 0;
      }
    })
    setPopularServices(array)
  }
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
    let finalflag=latestSignUp_flag
      finalflag[8]=!finalflag[8]
      setlatestsignup_flag(finalflag)
    setPlus({
      ...plus,
      lastSignUp: !plus?.lastSignUp,
    });
  };
  const star_client=[
    {
      id: 1,
      text: "Client Name",
      willDisplayDownArrow : popular_Service_flag[0],
      onCick: () => {sortByString3("Client Name")
      let finalflag=star_client_flag
        finalflag[0]=!finalflag[0]
        setstar_client_flag(finalflag)},
      },   
    {
      id: 2,
      willDisplayDownArrow : 0,
      text: "Code",
      willDisplayDownArrow : popular_Service_flag[1],
      onCick: () => {sortByString3("Code")
      let finalflag=star_client_flag
        finalflag[1]=!finalflag[1]
        setstar_client_flag(finalflag)},
      },
    {
      id: 3,
      text: "Referrals",
      willDisplayDownArrow : popular_Service_flag[2],
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
      onCick: () => {sortByString2("service",popular_Service_flag[0])
      let finalflag=popular_Service_flag
        finalflag[0]=!finalflag[0]
        setpopular_Service_flag(finalflag)},
      },   
    {
      id: 2,
      willDisplayDownArrow : 0,
      text: "Actively Using",
      willDisplayDownArrow : popular_Service_flag[1],
      onCick: () => {sortByString2("actively_using",popular_Service_flag[1])
      let finalflag=popular_Service_flag
        finalflag[1]=!finalflag[1]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 3,
      text: "Total Used",
      willDisplayDownArrow : popular_Service_flag[2],
      onCick: () => {sortByString2("total_used",popular_Service_flag[2])
      let finalflag=popular_Service_flag
        finalflag[2]=!finalflag[2]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 4,
      text: "Scheduled Hours",
      willDisplayDownArrow : popular_Service_flag[3],
      onCick: () => {sortByString2("scheduled_hours",popular_Service_flag[3])
      let finalflag=popular_Service_flag
        finalflag[3]=!finalflag[3]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 5,
      text: "Completed Hours",
      willDisplayDownArrow : popular_Service_flag[4],
      onCick: () => {sortByString2("completed_hours",popular_Service_flag[4])
      let finalflag=popular_Service_flag
        finalflag[4]=!finalflag[4]
        setpopular_Service_flag(finalflag)},
      },
    {
      id: 6,
      text: "% of Business",
      willDisplayDownArrow : popular_Service_flag[5],
      onCick: () => {sortByString2("percent_of_business",popular_Service_flag[5])
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
      willDisplayDownArrow : 0,
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
      onCick: () => sortByString("assiginedTutors"),
    },
    {
      id: 6,
      text: "Lead Status",
      willDisplayDownArrow : latestSignUp_flag[5],
      onCick: () => {sortByString("credits")
    let finalflag=latestSignUp_flag
      finalflag[5]=!finalflag[5]
      setlatestsignup_flag(finalflag)},
    },
    {
      id: 7,
      text: "Tutor Status",
      willDisplayDownArrow : latestSignUp_flag[6],
      onCick: () => sortByString("userStatus"),
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
  // console.log({ userData });
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
    <div className={styles.container}>

    {
      isSubscriptionAndExtensionModalActive ? (
        <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
          <SubscriptionAndExtensionModal
            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6 w-9/12"
            OnCheckoutClicked={() => {
              SetIsSubscriptionAndExtensionModalActive(false);
            }}
          />
        </div>
      ) : (<></>)
    }

      {/* <div className="fixed bg-[#00000080] top-0 left-0 right-0 bottom-0 z-[1000]" >
        <SubscriptionAndExtensionModal
          className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5/6 w-9/12"
        />
      </div> */}

      <div className=" mt-[28px] bg-#2E2E2E">
        <div className="mt-[50px] flex justify-center">
          <div className="w-[90vw]">
            <p className="text-[#24A3D9]  text-base-20">
              {organization?.company +
                "  >  " +
                firstName +
                "  " +
                lastName +
                "  >  "}
              <span className="font-semibold">Dashboard</span>
            </p>

            <div className="flex mt-[calc(40*0.050vw)] justify-between items-center ">
              <p className="font-bold  text-[#FFA28D] text-base-20">
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

        <section className="flex justify-center w-[90vw] mx-auto ">
          <div className={styles.mainBox}>
            <div className="grid grid-cols-2 px-[1.95vw] ">
              <div className={`${styles.gridBorder} my-auto `}>
                <div className="flex pr-[1.8vw] items-center  my-auto justify-between whitespace-nowrap">
                  <div className="w-[11.083vw]  ">
                    <div className="flex justify-between items-center mb-[6px] text-[#26435F] text-sm">
                      <p className="   font-medium text-base-17-5">
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
                      className={` !h-[calc(106*0.050vw)] flex justify-center rounded-md items-center text-[1.57vw] text-base-30 font-bold bg-[#22A69933]  ${styles.boxBorder1}`}
                    >
                      <p className="text-[#38C980]">
                        ${cRevenue?.completedRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[11.083vw] ">
                    <div className="flex justify-between rounded-md items-center mb-[6px] text-[#26435F] text-sm ">
                      <p className="font-medium text-base-17-5">
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
                      className={` !h-[calc(106*0.050vw)] flex rounded-md justify-center items-center text-[1.57vw] font-semibold bg-[#FF797933]  ${styles.boxBorder2}`}
                    >
                      <p className="text-[#FF7979]">
                        ${lRevenue?.canceledRevenue}
                      </p>
                    </div>
                  </div>
                  <div className="w-[11.083vw] text-base-17-5">
                    <div className="flex justify-between items-center mb-[6px] text-[#26435F] text-sm">
                      <p className="font-medium text-base-17-5">
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
                      className={` !h-[calc(106*0.050vw)] flex rounded-md justify-center items-center text-[1.57vw] font-semibold bg-[#7152EB33]  ${styles.boxBorder3}`}
                    >
                      <p className="text-[#7152EB]">
                        ${iRevenue?.impendingRevenue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={` my-auto `}>
                <div className="flex pl-[1.8vw]  my-auto items-center  justify-between whitespace-nowrap">
                  <div className="w-[11.083vw]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Unpaid Invoices
                      </p>
                    </div>
                    <div
                      className={` !h-[calc(106*0.050vw)] flex justify-center items-center rounded-5   shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[11.083vw]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Paid Invoices
                      </p>
                    </div>
                    <div
                      className={` !h-[calc(106*0.050vw)] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
                    >
                      <p>Coming soon</p>
                    </div>
                  </div>
                  <div className="w-[11.083vw]  text-base-17-5">
                    <div className="mb-[6px]">
                      <p className=" font-medium text-[#26435F80] mb-[5px]">
                        Cancelled Invoices
                      </p>
                    </div>
                    <div
                      className={` !h-[calc(106*0.050vw)] flex justify-center items-center rounded-5  shadow-box text-[#667085] bg-[#F5F8FA]`}
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
            <div className=" w-[85.125vw] !mt-[calc(50*0.050vw)]">
              <div className=" h-[1px] bg-[#CBD6E2]"></div>
            </div>
          </div>
          <div className=" w-[90vw]  text-[#FFA28D] mx-auto ">
            <div className="flex justify-between items-center !mt-[calc(30*0.050vw)] h-min py-0 mb-3 ">
              <p className="font-bold  text-base-20 ">USERS OVERVIEW </p>

              <div className="flex font-semibold text-[#FFA28D] text-xs">
                <RangeDate
                  optionClassName="!w-min"
                  inputContainerClassName="!w-min "
                  handleRangeData={handleUserStats}
                />
              </div>
            </div>
          </div>

          <div className="flex  w-[90vw] gap-x-5 mx-auto">
            <div className=" h-full  !whitespace-nowrap ">
              <p className=" mb-1 font-semibold text-[#26435F] mb-1 text-base-20">
                User Stats
              </p>
              <div className={`${styles.sidebox} h-[330px] w-[16.25vw] `}>
                <div className="   rounded ">
                  <p className="text-[#26435F] text-md text-base-20">
                    Active / Total Students
                  </p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl text-base-37-5">
                      {userStats?.student.activeUsers.count}
                      <span className="font-medium text-base-37-5">
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
                <div className={`   pt-7 rounded `}>
                  <p className="text-[#26435F] text-md text-base-20">
                    Active / Total Tutor <span className="text-white">###</span>
                  </p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl text-base-37-5">
                      {userStats?.tutor.activeUsers.count}
                      <span className="font-medium text-base-37-5">
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
                <div className={`   pt-7 rounded`}>
                  <p className="text-[#26435F] text-md text-base-20">
                    Active / Total Parents<span className="text-white">##</span>
                  </p>
                  <p className="text-md">
                    <span className="font-bold text-[#FFA28D] text-4xl text-base-37-5">
                      {userStats?.parent.activeUsers.count}
                      <span className="font-medium text-base-37-5">
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
              <p className="mb-1 font-semibold text-[#26435F] text-base-20  ">
                Action Log
              </p>
              <ActionLog
                className={"w-[71.1042vw]"}
                actionLog={filteredActionLog ? filteredActionLog : [""]}
              />
            </div>
          </div>
        </section>

        <section className="mt-[70px] w-[90vw] mx-auto ">
          <p className="font-semibold text-[#26435F]  text-base-20">
            Latest Sign-Ups <span className="font-light">(Last 7 Days)</span>
          </p>
          <div className="-mt-3">
            <Table
              data={userData}
              AdminLatestSignUp={true}
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
            />
          </div>
        </section>
        <div className="flex justify-center">
          <div className=" w-[85.125vw] !mt-[calc(43*0.050vw)]">
            <div className=" h-[1px] bg-[#CBD6E2]"></div>
          </div>
        </div>
        <div className=" relative z-[50000] w-[90vw] mx-auto mt-[25px] text-[#26435F]">
          <div className=" relative z-[50000] flex justify-between items-center translate-y-[10px] ">
            <p className="font-bold uppercase text-[#FFA28D] mb-1 text-base-20">
              Client Success Overview{" "}
            </p>

            <RangeDate
              optionClassName="!w-min"
              inputContainerClassName="!w-min "
              handleRangeData={handlePopularServices}
            />
          </div>
        </div>

        <section className="mt-[10px] mx-auto w-[90vw]">
          <div className="grid grid-cols-[67vw,24vw]">
            <div className="">
              <p className="font-semibold text-[#26435F] mt-3  text-base-17-5">
                Popular Services
              </p>
              <div className=" pr-[1.5625vw]  text-base-17-5 -mt-3">
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
                />
              </div>
            </div>
            <div className=" relative">
              <p className="pl-[1.5625vw] translate-y-[10px] font-semibold text-[#26435F] text-[17.5px] text-base-17-5">
                Star Clients
              </p>
              <div className="pl-[1.5625vw]  relative">
                {/* <div
                  className={`h-[85px] flex justify-center items-center text-sm text-[#667085] bg-[#E5E8EA]`}
                >
                  <p>Coming soon</p>
                </div> */}
                <Table
                  noArrow={false}
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
                />
              </div>
              <div className="h-[90%] absolute bottom-0 left-0 bg-[#CBD6E2] top-[55%] transform -translate-y-1/2 w-px"></div>
            </div>
          </div>
        </section>

        <section className="mt-[37px] mx-auto w-[90vw]">
          <div className="grid grid-cols-2 gap-x-[5.46875vw]">
            <div className="flex  justify-between gap-x-[1.953125vw]  mt-2 text-sm text-[#26435F]">
              <div>
                <p className="font-semibold text-base-17-5">
                  Total # Of Referrals
                </p>
                <div
                  className={`mt-1  h-[72px] !h-[calc(75*0.050vw)] bg-[rgba(255,162,141,0.2)] ${styles.smallBox}`}
                >
                  <p className="text-[#FFA28D] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
                    {improvementStats?.no_of_referrals}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-base-17-5">
                  Average SAT Improvement
                </p>
                <div
                  className={` mt-1 h-[72px] !h-[calc(75*0.050vw)] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
                    {improvementStats?.avg_sat_improvement
                      ? improvementStats?.avg_sat_improvement
                      : 0}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-base-17-5">
                  Average ACT Improvement
                </p>
                <div
                  className={` mt-1 h-[72px] !h-[calc(75*0.050vw)] bg-[rgba(36,163,217,0.2)]  ${styles.smallBox3}`}
                >
                  <p className="text-[#24A3D9] h-full w-full justify-center font-bold text-[1.953125vw] flex items-center text-center">
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
                  className={`w-[11.328125vw] mt-2 h-[72px] !h-[calc(75*0.050vw)] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average GMAT Improvement</p>
                <div
                  className={`w-[11.328125vw] mt-2 h-[72px] !h-[calc(75*0.050vw)] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
              <div>
                <p>Average IELTS Improvement</p>
                <div
                  className={`w-[11.328125vw] mt-2 h-[72px] !h-[calc(75*0.050vw)] ${styles.smallBox2} flex items-center justify-center font-medium`}
                >
                  <p>Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <div className=" w-[85.125vw] !mt-[calc(60*0.050vw)]">
            <div className=" h-[1px] bg-[#CBD6E2]"></div>
          </div>
        </div>
        <div className=" relative z-[50000] w-[90vw] mx-auto  mt-[13px] text-[#FFA28D] ">
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

        <section className="mx-auto  w-[90vw]">
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
