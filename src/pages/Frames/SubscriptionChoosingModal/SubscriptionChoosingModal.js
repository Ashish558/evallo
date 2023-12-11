import {
    useEffect,
    useState
} from "react";
import SubscriptionSelectionWidget from "../../../components/SubscriptionSelectionWidget/SubscriptionSelectionWidget";
import { SubscriptionPackDescriptions } from "./DummyData/SubscriptionPackDescriptions";
import { CurrencyNameToSymbole } from "../../../utils/utils";
import greenCheckIcon from "../../../assets/icons/green-check-icon.svg";
import { useSelector } from "react-redux";

function SubscriptionChoosingModal({
    className,
    subscriptionPlanInfo,
    subscriptionsInfoFromAPI,
    chosenSubscriptionPlanName,
    SetChosenSubscriptionPlanName,
    activeSubscriptionName,
    updateSubscriptionMode = false,
    renewProductMode = false,
}) {
    const [productDescriptions, SetProductDescriptions] = useState([]);
    const {
        activeSubscriptionInfo
    } = useSelector((state) => state.subscription);

    useEffect(() => {
        SetProductDescriptions(SubscriptionPackDescriptions);
    },[]);

    useEffect(() => {
        console.log("updateSubscriptionMode");
        console.log(updateSubscriptionMode);
    }, []);

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


                        if(plan.planName === activeSubscriptionInfo?.planName && updateSubscriptionMode) {
                            return (
                                <div className="mb-[40px] ml-[60px] mt-[40px] w-9/12" >
                                    <div className="flex w-full" >
                                        <img 
                                            src={greenCheckIcon}
                                        />
                                        <div className="ml-[17.5px]" >
                                            <div 
                                                className={`font-[600] text-[18.67px]`}
                                            >
                                                <span className="text-[#26435F]" >{plan.planDisplayName + " - "}</span>
                                                <span className="text-[#24A3D9]" >{CurrencyNameToSymbole(plan.currency)}{plan.pricePerMonth}/month</span>
                                            </div>

                                            <div className="font-[100] text-[15px]">
                                            Active Tutors Allowed - {plan.activeTutorsAllowed === Infinity ? "unlimited" : plan.activeTutorsAllowed}
                                            </div>

                                            <div className="text-[#38C980] text-[15px]" >
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
                                freeTrialDays={!(updateSubscriptionMode || renewProductMode) ? plan.freeTrialDays : 0}
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
                {
                    true ? (
                        <>
                            <div className="font-[200] ml-[30px] mt-[68px] text-[#FFA28D] text-[12px]" >What’s Included?</div>
                            <div className="ml-[35px] w-11/12" >
                                {
                                    !(productDescriptions === undefined || productDescriptions === null || productDescriptions.length === 0) ?
                                    (
                                        productDescriptions.map((item, index) => {
                                            return (
                                                <div className="flex mb-[5px]" key={index} >
                                                    <div className="bg-[#B3BDC7] mt-[7px] rounded-full h-[3px] w-[3px]" ></div>
                                                    <div className="leading-[0.8rem] ml-[10px] w-11/12" >
                                                        <span className="text-[#7C98B6] text-[12px] " >{item.title}</span><span className="font-thin text-[#B3BDC7] text-[12px]" >{" - " + item.description}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (<></>)
                                }
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="font-[700] ml-[30px] mt-[75px] text-[#26435F] text-[15px]" >⚠️ Note: </div>
                            <div className="font-[300] ml-[30px] mt-[20px] text-[12px] w-[289px]" >
                                <div className="text-[#7C98B6]" >
                                When downgrading from one plan to another, the 
                                change only takes effect AFTER the old 
                                subscription has expired and the new (lower) tier 
                                gets started. Your account will only be charged on 
                                that renewal date.
                                </div>

                                <div className="mt-[20px] text-[#517CA8]" >
                                However, when upgrading from a <span className="font-[500]" >lower</span> current 
                                subscription to a <span className="font-[500]" >higher</span> new one, the payment 
                                needs to be made immediately, and the new start 
                                date for subscription is set to THAT date.
                                </div>

                                <div className="font-[500] mt-[20px] text-[#517CA8]" >
                                The remaining days in the old subscription are discarded.
                                </div>
                            </div>
                        </>
                    )
                }
                {/* <div className="font-[200] ml-[30px] mt-[30px] text-[#FFA28D] text-[12px]" >What’s Included?</div>
                <div className="ml-[35px] w-11/12" >
                    {
                        !(productDescriptions === undefined || productDescriptions === null || productDescriptions.length === 0) ?
                        (
                            productDescriptions.map((item, index) => {
                                return (
                                    <div className="flex mb-[5px]" key={index} >
                                        <div className="bg-[#B3BDC7] mt-[7px] rounded-full h-[3px] w-[3px]" ></div>
                                        <div className="leading-[0.8rem] ml-[10px] w-11/12" >
                                            <span className="text-[#7C98B6] text-[12px] " >{item.title}</span><span className="font-thin text-[#B3BDC7] text-[12px]" >{" - " + item.description}</span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (<></>)
                    }
                </div> */}
            </div>
        </div>
    )
}

export default SubscriptionChoosingModal;