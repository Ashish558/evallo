import SubscriptionSelectionWidget from "../../../components/SubscriptionSelectionWidget/SubscriptionSelectionWidget";

function SubscriptionChoosingModal({
    className,
    subscriptionPlanInfo,
    subscriptionsInfoFromAPI,
    chosenSubscriptionPlanName,
    SetChosenSubscriptionPlanName
}) {
    return (
        <div
            className={`flex h-full w-full ${className}`}
        >
            <div
                className="h-full w-1/2"
            >
                <div className="ml-[30px] mt-[30px]" >
                    <div
                        className={`block text-base font-[500] text-[#26435F] ml-0 text-[14px]`}
                    >Choose Your Subscription Plan</div>
                    <div
                        className={`text-[12px] text-[#26435F] font-[100]`}
                    >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                    </div>
                </div>

                {
                    subscriptionPlanInfo?.map(plan => {
                        const freeTrialStatement = plan.freeTrialDays === 0 ? "Free Trial Not Available" :
                                                plan.freeTrialDays >= 30 ?  `${plan.freeTrialDays / 30} Months Free Trial` :
                                                `${plan.freeTrialDays} Days Free Trial`;

                        return (
                            <SubscriptionSelectionWidget
                                className="mb-[15px] ml-[30px] mt-[15px] w-9/12"
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
                className="border-l-[1px] border-[#E3E3E3] h-full w-1/2"
            >
                <div className="font-[200] ml-[30px] mt-[30px] text-[#FFA28D] text-[12px]" >What’s Included?</div>
            </div>
        </div>
    )
}

export default SubscriptionChoosingModal;