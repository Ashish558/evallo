import React from "react";
import faQuestionCircle from "../../assets/images/Vectorqsn.svg";
import icon from "../../assets/icons/Evallo Logo.svg";
import logoutIcon from "../../assets/images/Vectorlogout new.svg";
import Dashboard1 from "../../assets/icons/navbar-icons/Dashboard_red.svg";
import Dashboard from "../../assets/icons/Dashboard_light.svg";
import UsersIcon from "../../assets/icons/crm_light.svg";
import StudentIcon from "../../assets/icons/mdi_account-studentstudent.svg";
import StudentIcon2 from "../../assets/icons/mdi_account-studentstudent2.svg";
import UsersIcon1 from "../../assets/icons/navbar-icons/crm_red.svg";
import Schedule from "../../assets/icons/Calendar_light.svg";
import Schedule1 from "../../assets/icons/navbar-icons/calender-red.png";
import Assignment from "../../assets/icons/Assignments_light.svg";
import Assignment1 from "../../assets/icons/navbar-icons/Assignments_red.svg";
import Content from "../../assets/icons/content-logo_light.svg";
import Content2 from "../../assets/icons/navbar-icons/contents_red.svg";
import Invoice from "../../assets/images/invoice-logo.svg";
import Invoice2 from "../../assets/images/invoice-logo-red.svg";
import Settings from "../../assets/images/Settings 1 new.svg";
import Settings1 from "../../assets/icons/navbar-icons/settings_red.png";
import Profile from "../../assets/Navbar/profile.svg";
import Profile1 from "../../assets/images/Vector (5).svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useEffect } from "react";
import Modal from "../../components/Modal/Modal";
import { updateIsLoggedIn } from "../../app/slices/user";
import { useLazyGetLogoutQuery } from "../../app/services/superAdmin";

const tempnavdata = [
   {
      icon: Dashboard,
      activeIcon: Dashboard1,
      path: "/",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Dashboard",
   },
   {
      icon: UsersIcon,
      activeIcon: UsersIcon1,
      path: "/users",
      tooltip: "CRM",
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
      icon: Content,
      activeIcon: Content2,
      path: "/all-tests",
      tooltip: "Content",
   },
   {
      icon: Invoice,
      activeIcon: Invoice2,
      path: "/invoice",
      tooltip: "Invoicing",
   },
   {
      icon: Settings,
      activeIcon: Settings1,
      path: "/settings",
      excludes: ["student", "parent", "tutor"],
      tooltip: "Settings",
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

const Navbar = () => {
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

   const logoutUser = () => {
      logOutApi().then(() => {
         console.log("Successfully logged out");
      });
      sessionStorage.clear();
      localStorage.clear("evalloToken");
      navigate("/");
      dispatch(updateIsLoggedIn(false));
      window.location.reload();
   };
   useEffect(() => {
      setActiveRoute(location.pathname);

   }, [location.pathname]);
   useEffect(() => {

      if (!isLoggedIn && (activeRoute === '/signup/user' || activeRoute === '/signup' || activeRoute === "/")) {
         let arr = tutorNav;
         if (activeRoute === '/')
            arr[0].path = "/"
         setNavData(arr)
      }
   }, [activeRoute])

   return (
      <>
         <div className="flex justify-around bg-[#26435F] h-[65px] design:h-[72px] items-center w-full shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div
               className={`${persona === "superAdmin" ? "translate-x-[-30px]" : ""}`}
            >
               <a href="https://app.evallo.org">
                  <img className="h-[27.4px] design:h-[29.796px]" src={icon} alt="evallo_logo" />
               </a>

            </div>
            <div className={`flex  text-[#FFFFFF] font-semibold text-[0.9021vw] ${!isLoggedIn && "opacity-[0.3]"}`}>
               {navData.map((item, idx) => {
                  return (
                     <div
                        key={idx}
                        className={`flex items-center mr-6 design:mr-10  ${isLoggedIn ? "cursor-pointer" : ' cursor-default'}`}
                        onClick={() => isLoggedIn && handleNavigate(item.path)}
                     >
                        {isLoggedIn && item?.path === activeRoute ? (
                           <>
                              <p>
                                 <img
                                    className="w-[16px] h-[16px] design:h-[20px] design:w-[20px]"

                                    src={item.activeIcon}
                                    alt=""
                                 />
                              </p>
                              <p className="pl-[10px] text-[#FFA28D] text-text-[0.902vw] "> {item.tooltip} </p>
                           </>
                        ) : (
                           <>
                              <p>
                                 <img
                                    className="w-[16px] h-[16px] design:h-[20px] design:w-[20px]"
                                    src={item.icon}
                                    alt=""
                                 />
                              </p>
                              <p className="pl-[10px] text-[0.902vw] "> {item.tooltip} </p>
                           </>
                        )}
                     </div>
                  );
               })}
            </div>
            <div className={`flex font-bold ${isLoggedIn ? "" : "opacity-[0.3]"}`}>
             {persona =="parent"||  <div className="flex mr-[24px] text-[#24A3D9] text-base-16  items-center">
                  <p className=" text-[0.8333vw]">Pricing 	</p>
                  <p className="pl-2">
                     &#36;
                  </p>
               </div>}
               <div className="flex mr-[24px] text-[#24A3D9] items-center text-base-16 ">
                  <p className="text-[0.8333vw] ">Help</p>
                  <p>
                     <img
                        className="w-[16px] h-[14px] ml-2"
                        style={{ height: "14px" }}
                        src={faQuestionCircle}
                        alt=""
                     />
                  </p>
               </div>

               <div
                  className={`flex ${isLoggedIn&& 'cursor-pointer'} items-center `}
                  onClick={() => isLoggedIn && setLogoutModalActive(true)}
               >
                  <div>
                     <p className="text-[#24A3D9] text-[0.8333vw]">Logout</p>
                  </div>
                  <div>
                     <img
                        className="w-[16px] h-[14px] ml-2"
                        style={{ height: "14px" }}
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
               alignBtn={true}
               titleClassName="leading-9 text-center whitespace-nowrap mb-[22.67px]"
               cancelBtn={true}
               crossBtn={true}
               cancelBtnClassName="!w-[146px] text-[#26435F] font-medium text-base !rounded-[8px] !bg-[rgba(38,67,95,0.10)] !ml-auto !h-[46px]"
               primaryBtn={{
                  text: "Logout",
                  className: "text-base bg-[#FF7979] !w-[146px] pl-4 pr-4   !rounded-[8px] font-medium !mr-auto !text-center !bg-[#FF7979] !h-[46px]",
                  onClick: logoutUser,
               }}
               handleClose={() => setLogoutModalActive(false)}
               body={<div className="mb-6"></div>}
               classname={"!w-[666px] mx-auto !pt-7 !pb-[33px] !rounded-[8px] px-[33.33px] !text-center"}
            />
         )}
      </>
   );
};

export default Navbar;
