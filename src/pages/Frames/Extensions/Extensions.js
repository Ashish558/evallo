import React from "react";
import ExtensionPlan from "../../../components/ExtensionPlan/ExtensionPlan";
import {
    extensionPlansInfo as extensionPlansData
} from "./DummyData/ExtensionPlansInfo"
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

export default function Extensions({
    extensions = [
        {
            text: "",
            checked: false,
            packageName: ""
        }
    ],
    setExtensions,
    extensionPlansInfo = [
        {
            id: "",
            planName: "",
            planDisplayName: "",
            description: [],
            extensionPriceOptionHeadingLabel: "",
            extensionPriceOptionHeadingStatement: "",
            extensionPriceOption: []
        }
    ],
    values,
    setValues,
    setFrames,
    setcurrentStep
}) {
    // const extensionPlansInfo = extensionPlansData;

    const handleCheckboxChange = (text, arr, setValue) => {
        const temp = arr.map((topic) => {
          return topic.text === text
            ? { ...topic, checked: !topic.checked }
            : { ...topic };
        });
        setValue(temp);
      };

    const handleSubmit = () => {
        setFrames((prev) => {
            return { ...prev, extensions: false, checkout: true };
        });
        setcurrentStep(currentStep => currentStep + 1)
    };

    const handleBack = () => {
        setFrames((prev) => {
            return { ...prev, extensions: false, subscription: true };
        });
        setcurrentStep(currentStep => currentStep - 1)
    };
      

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

                extensions?.map((item,index) => {
                    if(!extensionPlansInfo || extensionPlansInfo === undefined || extensionPlansInfo === null) return (<React.Fragment key={index}></React.Fragment>)
                    if(extensionPlansInfo[0]?.planName === "") return (<React.Fragment key={index}></React.Fragment>)
                    let extension = extensionPlansInfo.find(i => i.planName === item.text)
                    if(!extension || extension === undefined || extension === null) return (<React.Fragment key={index}></React.Fragment>)
                    return (
                        <ExtensionPlan
                            key={extension.id}
                            className={"mb-[20px] pb-[20px]"}
                            selected={item.checked}
                            planName={extension.planName}
                            planDisplayName={extension.planDisplayName}
                            description={extension.description}
                            chosenPackage={item.packageName}
                            extensionPriceOptionHeadingLabel={extension.extensionPriceOptionHeadingLabel}
                            extensionPriceOptionHeadingStatement={extension.extensionPriceOptionHeadingStatement}
                            extensionPriceOption={extension.extensionPriceOption}
                            extensions={extensions}
                            setExtensions={setExtensions}
                            onChange={() => {handleCheckboxChange(item.text, extensions, setExtensions)}}
                        />
                    )
                })

            }

            <div className="border-[1px] mt-[25px] w-full"></div>

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    
                    children={`Next`}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    )
}

