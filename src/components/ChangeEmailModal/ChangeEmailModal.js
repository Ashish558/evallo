import Modal2 from "../Modal2/Modal2";
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";
import InputField from "../InputField/inputField";

function ChangeEmailModal({
    className,
    email = "",
    OnCrossIconClicked,
    OnForgotPasswordClicked,
    OnRequestEmailChangeClicked,
}) {
    return (
        <Modal2
            className="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] h-[314px] w-[497px]"
            title="Change Email"
            titleClassName="font-[600] text-[21.33px]"
            headerClassName={`pl-[30px] pr-[30px] pb-[21.67px] pt-[30px]`}
            OnCrossIconClicked={OnCrossIconClicked}
        >
            <div 
                className="flex flex-col items-center w-full"
            >
                <div className="mt-[20px] font-[400] text-[#517CA8] text-[17.5px] w-[437px]" >
                ⚠️ <span className="font-[700]" >Note:</span> An email verification link will be sent to {email} to confirm this change.
                </div>

                <InputField
                  // Icon={Passwordicon}
                  iconSize="medium"
                  parentClassName="mt-[30px] w-[437px]"
                  placeholder="Confirm Your Password"
                  biggerText={true}
                  removeResponsive={true}
                //   label="Password"
                  type="password"
                  labelClassname="text-[#26435F] font-medium"
                  inputClassName="bg-transparent "
                  inputContainerClassName="hover:border-[#FFA28D] border-[0.936px] border-[#D0D5DD] !text-lg h-[49.69px] rounded-[6px] w-[430px]"
                  customEyeIconSize={"w-[17.5px] h-[14.761px]"}
                  /* value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error.password}
                  totalErrors={error}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }} */
                />

                <div className="flex items-center justify-between mt-[20px] w-[437px]" >
                    <SecondaryButton
                        style={{backgroundColor: "#fff"}}
                        children={<span className="font-[500] text-[16px] text-[#FF7979]" >Forgot Password</span>}
                        className="bg-[#fff] px-[0px] rounded-[10px] flex"
                        onClick={OnForgotPasswordClicked}
                    />

                    <PrimaryButton
                        // style={{width: "46.05%"}}
                        className={` flex justify-center h-[41px] w-[197px] px-[15px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative`}
                        /* loading={emailExistLoad}
                        disabled={
                            values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                        } */
                        onClick={OnRequestEmailChangeClicked}
                        children={<span className="font-[500] text-[15px]" >Request Email Change</span>}
                    />   
                </div>
            </div>
        </Modal2>
    )
}

export default ChangeEmailModal;