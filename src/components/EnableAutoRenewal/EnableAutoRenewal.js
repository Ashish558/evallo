import Modal2 from "../Modal2/Modal2";
import PrimaryButton from "../Buttons/PrimaryButton";

function EnableAutoRenewal({
    className,
    OnCrossIconClicked,
    OnEnableAutoRenewClicked,
}) {
    return (
        <Modal2
            className={`relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[8px] h-[266px] w-[497px] ${className}`}
            title="Enable Auto-Renewal"
            titleClassName="font-[600] text-[21.33px]"
            headerClassName={`pl-[30px] pr-[30px] pb-[21.67px] pt-[30px]`}
            OnCrossIconClicked={OnCrossIconClicked}
        >
            <div 
                className="flex flex-col items-center w-full"
            >
                <div className="mt-[20px] font-[400] text-[#517CA8] text-[17.5px] w-[437px]" >
                ⚠️ <span className="font-[700]" >Note:</span> If you renew the plan, you will be able to continue using ALL features of your Evallo account. The payment will be automatically be deducted on the date of renewal.
                </div>
                <div className="flex items-center justify-between mt-[5px] h-[41px] w-[437px]" >
                    <div className="grow" ></div>

                    <PrimaryButton
                        // style={{width: "46.05%"}}
                        className={` flex justify-center h-[41px] w-[175px] px-[15px] bg-[#38C980]  disabled:opacity-60  rounded-[10px] text-white font-medium`}
                        /* loading={emailExistLoad}
                        disabled={
                            values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                        } */
                        onClick={OnEnableAutoRenewClicked}
                        children={<span className="font-[500] text-[15px]" >Enable Auto-Renew</span>}
                    />   
                </div>
            </div>
        </Modal2>
    )
}

export default EnableAutoRenewal;