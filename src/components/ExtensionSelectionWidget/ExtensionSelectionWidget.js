import { useRef } from "react";
import CheckBoxOptionContainer from "../CheckBoxOptionContainer/CheckBoxOptionContainer";
import { useEffect } from "react";
import { useState } from "react";
import { CurrencyNameToSymbole } from "../../utils/utils";
import styles from "./style.module.css";

/*
    TYPES 

    extensionPriceOption: [
        {
            planName: "",
            product: "",
            pricePerMonth: 0,
            currency: "",
            freeTrialDays: 0,
        }
    ]
*/

function ExtensionSelectionWidget({
    className,
    selected, 
    onChange,
    planName,
    planDisplayName,
    chosenPackage,
    extensionPriceOption,
    productGraphStatement,
    extensions,
    setExtensions,
    isDisabled,
    descriptionInDisabledState,
}) {

    const handleRadioButtonClick = (packageName, arr, extensionName, setValue) => {
        const temp = arr.map((topic) => {
            if(topic.text !== extensionName) return topic;
            return {
                text: topic.text,
                checked: topic.checked,
                packageName: packageName
            }
        });
        setValue(temp);
    };

    return (
        <CheckBoxOptionContainer
            className={`${className}`}
            onChange={onChange}
            selected={selected}
        >
            <div className="w-full" >
                <div className="flex items-center mt-[20px]" style={{width: "91%"}} >
                    <div 
                        className={`font-[600] text-[#26435F] text-[14px] 
                                    ${styles.planDisplayName}
                                    ${isDisabled ? styles.isDisabled : ""}
                                    `} 
                    >{planDisplayName}</div>
                    <div className="grow" ></div>
                    {
                        isDisabled ? (
                            <></>
                        ) : (
                            <div className="font-[100] text-[#38C980] text-[12px]" >1 Month Free Trial</div>
                        )
                    }
                    
                </div>

                {
                    isDisabled ? (
                        <div className="font-[600] mb-[20px] text-[#E0E0E0] text-[12px]" >
                            {descriptionInDisabledState}
                        </div>
                    ) : (
                        <div className="flex items-center mt-[20px] pb-[30px] w-11/12" >
                            {
                                !(extensionPriceOption === undefined || extensionPriceOption === null || extensionPriceOption.length === 0) ? (
                                    <>
                                        <div className="font-[300] text-[#26435F] text-[14px]" >Select plan:</div>

                                        <div className="flex flex-col items-center ml-[10px] w-9/12" >
                                            <div className="font-[300] text-[#24A3D9] text-[14px]" >{productGraphStatement}</div>

                                            <div className="flex flex-col justify-center mt-[10px] relative w-full" >
                                                <div className={`absolute border-[#B3BDC7] border-[1px] left-[23px] w-10/12 z-[1]`} ></div>

                                                <div className="flex items-center justify-between w-full z-[2]" >

                                                {
                                                    extensionPriceOption.map(item => {
                                                        const isSelected = item.planName === chosenPackage;
                                                        return (
                                                            <button className={`flex flex-col items-center px-[15px] py-[5px] rounded-[10px]
                                                                            ${isSelected ? "shadow-[0px_0px_10px_rgba(255,162,141,0.5)]" : ""}
                                                                            ${isSelected ? "bg-[#FFFFFFB2]" : ""}
                                                            `} 
                                                                onClick={() => {handleRadioButtonClick(item.planName, extensions, planName, setExtensions)}}
                                                            >
                                                                <div className={`
                                                                                ${isSelected ? "text-[#24A3D9]" : "text-[#24A3D980]"}
                                                                `} >500</div>
                                                                <div className={`aspect-square border-[2px] mt-[5px] rounded-full w-[10px]
                                                                                ${isSelected ? "bg-[#FFA28D]" : "bg-[#fff]"}
                                                                                ${isSelected ? "border-[#FFA28D]" : "border-[#B3BDC7]"}
                                                                                ${isSelected ? "shadow-[0px_0px_10px_rgba(255,162,141,1)]" : ""}
                                                                `} ></div>
                                                                <div className={`mt-[5px]
                                                                                ${isSelected ? "text-[#FFA28D]" : "text-[#FFA28D80]"}
                                                                `} >{CurrencyNameToSymbole(item.currency)}{item.pricePerMonth}</div>
                                                            </button>
                                                        )
                                                    })
                                                }
                                                </div>   
                                            </div>

                                            <div className="mt-[10px] text-[#FFA28D]" ><span className="text-[14px]" >Cost per month</span> <span className="text-[12px]" >(after free trial has ended)</span></div>
                                        </div>
                                    </>
                                ) : (<></>)
                            } 
                        </div>
                    )
                }

                
            </div>
        </CheckBoxOptionContainer>
    )
}

export default ExtensionSelectionWidget;