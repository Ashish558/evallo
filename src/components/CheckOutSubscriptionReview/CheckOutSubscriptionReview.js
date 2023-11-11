import {
    useState
} from "react";
import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"
import InputField from "../../components/InputField/inputField";
import { BASE_URL } from "../../app/constants/constants";
import { useApplyCouponQuery, useLazyApplyCouponQuery } from "../../app/services/subscription";
import { CurrencyNameToSymbole } from "../../utils/utils";

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
        if(!setFrames || !setcurrentStep) return;
        setFrames((prev) => {
            return { ...prev, checkout: false, subscription: true };
        });
        // setcurrentStep(currentStep => currentStep - 2)
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
                    {/* <SecondaryButton
                        children={"Add Promo Code"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] h-full px-[15px] py-[2px] text-[#B3BDC7]"}
                    /> */}

                    <InputField
                      placeholder="Add Promo Code"
                      parentClassName="text-xs"
                      label=""
                      labelClassname="text-[#26435F] font-semibold"
                      inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[45px] text-md"
                    
                      value={couponCode}
                      onChange={(e) => {
                        // setValues({
                        //   ...values,
                        //   firstName: e.target.value,
                        // })
                        SetcouponCode(e.target.value);
                      }}
                    //   totalErrors={error}
                    //   error={error.firstName}
                    />

                    <PrimaryButton
                        children={"Apply"}
                        className={"h-5/6 ml-[10px] px-[10px]"}
                        onClick={OnPressApplyCoupon}
                        loading={isCouponApplyProcessOnGoing}
                    />

                    <div className="grow" ></div>

                    {
                        subscriptionDiscount && subscriptionDiscount.discountPercent > 0 ?
                        (
                            <div>
                                <div>
                                    {subscriptionDiscount.discountPercent}% discount applied
                                </div>
                                <div>
                                    {CurrencyNameToSymbole(currency)}{subscriptionPricePerMonth - subscriptionPricePerMonth * subscriptionDiscount.discountPercent / 100} / Month
                                </div>
                            </div>
                        ) :
                        (<></>)
                    }
                    
            </div>) : (<></>)
            }
        </div>
    )
}