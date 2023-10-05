import RadioOptionContainer from "../RadioOptionContainer/RadioOptionContainer";

export default function ExtensionRadioOption({
    className,
    currency = "",
    description = [],
    onChange = function(c){},
    planName = "",
    planDisplayName = "",
    pricePerMonth = 0,
    selected,
}) {
    return (
        <RadioOptionContainer
            className={`pb-[15px] ${className}`}
            selected={selected}
            onChange={onChange}
        >
            <div className={`ml-[9px] mt-[15px] ${selected ? "text-[#24A3D9]" : "text-[#26435F]"}`}>
                <div>{planDisplayName}</div>
                <ul className="ml-[20px] ">
                    {
                        description.map(item => {
                            return (
                                <li className="list-disc text-[12px]">{item}</li>
                            )
                        })
                    }
                </ul>
                <div>$ {pricePerMonth} / month</div>
            </div>
        </RadioOptionContainer>
    )
}