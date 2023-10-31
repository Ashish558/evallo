import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"

export default function CheckOutSubscriptionReview({
    canAddPromoCode = false,
    className,
    description = [],
    planDisplayName,
    activeTutorsAllowed = 0,
    activeStudentsAllowed = 0,
    ccRequired = false,
    currency = "usd",
    subscriptionPricePerMonth,
    freeTrialDays,
    setFrames,
    setcurrentStep
}) {

    const handleChangePlan = () => {
        if(!setFrames || !setcurrentStep) return;
        setFrames((prev) => {
            return { ...prev, checkout: false, subscription: true };
        });
        // setcurrentStep(currentStep => currentStep - 2)
    }
    return (
        <div className={`flex flex-col pb-[10px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] w-full ${className}`}>
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold text-[#26435F] text-[16px]">{planDisplayName}</div>
                    {/* {
                        description.map((item, index) => {
                            return (
                                <div className="font-[200] text-[#26435F] text-sm" key={index} >{item}</div>
                            )
                        })
                    } */}
                    <div className="font-[200] text-[#26435F] text-sm">Active Tutors Allowed - {activeTutorsAllowed === Infinity ? "unlimited" : activeTutorsAllowed}</div>
                    <div className="font-[200] text-[#26435F] text-sm">Active Students Allowed - {activeStudentsAllowed === Infinity ? "unlimited" : activeStudentsAllowed}</div>
                    {
                        (() => {
                            const freeTrialStatement = freeTrialDays === 0 ? "Free Trial Not Available" :
                                               freeTrialDays >= 30 ?  `${freeTrialDays / 30} Months Free Trial` :
                                               `${freeTrialDays} Days Free Trial`;
                            return (
                                <div className="font-[600] text-sm text-[#24A3D9]">
                                    {freeTrialStatement + (ccRequired ? " (CC required)" : " (no CC required)")}
                                </div>
                            )
                        })()
                    }
                    <div className="font-[200] text-[#26435F] text-sm">
                        {(freeTrialDays === 0 ? "Flat Monthly Subscription - " : "Flat Monthly Subscription After Free Trial Ends - ")}
                        <div className="font-[600] inline">
                            ${subscriptionPricePerMonth}/month
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <SecondaryButton 
                        children={"Change Plan"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] px-[15px] py-[2px] text-[#7C98B6]"}
                        onClick={handleChangePlan}
                    />

                    <div className="grow"></div>
                    <div className="font-semibold text-[#24A3D9]">
                        {
                            freeTrialDays !== 0 ? "Free Trial" : `$${subscriptionPricePerMonth} / Month`
                        }
                    </div>
                    <div className="font-[200] text-[#24A3D9] text-sm">
                        {
                            freeTrialDays !== 0 ? 
                            freeTrialDays >= 30 ? 
                            `${freeTrialDays / 30} Months` : `${freeTrialDays} Days`
                            : "No Free Trial"
                        }
                    </div>
                </div>
            </div>

            {canAddPromoCode === true ? (<div className="flex h-[40px] items-center mt-[15px]">
                    <SecondaryButton
                        children={"Add Promo Code"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] h-full px-[15px] py-[2px] text-[#B3BDC7]"}
                    />

                    <PrimaryButton
                        children={"Apply"}
                        className={"h-5/6 ml-[10px] px-[10px]"}
                    />
            </div>) : (<></>)
            }
        </div>
    )
}