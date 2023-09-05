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
   cancelBtnStyle,
   underline,
   crossBtn
}) {

   useEffect(() => {
      document.body.style.overflow = "hidden";
      return () => {
         document.body.style.overflow = "unset";
      };
   }, []);
   return (
      <div className={styles.modalContainer}>
         <div className="w-full p-1">
            <div className={`w-full bg-white p-3 py-5 md:py-[33px] md:px-[33px] rounded-lg relative ${classname ? classname : ""
               }`}
            >
               <p className={`font-semibold text-xl md:text-[21px] text-center text-[#26435F]
               ${titleClassName ? titleClassName : "mb-[18px]"}`}
               >
                  {title}
               </p>

               {body}


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

               {
                  crossBtn ? '' : <button className={styles.cancelBtn}
                     style={cancelBtnStyle}
                     onClick={handleClose}
                  >
                     <img src={primaryCancel ? primaryCancelIcon : primaryCancelIcon} onClick={handleClose} />
                  </button>
               }
            </div>

            <div className={styles.modalOverlay}></div>
         </div>
      </div>
   );
}
