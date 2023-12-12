import React, { useEffect } from "react";
import CrossIcon from "../../assets/Modal/cross.svg";
import primaryCancelIcon from "../../assets/icons/Groupcancel bt.svg";
import styles from "./modal.module.css";

import { useRef } from "react";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import SecondaryButton from "../Buttons/SecondaryButton";
import Loader from "../Loader";

export default function Modal({
  title,
  titleClassName,
  modalSize,
  body,
  cancelBtn,
  cancelBtnClassName,
  primaryBtn,
  titleInvite,
  handleClose,
  classname,
  SaveUser,
  primaryCancel,
  otherBt,
  cancelBtnStyle,
  underline,
  crossBtn,
  crossBtn2,
  toEdit,
  alignBtn,
  wrapperClassName,
  btnClassName,
  buttonParentClassName,
  cancelIconState,
  parentClass,
  topClass
}) {
	const selectRef = useRef();
	// console.log(selectRef)
	useOutsideAlerter(selectRef, () => {
		selectRef.current = null;
		handleClose && handleClose();
	});

	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth", // Optional: Use smooth scrolling behavior
		});
		return () => {
			document.body.style.overflow = "unset";
		};
	}, []);

	const screenWidth = document.body.clientWidth;
	const scale = screenWidth > 0 ? screenWidth / 1920 : 0;
	return (
		<>
			{
				<div className={`${styles.modalContainer}  ${topClass ?? ""}`}>
					<div className={` h-full pt-[100px] pb-[20px] ${parentClass ?? ""}`}>
						{/* <div style={{marginTop:`-${(1/(scale > 1 ? 1 : scale))*70}px`,marginBottom:`-${(1-(scale > 1 ? 1 : scale))*70}px`}} className={styles.modalContainer+" "}>
          <div className="w-full p-1"> */}
          {/* <div className="absolute top-[150px] right-[150px]">X</div> */}
            <div
              ref={handleClose ? selectRef : null}
              className={`${modalSize ? modalSize : "w-full"} bg-white pt-[28px] pb-[33.34px] md:px-[33.33px] rounded-lg relative ${classname ? classname : ""
                }`}
            >
            <div onClick={handleClose} className={`absolute top-[20px] right-[50px] cursor-pointer ${crossBtn2===true?'hidden':''} `}><span className="cursor-pointer">X</span></div>
              <div className={wrapperClassName ? wrapperClassName : ""}>
                <p
                  className={`font-semibold text-xl md:text-[21px] text-left text-[#26435F] 
               ${titleClassName ? titleClassName : "mb-[18px]"} `}
								>
									{title}
									{titleInvite && "Are You Sure You Want to Invite "}
									{titleInvite && (
										<span className="text-[#FFA28D]">{titleInvite}</span>
									)}

									{titleInvite && " Users To Join Evallo?"}
								</p>
								{underline ? (
									""
								) : (
									<div className="h-[1.33px] w-full bg-[rgba(0,0,0,0.20)] mb-[36px]"></div>
								)}
								{body}

								<div className={`flex justify-center ${buttonParentClassName}`}>
									{cancelBtn && (
										<SecondaryButton
											onClick={handleClose}
											children="Cancel"
											className={`py-2  ${cancelBtnClassName}`}
											type="button"
										/>
									)}
									{SaveUser && SaveUser}
									{otherBt ? otherBt : <></>}
									{primaryBtn && (
										<button
											onClick={primaryBtn.onClick ? primaryBtn.onClick : null}
											form={primaryBtn.form ? primaryBtn.form : null}
											type={primaryBtn.type ? primaryBtn.type : "button"}
											className={`w-[120px] ${
												primaryBtn.bgDanger ? "bg-[#FFA28D]" : "bg-[#FFA28D]"
											} relative disabled:opacity-75 rounded-lg font-medium text-white cursor-pointer  ml-9 ${
												primaryBtn.className ? primaryBtn.className : ""
											}`}
											disabled={
												primaryBtn?.loading === true
													? true
													: primaryBtn.disabled
											}
											loading={primaryBtn.loading}
										>
											<div className="flex w-full items-center gap-2 justify-center">
												<p className="text-center">{primaryBtn.text}</p>
												{primaryBtn.icon && (
													<p>
														{primaryBtn.icon && primaryBtn?.loading === false
															? primaryBtn.icon
															: ""}
													</p>
												)}
											</div>

											{primaryBtn !== undefined &&
												primaryBtn?.loading === true && <Loader />}
										</button>
									)}
								</div>

                {crossBtn ? (
                  ""
                ) : (
                  <button
                    className={`absolute top-0 right-0 py-[28px] mr-[36px]`}
                    style={cancelBtnStyle}
                    onClick={handleClose}
                  >
                    <div className="w-full h-full flex justify-center items-center relative ">
                      <img
                        className={`${cancelIconState ? "block" : "hidden"}`}
                        src={
                          primaryCancel ? primaryCancelIcon : primaryCancelIcon
                        }
                        alt="close-btn"
                        onClick={handleClose}

                      />
                    </div>
                  </button>
                )}
              </div>
            </div>
            {/* <div className={styles.modalOverlay}></div> */}
          </div>
        </div>
      }
    </>
  );
}
