import { useState } from "react"
import styles from "./style.module.css"
import RadioOptionContainer from "../RadioOptionContainer/RadioOptionContainer";

export default function SubscriptionPlan({
    className = "",
    currency = "usd",
    description = new Array(4),
    onChange = function(c){},
    planName,
    planDisplayName,
    pricePerMonth = 0,
    selected
}) {
    const tailwindStyles = {
        selectedPlanName: "font-[600] text-[#24A3D9]",
        unSelectedPlanName: "font-semibold text-[#26435F]"
    }

    const currencySymbol = currency === "usd" ? "$" : "";
    return (
        <RadioOptionContainer
            className={className}
            selected={selected}
            onChange={onChange}
        >
            <div className={`flex h-full items-center justify-between mb-[20px] ml-[10px] mt-[15px] pr-[30px] w-full ${styles.container}`}>
                <div
                    className="h-5/6 text-[#26435F] w-[405px]"
                >
                    <div 
                        className={`text-[16px]
                        ${selected ? tailwindStyles.selectedPlanName : tailwindStyles.unSelectedPlanName}`}
                    >{planDisplayName}</div>
                    <div className="font-[100] text-sm">
                        {description[0]}
                    </div>
                    <div className="font-[100] text-sm">
                        {description[1]}
                    </div>
                    <div className="font-[600] text-sm text-[#24A3D9]">
                        {description[2]}
                    </div>
                    <div className="font-[100] text-sm">
                        {description[3]}<span className="font-[600]">{currencySymbol}{pricePerMonth}/month</span>
                    </div>
                </div>
                <div
                    className="border-2 h-1/5 px-[10px] rounded-[5px] text-[16px] text-[#7C98B6]"
                >
                    More Details
                </div>
            </div>
        </RadioOptionContainer>
        // <div 
        //     className={`flex h-[150px] items-center w-full ${selected ? styles.selectedContainer : styles.unSelectedContainer}`} 
        //     onClick={handleClick}
        // >
        //     <div className="grid grid-cols-[15px_1fr] grid-rows-[15px_1fr] h-5/6 ml-[10px] w-10/12">
        //         <div className={`col-start-1 row-start-1 ${selected ? styles.selectedRadio : styles.unSelectedRadio}`}></div>
        //         <div className="font-semibold text-[#26435F] text-[16px]">{planName}</div>
        //     </div>
        //     <div className="border-2 h-1/5 rounded-[5px] w-2/12">
                
        //     </div>
        // </div>
    )
}