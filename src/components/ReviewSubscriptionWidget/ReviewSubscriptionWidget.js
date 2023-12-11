import {
    useState
} from "react";
import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"
import InputField from "../../components/InputField/inputField";
import { BASE_URL } from "../../app/constants/constants";
import { useApplyCouponQuery, useLazyApplyCouponQuery } from "../../app/services/subscription";
import { CurrencyNameToSymbole } from "../../utils/utils";

function ReviewSubscriptionWidget({
    canChangePlan,
    canAddPromoCode = false,
    className,
    description = [],
    planDisplayName,
    activeTutorsAllowed = 0,
    activeStudentsAllowed = 0,
    ccRequired = false,
    currency = "usd",
    subscriptionPricePerMonth = 0,
    freeTrialDays = 0,
    setFrames,
    setcurrentStep,
    chosenSubscriptionObjectFromAPI,
    subscriptionDiscount,
    SetSubscriptionDiscount,
}) {
    const [couponCode, SetcouponCode] = useState("");
    const [couponDiscountPercent, SetCouponDiscountPercent] = useState(0);
    const [applyCoupon, applyCouponResp] = useLazyApplyCouponQuery();
    const [isCouponApplyProcessOnGoing, SetIsCouponApplyProcessOnGoing] = useState(false);

    const handleChangePlan = () => {
        if(!setFrames) return;
        setFrames((prev) => {
            return { ...prev, review: false, subscription: true };
        });
    }

    const OnPressApplyCoupon = async () => {
        if(couponCode === "") return;

        SetIsCouponApplyProcessOnGoing(true);
        const response = await applyCoupon({
            couponName: couponCode,
            subscriptionPrice: chosenSubscriptionObjectFromAPI.id
        });

        SetIsCouponApplyProcessOnGoing(false)
        console.log("apply coupon resonse");
        console.log(response.data);
        if(response.data && response.data.coupon) {
            // SetCouponDiscountPercent(response.data.coupon.percent_off);
            SetSubscriptionDiscount({
                apiResonse: response.data,
                code: couponCode,
                discountPercent: response.data.coupon.percent_off
            })
        }
    }
    return (
        <div className={`flex flex-col pb-[20px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] h-[106px] w-[600px] ${className}`}>
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold text-[#26435F] text-[17.5px]">{planDisplayName + " - " + CurrencyNameToSymbole(currency) + subscriptionPricePerMonth + "/month"}</div>
                    <div className="font-[200] text-[#26435F] text-[15px]">Active Tutors Allowed - {activeTutorsAllowed === Infinity ? "unlimited" : activeTutorsAllowed}</div>
                    {
                        (() => {
                            const freeTrialStatement = freeTrialDays === 0 ? "Free Trial Not Available" :
                                               freeTrialDays >= 30 ?  `${freeTrialDays / 30} Months Free Trial` :
                                               `${freeTrialDays} Days Free Trial`;

                            if(freeTrialDays === 0) {
                                return (
                                    <div className="font-[100] text-[#26435F] text-[15px]" >
                                        Free Trial Not Available
                                    </div>
                                )
                            }
                            return (
                                <div className="font-[600] text-[15px] text-[#38C980]">
                                    {freeTrialStatement}
                                </div>
                            )
                        })()
                    }
                </div>
                <div className="flex flex-col items-end">
                    <SecondaryButton 
                        children={<span className="text-[#7C98B6] text-[16px]" >Change Plan</span>}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] px-[15px] py-[2px] text-[#7C98B6] h-[30px] w-[130px]"}
                        style={{
                            backgroundColor: "#fff",
                            
                        }}
                        onClick={handleChangePlan}
                        disabled={!canChangePlan}
                    />
                </div>
            </div>
        </div>
    )
}
export default ReviewSubscriptionWidget;