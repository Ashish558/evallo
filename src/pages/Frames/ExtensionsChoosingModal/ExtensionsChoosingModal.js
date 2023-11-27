import React, {
    useState,
    useEffect,
} from "react";
import ExtensionSelectionWidget from "../../../components/ExtensionSelectionWidget/ExtensionSelectionWidget";

function ExtensionsChoosingModal({
    className,
    extensions,
    setExtensions,
    extensionPlansInfo,
}) {

    const [productDescriptions, SetProductDescriptions] = useState([]);
    const [productDescriptionsTitle, SetProductDescriptionsTitle] = useState("");

    useEffect(() => {
        SetProductDescriptionsTitle("Extensions");
        SetProductDescriptions([
            {
                title: "Assignments & Content",
                description: "",
            },
            {
                title: "Mass Emailer",
                description: "(coming soon)",
            },
            {
                title: "In-app chat / calls",
                description: "(coming soon)",
            },
            {
                title: "Mobile Application",
                description: "(coming soon)",
            },
            {
                title: "Session Recordings",
                description: "(coming soon)",
            },
            {
                title: "Digital Whiteboards",
                description: "(coming soon)",
            },
        ])
    }, []);

    const handleCheckboxChange = (text, arr, setValue) => {
        const temp = arr.map((topic) => {
            return topic.text === text
            ? { ...topic, checked: !topic.checked }
            : { ...topic };
        });
        setValue(temp);
    };

    return (
        <div
            className={`flex h-full w-full ${className}`}
        >
            <div className="h-full w-8/12" >
                <div className="ml-[30px] mt-[30px]" >
                    <div
                        className={`block text-base font-[500] text-[#26435F] ml-0 text-[14px]`}
                    >Select Extensions / Add-Ons</div>
                    <div
                        className={`text-[12px] text-[#26435F] font-[100]`}
                    >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                    </div>
                </div>

                <div className="ml-[30px] mt-[20px] " style={{width: "89%"}} >
                    {/* <ExtensionSelectionWidget
                        className="w-full"
                        planDisplayName="Assignments"
                        productGraphStatement="Maximum number of Assignments per month"
                        onChange={() => {handleCheckboxChange("Assignments / Content", extensions, setExtensions)}}
                    /> */}

                    {
                        extensions?.map((item,index) => {
                            if(!extensionPlansInfo || extensionPlansInfo === undefined || extensionPlansInfo === null) return (<React.Fragment key={index}></React.Fragment>)
                            if(extensionPlansInfo[0]?.planName === "") return (<React.Fragment key={index}></React.Fragment>)
                            let extension = extensionPlansInfo.find(i => i.planName === item.text)
                            if(!extension || extension === undefined || extension === null) return (<React.Fragment key={index}></React.Fragment>)
                            return (
                                <ExtensionSelectionWidget
                                    className="w-full"
                                    extensions={extensions}
                                    setExtensions={setExtensions}
                                    planName={extension.planName}
                                    planDisplayName={extension.planDisplayName}
                                    productGraphStatement="Maximum number of Assignments per month"
                                    selected={item.checked}
                                    chosenPackage={item.packageName}
                                    extensionPriceOption={extension.extensionPriceOption}
                                    onChange={() => {handleCheckboxChange(item.text, extensions, setExtensions)}}
                                />
                            )
                        })
                    }
                </div>

                
            </div>

            <div className="border-l-[1px] border-[#E3E3E3] overflow-hidden h-full w-4/12" >
                <div className="font-[200] ml-[30px] mt-[30px] text-[#FFA28D] text-[12px]" >{productDescriptionsTitle}</div>
                <div className="ml-[35px] overflow-y-scroll w-11/12" >
                    {
                        !(productDescriptions === undefined || productDescriptions === null || productDescriptions.length === 0) ?
                        (
                            productDescriptions.map(item => {
                                return (
                                    <div className="flex mb-[5px]" >
                                        <div className="bg-[#B3BDC7] mt-[7px] rounded-full h-[3px] w-[3px]" ></div>
                                        <div className="leading-[0.8rem] ml-[10px] w-11/12" >
                                            <span className="text-[#7C98B6] text-[10px] " >{item.title}</span><span className="font-thin text-[#B3BDC7] text-[10px]" >{" - " + item.description}</span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (<></>)
                    }
                </div>
            </div>
        </div>
    )
}

export default ExtensionsChoosingModal;