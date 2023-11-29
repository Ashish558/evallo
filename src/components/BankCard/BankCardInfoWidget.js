import { useEffect, useState } from "react";
import visaIcon from "../../assets/BankCard/visa.svg";
import mastercardIcon from "../../assets/BankCard/mastercard.svg";


function BankCardInfoWidget({
    className,
    style,
    cardLogo,
    cardNumber,
    cardNumberLastFourDigits,
    isDefault,
}) {
    const cardLogoToBeDisplayed = cardLogo ? cardLogo : visaIcon;
    const [cardEndingIn, SetCardEndingIn] = useState("");

    useEffect(() => {
        if(cardNumber) {
            SetCardEndingIn(cardNumber.slice(-4));
            return;
        }

        if(cardNumberLastFourDigits) {
            SetCardEndingIn(cardNumberLastFourDigits);
            return;
        }

        SetCardEndingIn("XXXX");
    },[]);

    return (
        <div className={`bg-[#fff] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] aspect-[270/106] w-[270px] ${className}`} style={{...style}} >
            <div className="flex items-start ml-[20px] mt-[20px]" >
                <img
                    src={cardLogoToBeDisplayed}
                />
                
                <div className="ml-[10px]" >
                    <div className="font-[600] text-[#26435F] text-[14px]" >Card ending in **** {cardEndingIn}</div>
                    <div className="font-[100] text-[#26435F] text-[12px]" >Expires on</div>
                    {
                        isDefault ? (
                            <div className="font-[100] text-[#38C980] text-[12px]" >Default Payment Method</div>
                        ) : (
                            <button className="font-[500] text-[#24A3D9] text-[12px]" >Set As Default</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default BankCardInfoWidget;