import React from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faArrowDown,
//   faArrowDown19,
//   faArrowDown91,
//   faArrowRightFromBracket,
//   faCaretDown,
//   faDollar,
//   faPlus,
//   faUpload,
// } from "@fortawesome/free-solid-svg-icons";
import faQuestionCircle from "../../assets/images/Vectorqsn.svg";
import icon from "../../assets/icons/Evallo Logo.svg";
import logoutIcon from "../../assets/images/Vectorlogout new.svg";
import Dashboard1 from "../../assets/images/Dashboard 1 new.svg";
import Dashboard from "../../assets/images/Dashboard 1.svg";
import UsersIcon from "../../assets/images/Vector (1).png";
import StudentIcon from "../../assets/icons/mdi_account-studentstudent.svg";
import StudentIcon2 from "../../assets/icons/mdi_account-studentstudent2.svg";
import UsersIcon1 from "../../assets/images/Vector (3).svg";
import Schedule from "../../assets/images/Vector (2).png";
import Schedule1 from "../../assets/images/Calendar 1.svg";
import Assignment from "../../assets/images/Vector (3).png";
import Assignment1 from "../../assets/images/Vector (4).svg";
import Content from "../../assets/images/content.png";
import Content2 from "../../assets/images/content-1.svg";
import Invoice from "../../assets/images/Vector (5).png";
import Invoice2 from "../../assets/images/invoicing.png";
import Settings from "../../assets/images/Settings 1 new.svg";
import Settings1 from "../../assets/images/Settings 1.svg";
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
    path: "/dashboard",
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

const AdminNavbar = () => {
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
 useEffect(()=>{

  if(!isLoggedIn&&(activeRoute==='/signup/user'|| activeRoute==='/signup' || activeRoute==="/")){
    let arr=tutorNav;
    if(activeRoute==='/')
    arr[0].path="/dashboard"
    setNavData(arr)
  }
 },[activeRoute])
 
  return (
    <>
      <div className="flex justify-around bg-[#26435F] h-[74px] items-center w-full overflow-y-auto w-[100vw]">
        <div
          className={`${persona === "superAdmin" ? "translate-x-[-80px]" : ""}`}
        >
          <a href="https://app.evallo.org">
          <img className="h-[29px]" src={icon}  alt="evallo_logo" />
          </a>
         
        </div>
        <div className={`flex  text-[#FFFFFF] font-semibold text-base-20 ${!isLoggedIn&& " opacity-[0.3]"}`}>
          {navData.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`flex items-center mr-8 text-base-17-5 ${isLoggedIn?"cursor-pointer":' cursor-default'} text-base-20`}
                onClick={() =>isLoggedIn&& handleNavigate(item.path)}
              >
                { isLoggedIn && item?.path === activeRoute ? (
                  <>
                    <p>
                      <img
                        className="w-[16px] h-[16px]"
                        style={{ height: "16px" }}
                        src={item.activeIcon}
                        alt=""
                      />
                    </p>
                    <p className="pl-[10px] text-[#FFA28D] text-base-20"> {item.tooltip} </p>
                  </>
                ) : (
                  <>
                    <p>
                      <img
                        className="w-[16px] h-[16px]"
                        src={item.icon}
                        alt=""
                      />
                    </p>
                    <p className="pl-[10px] text-base-20"> {item.tooltip} </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className={`flex font-bold ${isLoggedIn?"":"opacity-[0.3]"}`}>
          <div className="flex mr-[24px] text-[#24A3D9] text-xs ">
            <p className=" ">Pricing 	</p>
            <p className="pl-2">
              &#36;
            </p>
          </div>
          <div className="flex mr-[24px] text-[#24A3D9] text-xs">
            <p className=" ">Help</p>
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
              className="flex text-xs cursor-pointer"
              onClick={() => isLoggedIn&& setLogoutModalActive(true)}
            >
              <div>
                <p className="text-[#24A3D9]">Logout</p>
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
              Are you sure <br />
              you want to logout ?
            </>
          }
          titleClassName="leading-9 text-center whitespace-nowrap mb-5"
          cancelBtn={true}
          cancelBtnClassName="py-4"
          primaryBtn={{
            text: "Logout",
            className: "bg-danger w-[123px] pl-4 pr-4",
            onClick: logoutUser,
          }}
          handleClose={() => setLogoutModalActive(false)}
          body={<div className="mb-6"></div>}
          classname={"max-w-567 mx-auto"}
        />
      )}
    </>
  );
};

export default AdminNavbar;
