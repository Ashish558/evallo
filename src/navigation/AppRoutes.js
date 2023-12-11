import React, { Suspense, lazy, useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import { RequireAuth } from "./PrivateRoute";
import Footer from "../components/Footer/Footer"
import Layout from "../pages/Layout/Layout";
import Layout2 from "../pages/Layout/Layout2";
import SubscriptionAndExtensionModal from "../pages/Frames/SubscriptionAndExtensionModal/SubscriptionAndExtensionModal";
import { useLazyGetAuthQuery, useLazyGetOrganizationQuery, useLazyGetPersonalDetailQuery } from "../app/services/users";
import { 
  closeModal as closeSubscriptionAndExtensionModal, 
  openModal as openSubscriptionAndExtensionModal, 
  openSubscriptionPanelInRenewProductMode } from "../app/slices/subscriptionUI";
import { 
  triggerSubscriptionUpdate, 
  updateActiveExtensionInfo, 
  updateActiveSubscriptionInfo, 
  updatePaymentMethods, 
  updateStripeCustomerId, 
  updateSubscriptionsInfoFromAPI, 
  updateHasSubscriptionExpired, 
  updateDefaultPaymentMethodId,
  updateHasExtensionExpired} from "../app/slices/subscription";
import { useLazyGetSubscriptionsInfoQuery } from "../app/services/orgSignup";


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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.user);
  const { 
    isActive: isSubscriptionAndExtensionModalActive , 
    isInUpdateMode: isSubscriptionAndExtensionModalInUpateMode ,
    isInRenewProductMode: isSubscriptionAndExtensionModalInRenewProductMode,
    openSubscriptionPanel,
    openExtensionsPanel,
  } = useSelector((state) => state.subscriptionUI);
  const {
    subscriptionsInfoFromAPI,
    activeSubscriptionInfo,
    activeExtensionInfo,
    subscriptionUpdateTrigger,
    hasSubscriptionExpired,
  } = useSelector((state) => state.subscription);
  const { role: persona } = useSelector((state) => state.user);
  const [isOrgAdmin, SetIsOrgAdmin] = useState(false);
  // const [isSubscriptionAndExtensionModalActive, SetIsSubscriptionAndExtensionModalActive] = useState(false);
  const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
  const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
  const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();

  function fetchSubscriptionsInfo() {
    getSubscriptionsInfo().then((res) => {
      console.log("Subscriptions info");
      console.log(res.data)
      dispatch(updateSubscriptionsInfoFromAPI(res.data.data));
      // SetSubscriptionsInfoFromAPI(res.data.data);
    }).catch((error) => {
      console.error("Error while fetching subscriptions info")
      console.error(error)
    })
  }

  useEffect(() => {
    if(persona === "parent" || persona === "student" || persona === "tutor" || 
       persona === "contributor" || persona === "superAdmin" || persona === "manager") {
        SetIsOrgAdmin(false);
        return;
    }

    SetIsOrgAdmin(true);
  }, [persona]);

  useEffect(() => {
    if(persona === "parent" || persona === "student" || persona === "tutor" || 
       persona === "contributor" || persona === "superAdmin" || persona === "manager") {
        return;
    }

    if(subscriptionsInfoFromAPI && subscriptionsInfoFromAPI.length > 0) return;
    fetchSubscriptionsInfo();
  }, [persona, subscriptionsInfoFromAPI]);

  function loadOrgDetails() {
    getPersonalDetail()
    .then(data => {
      console.log("getPersonalDetail");
      console.log(data);
      const user = data.data.data.user;

      getOrgDetails(user.associatedOrg)
      .then(data => {
        console.log("getOrgDetails - attempt with associatedOrg");
        console.log(data);
        if(data?.data?.stripeCustomerDetails?.invoice_settings?.default_payment_method) {
          dispatch(updateDefaultPaymentMethodId(data.data.stripeCustomerDetails.invoice_settings.default_payment_method));
        }

        if(data?.data?.stripeCustomerDetails?.id) {
          dispatch(updateStripeCustomerId(data.data.stripeCustomerDetails.id));
        }

        if(data?.data?.stripeCustomerPaymentDetails) {
          console.log("data?.data?.stripCustomerPaymentDetails - ");
          console.log(data?.data?.stripeCustomerPaymentDetails);
          dispatch(updatePaymentMethods(data.data.stripeCustomerPaymentDetails.data));
          // SetPaymentMethods(data.data.stripCustomerPaymentDetails.data);
        }

        if(data?.data?.customerSubscriptions?.data?.length === 0) {
          dispatch(openSubscriptionAndExtensionModal());
        } else {
          dispatch(closeSubscriptionAndExtensionModal());
        }

        let foundSubscription = false;
        if(data?.data?.customerSubscriptions?.data?.length > 0 && subscriptionsInfoFromAPI?.length > 0) {
          const products = data.data.customerSubscriptions.data;
          let activeSub;
          const todayDate = new Date();
          for(let i = 0; i < products.length; i++) {
            let planId = products[i].plan.id;
            activeSub = subscriptionsInfoFromAPI.find(item => item.id === planId);
            if(products[i].metadata.type === "extension") {
              let productQuantity = 0;
              if(activeSub.lookup_key === "p1") {
                  productQuantity = 100;
              }
              if(activeSub.lookup_key === "p2") {
                  productQuantity = 400;
              }
              if(activeSub.lookup_key === "p3") {
                  productQuantity = 1500;
              }
              if(activeSub.lookup_key === "p4") {
                  productQuantity = Infinity;
              }

              const expiryDate = new Date(products[i].current_period_end * 1000);
              const isCancelled = products[i].canceled_at === null || products[i].canceled_at === undefined ? false : true;

              dispatch(updateHasExtensionExpired(expiryDate < todayDate ? true : false));
              dispatch(updateActiveExtensionInfo({
                  planName: "Assignment",
                  planDisplayName: "Assignement",
                  productQuantity: productQuantity,
                  packageName: activeSub.lookup_key,
                  currency: products[i].currency,
                  startDate: products[i].start_date * 1000,//new Date(products[i].start_date * 1000),
                  autoRenewalDate: products[i].current_period_end * 1000,//new Date(products[i].current_period_end * 1000),
                  expiryDate: products[i].current_period_end * 1000,//expiryDate,
                  subscriptionPricePerMonth: products[i].plan.amount / 100,
                  monthlyCostAfterDiscount: products[i].plan.amount / 100,
                  freeTrialExpiryDate: products[i].trial_end * 1000,//new Date(products[i].trial_end * 1000),
                  hasExpired: expiryDate < todayDate,
                  isCancelled: isCancelled,
                  priceObject: products[i].items?.data[0]?.price,
                  subscriptionId: products[i].id,
              }));

              continue;
            }

            foundSubscription = true;
            const expiryDate = new Date(products[i].current_period_end * 1000);
            const isCancelled = products[i].canceled_at === null || products[i].canceled_at === undefined ? false : true;
            const subscriptionPricePerMonth = activeSub.unit_amount / 100;
            let monthlyCostAfterDiscount = subscriptionPricePerMonth;
            if(products[i]?.discount?.coupon) {
              monthlyCostAfterDiscount = subscriptionPricePerMonth - products[i]?.discount?.coupon?.percent_off / 100.0 * subscriptionPricePerMonth;
            }

            if(expiryDate < todayDate) {
              navigate("/settings");
              dispatch(openSubscriptionPanelInRenewProductMode());
              dispatch(updateHasSubscriptionExpired(true));
              continue;
            }

            dispatch(updateHasSubscriptionExpired(false));

            dispatch(updateActiveSubscriptionInfo({
              planName: activeSub.product.name,
              planDisplayName: activeSub.product.name,
              activeTutorsAllowed: products[i].metadata.active_tutors,
              currency: activeSub.currency,
              subscriptionPricePerMonth: subscriptionPricePerMonth,//activeSub.unit_amount / 100,
              monthlyCostAfterDiscount: monthlyCostAfterDiscount,//activeSub.unit_amount / 100,
              startDate: products[i].start_date * 1000,//new Date(products[i].start_date * 1000),
              autoRenewalDate: products[i].current_period_end * 1000,//new Date(products[i].current_period_end * 1000),
              expiryDate: products[i].current_period_end * 1000,//expiryDate,
              freeTrialExpiryDate: products[i].trial_end * 1000,//new Date(products[i].trial_end * 1000),
              hasExpired: expiryDate < todayDate,
              isCancelled: isCancelled,
              priceObject: products[i].items?.data[0]?.price,
              subscriptionId: products[i].id,
            }));

            
          }
        }

        if(!foundSubscription) {
          dispatch(openSubscriptionAndExtensionModal());
        } else {
          dispatch(closeSubscriptionAndExtensionModal());
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
  }

  useEffect(() => {
    if(persona === "parent" || persona === "student" || persona === "tutor" || 
       persona === "contributor" || persona === "superAdmin" || persona === "manager") {
        return;
    }

    loadOrgDetails();
  }, [persona, subscriptionsInfoFromAPI, subscriptionUpdateTrigger]);

  return (
    <>
    {/* <BrowserRouter> */}
      {/* <Navbar /> */}
      <Layout2>
      {
        isSubscriptionAndExtensionModalActive && isOrgAdmin ? (
          <div className="fixed bg-[#00000080] top-[-50px] left-0 right-0 bottom-[-50px] z-[1000000]" style={{position: "fixed"}} >
            <SubscriptionAndExtensionModal
              className="relative top-[500px] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px]"
              updateSubscriptionMode={isSubscriptionAndExtensionModalInUpateMode}
              renewProductMode={isSubscriptionAndExtensionModalInRenewProductMode}
              openSubscriptionModal={openSubscriptionPanel}
              openExtensionsModal={openExtensionsPanel}
              activeSubscriptionName={activeSubscriptionInfo?.planName}
              OnSubscriptionAddedSuccessfully={() => {
                // SetIsSubscriptionAndExtensionModalActive(false);
                dispatch(triggerSubscriptionUpdate());
                dispatch(closeSubscriptionAndExtensionModal());
              }}

              OnCancelClicked={() => {
                // SetIsSubscriptionAndExtensionModalActive(false);
                dispatch(closeSubscriptionAndExtensionModal());
              }}
            />
          </div>
        ) : (<></>)
      }
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
    {/* </BrowserRouter> */}
   </>
  );
};

export default AppRoutes;
