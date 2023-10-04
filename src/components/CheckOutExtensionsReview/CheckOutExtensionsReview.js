import PrimaryButton from "../Buttons/PrimaryButton"
import SecondaryButton from "../Buttons/SecondaryButton"

export default function CheckOutExtensionsReview({
    canAddPromoCode = false,
    className,
    description = [],
    extensionPriceOption = {
        planName: "",
        planDisplayName: "",
        description: [],
        pricePerMonth: 0,
        currency: ""
    },
    planName,
    planDisplayName,
}) {
    return (
        <div className={`flex flex-col pb-[10px] pl-[20px] pr-[30px] pt-[20px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] w-full ${className}`}>
            <div className="flex justify-between">
                <div className="w-7/12">
                    <div className="font-semibold text-[#26435F] text-[16px]">{planDisplayName}</div>

                    <div className="font-semibold text-[#24A3D9] text-[15px]">{extensionPriceOption?.planDisplayName}</div>

                    <ul className="ml-[20px]">
                        {
                            extensionPriceOption?.description.map(item => {
                                return (
                                    <li className="list-disc text-[#26435F] text-[14px]">{item}</li>
                                )
                            })
                        }
                    </ul>
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