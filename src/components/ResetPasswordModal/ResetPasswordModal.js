import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";

function ResetPasswordModal({
    className,
    OnCancelClicked,
    OnOkayClicked,
}) {
    return (
        <div className={`relative flex flex-col items-center bg-[#fff] rounded-[8px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[190px] w-[666.67px]`} >
            <div className="font-[400] mt-[25px] text-center text-[#26435F] text-[21.33px] w-[595px]" >
            A Password Reset Link will be sent to you. Please click on it to change your password.
            </div>

            <div className="flex justify-between mt-[30px] w-[313.34px]" >
                <SecondaryButton
                    style={{backgroundColor: "#fff"}}
                    children={<span className="font-[500] text-[14px] text-[#FF7979]" >Cancel</span>}
                    className="bg-[#fff] border-[#FF7979] border-[1px] rounded-[8px] h-[46.67px] w-[146.67px]"
                    onClick={OnCancelClicked}
                />

                <PrimaryButton
                    // style={{width: "46.05%"}}
                    className={` flex justify-center h-[46.67px] w-[146.67px] bg-[#FFA28D]  disabled:opacity-60  rounded-[8px] text-white font-medium`}
                    /* loading={emailExistLoad}
                    disabled={
                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                    } */
                    onClick={OnOkayClicked}
                    children={`Okay`}
                />    
            </div>
        </div>
    )
}

export default ResetPasswordModal;