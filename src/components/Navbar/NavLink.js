import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Selected from "../../assets/Navbar/selected.svg";
import SelectedMobile from "../../assets/Navbar/selected-mobile.svg";
import { desktop } from "../../constants/constants";
import styles from "./navbar.module.css";
import { useDispatch } from "react-redux";
import { updateIsLoggedIn } from "../../app/slices/user";
import Modal from "../Modal/Modal";

export default function NavLink({ width, icon: Icon, path, parentClassName }) {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [modalActive, setModalActive] = useState(false);

   const handleNavigate = () => {
      if(path === '/exit') {
      
         setModalActive(true)
      }else{
         if(path === '') return
         navigate(path)
      }
   }
   const location = useLocation();
   console.log(path);
   return (
//      <>
//       {!path.includes("https") ? <>
//          <button
//             className={`${path !== "/exit" ? "lg:mb-12" : "lg:mt-32"
//                } z-20 relative ${styles.navLink} ${parentClassName ? parentClassName : ""
//                } 
//          ${location.pathname === path ? styles.selectedNavLink : ""}
//          ${location.pathname === path && width < desktop
//                   ? styles.translateUp
//                   : ""
//                }  `}
//             onClick={handleNavigate}
//          >
//             {/* <img src={icon} className={Selected ? styles.selectedNavLink : ''} /> */}
//             <Icon />
//             {location.pathname === path && (
//                <img 
//                   src={width > desktop ? Selected : SelectedMobile}
//                   className={`${styles.selectedIcon}`}
//                />
//             )}
//          </button>

//             {modalActive && (
//                <Modal
//                   title="Are You Sure You Want to Log Out"
//                   classname={"max-w-[700px] mx-auto"}
//                   cancelBtn={true}
//                   handleClose={() => setModalActive(false)}
//                   primaryBtn={{
//                      text: "Log out",
//                      onClick: () => {
//                         localStorage.clear()
//                         navigate('/')
//                         dispatch(updateIsLoggedIn(false))
//                      }
//                   }}
                  
//                />
//             )}
//       </> : <a href="https://sevensquarelearning.com/" target="_blank" rel="noreferrer">
//             <button
//                className={`${path !== "/exit" ? "lg:mb-12" : "lg:mt-32"
//                   } z-20 relative ${styles.navLink} ${parentClassName ? parentClassName : ""
//                   } 
//             ${location.pathname === path ? styles.selectedNavLink : ""}
//             ${location.pathname === path && width < desktop
//                      ? styles.translateUp
//                      : ""
//                   }  `}
//                // onClick={handleNavigate}
//             >
//                {/* <img src={icon} className={Selected ? styles.selectedNavLink : ''} /> */}
//                <Icon />
//                {location.pathname === path && (
//                   <img 
//                      src={width > desktop ? Selected : SelectedMobile}
//                      className={`${styles.selectedIcon}`}
//                   />
//                )}
//             </button>

//                {modalActive && (
//                   <Modal
//                      title="Are You Sure You Want to Log Out"
//                      classname={"max-w-[700px] mx-auto"}
//                      cancelBtn={true}
//                      handleClose={() => setModalActive(false)}
//                      primaryBtn={{
//                         text: "Log out",
//                         onClick: () => {
//                            localStorage.clear()
//                            navigate('/')
//                            dispatch(updateIsLoggedIn(false))
//                         }
//                      }}
                     
//                   />
//                )}
//       </a>}
//      </>
// =======
      <button
         className={`${path !== "/exit" ? "lg:mb-12" : "lg:mt-auto"
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
