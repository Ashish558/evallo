import Modal2 from "../Modal2/Modal2";
import SecondaryButton from "../Buttons/SecondaryButton";
import PrimaryButton from "../Buttons/PrimaryButton";

function DeletePaymentMethodModal({
    className,
    OnCrossIconClicked,
    OnCancelClicked,
    OnDeletePaymentMethodClicked,
}) {
    return (
        <Modal2
            className={` ${className}`}
            title="Delete Payment Method"
            titleClassName="font-[600] text-[20px]"
            headerClassName={`pl-[20px] pr-[20px] pb-[10px] pt-[30px]`}
            OnCrossIconClicked={OnCrossIconClicked}
        >
            <div 
                className="flex flex-col items-center w-full"
            >
                <div className="mt-[20px] text-[#517CA8] text-[13px] w-11/12" >
                ⚠️ <span className="font-[600]" >Note:</span> You need to have at least one active payment method in order to continue using your subscription.
                </div>
                <div className="flex items-center justify-between mt-[30px] 2xl:mt-[10px] design:mt-[40px] w-9/12" >
                    <SecondaryButton
                        style={{width: "36.05%", backgroundColor: "#fff"}}
                        children={<span className="font-[500] text-[12px] text-[#FF7979]" >Cancel</span>}
                        className="bg-[#fff] px-[0px] rounded-[10px]"
                        onClick={OnCancelClicked}
                    />

                    <PrimaryButton
                        style={{width: "56.05%"}}
                        className={` flex justify-center px-[0px] 2xl:px-[5px] bg-[#FFA28D]  disabled:opacity-60  rounded-[10px] text-white text-sm font-medium relative py-[9px]`}
                        /* loading={emailExistLoad}
                        disabled={
                            values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                        } */
                        onClick={OnDeletePaymentMethodClicked}
                        children={<span className="text-[12px]" >Delete Payment Method</span>}
                    />   
                </div>
            </div>
        </Modal2>
    )
}

export default DeletePaymentMethodModal;