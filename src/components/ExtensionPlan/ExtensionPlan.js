import CheckBoxOptionContainer from "../CheckBoxOptionContainer/CheckBoxOptionContainer";
import ExtensionRadioOption from "../ExtensionRadioOption/ExtensionRadioOption";

export default function ExtensionPlan({
    className,
    selected, 
    onChange = function(c) {},
    planName = "",
    planDisplayName = "",
    description = [],
    chosenPackage = "",
    extensionPriceOption = [],
    extensionPriceOptionHeadingLabel = "",
    extensionPriceOptionHeadingStatement = "",
    extensions,
    setExtensions
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
                                            selected={item.planName === chosenPackage}
                                            planName={item.planName}
                                            planDisplayName={item.planDisplayName}
                                            description={item.description}
                                            pricePerMonth={item.pricePerMonth}
                                            currency={item.currency}
                                            onChange={() => {handleRadioButtonClick(item.planName, extensions, planName, setExtensions)}}
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
