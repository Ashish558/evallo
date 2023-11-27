import { useState } from "react";
import creditCardSVG from "../../../assets/ReviewProduct/Credit_cardAsset_1_1.svg";

function ReviewProduct({
    className
}) {
    const [isCardRequired, SetIsCardRequired] = useState(false);
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

            </div>

            <div className="border-l-[1px] border-[#E3E3E3] h-full w-4/12" >
                <div className="ml-[30px] mt-[30px] w-9/12" >
                    <div className="flex" >
                        <div className="font-[500] text-[#26435F] text-[14px]" >Subscription</div>
                        <div className="border-dotted border-b-[1px] border-[#26435F] grow" ></div>
                        <div className="font-[500] text-[#26435F] text-[14px]" >$0.00</div>
                    </div>
                    <div className="text-[#7C98B6] text-[12px]" >Professional Plan</div>

                    <div className="flex mt-[10px]" >
                        <div className="font-[500] text-[#26435F] text-[14px]" >Extensions</div>
                        <div className="border-dotted border-b-[1px] border-[#26435F] grow" ></div>
                        <div className="font-[500] text-[#26435F] text-[14px]" >$0.00</div>
                    </div>
                    <div className="text-[#7C98B6] text-[12px]" >Assignments</div>

                    <div className="flex mt-[10px]" >
                        <div className="font-[500] text-[#24A3D9] text-[16px]" >Total</div>
                        <div className="border-dotted border-b-[1px] border-[#24A3D9] grow" ></div>
                        <div className="font-[500] text-[#24A3D9] text-[16px]" >$0.00</div>
                    </div>
                </div>

                <img
                    className="ml-[30px] mt-[20px] w-9/12"
                    src={creditCardSVG}
                />

                <div className="font-[500] mt-[25px] text-center text-[t#26435F] text-[16px] w-full" >
                    {
                        isCardRequired ? "Card Required!" : "Card Not Required!"
                    }
                </div>

                <div className="font-[100] mt-[15px] text-center text-[t#26435F] text-[12px] whitespace-pre-line w-full" >
                    {
                        isCardRequired ? 
                        `Click the button below to make 
                        the subscription payment. Please 
                        keep your card ready with you.` : 
                        `Your free trial is on us! 
                        Are you ready?!`
                    }
                </div>
            </div>

            
        </div>
    )
}

export default ReviewProduct;