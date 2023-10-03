import CheckBoxOptionContainer from "../CheckBoxOptionContainer/CheckBoxOptionContainer";
import ExtensionRadioOption from "../ExtensionRadioOption/ExtensionRadioOption";

export default function ExtensionPlan({
    className,
    selected, 
    onChange = function(c) {},
    planName = "",
    planDisplayName = "",
    description = [],
    extensionPriceOption = [],
    extensionPriceOptionHeadingLabel = "",
    extensionPriceOptionHeadingStatement = ""
}) {
    return (
        <CheckBoxOptionContainer
        className={`${className}`}
            onChange={onChange}
            selected={selected}
        >
            <div className="mt-[18px]">
                <div
                    className="text-base font-semibold text-[#26435F] text-[16px]"
                >{planDisplayName}</div>
                <ul className="ml-[20px]">
                    {
                        description.map(item => {
                            return (
                                <li className="list-disc text-[#26435F] text-[12px]">{item}</li>
                            )
                        })
                    }
                </ul>

                {extensionPriceOption.length !== 0 ? (
                    <>
                        <div className="mt-[20px] text-[#26435F] text-[12px]"><span className="font-semibold text-[13px]">{extensionPriceOptionHeadingLabel}</span>{extensionPriceOptionHeadingStatement}</div>

                        <div
                            className="auto-rows-auto gap-[20px] grid grid-cols-2 mt-[7px] w-11/12"
                        >
                            {
                                extensionPriceOption.map(item => {
                                    return (
                                        <ExtensionRadioOption
                                            selected={false}
                                            planName={item.planName}
                                            planDisplayName={item.planDisplayName}
                                            description={item.description}
                                            pricePerMonth={item.pricePerMonth}
                                            currency={item.currency}
                                        />
                                    )
                                })
                            }
                        </div>
                    </>
                ) : (<></>)}

                
            </div>
        </CheckBoxOptionContainer>
    )
}
