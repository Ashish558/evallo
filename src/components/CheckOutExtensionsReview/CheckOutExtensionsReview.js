import {
    useState
} from "react";
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";
import InputField from "../../components/InputField/inputField";
import { BASE_URL } from "../../app/constants/constants";
import { useLazyApplyCouponQuery } from "../../app/services/subscription";

export default function CheckOutExtensionsReview({
    canAddPromoCode = false,
    className,
    description = [],
    extensionPriceOption = {
        planName: "",
        planDisplayName: "",
        description: [],
        subscriptionPricePerMonth: 0,
        currency: "",
        freeTrialDays: 0,
    },
    planName,
    planDisplayName,
    subscriptionPricePerMonth = 10,
    freeTrialDays = 0,
    setFrames,
    setcurrentStep,
    chosenExtentionObjectsFromAPI,
    extensionDiscounts,
    SetExtensionDiscounts,
}) {
    const [couponCode, SetcouponCode] = useState("");
    const [applyCoupon, applyCouponResp] = useLazyApplyCouponQuery();

    const handleChangePlan = () => {
        if(!setFrames || !setcurrentStep) return;
        setFrames((prev) => {
            return { ...prev, checkout: false, extensions: true };
        });
        // setcurrentStep(currentStep => currentStep - 1)
    }

    const OnPressApplyCoupon = async () => {
        if(couponCode === "") return;

        const response = await applyCoupon({
            couponName: couponCode,
            subscriptionPrice: ""
        });


        console.log("apply coupon resonse");
        console.log(response.data);

        if(response.data && response.data.coupon) {
            
        }
    }

    return (
        <div className={`flex flex-col pb-[15px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] w-full ${className}`}>
            <div className="flex justify-between">
                <div className="w-7/12">
                    <div className="font-semibold text-[#26435F] text-[16px]">{planDisplayName}</div>

                    <div className="font-semibold text-[#24A3D9] text-[15px]">{extensionPriceOption?.planDisplayName}</div>

                    {(extensionPriceOption === undefined || extensionPriceOption === null || extensionPriceOption.planName === "") ? (<></>) :
                    (<ul className="ml-[20px]">
                        {
                            extensionPriceOption?.description.map((item, index) => {
                                return (
                                    <li className="list-disc text-[#26435F] text-[14px]" key={index}>{item}</li>
                                )
                            })
                        }
                    </ul>)
                    }
                </div>
                <div className="flex flex-col items-end">
                    <SecondaryButton 
                        children={"Change Plan"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] px-[15px] py-[2px] text-[#7C98B6]"}
                        onClick={handleChangePlan}
                    />

                    <div className="grow"></div>
                    {
                        freeTrialDays === 0 ?
                        (
                            <div className="font-semibold text-[#24A3D9]">
                                ${subscriptionPricePerMonth} / Month
                            </div>
                        ) : 
                        (
                            <>
                                <div className="font-semibold text-[#24A3D9]">
                                    Free Trial
                                </div>
                                <div className="font-[200] text-[#24A3D9] text-sm">
                                    {
                                        freeTrialDays >= 30 ?  `${freeTrialDays / 30} Months` :
                                        `${freeTrialDays} Days`
                                    }
                                </div>
                            </>
                        )
                    }
                    
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
                    />
            </div>) : (<></>)
            }
        </div>
    )
}