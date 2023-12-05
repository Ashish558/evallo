import React, { Suspense, lazy, useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { RequireAuth } from "./PrivateRoute";
import Footer from "../components/Footer/Footer"
import Layout from "../pages/Layout/Layout";
import Layout2 from "../pages/Layout/Layout2";


const AllTests = lazy(() => import("../pages/AllTests/AllTests"));
const AssignedTests = lazy(() => import("../pages/AssignedTests/AssignedTests"));
const Calendar = lazy(() => import("../pages/Calendar/Calendar"));
const Home = lazy(() => import("../pages/Home/Home"));
const Login = lazy(() => import("../pages/Login/Login"));
const Signup = lazy(() => import("../pages/Signup/Signup"));
const StudentProfile = lazy(() => import("../pages/Profiles/StudentProfile/StudentProfile"));
const TestDetail = lazy(() => import("../pages/TestDetail/TestDetail"));
const Users = lazy(() => import("../pages/Users/users"));
const SetPassword = lazy(() => import("../pages/Frames/SetPassword/SetPassword"));
const Ledger = lazy(() => import("../pages/Ledger/Ledger"));
const StartTest = lazy(() => import("../pages/StartTest/StartTest"));
const AssignedStudents = lazy(() => import("../pages/AssignedStudents/assignedStudents"));
const ParentProfile = lazy(() => import("../pages/Profiles/ParentProfile/ParentProfile"));
const TutorProfile = lazy(() => import("../pages/Profiles/Tutor/TutorProfile"));
const Invoice = lazy(() => import("../pages/Invoice/Invoice"));
const StudentReport = lazy(() => import("../pages/StudentReport/StudentReport"));
const AssignedTutors = lazy(() => import("../pages/AssignedTutors/AssignedTutors"));
const SuperadminDashboard = lazy(() => import("../pages/SuperadminDashboard/SuperadminDashboard"));
const UserSignup = lazy(() => import("../pages/UserSignup/Signup"));
const Dashboard = lazy(() => import("../pages/AdminDashboard/Dashboard"));
const AdminContent = lazy(() => import("../pages/AdminContent/AdminContent"));
const AllOrgs = lazy(() => import("../pages/SuperadminDashboard/components/AllOrgs/AllOrgs"));

const Settings = lazy(() => import("../pages/Settings/Settings"));
const SuperAdminSettings = lazy(() => import("../pages/Settings/SuperAdminSettings"));
const SuperAdminProfile = lazy(() => import("../pages/SuperadminDashboard/components/About/About"));
const EmailVerify = lazy(() => import("../pages/Settings/Tabs/AccountOverview/EmailVerify"));
const StudentSettings = lazy(() => import("../pages/Settings/Tabs/AccountOverview/studentSettings"));
const ContributorSettings = lazy(() => import("../pages/Settings/ContributorSettings"));
const TestPage = lazy(() => import("../pages/DsatTestPage/TestPage"));
const AnnotatorComponent = lazy(() => import("../components/annotate"));
const Testinstruction_2 = lazy(() => import("../components/TestItem/testinstruction_2"));
const AdminPortal = lazy(() => import("../pages/SuperadminDashboard/components/About/AdminPortal"));
const OrgAdminSignup = lazy(() => import("../pages/OrgAdminSignup/OrgAdminSignup"));
// Lazy-load your components

//  layout page

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const { role: persona } = useSelector((state) => state.user);


  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Layout2>
      <Routes>
        <Route path="/" element={<Suspense fallback={<div>Loading...</div>}>{isLoggedIn ? <Home /> : <Login />}</Suspense>}/>

{/*  layout routes */}
        <Route
          path="/Layout"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Layout />
            </RequireAuth>
          }
        />

        <Route path="/signup" element={<Suspense fallback={<div>Loading...</div>}><OrgAdminSignup /></Suspense>} />
        <Route path="/admin-portal" element={<AdminPortal />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route
          path="/"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              {persona === "superAdmin" || persona === "manager" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <SuperadminDashboard />
                </Suspense>
              ) : (
                <Suspense fallback={<div>Loading...</div>}>
                  <Home />
                </Suspense>
              )}
            </RequireAuth>
          }
        />
        <Route path="/all-orgs" element={
          <Suspense fallback={<div>Loading...</div>}>
            <AllOrgs />
          </Suspense>
        } />
        <Route path="/verify-email" element={
          <Suspense fallback={<div>Loading...</div>}>
            <EmailVerify />
          </Suspense>
        } />
        <Route path="/orgadmin-profile/:id" element={
          <Suspense fallback={<div>Loading...</div>}>
            <SuperAdminProfile />
          </Suspense>
        } />
        <Route
          path="/users"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Users />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/invoice"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Invoice />
              </Suspense>
            </RequireAuth>
          }
        />
        {/* <Route
          path="/assigned-tutors"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <AssignedTutors />
            </RequireAuth>
          }
        /> */}

        <Route
          path="/calendar"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Calendar />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/edit/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Calendar />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/calendar/:persona"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Calendar />
              </Suspense>
            </RequireAuth>
          }
        />
        {/* <Route path="/calendar/:persona" element={<Calendar />} /> */}
        <Route
          path="/assigned-tests"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <AssignedTests />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route path="/set-password" element={
          <Suspense fallback={<div>Loading...</div>}>
            <SetPassword />
          </Suspense>
        } />
        <Route
          path="/reset-password"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <SetPassword resetPassword={true} />
            </Suspense>
          }
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
              <Suspense fallback={<div>Loading...</div>}>
                <StudentReport />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/assigned-tests/:id/:assignedTestId/report/:studentId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <StudentReport />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <AllTests />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <TestDetail />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              {persona === "parent" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <ParentProfile isOwn={true} />
                </Suspense>
              ) : persona === "student" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <StudentProfile isOwn={true} />
                </Suspense>
              ) : persona === "tutor" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <TutorProfile isOwn={true} />
                </Suspense>
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
              <Suspense fallback={<div>Loading...</div>}>
                <StudentProfile />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/profile/parent/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <ParentProfile />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/profile/tutor/:id"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <TutorProfile />
              </Suspense>
            </RequireAuth>
          }
        />

        <Route
          path="/ledger"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <Ledger />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/testpage/:id/:assignedTestId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <TestPage />
              </Suspense>
            </RequireAuth>
          }
        />

        <Route
          path="/settings"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              {persona === "superAdmin" || persona === "manager" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <SuperAdminSettings />
                </Suspense>
              ) : persona === "student" ||
                persona === "parent" ||
                persona === "tutor" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <StudentSettings />
                </Suspense>
              ) : persona === "contributor" ? (
                <Suspense fallback={<div>Loading...</div>}>
                  <ContributorSettings />
                </Suspense>
              ) : (
                <Suspense fallback={<div>Loading...</div>}>
                  <Settings />
                </Suspense>
              )}
            </RequireAuth>
          }
        />
        <Route
          path="/assigned-students"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <AssignedStudents />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route
          path="/all-tests/start-section/:id/:assignedTestId"
          element={
            <RequireAuth isLoggedIn={isLoggedIn}>
              <Suspense fallback={<div>Loading...</div>}>
                <StartTest />
              </Suspense>
            </RequireAuth>
          }
        />
        <Route path="/ll" element={
          <Suspense fallback={<div>Loading...</div>}>
            <AnnotatorComponent />
          </Suspense>
        } />
        <Route path="/adminDashboard" element={
          <Suspense fallback={<div>Loading...</div>}>
            <Dashboard />
          </Suspense>
        }></Route>
        <Route
          path="/adminContent"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <AdminContent />
            </Suspense>
          }
        ></Route>
      </Routes>
      </Layout2>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default AppRoutes;
