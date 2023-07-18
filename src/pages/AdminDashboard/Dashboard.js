import React from "react";
import { useSelector } from "react-redux";
import SAdminNavbar2 from "../../components/sAdminNavbar/sAdminNavbar2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowDown19,
  faArrowDown91,
  faArrowRightFromBracket,
  faCaretDown,
  faDollar,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/images/Evallo.png";
import styles from "./style.module.css";
import image from "../../assets/images/Vector.png";
import image1 from "../../assets/images/Vector (1).png";
import image2 from "../../assets/images/Vector (2).png";
import image3 from "../../assets/images/Vector (3).png";
import image4 from "../../assets/images/Vector (4).png";
import image5 from "../../assets/images/Vector (5).png";
import image6 from "../../assets/images/Vector (6).png";
import AdminNavbar from "./AdminNavbar";
import Table from "../SuperadminDashboard/Table/table";
import ActionLog from "./ActionLog";
import { calculateDateRange } from "../../components/RangeDate/utils";
import {
  useGetAllRevenueMutation,
  useGetImpendingRevenueMutation,
  useGetLatestSignUpQuery,
  useGetLeakedRevenueMutation,
  useGetUserStatsQuery,
} from "../../app/services/adminDashboard";
import { latestSignUpHeaders, tutorTableHeaders } from "./staticData";
import { useState } from "react";
import RangeDate from "../../components/RangeDate/RangeDate";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: latestSignUp } = useGetLatestSignUpQuery();
  const { organization } = useSelector((state) => state.organization);
  const { firstName, lastName } = useSelector((state) => state.user);
  const { data: userStats } = useGetUserStatsQuery();
  const [startDate, setStartDate] = useState("");
  const [completedRevenue, completedRevenueStatus] = useGetAllRevenueMutation();
  const [leakedRevenue, leakedRevenueStatus] = useGetLeakedRevenueMutation();
  const [impendingRevenue, impendingRevenueStatus] =
    useGetImpendingRevenueMutation();
  const [cRevenue, setCRevenue] = useState("");
  const [lRevenue, setLRevenue] = useState("");
  const [iRevenue, setIRevenue] = useState("");

  const handleFetchRevenue = (fetchMutation, body, setValue) => {
    fetchMutation(body).then((res) => {
      setValue(res.data);
    });
  };
  const handleStartDate = (e) => {
    setStartDate(e);
  };
  useEffect(() => {
    if (startDate) {
      let startD = startDate.split("-")[0];
      startD = new Date(startD).toISOString().split("T")[0];
      let endD = startDate.split("-")[1];
      endD = new Date(endD).toISOString().split("T")[0];
      const body = { startDate: startD, endDate: endD };
      handleFetchRevenue(completedRevenue, body, setCRevenue);
      handleFetchRevenue(leakedRevenue, body, setLRevenue);
      handleFetchRevenue(impendingRevenue, body, setIRevenue);
    }
  }, [startDate]);

  return (
    <>
    </>
  );
};

export default Dashboard;
