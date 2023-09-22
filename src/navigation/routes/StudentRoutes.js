import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import AssignedTests from "../../pages/AssignedTests/AssignedTests";
import Calendar from "../../pages/Calendar/Calendar";
import Login from "../../pages/Login/Login";
import StudentProfile from "../../pages/Profiles/StudentProfile/StudentProfile";
import TestDetail from "../../pages/TestDetail/TestDetail";

import { RequireAuth } from "../PrivateRoute";
import SetPassword from "../../pages/Frames/SetPassword/SetPassword";
import StudentDashboard from "../../pages/StudentDashboard/StudentDashboard";
import StartTest from "../../pages/StartTest/StartTest";
import ParentProfile from "../../pages/Profiles/ParentProfile/ParentProfile";
import TutorProfile from "../../pages/Profiles/Tutor/TutorProfile";
import StudentReport from "../../pages/StudentReport/StudentReport";
import AllOrgs from "../../pages/SuperadminDashboard/components/AllOrgs/AllOrgs";
import Footer from "../../components/Footer/Footer";
import Settings from "../../pages/Settings/Settings";
import SuperAdminSettings from "../../pages/Settings/SuperAdminSettings";
import SuperAdminProfile from "../../pages/SuperadminDashboard/components/About/About";
import EmailVerify from "../../pages/Settings/Tabs/AccountOverview/EmailVerify";
import StudentSettings from "../../pages/Settings/Tabs/AccountOverview/studentSettings";
import StudentTest from "../../pages/StudentTest/StudentTest";
import Home from "../../pages/Home/Home";



const StudentRoutes = () => {
   const { isLoggedIn } = useSelector((state) => state.user);
   const { role: persona } = useSelector((state) => state.user);

   return (
      <Routes>
         <Route path="/all-orgs" element={<AllOrgs />} />
         <Route path="/verify-email" element={<EmailVerify />} />
         <Route path="/orgadmin-profile/:id" element={<SuperAdminProfile />} />

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
                  <StudentTest />
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
                  <StudentProfile isOwn={true} />
               </RequireAuth>
            }
         />

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
            path="/settings"
            element={
               <RequireAuth isLoggedIn={isLoggedIn}>
                  {persona === "superAdmin" ? <SuperAdminSettings /> : persona === 'student' ? <StudentSettings /> : <Settings />}
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
      </Routes>
   );
};

export default StudentRoutes;
