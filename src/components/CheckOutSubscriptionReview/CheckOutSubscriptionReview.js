import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"

export default function CheckOutSubscriptionReview({
    canAddPromoCode = false,
    className,
    description = [],
    planDisplayName,
}) {
    return (
        <div className={`flex flex-col pb-[10px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] w-full ${className}`}>
            <div className="flex justify-between">
                <div>
                    <div className="font-semibold text-[#26435F] text-[16px]">{planDisplayName}</div>
                    {
                        description.map(item => {
                            return (
                                <div className="font-[200] text-[#26435F] text-sm">{item}</div>
                            )
                        })
                    }
                </div>
                <div className="flex flex-col items-end">
                    <SecondaryButton 
                        children={"Change Plan"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] px-[15px] py-[2px] text-[#7C98B6]"}
                    />

                    <div className="grow"></div>
                    <div className="font-semibold text-[#24A3D9]">Free Trial</div>
                    <div className="font-[200] text-[#24A3D9] text-sm">14 days</div>
                </div>
            </div>

            {canAddPromoCode === true ? (<div className="flex h-[40px] items-center mt-[15px]">
                    <SecondaryButton
                        children={"Add Promo Code"}
                        className={"bg-white drop-shadow-[0px_0px_1px_rgba(0,0,0,0.25)] h-full px-[15px] py-[2px] text-[#B3BDC7]"}
                    />

                    <PrimaryButton
                        children={"Apply"}
                        className={"h-5/6 ml-[10px] px-[10px]"}
                    />
            </div>) : (<></>)
            }
        </div>
    )
}