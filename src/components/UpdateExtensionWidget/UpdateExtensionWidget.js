import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { CurrencyNameToSymbole, getFormattedDate } from "../../utils/utils";
import styles from "./style.module.css";
import CheckboxGreenIcon from "../../assets/icons/check-box-green.svg";

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

function UpdateExtensionWidget({
    className,
    selected, 
    onChange,
    onBodyClicked,
    planName,
    planDisplayName,
    chosenPackage,
    extensionPriceOption,
    productGraphStatement,
    extensions,
    setExtensions,
    isDisabled,
    descriptionInDisabledState,
    freeTrialExpiryDate,
}) {

    const { dateFormat } = useSelector((state) => state.user);
    const [hasFreeTrialExpired, SetHasFreeTrialExpired] = useState(true);
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

    useEffect(() => {
        console.log("ExtensionSelectionWidget - planDisplayName")
        console.log(planDisplayName);
    }, []);

    useEffect(() => {
        if(!(freeTrialExpiryDate && freeTrialExpiryDate.constructor && freeTrialExpiryDate.constructor.name === "Date")) {
            SetHasFreeTrialExpired(true);
            return;
        }

        if(freeTrialExpiryDate < (new Date())) {
            SetHasFreeTrialExpired(true);
            return;
        }

        SetHasFreeTrialExpired(false);
    }, [freeTrialExpiryDate])

    return (
        <div
            className={`flex rounded-[10px] shadow-[0px_0px_20px_rgba(36,163,217,0.2)] ${className}`}
            onChange={onChange}
            selected={selected}
            onBodyClicked={onBodyClicked}
        >
            <img
                src={CheckboxGreenIcon}
                className="ml-[17.22px] mt-[22.22px] h-[22.18px] w-[22.18px]"
            />
            <div className="ml-[10.38px] w-[650px] h-[270px]" >
                <div className="flex items-center mt-[20px]" style={{width: "91%"}} >
                    <div 
                        className={`font-[600] text-[#26435F] text-[18.67px] 
                                    ${styles.planDisplayName}
                                    ${isDisabled ? styles.isDisabled : ""}
                                    `} 
                    >{planDisplayName}</div>
                    <div className="grow" ></div>
                    {
                        hasFreeTrialExpired ? (
                            <div className="font-[300] text-[#26435F] text-[15px]" >Free Trial has ended.</div>
                        ) : (
                            <div className="font-[500] text-[#38C980] text-[15px]" >
                                Free Trial till {getFormattedDate(freeTrialExpiryDate, dateFormat)}
                            </div>
                        )
                    }
                    {/* {
                        isDisabled ? (
                            <></>
                        ) : (
                            <div className="font-[100] text-[#38C980] text-[18px]" >1 Month Free Trial</div>
                        )
                    } */}
                    
                </div>

                {
                    isDisabled ? (
                        <div className="font-[600] mb-[20px] text-[#E0E0E0] text-[15px]" >
                            {descriptionInDisabledState}
                        </div>
                    ) : (
                        <div className="flex items-center mt-[34px] pb-[30px] w-11/12" >
                            {
                                !(extensionPriceOption === undefined || extensionPriceOption === null || extensionPriceOption.length === 0) ? (
                                    <>
                                        <div className="font-[300] text-[#26435F] text-[15px]" >Select plan:</div>

                                        <div className="flex flex-col items-center ml-[10px] w-9/12" >
                                            <div className="font-[300] text-[#24A3D9] text-[15px]" >{productGraphStatement}</div>

                                            <div className="flex flex-col justify-center mt-[10px] relative w-full" >
                                                <div className={`absolute border-[#B3BDC7] border-[1px] left-[23px] w-[350px] z-[1]`} ></div>

                                                <div className="flex items-center justify-between w-[409px] z-[2]" >

                                                {
                                                    extensionPriceOption.map((item, index) => {
                                                        const isSelected = item.planName === chosenPackage;
                                                        const numberOfAssignments = index === 0 ? 100 : index === 1 ? 400 : index === 2 ? "1,500" :  "Unlimited" 
                                                        return (
                                                            <button 
                                                                key={index}
                                                                className={`flex flex-col items-center px-[15px] py-[5px] rounded-[10px]
                                                                            ${isSelected ? "shadow-[0px_0px_10px_rgba(255,162,141,0.5)]" : ""}
                                                                            ${isSelected ? "bg-[#FFFFFFB2]" : ""}
                                                            `} 
                                                                onClick={() => {handleRadioButtonClick(item.planName, extensions, planName, setExtensions)}}
                                                            >
                                                                <div className={`
                                                                                ${isSelected ? "text-[#24A3D9]" : "text-[#24A3D980]"}
                                                                `} >{numberOfAssignments}</div>
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

                                            <div className="mt-[10px] text-[#FFA28D]" ><span className="text-[15px]" >Cost per month</span> <span className="text-[12px]" >(after free trial has ended)</span></div>
                                        </div>
                                    </>
                                ) : (<></>)
                            } 
                        </div>
                    )
                }

                
            </div>
        </div>
    )
}

export default UpdateExtensionWidget;