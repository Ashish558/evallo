
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import AllTests from "../pages/AllTests/AllTests";
import AssignedTests from "../pages/AssignedTests/AssignedTests";
import Calendar from "../pages/Calendar/Calendar";
import CompletedTest from "../pages/CompletedTest/CompletedTest";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import StudentProfile from "../pages/Profiles/StudentProfile/StudentProfile";
import TestDetail from "../pages/TestDetail/TestDetail";
import Users from "../pages/Users/users";

import { RequireAuth } from "./PrivateRoute";
import ParentDashboard from "./../pages/ParentDashboard/ParentDashboard";
import SetPassword from "../pages/Frames/SetPassword/SetPassword";
import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import Ledger from "../pages/Ledger/Ledger";
import StartTest from "../pages/StartTest/StartTest";
import AssignedStudents from "../pages/AssignedStudents/assignedStudents";
import ParentProfile from "../pages/Profiles/ParentProfile/ParentProfile";
import TutorProfile from "../pages/Profiles/Tutor/TutorProfile";
import Invoice from "../pages/Invoice/Invoice";
import { useEffect } from "react";
import StudentReport from "../pages/StudentReport/StudentReport";
import AssignedTutors from "../pages/AssignedTutors/AssignedTutors";
import SuperadminDashboard from "../pages/SuperadminDashboard/SuperadminDashboard";
import UserSignup from "../pages/UserSignup/Signup";
import Dashboard from "../pages/AdminDashboard/Dashboard";
import AdminContent from "../pages/AdminContent/AdminContent";
import AllOrgs from "../pages/SuperadminDashboard/components/AllOrgs/AllOrgs";
import Footer from "../components/Footer/Footer";
import Settings from "../pages/Settings/Settings";
import SuperAdminSettings from "../pages/Settings/SuperAdminSettings";
import SuperAdminProfile from "../pages/SuperadminDashboard/components/About/About";
import EmailVerify from "../pages/Settings/Tabs/AccountOverview/EmailVerify";
import StudentSettings from "../pages/Settings/Tabs/AccountOverview/studentSettings";

import TutorSetting from "../pages/Settings/TutorSetting";
import ContributorSettings from "../pages/Settings/ContributorSettings";
import TestPage from "../pages/DsatTestPage/TestPage";
import AnnotatorComponent from "../components/annotate";
import Testinstruction_2 from "../components/TestItem/testinstruction_2";




const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { role: persona } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/dashboard" element={<SuperadminDashboard />} />
        <Route path="/all-orgs" element={<AllOrgs />} />
        <Route path="/verify-email" element={<EmailVerify />} />
        <Route path="/orgadmin-profile/:id" element={<SuperAdminProfile />} />
        <Route
          path="/users"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Users />
            </RequireAuth>
          }
        />
        <Route
          path="/invoice"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Invoice />
            </RequireAuth>
          }
        />
        <Route
          path="/assigned-tutors"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <AssignedTutors />
            </RequireAuth>
          }
        />

        <Route
          path="/calendar"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Calendar />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/edit/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Calendar />
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/:persona"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Calendar />
            </RequireAuth>
          }
        />
        {/* <Route path="/calendar/:persona" element={<Calendar />} /> */}
        <Route
          path="/assigned-tests"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <AssignedTests />
            </RequireAuth>
          }
        />
        <Route path="/set-password" element={<SetPassword />} />
        <Route
          path="/reset-password"
          element={<SetPassword resetPassword={true} />}
        />
        {/* <Route
               path="/assigned-tests/:id/:assignedTestId/report"
               element={
                  <RequireAuth isLoggedIn={isLoggedIn}>
                     <StudentReport />
                  </RequireAuth>
               }
            /> */}
        <Route
          path="/assigned-tests/:id/:assignedTestId/report"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <StudentReport />
            </RequireAuth>
          }
        />
        <Route
          path="/assigned-tests/:id/:assignedTestId/report/:studentId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <StudentReport />
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <AllTests />
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <TestDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              {persona === "parent" ? (
                <ParentProfile isOwn={true} />
              ) : persona === "student" ? (
                <StudentProfile isOwn={true} />
              ) : persona === "tutor" ? (
                <TutorProfile isOwn={true} />
              ) : (
                <></>
              )}
            </RequireAuth>
          }
        />
        {/* <Route path="/profile" element={
               persona === 'parent' ? <ParentProfile isOwn={true} /> : persona === 'student' ? <StudentProfile isOwn={true} /> : persona === 'tutor' ? <TutorProfile isOwn={true} /> : <></>
            } /> */}

        <Route
          path="/profile/student/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <StudentProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/parent/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <ParentProfile />
            </RequireAuth>
          }
        />
        <Route
          path="/profile/tutor/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <TutorProfile />
            </RequireAuth>
          }
        />

        <Route
          path="/ledger"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Ledger />
            </RequireAuth>
          }
        />
         <Route
          path="/testpage/:id/:assignedTestId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
             <TestPage/>
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>

              {(persona === "superAdmin" || persona === 'manager') ?
                <SuperAdminSettings /> : persona === 'student' || persona === 'parent' || persona === 'tutor'
                  ? <StudentSettings /> : persona === 'contributor' ?
                    <ContributorSettings /> : <Settings />}

            </RequireAuth>
          }
        />
        <Route
          path="/assigned-students"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <AssignedStudents />
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests/start-section/:id/:assignedTestId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <StartTest />
            </RequireAuth>
          }
        />
        <Route path="/adminDashboard" element={<Dashboard></Dashboard>}></Route>
        <Route
          path="/adminContent"
          element={<AdminContent></AdminContent>}
        ></Route>
        {/* <Route
                  path="/profile"
                  element={
                     <RequireAuth isLoggedIn={isLoggedIn}>
                        <Profile  />
                     </RequireAuth>
                  }
               /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default AppRoutes;
