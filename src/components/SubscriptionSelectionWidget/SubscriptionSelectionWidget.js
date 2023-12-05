import { useState } from "react"
import styles from "./style.module.css"
import RadioOptionContainer from "../RadioOptionContainer/RadioOptionContainer";
import { CurrencyNameToSymbole } from "../../utils/utils";

export default function SubscriptionSelectionWidget({
    className = "",
    currency = "usd",
    description = new Array(4),
    onChange = function(c){},
    planName,
    planDisplayName,
    pricePerMonth = 0,
    selected,
    activeTutorsAllowed,
    freeTrialDays
}) {
    const tailwindStyles = {
        selectedPlanName: "font-[600] text-[#24A3D9]",
        unSelectedPlanName: "font-semibold text-[#26435F]"
    }

    const currencySymbol = CurrencyNameToSymbole(currency);
    const freeTrialStatement = freeTrialDays === 0 ? "Free Trial Not Available" :
                                                freeTrialDays >= 30 ?  `${freeTrialDays / 30} Months Free Trial` :
                                                `${freeTrialDays} Days Free Trial`;
    return (
        <RadioOptionContainer
            className={className}
            selected={selected}
            onChange={onChange}
            radioButtonClassName="aspect-square ml-[20px] mt-[23px] h-[15px] w-[15px]"
        >
            <div className={`flex h-full items-center justify-between mb-[12px] ml-[10px] mt-[10px] pr-[30px] w-full ${styles.container}`}>
                <div
                    className="h-5/6 text-[#26435F] w-11/12"
                >
                    <div 
                        className={`text-[18.67px]
                            // ${selected ? tailwindStyles.selectedPlanName : tailwindStyles.unSelectedPlanName}
                        `}
                    >
                        <span className="text-[#26435F]" >{planDisplayName + " - "}</span>
                        <span className="text-[#24A3D9]" >{currencySymbol}{pricePerMonth}/month</span>
                    </div>
                    <div className="font-[100] text-[15px]">
                    Active Tutors Allowed - {activeTutorsAllowed === Infinity ? "unlimited" : activeTutorsAllowed}
                    </div>
                    {
                        freeTrialDays === 0 ? (
                            <div className="font-[100] text-[#26435F] text-[15px]" >
                                {freeTrialStatement}
                            </div>
                        ) : (
                            <div className="font-[300] text-[#38C980] text-[15px]" >
                                {freeTrialStatement}
                            </div>
                        )
                    }
                </div>
            </div>
        </RadioOptionContainer>
    )
}