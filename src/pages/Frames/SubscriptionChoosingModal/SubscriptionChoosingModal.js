import {
    useEffect,
    useState
} from "react";
import SubscriptionSelectionWidget from "../../../components/SubscriptionSelectionWidget/SubscriptionSelectionWidget";
import { SubscriptionPackDescriptions } from "./DummyData/SubscriptionPackDescriptions";
import { CurrencyNameToSymbole } from "../../../utils/utils";
import greenCheckIcon from "../../../assets/icons/green-check-icon.svg";

function SubscriptionChoosingModal({
    className,
    subscriptionPlanInfo,
    subscriptionsInfoFromAPI,
    chosenSubscriptionPlanName,
    SetChosenSubscriptionPlanName,
    activeSubscriptionName,
}) {
    const [productDescriptions, SetProductDescriptions] = useState([]);

    useEffect(() => {
        SetProductDescriptions(SubscriptionPackDescriptions);
    },[])

    return (
        <div
            className={`flex h-full w-full ${className}`}
        >
            <div
                className="h-full w-[550px]"
            >
                <div className="ml-[50px] mt-[68px] mb-[30px]" >
                    <div
                        className={`block text-base font-[500] text-[#26435F] ml-0 text-[18.67px]`}
                    >Choose Your Subscription Plan</div>
                    <div
                        className={`text-[15px] text-[#26435F] font-[100]`}
                    >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                    </div>
                </div>

                {
                    subscriptionPlanInfo?.map(plan => {
                        const freeTrialStatement = plan.freeTrialDays === 0 ? "Free Trial Not Available" :
                                                plan.freeTrialDays >= 30 ?  `${plan.freeTrialDays / 30} Months Free Trial` :
                                                `${plan.freeTrialDays} Days Free Trial`;


                        if(plan.planName === activeSubscriptionName) {
                            return (
                                <div className="mb-[25px] ml-[30px] mt-[25px] w-9/12" >
                                    <div className="flex w-full" >
                                        <img 
                                            src={greenCheckIcon}
                                        />
                                        <div className="ml-[20px]" >
                                            <div 
                                                className={`font-[600] text-[12px]`}
                                            >
                                                <span className="text-[#26435F]" >{plan.planDisplayName + " - "}</span>
                                                <span className="text-[#24A3D9]" >{CurrencyNameToSymbole(plan.currency)}{plan.pricePerMonth}/month</span>
                                            </div>

                                            <div className="font-[100] text-[12px]">
                                            Active Tutors Allowed - {plan.activeTutorsAllowed === Infinity ? "unlimited" : plan.activeTutorsAllowed}
                                            </div>

                                            <div className="text-[#38C980] text-[12px]" >
                                                Free Trial till
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        return (
                            <SubscriptionSelectionWidget
                                className="mb-[15px] ml-[50px] mt-[20px] h-[107px] w-[400px]"
                                key={plan.id}
                                planName={plan.planName}
                                planDisplayName={plan.planDisplayName}
                                description={[
                                    `Active Tutors Allowed - ${plan.activeTutorsAllowed === Infinity ? "unlimited" : plan.activeTutorsAllowed}`,
                                    // `Active Students Allowed - ${plan.activeStudentsAllowed === Infinity ? "unlimited" : plan.activeStudentsAllowed}`,
                                    freeTrialStatement + (plan.ccRequired ? " (CC required)" : " (no CC required)"),
                                    (plan.freeTrialDays === 0 ? "Flat Monthly Subscription - " : "Flat Monthly Subscription After Free Trial Ends - ")     
                                ]}
                                activeTutorsAllowed={plan.activeTutorsAllowed}
                                freeTrialDays={plan.freeTrialDays}
                                pricePerMonth={plan.pricePerMonth}
                                currency={plan.currency}
                                selected={plan.planName === chosenSubscriptionPlanName ? true : false}
                                onChange={() => {
                                    SetChosenSubscriptionPlanName(plan.planName);

                                    /* setValues(values => {
                                        return ({
                                            ...values,
                                            subscriptionPlan: plan.planName
                                        })
                                    }) */

                                    const chosenSubscriptionFromAPI = subscriptionsInfoFromAPI.find(item => item.id === plan.id)
                                    sessionStorage.setItem("chosenSubscriptionFromAPI", JSON.stringify(chosenSubscriptionFromAPI));
                                }}
                                
                            />
                        )
                    })
                }
            </div>
            
            <div
                className="border-l-[1px] border-[#E3E3E3] flex flex-col h-full w-[549px]"
            >
                <div className="font-[200] ml-[30px] mt-[30px] text-[#FFA28D] text-[12px]" >What’s Included?</div>
                <div className="ml-[35px] w-11/12" >
                    {
                        !(productDescriptions === undefined || productDescriptions === null || productDescriptions.length === 0) ?
                        (
                            productDescriptions.map((item, index) => {
                                return (
                                    <div className="flex mb-[5px]" key={index} >
                                        <div className="bg-[#B3BDC7] mt-[7px] rounded-full h-[3px] w-[3px]" ></div>
                                        <div className="leading-[0.8rem] ml-[10px] w-11/12" >
                                            <span className="text-[#7C98B6] text-[10px] " >{item.title}</span><span className="font-thin text-[#B3BDC7] text-[10px]" >{" - " + item.description}</span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (<></>)
                    }
                </div>
            </div>
        </div>
    )
}

export default SubscriptionChoosingModal;