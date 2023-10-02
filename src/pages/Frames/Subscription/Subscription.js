import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import SubscriptionPlan from "../../../components/SubscriptionPlan/SubscriptionPlan";
import styles from "./styles.module.css";
import { subScriptionPlanData } from "./DummyData/SubscriptionPlanData";

export default function Subscription({
    values,
    setValues
}) {
    const subScriptionPlanInfo = subScriptionPlanData
    return (
        <div className="mt-2 mb-3">
            <div>
                <div
                    className={`block text-base font-semibold text-[#26435F] ml-0 text-[16px]`}
                >Choose Your Subscription Plan</div>
                <div
                    className={`text-sm text-[#26435F] font-[300]`}
                >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                </div>
            </div>

            {
                subScriptionPlanInfo.map(plan => {
                    const freeTrialStatement = plan.freeTrialDays === 0 ? "Free Trial Not Available" :
                                               plan.freeTrialDays >= 30 ?  `${plan.freeTrialDays / 30} Months Free Trial` :
                                               `${plan.freeTrialDays} Days Free Trial`;

                    return (
                        <SubscriptionPlan
                            className="mb-[15px] mt-[15px]"
                            planName={plan.planName}
                            description={[
                                `Active Tutors Allowed - ${plan.activeTutorsAllowed === Infinity ? "unlimited" : plan.activeTutorsAllowed}`,
                                `Active Students Allowed - ${plan.activeStudentsAllowed === Infinity ? "unlimited" : plan.activeStudentsAllowed}`,
                                freeTrialStatement + (plan.ccRequired ? " (CC required)" : " (no CC required)"),
                                (plan.freeTrialDays === 0 ? "Flat Monthly Subscription - " : "Flat Monthly Subscription After Free Trial Ends - ")     
                            ]}
                            pricePerMonth={15}
                            selected={plan.planName === values.subscriptionPlan ? true : false}
                            onClick={() => {
                                setValues(values => {
                                    return ({
                                        ...values,
                                        subscriptionPlan: plan.planName
                                    })
                                })
                            }}
                        />
                    )
                })
            }

                <div className="flex items-center mt-[60px] justify-end">
                    <SecondaryButton
                      children="Go back"
                      className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    />
                    <PrimaryButton
                      className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                      
                      children={`Next`}
                    />
                  </div>
        </div>
    )
}