import React, { useState } from "react";
import creditCardSVG from "../../../assets/ReviewProduct/Credit_cardAsset_1_1.svg";
import ReviewSubscriptionWidget from "../../../components/ReviewSubscriptionWidget/ReviewSubscriptionWidget";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import InputField from "../../../components/InputField/inputField";
import { CurrencyNameToSymbole } from "../../../utils/utils";
import ReviewExtensionWidget from "../../../components/ReviewExtensionWidget/ReviewExtensionWidget";
import { useEffect } from "react";
import StripeCardDetailWidget from "../../../components/StripeCardDetailWidget/StripeCardDetailWidget";
import { useApplyCouponQuery, useLazyApplyCouponQuery } from "../../../app/services/subscription";

function ReviewProduct({
    className,
    chosenSubscriptionPlanName,
    subscriptionsInfo,
    setFrames,
    extensions,
    extensionPlansInfo,
    isCCRequired,
    SetIsCCRequired,
    subscriptionsInfoFromAPI = [],
    stripeCustomerId,
}) {
    // const [isCCRequired, SetIsCCRequired] = useState(false);
    const [chosenSubscriptionPlan, SetChosenSubscriptionPlan] = useState(
        subscriptionsInfo ? subscriptionsInfo.find(item => item.planName === chosenSubscriptionPlanName) : null
    );
    const [chosenSubscriptionObjectFromAPI, SetChosenSubscriptionObjectFromAPI] = useState();
    const [chosenExtentionObjectsFromAPI, SetChosenExtentionObjectsFromAPI] = useState([]);
    const [couponForSubscription, SetCouponForSubscription] = useState("");
    const [chosenExtensionPrice, SetChosenExtensionPrice] = useState(0);

    const [chosenExtensionPlans, SetChosenExtensionPlans] = useState(
        extensionPlansInfo.filter(item => {
            if(item.planName === "" || item.planName === undefined || item.planName === null) return false;
            for(let i = 0; i < extensions.length; i++) {
                if(extensions[i].text === item.planName && extensions[i].checked) return true;
            }
            return false;
        })
    );
    const [totalPrice, SetTotalPrice] = useState(0);
    const [applyCoupon, applyCouponResp] = useLazyApplyCouponQuery();

    useEffect(() => {
        // console.log("chosenSubscriptionFromAPI from sessionStorage");
        let subscriptionSessionStorageOutput = sessionStorage.getItem("chosenSubscriptionFromAPI");
        if(subscriptionSessionStorageOutput === '' || subscriptionSessionStorageOutput === undefined) {
            subscriptionSessionStorageOutput = null;
        }
        let chosenSub = JSON.parse(subscriptionSessionStorageOutput);
        if(chosenSub === null) {
            chosenSub = subscriptionsInfoFromAPI.find(item => item.id === chosenSubscriptionPlan.id);
        }
        SetChosenSubscriptionObjectFromAPI(chosenSub);
    }, []);

    useState(() => {
        SetTotalPrice(
            chosenSubscriptionPlan.pricePerMonth + chosenExtensionPrice
        )
    }, [chosenSubscriptionPlan, chosenExtensionPrice]);

    useEffect(() => {
        if(!(SetIsCCRequired.constructor && SetIsCCRequired.constructor.name === "Function")) return;
        if(chosenSubscriptionPlan.ccRequired) {
            SetIsCCRequired(true);
            return;
        }

        SetIsCCRequired(false);
    }, [chosenSubscriptionPlan]);

    async function OnApplyCouponForSubscriptionClicked(couponCode, chosenSubscriptionObjectFromAPI_Id){
        const response = await applyCoupon({
            couponName: couponCode,
            subscriptionPrice: chosenSubscriptionObjectFromAPI_Id
        });

        console.log("applyCoupon Response");
        console.log(response);
    }

    return (
        <div
            className={`flex h-full w-full ${className}`}
        >
            <div className="h-full w-8/12" >
                <div className="ml-[30px] mt-[30px]" >
                    <div
                        className={`block text-base font-[500] text-[#26435F] ml-0 text-[14px]`}
                    >Review Your Selections</div>
                    <div
                        className={`text-[12px] text-[#26435F] font-[100]`}
                    >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                    </div>
                </div>

                <div className="font-[500] ml-[30px] mt-[25px] text-[#FFA28D] text-[14px]" >Subscription</div>

                <div className="ml-[30px]" style={{width: "85%"}} >

                    <ReviewSubscriptionWidget
                        className="w-full"
                        canChangePlan={true}
                        setFrames={setFrames}
                        planDisplayName={chosenSubscriptionPlan && chosenSubscriptionPlan.planDisplayName ? chosenSubscriptionPlan.planDisplayName : null}
                        activeTutorsAllowed={chosenSubscriptionPlan && chosenSubscriptionPlan.activeTutorsAllowed ? chosenSubscriptionPlan.activeTutorsAllowed : null}
                        currency={chosenSubscriptionPlan && chosenSubscriptionPlan.currency ? chosenSubscriptionPlan.currency : null}
                        subscriptionPricePerMonth={chosenSubscriptionPlan && chosenSubscriptionPlan.pricePerMonth ? chosenSubscriptionPlan.pricePerMonth : null}
                        freeTrialDays={chosenSubscriptionPlan ? chosenSubscriptionPlan.freeTrialDays : null}
                    />

                    <div className="flex items-center mt-[7px] w-full" >
                        <InputField
                            placeholder="Add Promo Code"
                            parentClassName="text-xs"
                            label=""
                            labelClassname="text-[#26435F] font-semibold"
                            inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                            
                            value={couponForSubscription}
                            onChange={(e) => {
                                SetCouponForSubscription(e.target.value);
                            }}
                            //   totalErrors={error}
                            //   error={error.firstName}
                        />

                        <PrimaryButton
                            children={"Apply"}
                            className={"h-[30px] ml-[10px] px-[10px]"}
                            style={{
                                // height: "10%",
                            }}
                            onClick={() => {
                                OnApplyCouponForSubscriptionClicked(
                                    couponForSubscription,
                                    chosenSubscriptionObjectFromAPI.id
                                )
                            }}
                            // loading={isCouponApplyProcessOnGoing}
                        />

                        <div className="grow" ></div>

                        <div className="flex flex-col items-end text-[#24A3D9]" >
                            <div>{CurrencyNameToSymbole(chosenSubscriptionPlan.currency) + 
                                  (chosenSubscriptionPlan.freeTrialDays === 0 ? chosenSubscriptionPlan.pricePerMonth : 0)
                            }</div>
                            <div>
                                {
                                    (() => {
                                        const freeTrialDays = chosenSubscriptionPlan.freeTrialDays;
                                        const freeTrialStatement = freeTrialDays === 0 ? "1 Month" :
                                                           freeTrialDays >= 30 ?  `${freeTrialDays / 30} Months` :
                                                           `${freeTrialDays} Days`;
                                        return (
                                            <div>
                                                {freeTrialStatement}
                                            </div>
                                        )
                                    })()
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {
                    (chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0) ? (<></>) :
                    (
                        <>
                            <div className="font-[500] ml-[30px] mt-[25px] text-[#FFA28D] text-[14px]" >Extensions</div>

                            <div className="ml-[30px] " style={{width: "85%"}} >
                                <>
                                    {chosenExtensionPlans.map((item, index) => {
                                        const chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
                                        const chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
                                        /* const extObjectFromAPI = chosenExtentionObjectsFromAPI.find(i => {
                                            return i.product.name === item.planName && i.lookup_key === chosenPackageName;
                                        }) */

                                        // const extDiscount = extensionDiscounts.find(i => i.planName === item.planName);
                                        // const numberOfAssignments = chosenPackage.numberOfAssignments === Infinity ? "Unlimited" : chosenPackage.numberOfAssignments;
                                        const numberOfAssignments = chosenPackageName === "p1" ? 100 : chosenPackageName === "p2" ? 500 : chosenPackageName === "p3" ? "1,500" :  "Unli";
                                        
                                        return (
                                            <React.Fragment key={index} >
                                                <ReviewExtensionWidget
                                                    canChangePlan={true}
                                                    setFrames={setFrames}
                                                    planName={item.planName}
                                                    planDisplayName={item.planDisplayName}
                                                    extensionPriceOption={chosenPackage}
                                                    subscriptionPricePerMonth={chosenPackage.pricePerMonth}
                                                    productInfoStatement={`Maximum Number of Assignments per month - ${numberOfAssignments}`}
                                                />

                                                <div className="flex items-center mt-[7px] w-full" >
                                                    <InputField
                                                        placeholder="Add Promo Code"
                                                        parentClassName="text-xs"
                                                        label=""
                                                        labelClassname="text-[#26435F] font-semibold"
                                                        inputContainerClassName=" border border-[#D0D5DD] rounded-md py-[9px] h-[40px] text-md"
                                                        
                                                        // value={couponForSubscription}
                                                        /* onChange={(e) => {
                                                            // setValues({
                                                            //   ...values,
                                                            //   firstName: e.target.value,
                                                            // })
                                                            SetCouponForSubscription(e.target.value);
                                                        }} */
                                                        //   totalErrors={error}
                                                        //   error={error.firstName}
                                                    />

                                                    <PrimaryButton
                                                        children={"Apply"}
                                                        className={"h-[30px] ml-[10px] px-[10px]"}
                                                        // onClick={OnPressApplyCoupon}
                                                        // loading={isCouponApplyProcessOnGoing}
                                                    />

                                                    <div className="grow" ></div>

                                                    <div className="flex flex-col items-end text-[#24A3D9]" >
                                                        <div>{CurrencyNameToSymbole(chosenPackage.currency) + chosenPackage.pricePerMonth}</div>
                                                        <div>1 Month</div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        )
                                        /* return (
                                            <CheckOutExtensionsReview
                                                className={"mt-[25px]"}
                                                canChangePlan={!(isPaymentSuccessfull && isCCRequired)}
                                                canAddPromoCode={true}
                                                planName={item.planName}
                                                planDisplayName={item.planDisplayName}
                                                extensionPriceOption={chosenPackage}
                                                subscriptionPricePerMonth={chosenPackage.pricePerMonth}
                                                setFrames={setFrames}
                                                setcurrentStep={setcurrentStep}
                                                chosenExtentionObjectFromAPI={extObjectFromAPI}
                                                extensionDiscount={extDiscount}
                                                SetExtensionDiscounts={SetExtensionDiscounts}
                                            />
                                        ) */
                                    })}
                                </>
                            </div>
                        </>
                    )
                }

            </div>

            <div className="border-l-[1px] border-[#E3E3E3] h-full w-4/12" >
                <div className="ml-[30px] mt-[30px] w-9/12" >
                    <div className="flex" >
                        <div className="font-[500] text-[#26435F] text-[14px]" >Subscription</div>
                        <div className="border-dotted border-b-[1px] border-[#26435F] grow" ></div>
                        <div className="font-[500] text-[#26435F] text-[14px]" >{CurrencyNameToSymbole(chosenSubscriptionPlan.currency) + chosenSubscriptionPlan.pricePerMonth}</div>
                    </div>
                    <div className="text-[#7C98B6] text-[12px]" >{chosenSubscriptionPlan.planDisplayName} Plan</div>

                    <div className="flex mt-[10px]" >
                        <div className="font-[500] text-[#26435F] text-[14px]" >Extensions</div>
                        <div className="border-dotted border-b-[1px] border-[#26435F] grow" ></div>
                        <div className="font-[500] text-[#26435F] text-[14px]" >{CurrencyNameToSymbole(chosenSubscriptionPlan.currency) + chosenExtensionPrice}</div>
                    </div>
                    <div className="text-[#7C98B6] text-[12px]" >Assignments</div>

                    <div className="flex mt-[10px]" >
                        <div className="font-[500] text-[#24A3D9] text-[16px]" >Total</div>
                        <div className="border-dotted border-b-[1px] border-[#24A3D9] grow" ></div>
                        <div className="font-[500] text-[#24A3D9] text-[16px]" >{CurrencyNameToSymbole(chosenSubscriptionPlan.currency) + totalPrice}</div>
                    </div>
                </div>

                {
                    isCCRequired ? (
                        <StripeCardDetailWidget
                            chosenSubscriptionObjectFromAPI={chosenSubscriptionObjectFromAPI}
                            stripeCustomerId={stripeCustomerId}
                        />
                    ) : (
                        <>
                            <img
                                className="ml-[30px] mt-[20px] w-9/12"
                                src={creditCardSVG}
                            />

                            <div className="font-[500] mt-[25px] text-center text-[t#26435F] text-[16px] w-full" >
                                {
                                    isCCRequired ? "Card Required!" : "Card Not Required!"
                                }
                            </div>

                            <div className="font-[100] mt-[15px] text-center text-[t#26435F] text-[12px] whitespace-pre-line w-full" >
                                {
                                    isCCRequired ? 
                                    `Click the button below to make 
                                    the subscription payment. Please 
                                    keep your card ready with you.` : 
                                    `Your free trial is on us! 
                                    Are you ready?!`
                                }
                            </div>
                        </>
                    )
                }

                {/* <img
                    className="ml-[30px] mt-[20px] w-9/12"
                    src={creditCardSVG}
                />

                <div className="font-[500] mt-[25px] text-center text-[t#26435F] text-[16px] w-full" >
                    {
                        isCCRequired ? "Card Required!" : "Card Not Required!"
                    }
                </div>

                <div className="font-[100] mt-[15px] text-center text-[t#26435F] text-[12px] whitespace-pre-line w-full" >
                    {
                        isCCRequired ? 
                        `Click the button below to make 
                        the subscription payment. Please 
                        keep your card ready with you.` : 
                        `Your free trial is on us! 
                        Are you ready?!`
                    }
                </div> */}
            </div>

            
        </div>
    )
}

export default ReviewProduct;