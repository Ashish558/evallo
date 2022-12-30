import React, { useEffect } from "react";
import styles from "./modal.module.css";
import CancelIcon from "../../assets/Modal/cancel.svg";
import SecondaryButton from "../Buttons/SecondaryButton";

export default function Modal({
   title,
   titleClassName,
   body,
   cancelBtn,
   cancelBtnClassName,
   primaryBtn,
   handleClose,
   classname,
   cancelBtnStyle
}) {
   //disable body scroll if modal open
   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "unset";
      };
   }, []);

   return (
      <div className={styles.modalContainer}>
         <div className="w-full p-1">
            <div className={`w-full bg-white p-3 py-5 md:py-9.5 md:px-9.5 rounded-20 relative ${classname ? classname : ""
               }`}
            >
               <p className={`font-semibold text-xl md:text-2xl text-center text-primary-dark
               ${titleClassName ? titleClassName : "mb-[18px]"}`}
               >
                  {title}
               </p>
               {body}

               {/* footer buttons */}
               <div className="flex justify-center">
                  {cancelBtn && (
                     <SecondaryButton
                        onClick={handleClose}
                        children="Cancel"
                        className={`pt-3 pb-3 ${cancelBtnClassName}`}
                        type="button"
                     />
                  )}
                  {primaryBtn && (
                     <button
                        onClick={primaryBtn.onClick ? primaryBtn.onClick : null}
                        form={primaryBtn.form ? primaryBtn.form : null}
                        type={primaryBtn.type ? primaryBtn.type : "button"}
                        className={`bg-primary disabled:bg-primary-300 rounded-md text-lg font-medium text-white py-3 px-12 ml-12 ${primaryBtn.className ? primaryBtn.className : ""}`}
                        disabled={primaryBtn.disabled}
                     >
                        {primaryBtn.text}
                     </button>
                  )} 
               </div>
               <button className={styles.cancelBtn} 
                style={cancelBtnStyle}
                >
                  <img src={CancelIcon} onClick={handleClose} />
               </button>
            </div>

            <div className={styles.modalOverlay}></div>
         </div>
      </div>
   );
}
