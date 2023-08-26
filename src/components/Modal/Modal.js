import React, { useEffect } from "react";
import styles from "./modal.module.css";
import CancelIcon from "../../assets/Modal/cancel.svg";
import primaryCancelIcon from "../../assets/icons/Groupcancel bt.svg";

import SecondaryButton from "../Buttons/SecondaryButton";
import Loader from "../Loader";

export default function Modal({
   title,
   titleClassName,
   body,
   cancelBtn,
   cancelBtnClassName,
   primaryBtn,
   handleClose,
   classname,
   SaveUser,
   primaryCancel,
   otherBt,
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
               <p className={`font-semibold text-xl md:text-2xl text-left text-primary-dark
               ${titleClassName ? titleClassName : "mb-[18px]"}`}
               >
                  {title}
               </p>
               <div className="h-[1px] w-full bg-[rgba(0,0,0,0.20)] mb-[18px]"></div>
               {body}

               {/* footer buttons */}
               <div className="flex justify-center">
                  {cancelBtn && (
                     <SecondaryButton
                        onClick={handleClose}
                        children="Cancel"
                        className={`py-2 ${cancelBtnClassName}`}
                        type="button"
                     />
                  )}
                  {
                     SaveUser && SaveUser
                  }
                  {
                     otherBt ? otherBt : <></>
                  }
                  {primaryBtn && (
                     <button
                        onClick={primaryBtn.onClick ? primaryBtn.onClick : null}
                        form={primaryBtn.form ? primaryBtn.form : null}
                        type={primaryBtn.type ? primaryBtn.type : "button"}
                        className={`${primaryBtn.bgDanger ? 'bg-[#FF5B4F]' : ' bg-primary'} relative disabled:opacity-75 rounded-md font-medium text-white  px-6 ml-9 ${primaryBtn.className ? primaryBtn.className : ""}`}
                        disabled={primaryBtn?.loading === true ? true : primaryBtn.disabled}
                        loading={primaryBtn.loading}
                     // disabled
                     >
                        {primaryBtn.text}  {
                           (primaryBtn.icon && primaryBtn?.loading === false) ? primaryBtn.icon : ''
                        }
                        {
                           primaryBtn !== undefined && primaryBtn?.loading === true &&
                           <Loader />
                        }

                     </button>
                  )}
               </div>
               <button className={styles.cancelBtn}
                  style={cancelBtnStyle}
                  onClick={handleClose}
               >
                  <img src={primaryCancel ? primaryCancelIcon : primaryCancelIcon} onClick={handleClose} />
               </button>

            </div>

            <div className={styles.modalOverlay}></div>
         </div>
      </div>
   );
}
