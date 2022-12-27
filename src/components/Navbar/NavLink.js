import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Selected from "../../assets/Navbar/selected.svg";
import SelectedMobile from "../../assets/Navbar/selected-mobile.svg";
import { desktop } from "../../constants/constants";
import styles from "./navbar.module.css";
import { useDispatch } from "react-redux";
import { updateIsLoggedIn } from "../../app/slices/user";

export default function NavLink({ width, icon: Icon, path, parentClassName }) {
   const navigate = useNavigate();
   const dispatch = useDispatch()

   const handleNavigate = () => {
      if(path === '/exit') {
         sessionStorage.clear()
         navigate('/')
         dispatch(updateIsLoggedIn(false))
      }else{
         navigate(path)
      }
   }
   const location = useLocation();

   return (
      <button
         className={`${path !== "/exit" ? "lg:mb-12" : "lg:mt-32"
            } z-20 relative ${styles.navLink} ${parentClassName ? parentClassName : ""
            } 
      ${location.pathname === path ? styles.selectedNavLink : ""}
      ${location.pathname === path && width < desktop
               ? styles.translateUp
               : ""
            }  `}
         onClick={handleNavigate}
      >
         {/* <img src={icon} className={Selected ? styles.selectedNavLink : ''} /> */}
         <Icon />
         {location.pathname === path && (
            <img 
               src={width > desktop ? Selected : SelectedMobile}
               className={`${styles.selectedIcon}`}
            />
         )}
      </button>
   );
}
