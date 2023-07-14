import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import ParentDashboard from "../ParentDashboard/ParentDashboard";
import StudentDashboard from "../StudentDashboard/StudentDashboard";
import TutorDashboard from "../TutorDashboard/TutorDashboard";
import Users from "../Users/users";
import AllOrgs from "../SuperadminDashboard/components/AllOrgs/AllOrgs";
import SuperadminDashboard from "../SuperadminDashboard/SuperadminDashboard";
const Dashboard = React.lazy(() => import("../AdminDashboard/Dashboard"));

export default function Home() {
  const { role: persona } = useSelector((state) => state.user);

  return (
    <>
      {persona === "parent" ? (
        <ParentDashboard />
      ) : persona === "student" ? (
        <StudentDashboard />
      ) : persona === "tutor" ? (
        <TutorDashboard />
      ) : persona === "admin" ? (
        <Suspense fallback={<div> Please Wait... </div>}>
          <Dashboard />
        </Suspense>
      ) : persona === "superAdmin" ? (
        <SuperadminDashboard />
      ) : (
        <div className="ml-pageLeft bg-lightWhite min-h-screen"></div>
      )}
    </>
  );
}
