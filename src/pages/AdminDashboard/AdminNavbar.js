import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowDown19,
  faArrowDown91,
  faArrowRightFromBracket,
  faCaretDown,
  faDollar,
  faPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import icon from "../../assets/icons/FIGMA 3.svg";
import Dashboard1 from "../../assets/images/Vector.png";
import Dashboard from "../../assets/images/Dashboard 1.svg";
import UsersIcon from "../../assets/images/Vector (1).png";
import UsersIcon1 from "../../assets/images/Vector (3).svg";
import Schedule from "../../assets/images/Vector (2).png";
import Schedule1 from "../../assets/images/Calendar 1.svg";
import Assignment from "../../assets/images/Vector (3).png";
import Assignment1 from "../../assets/images/Vector (4).svg";
import Content from "../../assets/images/Vector (4).png";
import Invoice from "../../assets/images/Vector (5).png";
import Invoice2 from "../../assets/images/invoicing.png";
import Settings from "../../assets/images/Vector (6).png";
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
    path: "/all-tests",
    tooltip: "Assignments",
  },
  {
    icon: Assignment,
    activeIcon: Assignment1,
    path: "/assigned-tests",
    tooltip: "Content",
  },
  {
    icon: Invoice,
    activeIcon: Invoice2,
    path: "/invoicing",
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
    icon: Schedule,
    activeIcon: Schedule1,
    path: "/calendar",
    tooltip: "Calendar",
  },
  {
    icon: Assignment,
    activeIcon: Assignment1,
    path: "/all-tests",
    tooltip: "Assigned Tests",
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
    icon: Schedule,
    activeIcon: Schedule1,
    path: "/calendar",
    tooltip: "Calendar",
  },
  {
    icon: Assignment,
    activeIcon: Assignment1,
    path: "/all-tests",
    tooltip: "Assigned Tests",
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
    icon: UsersIcon,
    activeIcon: UsersIcon1,
    path: "/assigned-students",
    tooltip: "Assigned Students",
  },
  {
    icon: Schedule,
    activeIcon: Schedule1,
    path: "/calendar",
    tooltip: "Calendar",
  },
  {
    icon: Assignment,
    activeIcon: Assignment1,
    path: "/assigned-tests",
    tooltip: "Assigned Tests",
  },
];
const supAdminNavData = [
  {
    icon: Settings,
    activeIcon: Settings1,
    path: "/settings",
    excludes: ["student", "parent", "tutor"],
    tooltip: "Settings",
  },
  {
    icon: Profile,
    activeIcon: Profile1,
    path: "/all-orgs",
    excludes: ["student", "parent", "tutor"],
    tooltip: "All Orgs",
  },
  {
    icon: Dashboard,
    activeIcon: Dashboard1,
    path: "/dashboard",
    excludes: ["student", "parent", "tutor"],
    tooltip: "Dashboard",
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
    navigate("/");
    dispatch(updateIsLoggedIn(false));
    window.location.reload();
  };
  useEffect(() => {
    setActiveRoute(location.pathname);
  }, [location.pathname]);
  return (
    <>
      <div className="flex justify-around bg-[#26435F] h-[54px] items-center w-full">
        <div>
          <img src={icon} alt="" />
        </div>
        <div className="flex  text-[#FFFFFF] font-semibold text-[13px]">
          {navData.map((item, idx) => {
            return (
              <div
                key={idx}
                className="flex items-center mr-6 cursor-pointer"
                onClick={() => handleNavigate(item.path)}
              >

                {
                  item?.path === activeRoute ? <>
                    <p >
                      <img className="w-[16px] h-[16px]" style={{ height: '16px' }} src={item.activeIcon} alt="" />
                    </p>
                    <p className="pl-[10px] text-[#FFA28D]"> {item.tooltip} </p>
                  </>
                    :
                    <>
                      <p>
                        <img className="w-[16px] h-[16px]" src={item.icon} alt="" />
                      </p>
                      <p className="pl-[10px]"> {item.tooltip} </p>
                    </>
                }

              </div>
            );
          })}
        </div>
        <div className="flex font-bold">
          <div className="flex mr-[24px] text-[#24A3D9] text-xs ">
            <p className=" ">Pricing </p>
            <p>
              <FontAwesomeIcon
                className="pl-2"
                icon={faDollar}
              ></FontAwesomeIcon>
            </p>
          </div>
          <div className="flex mr-[24px] text-[#24A3D9] text-xs">
            <p className=" ">Help</p>
            <p>
              <FontAwesomeIcon
                className="pl-2"
                icon={faQuestionCircle}
              ></FontAwesomeIcon>
            </p>
          </div>
          {isLoggedIn && (
            <div
              className="flex text-xs cursor-pointer"
              onClick={() => setLogoutModalActive(true)}
            >
              <div>
                <p className="text-[#24A3D9]">Logout</p>
              </div>
              <div>
                <p>
                  <FontAwesomeIcon
                    className="pl-2 text-[#24A3D9]"
                    icon={faArrowRightFromBracket}
                  ></FontAwesomeIcon>
                </p>
              </div>
            </div>
          )}
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
          titleClassName="leading-9"
          cancelBtn={true}
          cancelBtnClassName="py-4"
          primaryBtn={{
            text: "Logout",
            className: "bg-danger w-[123px] pl-4 pr-4",
            onClick: logoutUser,
          }}
          handleClose={() => setLogoutModalActive(false)}
          body={<div className="mb-10"></div>}
          classname={"max-w-567 mx-auto"}
        />
      )}
    </>
  );
};

export default AdminNavbar;
