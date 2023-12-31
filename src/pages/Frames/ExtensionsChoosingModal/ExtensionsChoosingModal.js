import React, {
    useState,
    useEffect,
} from "react";
import ExtensionSelectionWidget from "../../../components/ExtensionSelectionWidget/ExtensionSelectionWidget";
import styles from "./style.module.css";
import { extensionProductDescriptions } from "./DummyData/ExtensionsProductDescriptions";
import UpdateExtensionWidget from "../../../components/UpdateExtensionWidget/UpdateExtensionWidget";
import { useSelector } from "react-redux";

const listOfExtensions = [
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
]

function ExtensionsChoosingModal({
    className,
    extensions,
    setExtensions,
    extensionPlansInfo,
    updateExtensionMode = false,
}) {
    const {
        activeExtensionInfo
    } = useSelector(state => state.subscription);
    const [productDescriptions, SetProductDescriptions] = useState([]);
    const [productDescriptionsTitle, SetProductDescriptionsTitle] = useState("");
    const [extensionNameInFocus, SetExtensionNameInFocus] = useState("");

    useEffect(() => {
        console.log("extensions");
        console.log(extensions);

        console.log("extensionPlansInfo");
        console.log(extensionPlansInfo);
    }, []);

    useEffect(() => {
        console.log("extensionNameInFocus - " + extensionNameInFocus);
        const extInFocus = extensionProductDescriptions.find(item => item.planName === extensionNameInFocus);
        if(extInFocus === undefined || extInFocus === null) {
            SetProductDescriptionsTitle("Extensions");
            SetProductDescriptions(listOfExtensions);
            return;
        }

        SetProductDescriptionsTitle(extInFocus.planDisplayName);
        if(extInFocus.info) {
            SetProductDescriptions(extInFocus.info);
        }
    }, [extensionNameInFocus]);

    /* useEffect(() => {
        SetProductDescriptionsTitle("Extensions");
        SetProductDescriptions(listOfExtensions);
    }, []); */

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
            <div className="h-full w-[750px]" >
                <div className="ml-[30px] mt-[55px]" >
                    <div
                        className={`block font-[500] text-[#26435F] ml-0 text-[18.67px]`}
                    >Select Extensions / Add-Ons</div>
                    <div
                        className={`text-[15px] text-[#26435F] font-[400]`}
                    >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                    </div>
                </div>

                <div className={`ml-[30px] mt-[35px] px-[4px] py-[7px] ${styles.extensionsListContainer}`} style={{width: "91%", height: "80%"}} >

                    {
                        extensions?.map((item,index) => {
                            if(!extensionPlansInfo || extensionPlansInfo === undefined || extensionPlansInfo === null) return (<React.Fragment key={index}></React.Fragment>)
                            if(extensionPlansInfo[0]?.planName === "") return (<React.Fragment key={index}></React.Fragment>)
                            let extension = extensionPlansInfo.find(i => i.planName === item.text)
                            if(!extension || extension === undefined || extension === null) return (<React.Fragment key={index}></React.Fragment>)
                            if(extension.isComingSoon) {
                                return (
                                    <ExtensionSelectionWidget
                                        key={index}
                                        className={`mb-[20px] w-[650px] h-[86px] 
                                                    ${extensionNameInFocus === extension.planName ? "shadow-[0px_0px_10px_rgba(0,0,0,0.25)]" : ""}
                                        `}
                                        planDisplayName={extension.planDisplayName}
                                        descriptionInDisabledState={extension.description}
                                        isDisabled={true}
                                        onBodyClicked={() => {
                                            SetExtensionNameInFocus(extension.planName);
                                        }}
                                    />
                                )
                            }

                            if(updateExtensionMode && activeExtensionInfo?.planName !== "") {
                                return (
                                    <UpdateExtensionWidget
                                        key={index}
                                        className="mb-[20px] w-[650px]"
                                        extensions={extensions}
                                        setExtensions={setExtensions}
                                        planName={activeExtensionInfo.planName}
                                        planDisplayName={activeExtensionInfo.planDisplayName}
                                        productGraphStatement="Maximum number of Assignments per month"
                                        selected={item.checked}
                                        chosenPackage={activeExtensionInfo.packageName}
                                        extensionPriceOption={extension.extensionPriceOption}
                                    />
                                )
                            }
                            return (
                                <ExtensionSelectionWidget
                                    key={index}
                                    className="mb-[20px] w-[650px]"
                                    extensions={extensions}
                                    setExtensions={setExtensions}
                                    planName={extension.planName}
                                    planDisplayName={extension.planDisplayName}
                                    productGraphStatement="Maximum number of Assignments per month"
                                    selected={item.checked}
                                    chosenPackage={item.packageName}
                                    extensionPriceOption={extension.extensionPriceOption}
                                    onChange={() => {
                                        handleCheckboxChange(item.text, extensions, setExtensions);
                                        if(!item.checked) {
                                            SetExtensionNameInFocus(extension.planName);
                                            return;
                                        }
                                        SetExtensionNameInFocus("");
                                        
                                    }}
                                    onBodyClicked={() => {
                                        SetExtensionNameInFocus(extension.planName);
                                    }}
                                />
                            )
                        })
                    }
                </div>

                
            </div>

            <div className="border-l-[1px] border-[#E3E3E3] overflow-hidden h-full w-[349px]" >
                <div className="font-[200] ml-[30px] mt-[30px] text-[#FFA28D] text-[12px]" >{productDescriptionsTitle}</div>
                <div className="ml-[35px] mt-[10px] w-[289px]" >
                    {
                        !(productDescriptions === undefined || productDescriptions === null || productDescriptions.length === 0) ?
                        (
                            productDescriptions.map((item, index) => {
                                return (
                                    <div className="flex mb-[5px]" key={index}>
                                        <div className="bg-[#B3BDC7] mt-[7px] rounded-full h-[3px] w-[3px]" ></div>
                                        <div className="leading-[0.8rem] ml-[10px] w-11/12" >
                                            <span className="text-[#7C98B6] text-[12px] " >{item.title}</span><span className="font-thin text-[#B3BDC7] text-[12px]" >{item.description}</span>
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