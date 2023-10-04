import ExtensionPlan from "../../../components/ExtensionPlan/ExtensionPlan";
import {
    extensionPlansInfo as extensionPlansData
} from "./DummyData/ExtensionPlansInfo"
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

export default function Extensions({
    values,
    setValues,
}) {
    const extensionPlansInfo = extensionPlansData;
    return (
        <div
            className="mt-2 mb-3"
        >
            <div className="mb-[10px]">
                <div
                    className={`block text-base font-semibold text-[#26435F] ml-0 text-[16px]`}
                >Select Extensions / Add-Ons</div>
                <div
                    className={`text-sm text-[#26435F] font-[300]`}
                >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                </div>
            </div>

            {
                extensionPlansInfo.map(item => {
                    return (
                        <ExtensionPlan
                            className={"mb-[20px] pb-[20px]"}
                            selected={true}
                            planName={item.planName}
                            planDisplayName={item.planDisplayName}
                            description={item.description}
                            extensionPriceOptionHeadingLabel={item.extensionPriceOptionHeadingLabel}
                            extensionPriceOptionHeadingStatement={item.extensionPriceOptionHeadingStatement}
                            extensionPriceOption={item.extensionPriceOption}
                            onChange={() => {}}
                        />
                    )
                })
            }

            <div className="border-[1px] mt-[25px] w-full"></div>

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    
                    children={`Next`}
                />
            </div>
        </div>
    )
}

