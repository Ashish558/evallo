import React from "react";
import faQuestionCircle from "../../assets/images/Vectorqsn.svg";
import icon from "../../assets/icons/Evallo Logo.svg";
import evallo_logo from "../../assets/icons/navbar-icons/evallo-logo.svg";
import logoutIcon from "../../assets/images/Vectorlogout new.svg";
import Dashboard1 from "../../assets/icons/navbar-icons/Dashboard_red.svg";
import Dashboard from "../../assets/icons/Dashboard_light.svg";
import DashboardDisabled from "../../assets/icons/navbar-icons/Dashboard_grey.svg";
import UsersIcon from "../../assets/icons/crm_light.svg";
import StudentIcon from "../../assets/icons/mdi_account-studentstudent.svg";
import StudentIcon2 from "../../assets/icons/mdi_account-studentstudent2.svg";
import UsersIcon1 from "../../assets/icons/navbar-icons/crm_red.svg";
import UsersIconDisabled from "../../assets/icons/navbar-icons/crm_grey.svg";
import Schedule from "../../assets/icons/Calendar_light.svg";
import Schedule1 from "../../assets/icons/navbar-icons/calender-red.png";
import ScheduleDisabled from "../../assets/icons/navbar-icons/Calendar_grey.svg";
import Assignment from "../../assets/icons/Assignments_light.svg";
import Assignment1 from "../../assets/icons/navbar-icons/Assignments_red.svg";
import AssignmentDisabled from "../../assets/icons/navbar-icons/Assignments_grey.svg";
import Content from "../../assets/icons/content-logo_light.svg";
import Content2 from "../../assets/icons/navbar-icons/contents_red.svg";
import ContentDisabled from "../../assets/icons/navbar-icons/contents_grey.svg";
import Invoice from "../../assets/images/invoice-logo.svg";
import Invoice2 from "../../assets/images/invoice-logo-red.svg";
import InvoiceDisabled from "../../assets/images/invoice-logo-grey.svg";
import Settings from "../../assets/images/Settings 1 new.svg";
import Settings1 from "../../assets/icons/navbar-icons/settings_red.png";
import Profile from "../../assets/Navbar/profile.svg";
import Profile1 from "../../assets/images/Vector (5).svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { updateIsLoggedIn } from "../../app/slices/user";
import { useLazyGetLogoutQuery } from "../../app/services/superAdmin";
import styles from './navbar.module.css'
import {
   useLazyGetPersonalDetailQuery,
   useLazyGetOrganizationQuery,
 } from "../../app/services/users";

let tempnavdata = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      disabledIcon: DashboardDisabled,
      path: "/",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Dashboard",
      isDisabled: false,
   },
   {
      icon: UsersIcon,
      activeIcon: UsersIcon1,
      disabledIcon: UsersIconDisabled,
      path: "/users",
      tooltip: "CRM",
      isDisabled: false,
   },
   {
      icon: Schedule,
      activeIcon: Schedule1,
      disabledIcon: ScheduleDisabled,
      path: "/calendar",
      tooltip: "Schedule",
      isDisabled: false,
   },
   {
      icon: Assignment,
      activeIcon: Assignment1,
      disabledIcon: AssignmentDisabled,
      path: "/assigned-tests",
      tooltip: "Assignments",
      isDisabled: true,
   },
   {
      icon: Content,
      activeIcon: Content2,
      disabledIcon: ContentDisabled,
      path: "/all-tests",
      tooltip: "Content",
      isDisabled: true,
   },
   {
      icon: Invoice,
      activeIcon: Invoice2,
      disabledIcon: InvoiceDisabled,
      path: "/invoice",
      tooltip: "Invoicing",
      isDisabled: false,
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Settings",
      isDisabled: false,
   },
];

const parentNav = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      tooltip: "Dashboard",
   },
   {
      icon: Profile,
      activeIcon: Profile1,
      path: "/profile",
      tooltip: "Profile",
   },
   {
      icon: Assignment,
      activeIcon: Assignment1,
      path: "/all-tests",
      tooltip: "Assignments",
   },
   {
      icon: Schedule,
      activeIcon: Schedule1,
      path: "/calendar",
      tooltip: "Schedule",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "tutor", "admin", "superAdmin"],
      tooltip: "Settings",
   },
];

const studentNav = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      tooltip: "Dashboard",
   },
   {
      icon: Profile,
      activeIcon: Profile1,
      path: "/profile",
      tooltip: "Profile",
   },
   {
      icon: Assignment,
      activeIcon: Assignment1,
      path: "/all-tests",
      tooltip: "Assignments",
   },
   {
      icon: Schedule,
      activeIcon: Schedule1,
      path: "/calendar",
      tooltip: "Schedule",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["parent", "tutor", "admin", "superAdmin"],
      tooltip: "Settings",
   },
];
const tutorNav = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      tooltip: "Dashboard",
   },
   {
      icon: Profile,
      activeIcon: Profile1,
      path: "/profile",
      tooltip: "Profile",
   },
   {
      icon: Schedule,
      activeIcon: Schedule1,
      path: "/calendar",
      tooltip: "Schedule",
   },
   {
      icon: Assignment,
      activeIcon: Assignment1,
      path: "/assigned-tests",
      tooltip: "Assignments",
   },
   {
      icon: StudentIcon,
      activeIcon: StudentIcon2,
      path: "/assigned-students",
      tooltip: "Students",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["parent", "student", "admin", "superAdmin"],
      tooltip: "Settings",
   },
];
const supAdminNavData = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Dashboard",
   },
   {
      icon: Profile,
      activeIcon: Profile1,
      path: "/all-orgs",
      excludes: ["student", "parent", "tutor"],
      tooltip: "All Orgs",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Settings",
   },
];

const contributorNavdata = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      tooltip: "Dashboard",
   },
   {
      icon: Content,
      activeIcon: Content2,
      path: "/all-tests",
      tooltip: "Content",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Settings",
   },
];

const managerNavData = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Dashboard",
   },
   {
      icon: Profile,
      activeIcon: Profile1,
      path: "/all-orgs",
      excludes: ["student", "parent", "tutor"],
      tooltip: "All Orgs",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Settings",
   },
];

const Navbar = ({myRef}) => {
   const {
      hasSubscriptionExpired,
      hasExtensionsExpired,
      activeSubscriptionInfo,
      activeExtensionInfo,
   } = useSelector(state => state.subscription);
   const [navData, setNavData] = useState(tempnavdata);
   const location = useLocation();
   const [activeRoute, setActiveRoute] = useState(location.pathname);

   const [logoutModalActive, setLogoutModalActive] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [showDashboard, setShowDashboard] = useState(
      location.pathname.includes("all-orgs") ||
         location.pathname.includes("dashboard")
         ? true
         : false
   );
   const { width } = useWindowDimensions();
   const { isLoggedIn } = useSelector((state) => state.user);
   const [logOutApi, setLogOutApi] = useLazyGetLogoutQuery();
   const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
    const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
   const { role: persona } = useSelector((state) => state.user);

   useEffect(() => {
      if (persona === "student") {
         setNavData(studentNav);
      } else if (persona === "tutor") {
         setNavData(tutorNav);
      } else if (persona === "parent") {
         setNavData(parentNav);
      } else if (persona === "admin") {
         setNavData(tempnavdata);
      } else if (persona === "superAdmin") {
         setNavData(supAdminNavData);
      } else if (persona === "contributor") {
         setNavData(contributorNavdata);
      } else if (persona === "manager") {
         setNavData(managerNavData);
      } else {
         setNavData([]);
      }
   }, [persona]);

   const handleNavigate = (path) => {
      if (path === "/exit") {
         setLogoutModalActive(true);
      } else if (path === "/logo") {
         // window.open("https://sevensquarelearning.com/");
      } else {
         if (path === "") return;
         if (path === "/all-orgs") {
            setShowDashboard(true);
         }
         navigate(path);
      }
   };
const [loading2,setLoading2]=useState(false)
   const logoutUser = () => {
      setLoading2(true);
      logOutApi().then((res) => {
         setLoading2(false);
         if(res?.error){
            alert("Something went wrong. Please try again")
            return 
         }
         console.log("Successfully logged out");
         setLogoutModalActive(false)
         sessionStorage.clear();
         localStorage.clear("evalloToken");
         navigate("/");
         dispatch(updateIsLoggedIn(false));
         window.location.reload();
      });
   
   };
   useEffect(() => {
      if(location.pathname.includes('/all-tests/')){
         setActiveRoute('/all-tests');
      }
      else if(location.pathname.includes('/orgadmin-profile/')){
         setActiveRoute('/all-orgs');
         console.log(activeRoute)
      }
    else  setActiveRoute(location.pathname);
   }, [location.pathname]);
   useEffect(() => {

      if (!isLoggedIn && (activeRoute === '/signup/user' || activeRoute === '/signup' || activeRoute === "/")) {
         let arr = tutorNav;
         if (activeRoute === '/')
            arr[0].path = "/"
         setNavData(arr)
      }
   }, [activeRoute]);
   const [navTop,setNavTop] = useState(0);

   // const handleScroll = () =>{
   //    setNavTop(0);
   //    const screenWidth = window.innerWidth;
   //    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;
   //    const scrollY = window.scrollY;
   //    const requiredTop = (1/(scale>1?1:scale)) * scrollY;
   //    setNavTop(requiredTop);
   // };
   // useEffect(() => {
   //    window.addEventListener('scroll', handleScroll);
   //    window.addEventListener('resize', handleScroll);
   //    window.addEventListener('wheel',handleScroll);
   //    return () => {
   //       window.removeEventListener('scroll', handleScroll);
   //       window.removeEventListener('resize', handleScroll);
   //    window.removeEventListener('wheel',handleScroll);
   //    };
   //  }, []);

   useEffect(() => {
      if(hasSubscriptionExpired || activeSubscriptionInfo.planName === "") {
         let tempnavdata = [
            {
               icon: Dashboard,
               activeIcon: Dashboard1,
               disabledIcon: DashboardDisabled,
               path: "/",
               excludes: ["student", "parent", "tutor"],
               tooltip: "Dashboard",
               isDisabled: true,
            },
            {
               icon: UsersIcon,
               activeIcon: UsersIcon1,
               disabledIcon: UsersIconDisabled,
               path: "/users",
               tooltip: "CRM",
               isDisabled: true,
            },
            {
               icon: Schedule,
               activeIcon: Schedule1,
               disabledIcon: ScheduleDisabled,
               path: "/calendar",
               tooltip: "Schedule",
               isDisabled: true,
            },
            {
               icon: Assignment,
               activeIcon: Assignment1,
               disabledIcon: AssignmentDisabled,
               path: "/assigned-tests",
               tooltip: "Assignments",
               isDisabled: true,
            },
            {
               icon: Content,
               activeIcon: Content2,
               disabledIcon: ContentDisabled,
               path: "/all-tests",
               tooltip: "Content",
               isDisabled: true,
            },
            {
               icon: Invoice,
               activeIcon: Invoice2,
               disabledIcon: InvoiceDisabled,
               path: "/invoice",
               tooltip: "Invoicing",
               isDisabled: true,
            },
            {
               icon: Settings,
               activeIcon: Settings1,
               path: "/settings",
               excludes: ["student", "parent", "tutor"],
               tooltip: "Settings",
               isDisabled: false,
            },
         ];

         setNavData(tempnavdata);
         return;
      }

      if(!(hasSubscriptionExpired || activeSubscriptionInfo.planName === "")) {
         let tempnavdata = [
            {
               icon: Dashboard,
               activeIcon: Dashboard1,
               disabledIcon: DashboardDisabled,
               path: "/",
               excludes: ["student", "parent", "tutor"],
               tooltip: "Dashboard",
               isDisabled: false,
            },
            {
               icon: UsersIcon,
               activeIcon: UsersIcon1,
               disabledIcon: UsersIconDisabled,
               path: "/users",
               tooltip: "CRM",
               isDisabled: false,
            },
            {
               icon: Schedule,
               activeIcon: Schedule1,
               disabledIcon: ScheduleDisabled,
               path: "/calendar",
               tooltip: "Schedule",
               isDisabled: false,
            },
            {
               icon: Assignment,
               activeIcon: Assignment1,
               disabledIcon: AssignmentDisabled,
               path: "/assigned-tests",
               tooltip: "Assignments",
               isDisabled: (hasExtensionsExpired || activeExtensionInfo.planName === "") ? true : false,
            },
            {
               icon: Content,
               activeIcon: Content2,
               disabledIcon: ContentDisabled,
               path: "/all-tests",
               tooltip: "Content",
               isDisabled: (hasExtensionsExpired || activeExtensionInfo.planName === "") ? true : false,
            },
            {
               icon: Invoice,
               activeIcon: Invoice2,
               disabledIcon: InvoiceDisabled,
               path: "/invoice",
               tooltip: "Invoicing",
               isDisabled: false,
            },
            {
               icon: Settings,
               activeIcon: Settings1,
               path: "/settings",
               excludes: ["student", "parent", "tutor"],
               tooltip: "Settings",
               isDisabled: false,
            },
         ];

         setNavData(tempnavdata);
      }
   }, [hasSubscriptionExpired, activeSubscriptionInfo, hasExtensionsExpired, activeExtensionInfo]);

   function loadOrgDetails() {
      getPersonalDetail()
          .then(data => {
              // console.log("getPersonalDetail");
              // console.log(data);
              const user = data.data.data.user;
          
              getOrgDetails(user.associatedOrg)
              .then(data => {
                  console.log("getOrgDetails");
                  console.log(data);

                  if(data.data && 
                     data.data.customerSubscriptions && 
                     data.data.customerSubscriptions.data && 
                     data.data.customerSubscriptions.data.length > 0 &&
                     data.data.customerSubscriptions.data.findIndex(item => {
                        if(item && item.metadata) {
                           return item.metadata.type === "extension";
                        }
                     }) !== -1) {
                        tempnavdata = [
                           {
                              icon: Dashboard,
                              activeIcon: Dashboard1,
                              path: "/",
                              excludes: ["student", "parent", "tutor"],
                              tooltip: "Dashboard",
                              isDisabled: false,
                           },
                           {
                              icon: UsersIcon,
                              activeIcon: UsersIcon1,
                              path: "/users",
                              tooltip: "CRM",
                              isDisabled: false,
                           },
                           {
                              icon: Schedule,
                              activeIcon: Schedule1,
                              path: "/calendar",
                              tooltip: "Schedule",
                              isDisabled: false,
                           },
                           {
                              icon: Assignment,
                              activeIcon: Assignment1,
                              path: "/assigned-tests",
                              tooltip: "Assignments",
                              isDisabled: false,
                           },
                           {
                              icon: Content,
                              activeIcon: Content2,
                              path: "/all-tests",
                              tooltip: "Content",
                              isDisabled: false,
                           },
                           {
                              icon: Invoice,
                              activeIcon: Invoice2,
                              path: "/invoice",
                              tooltip: "Invoicing",
                              isDisabled: false,
                           },
                           {
                              icon: Settings,
                              activeIcon: Settings1,
                              path: "/settings",
                              excludes: ["student", "parent", "tutor"],
                              tooltip: "Settings",
                              isDisabled: false,
                           },
                        ];

                        setNavData(tempnavdata);
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
          });
  }

  useEffect(() => {
   if(persona === "parent" || persona === "student" || persona === "tutor" || 
       persona === "contributor" || persona === "superAdmin" || persona === "manager") {
         return;
   }
   // loadOrgDetails();
  }, [])

   return (
      <>
      {/* this div will take navbar's height */}
         {/* <div className="h-[72px]"></div> */}
         <div ref={myRef} style={{top:`${navTop}px`,transformOrigin:"top left"}} className={`flex bg-[#26435F] h-[72px] items-center w-[1920px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] sticky left-0 ${persona==="superAdmin"?"justify-between px-[5%]":"justify-around"} design:left-[calc(50vw-960px)] z-[100000]`}>
            <div
               className={`${persona === "superAdmin" ? "translate-x-[-44.16px]" : ""}`}
            >
               <Link to="/" className="cursor-default">
                  <div className="flex gap-x-[6px] items-center w-[135px] h-[29.5px]">
                  <img className="inline-block w-[25px] h-[25px]" src={evallo_logo} alt="evallo_logo" />
                  <p  className={`text-[43px] text-white font-bold pt-[3.2px] ${styles.customFont}`}>Evallo</p>
                  </div>
               </Link>

            </div>
            <div className={`flex  text-[#FFFFFF] font-semibold text-[17.333px] ${!isLoggedIn && "opacity-[0.3]"} ${persona === "superAdmin" ? "translate-x-[67.2px]" : ""}`}>
               {navData.map((item, idx) => {
                  return (
                     <div
                        key={idx}
                        className={`flex items-center mr-6 design:mr-10  ${isLoggedIn && !item.isDisabled ? "cursor-pointer" : ' cursor-default'}`}
                        onClick={() => {
                           if(isLoggedIn && !item.isDisabled) {
                              handleNavigate(item.path)
                           }
                           // isLoggedIn && handleNavigate(item.path)
                        }}
                     >
                        {isLoggedIn && item?.path === activeRoute ? (
                           <>
                              <p>
                                 <img
                                    className={item.path==="/invoice"?"w-[14.667px] h-[19.556px]":"w-[21.33px] h-[21.33px]"}

                                    src={item.activeIcon}
                                    alt=""
                                 />
                              </p>
                              <p className="pl-[13.34px] text-[#FFA28D] text-[17.33px] "> {item.tooltip} </p>
                           </>
                        ) : (
                           <>
                              <p>
                                 <img
                                    className={item.path==="/invoice"?"w-[14.667px] h-[19.556px]":"w-[21.33px] h-[21.33px]"}
                                    src={(item.isDisabled && item.disabledIcon ? item.disabledIcon : item.icon)}
                                    alt=""
                                 />
                              </p>
                              <p className={`pl-[10px] text-[17.33px] ${item.isDisabled ? "text-[#B3BDC7]" : ""}`}> {item.tooltip} </p>
                           </>
                        )}
                     </div>
                  );
               })}
            </div>
            <div className={`flex ${persona === "superAdmin" ? "translate-x-[-19.2px]" : ""} font-bold ${isLoggedIn ? "" : "opacity-[0.3]"}`}>
             {persona =="parent"||  <div className="cursor-pointer flex mr-[24px] text-[#24A3D9] text-base-16  items-center">
                  <p className=" text-[16px]">Pricing 	</p>
                  <p className="pl-2 text-[17px]">
                   $
                  </p>
               </div>}
               <div className="cursor-pointer flex mr-[24px] text-[#24A3D9] items-center text-base-16 ">
                  <p className="text-[16px] ">Help</p>
                  <p>
                     <img
                        className=" ml-2"
                      
                        src={faQuestionCircle}
                        alt=""
                     />
                  </p>
               </div>

               <div
                  className={` flex ${isLoggedIn&& 'cursor-pointer'} items-center cursor-pointer`}
                  onClick={() => isLoggedIn && setLogoutModalActive(true)}
               >
                  <div>
                     <p className="text-[#24A3D9] text-[16px] !font-semibold">Logout</p>
                  </div>
                  <div>
                     <img
                        className=" ml-2"
            
                        src={logoutIcon}
                        alt=""
                     />
                  </div>
               </div>

            </div>
         </div>
         {logoutModalActive && (
            <Modal
               title={
                  <>
                     Are You Sure
                     You Want To Log Out?
                  </>
               }
               topClass="!h-[115%]"
               parentClass="flex flex-col justify-center items-center pb-[100px]"
               alignBtn={true}
               titleClassName="leading-9 text-center whitespace-nowrap mb-[22.67px]"
               cancelBtn={true}
               crossBtn={true}
               cancelBtnClassName="!w-[146px] text-[#26435F] font-medium text-base !rounded-[8px] !bg-[rgba(38,67,95,0.10)] !ml-auto !h-[46px]"
               primaryBtn={{
                  text: "Logout",
                  loading:loading2,
                  className: "text-base bg-[#FF7979] !w-[146px] pl-4 pr-4   !rounded-[8px] font-medium !mr-auto !text-center !bg-[#FF7979] !h-[46px]",
                  onClick: logoutUser,
               }}
               handleClose={() => setLogoutModalActive(false)}
               body={<div className="mb-6"></div>}
               classname={"!w-[666px] mx-auto !pt-7 !pb-[33px] !rounded-[8px] px-[33.33px] !text-center scale-50 md:scale-75 lg:scale-90 2xl:scale-100"}
            />
         )}
</>
   );
};

export default Navbar;
