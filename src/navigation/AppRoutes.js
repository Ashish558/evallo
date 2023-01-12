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
import Settings from "../pages/Settings/Settings";
import StartTest from "../pages/StartTest/StartTest";
import AssignedStudents from "../pages/AssignedStudents/assignedStudents";
import ParentProfile from "../pages/Profiles/ParentProfile/ParentProfile";
import TutorProfile from "../pages/Profiles/Tutor/TutorProfile";
import Invoice from "../pages/Invoice/Invoice";
import { useEffect } from "react";
import StudentReport from "../pages/StudentReport/StudentReport";

const PrivateRoutes = [
   {
      el: Calendar,
      path: "/calendar",
   },
   {
      el: Users,
      path: "/users",
   },
   {
      el: Calendar,
      path: "/calendar/:persona",
   },
   {
      el: Calendar,
      path: "/calendar",
   },
   {
      el: Calendar,
      path: "/calendar",
   },
   {
      el: Calendar,
      path: "/calendar",
   },
];

const AppRoutes = () => {
   const { isLoggedIn } = useSelector((state) => state.user);
   const {role : persona} = useSelector(state => state.user)
   
   return (
      <BrowserRouter>
         <Navbar />
         <Routes>
            <Route
               path="/"
               element={
                  isLoggedIn ? (
                     <Home />
                  ) : (
                     <Login  />
                  )
               }
            />
            <Route
               path="/signup"
               element={
                  <Signup  />
               }
            />

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
            <Route
               path="/set-password"
               element={
                  <SetPassword  />
               }
            />
            <Route
               path="/reset-password"
               element={
                  <SetPassword resetPassword={true} />
               }
            />
            <Route
               path="/assigned-tests/:id/report"
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
                     {persona === 'parent' ?
                        <ParentProfile isOwn={true} /> :
                        persona === 'student' ?
                           <StudentProfile isOwn={true} /> :
                           persona === 'tutor' ? <TutorProfile isOwn={true} /> : <></>}
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
               path="/settings"
               element={
                  <RequireAuth isLoggedIn={isLoggedIn}>
                     <Settings />
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
               path="/all-tests/start-section/:id"
               element={
                  <RequireAuth isLoggedIn={isLoggedIn}>
                     <StartTest />
                  </RequireAuth>
               }
            />

            {/* <Route
                  path="/profile"
                  element={
                     <RequireAuth isLoggedIn={isLoggedIn}>
                        <Profile  />
                     </RequireAuth>
                  }
               /> */}
         </Routes>
      </BrowserRouter>
   );
};

export default AppRoutes;
