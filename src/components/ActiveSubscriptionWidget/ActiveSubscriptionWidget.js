import {
    useState
} from "react";
import {
    useSelector
} from "react-redux";
import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"
import InputField from "../../components/InputField/inputField";
import { BASE_URL } from "../../app/constants/constants";
import { useApplyCouponQuery, useLazyApplyCouponQuery } from "../../app/services/subscription";
import { CurrencyNameToSymbole, getFormattedDate } from "../../utils/utils";

function getDateAsString(date) {
    if(!(date && date.constructor && date.constructor.name === "Date")) return "05/12/23";
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear() % 2000;
    return "" + d + "/" + m + "/" + y;
}

function ActiveSubscriptionWidget({
    canChangePlan,
    canAddPromoCode = false,
    className,
    style,
    description = [],
    planDisplayName,
    activeTutorsAllowed = 0,
    activeStudentsAllowed = 0,
    ccRequired = false,
    currency = "usd",
    subscriptionPricePerMonth,
    freeTrialDays,
    setFrames,
    setcurrentStep,
    chosenSubscriptionObjectFromAPI,
    subscriptionDiscount,
    SetSubscriptionDiscount,
    freeTrialExpiryDate,
    handleChangePlan,
}) {
    const [couponCode, SetcouponCode] = useState("");
    const [couponDiscountPercent, SetCouponDiscountPercent] = useState(0);
    const [applyCoupon, applyCouponResp] = useLazyApplyCouponQuery();
    const [isCouponApplyProcessOnGoing, SetIsCouponApplyProcessOnGoing] = useState(false);
    const { dateFormat } = useSelector((state) => state.user);

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
        <div className={`flex flex-col pb-[15px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] w-full ${className}`} style={{...style}} >
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold text-[#26435F] text-[17.5px]">{planDisplayName + " - " + CurrencyNameToSymbole(currency) + subscriptionPricePerMonth + "/month"}</div>
                    <div className="font-[200] text-[#26435F] text-[15px]">Active Tutors Allowed - {activeTutorsAllowed === Infinity ? "unlimited" : activeTutorsAllowed}</div>
                    {
                        (() => {
                            const today = new Date();
                            if(freeTrialExpiryDate && freeTrialExpiryDate.constructor && 
                               freeTrialExpiryDate.constructor.name === "Date" && today <= freeTrialExpiryDate) {
                                return (
                                    <div className="font-[500] text-[15px] text-[#38C980]">
                                        Free Trial till {getFormattedDate(freeTrialExpiryDate, dateFormat)}
                                    </div>
                                )
                            }
                            return (
                                <div className="font-[100] text-[15px] text-[#26435F]">
                                    Free Trial has ended.
                                </div>
                            )

                        })()
                    }
                </div>
                <div className="flex flex-col items-end">
                    <SecondaryButton 
                        children={<span className="text-[#7C98B6] text-[16px]" >Change Plan</span>}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] px-[7px] py-[1px] text-[#7C98B6] h-[30px] w-[130px]"}
                        style={{
                            backgroundColor: "#fff",
                            paddingRight: "7px",
                            paddingLeft: "7px",
                            paddingTop: "1px",
                            paddingBottom: "1px",
                        }}
                        onClick={() => {
                            if(handleChangePlan.constructor && handleChangePlan.constructor.name === "Function") {
                                handleChangePlan();
                            }
                        }}
                        disabled={!canChangePlan}
                    />
                </div>
            </div>
        </div>
    )
}
export default ActiveSubscriptionWidget;