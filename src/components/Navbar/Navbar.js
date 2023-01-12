import React, { useEffect, useState } from "react";
import TestsIcon from "../../assets/Navbar/tests";
import DollarIcon from "../../assets/Navbar/dollar";
import SettingsIcon from "../../assets/Navbar/settings";
import Exit from "../../assets/Navbar/exit";
import Bubble from "../../assets/Navbar/bubble";
import Document from "../../assets/Navbar/document";
import Calendar from "../../assets/Navbar/calendar";
import People from "../../assets/Navbar/people";
import Selected from "../../assets/Navbar/selected.svg";
import NavLink from "./NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { desktop } from "../../constants/constants";
import Options from "../../assets/Navbar/options";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "../../assets/Navbar/dashboard";
import Profile from "../../assets/Navbar/profile";
import StudentTest from "../../assets/Navbar/studentTest";
import Percentage from "../../assets/Navbar/percentage";
import AssignedStudents from "../../assets/Navbar/assignedStudents";
import Back from "../../assets/Navbar/Back";
import logo from "../../assets/Navbar/logo";
import Modal from "../Modal/Modal";
import { updateIsLoggedIn } from "../../app/slices/user";

const tempnavdata = [
   {
      icon: logo,
      path: "/logo"
   },
   {
      icon: Calendar,
      path: "/calendar",
   },
   {
      icon: TestsIcon,
      path: "/assigned-tests",
   },
   {
      icon: Document,
      path: "/all-tests",
   },
   {
      icon: SettingsIcon,
      path: "/settings",
      excludes: ['student', 'parent', 'tutor']
   },
   {
      icon: People,
      path: "/",
   },
   {
      icon: DollarIcon,
      path: "/invoice",
   },
   {
      icon: Exit,
      path: "/exit",
      parentClassName: "mt-auto",
   },
];

const parentNav = [
   {
      icon: logo,
      path: "/logo"
   },
   {
      icon: Dashboard,
      path: "/",
   },
   {
      icon: Profile,
      path: "/profile",
   },
   {
      icon: Calendar,
      path: "/calendar",
   },
   {
      icon: StudentTest,
      path: "/all-tests",
   },
   {
      icon: Back,
      path: "/exit",
      parentClassName: "mt-auto",
   },
]

const studentNav = [
   {
      icon: logo,
      path: "/logo"
   },
   {
      icon: Dashboard,
      path: "/",
   },
   {
      icon: Profile,
      path: "/profile",
   },
   {
      icon: Calendar,
      path: "/calendar",
   },
   {
      icon: StudentTest,
      path: "/all-tests",
   },
   {
      icon: Exit,
      path: "/exit",
      parentClassName: "mt-auto",
   },
]
const tutorNav = [
   {
      icon: logo,
      path: "/logo"
   },
   {
      icon: Dashboard,
      path: "/",
   },
   {
      icon: Profile,
      path: "/profile",
   },
   {
      icon: AssignedStudents,
      path: "/assigned-students",
   },
   {
      icon: Calendar,
      path: "/calendar",
   },
   // {
   //    icon: TestsIcon,
   //    path: "/assigned-tests",
   // },
   {
      icon: Exit,
      path: "/exit",
      parentClassName: "mt-auto",
   },
]
export default function Navbar() {
   const [navData, setNavData] = useState(tempnavdata)
   const location = useLocation();
   const [modalActive, setModalActive] = useState(false);
   const [logoutModalActive, setLogoutModalActive] = useState(false)
   const navigate = useNavigate();
   const dispatch = useDispatch()

   const { width } = useWindowDimensions()
   const { isLoggedIn } = useSelector((state) => state.user)

   const {role : persona} = useSelector(state => state.user)

   const logoutUser = () => {
      sessionStorage.clear()
      navigate('/')
      dispatch(updateIsLoggedIn(false))
      window.location.reload()
   }

   useEffect(() => {
      if (persona === 'student') {
         setNavData(studentNav)
      } else if (persona === 'tutor') {
         setNavData(tutorNav)
      } else if (persona === 'parent') {
         setNavData(parentNav)
      }else if(persona === 'admin'){
         setNavData(tempnavdata)
      }else{
         setNavData(studentNav)
      }
   }, [persona])

   return (
      <>
      <div
         className={`
         fixed bottom-0 lg:w-auto lg:top-0 lg:left-0 lg:h-screen z-50 w-full overflow-y-hidden lg:overflow-y-auto lg:p-4
          flex overflow-auto
      ${location.pathname === "/login" ||
               location.pathname === "/signup" ||
               location.pathname === "/set-password" ||
               !isLoggedIn
               ? "hidden"
               : "bg-lightWhite"
            }`}
      // className={styles.navContainer}
      >
         <div className="lg:min-h-full lg:w-[100px] w-full h-75 lg:h-auto bg-primary p-4 lg:rounded-20 rounded-30 overflow-x-hidden overflow-y-hidden lg:overflow-y-auto lg:pt-10">
            <div className="h-full flex lg:flex-col items-center self-stretch justify- ">
               {navData.map((item, idx) => {
                  if (width < desktop) {
                     return (
                        idx < 4 && (
                           <NavLink setLogoutModalActive={setLogoutModalActive} width={width} key={idx} {...item} />
                        )
                     );
                  } else {
                     return (
                        <NavLink setLogoutModalActive={setLogoutModalActive} width={width} key={idx} {...item} />
                     );
                  }
               })}
               {width < desktop && (
                  <NavLink setLogoutModalActive={setLogoutModalActive} width={width} icon={Options} isOption={true} />
               )}
            </div>
         </div>
      </div>
       {
         logoutModalActive &&
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
      }
      </>
   );
}
