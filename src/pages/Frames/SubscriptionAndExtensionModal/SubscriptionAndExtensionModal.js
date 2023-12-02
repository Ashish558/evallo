import {
    useState,
    useEffect
} from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import OrgDetailsForm from "../OrgDetailsForm/OrgDetailsForm";
import SubscriptionChoosingModal from "../SubscriptionChoosingModal/SubscriptionChoosingModal";
import { useLazyGetSubscriptionsInfoQuery } from "../../../app/services/orgSignup";
import { extensionPlansInfo } from "../../OrgSignup/DummyData/ExtensionPlansInfo";
import ReviewProduct from "../ReviewProduct/ReviewProduct";
import ExtensionsChoosingModal from "../ExtensionsChoosingModal/ExtensionsChoosingModal";
import VerticalNumericSteppers from "../../../components/VerticalNumericSteppers/VerticalNumericSteppers";
import { extensionsData } from "./data";
import { comingSoonExtensionData } from "./DummyData/ComingSoonExtensionData";
import { useAddSubscriptionsMutation } from "../../../app/services/subscription";

function SubscriptionAndExtensionModal({
    className,
    openSubscriptionModal,
    openExtensionsModal,
    openedFromAccountOverview = false,
    OnCancelClicked,
    subscriptionsInfoFromAPI_Param,
    activeSubscriptionName = "",
}) {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        userId: "",
        registrationAs: "Company",
        phoneCode:"",
        orgName: "",
        companyType: "",
        website: "",
        address: "",
        country: "",
        state: "",
        zip: "",
        city: "",
        paymentType: "",
        activeStudents: "",
        activeTutors: "",
        services: [],
        subscriptionPlan: "Starter",
        extensionsPlans: [],
        extensionsPricePlan: "",
    });

    const [frames, setFrames] = useState({
        orgDetails: true,
        subscription: false,
        extensions: false,
        review: false,
    });
    const [restrictedIndices, SetRestrictedIndices] = useState([]);
    const [currentModalIndex, SetCurrentModalIndex] = useState(0);
    const [subscriptionPlanInfo, SetSubscriptionPlanInfo] = useState([]);
    const [extensionPlansData, SetExtensionPlansData] = useState([]);
    const [extensions, setExtensions] = useState(extensionsData);
    const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
    const [chosenSubscriptionPlanName, SetChosenSubscriptionPlanName] = useState(
        (openedFromAccountOverview ? activeSubscriptionName : "Professional")
    );
    const [isCCRequired, SetIsCCRequired] = useState(false);

    const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();
    const [addSubscriptions, addSubscriptionsResp] = useAddSubscriptionsMutation();

    function loadSubscriptionAndExtensionInfo(productList) {
        if(!(productList.constructor && productList.constructor.name === "Array")) return;

        for(let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if(product.product.metadata.type !== "default") continue;
    
            let productInfo = {};
            productInfo.id = product.id;
            productInfo.planName = product.product.name;
            productInfo.planDisplayName = product.product.name;
            productInfo.freeTrialDays = parseInt(product.product.metadata.free_trial);
            productInfo.activeTutorsAllowed = product.product.metadata.active_tutors === "unlimited" ? Infinity : parseInt(product.product.metadata.active_tutors);
            productInfo.activeStudentsAllowed = product.product.metadata.active_students === "unlimited" ? Infinity : parseInt(product.product.metadata.active_students);
            productInfo.ccRequired = product.product.metadata.cc_required === "yes" ? true : false;
            productInfo.pricePerMonth = product.unit_amount / 100;
            productInfo.currency = product.currency;

            /* if(i === 0) {
                SetChosenSubscriptionPlanName(product.product.name);
            } */
    
            SetSubscriptionPlanInfo(plans => {
              // if product info already exists in the list then don't do anything
              if(plans.findIndex(item => item.planName === productInfo.planName) !== -1) return plans;
    
              const newPlansList = [];
    
              let i;
              for(i = 0; i < plans.length; i++) {
                if(plans[i].pricePerMonth < productInfo.pricePerMonth) {
                  newPlansList.push(plans[i]);
                  continue;
                }
                break;
              }
    
              newPlansList.push(productInfo);
              for( ; i < plans.length; i++) {
                newPlansList.push(plans[i])
              }
    
              return newPlansList
            });
            //product.unit_amount
          }
    
          // collecting info for extensions
          for(let i = 0; i < productList.length; i++) {
            let product = productList[i];
            if(product.product.metadata.type !== "extension") continue;
            console.log(product)
    
            SetExtensionPlansData(extList => {
              let newExtList = [...extList];
              let productInfo = newExtList.find(item => item.planName === product.product.name);
              const extInfoFromDummyData = extensionPlansInfo.find(item => item.planName === product.product.name);
    
              if(productInfo === undefined || productInfo === null) {
                let productInfo = {};
                productInfo.id = product.product.id;
                productInfo.planName = product.product.name;
                productInfo.planDisplayName = product.product.name;
                productInfo.description = [...extInfoFromDummyData.description]
                productInfo.extensionPriceOptionHeadingLabel = ""
                productInfo.extensionPriceOptionHeadingStatement = ""
                
    
                const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
                let packInfo = {}
                packInfo.id = product.id;
                packInfo.planName = product.lookup_key;
                packInfo.planDisplayName = product.nickname;
                packInfo.description = [...packInfoFromDummyData.description];
                packInfo.pricePerMonth = product.unit_amount / 100;
                packInfo.currency = product.currency;
    
                productInfo.extensionPriceOption = [packInfo]
                newExtList.push(productInfo);
                return newExtList;
              }
    
              const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
              let packInfo = {}
              packInfo.planName = product.lookup_key;
              
              const extPriceOption = productInfo.extensionPriceOption;
              // if pack info already exists in the extensions data then don't do anything else
              if(extPriceOption.findIndex(item => item.planName === packInfo.planName) !== -1) return newExtList;
    
              packInfo.id = product.id;
              packInfo.planDisplayName = product.nickname;
              packInfo.description = [...packInfoFromDummyData.description];
              packInfo.pricePerMonth = product.unit_amount / 100;
              packInfo.currency = product.currency;
    
              const newPacksList = [];
    
              let i;
              for(i = 0; i < extPriceOption.length; i++) {
                if(extPriceOption[i].pricePerMonth < packInfo.pricePerMonth) {
                  newPacksList.push(extPriceOption[i]);
                  continue;
                }
                break;
              }
    
              newPacksList.push(packInfo);
              for( ; i < extPriceOption.length; i++) {
                newPacksList.push(extPriceOption[i])
              }
              
              productInfo.extensionPriceOption = newPacksList;
              return newExtList;
            })
    
            /*
            let productInfo = {};
            productInfo.id = product.id;
            productInfo.planName = product.product.name;
            productInfo.planDisplayName = product.product.name;
            productInfo.description = []
            productInfo.extensionPriceOptionHeadingLabel = ""
            productInfo.extensionPriceOptionHeadingStatement = ""
            productInfo.extensionPriceOption = []
            */
          }

          SetExtensionPlansData(extData => {
            const newExtData = [...extData, ...comingSoonExtensionData];

            return newExtData;
          })
    
          SetSubscriptionsInfoFromAPI(productList);
    }

    function fetchSubscriptionsInfo(){
        getSubscriptionsInfo().then((res) => {
          console.warn("Subscriptions info");
          console.warn(res.data)
          // subscriptionsInfoFromAPI = res.data.data;
          const productList = res.data.data;
          loadSubscriptionAndExtensionInfo(productList)
        }).catch((error) => {
          console.error("Error while fetching subscriptions info")
          console.error(error)
        })
    }
    
    useEffect(() => {
        if(subscriptionsInfoFromAPI_Param && subscriptionsInfoFromAPI_Param.length > 0) {
            loadSubscriptionAndExtensionInfo(subscriptionsInfoFromAPI_Param);
            return;
        }
        if(subscriptionsInfoFromAPI && subscriptionsInfoFromAPI.length > 0) {
            loadSubscriptionAndExtensionInfo(subscriptionsInfoFromAPI);
            return;
        }
        fetchSubscriptionsInfo();
    }, []);

    useEffect(() => {
        if(frames.orgDetails) {
            SetCurrentModalIndex(0);
            return;
        }

        if(frames.subscription) {
            SetCurrentModalIndex(1);
            return;
        }

        if(frames.extensions) {
            SetCurrentModalIndex(2);
            return;
        }

        if(frames.review) {
            SetCurrentModalIndex(3);
            return;
        }
    }, [frames]);

    useEffect(() => {
        if(openedFromAccountOverview && openSubscriptionModal) {
            setFrames({
                orgDetails: false,
                subscription: true,
                extensions: false,
                review: false,
            })
            return;
        }

        if(openedFromAccountOverview && openExtensionsModal) {
            setFrames({
                orgDetails: false,
                subscription: false,
                extensions: true,
                review: false,
            })
            return;
        }
    }, []);

    useEffect(() => {
        if(openedFromAccountOverview) {
            SetRestrictedIndices([0]);
        }
    },[openedFromAccountOverview]);

    const onBackToPreviousStepClicked = () => {
        setFrames(frames => {
            if (frames.orgDetails) return frames;
            if (frames.subscription) return {
                ...frames,
                subscription: false,
                orgDetails: true
            }
            if (frames.extensions) return {
                ...frames,
                extensions: false,
                subscription: true
            }
            if (frames.review) return {
                ...frames,
                review: false,
                extensions: true
            }
        })
    }

    const onSkipStepClicked = () => {
        setFrames(frames => {
            if (frames.review) return frames;
            if (frames.subscription) return {
                ...frames,
                subscription: false,
                extensions: true
            }
            if (frames.extensions) return {
                ...frames,
                extensions: false,
                review: true
            }
            if (frames.orgDetails) return {
                ...frames,
                orgDetails: false,
                subscription: true
            }
        })
    }

    const onSaveAndNextClicked = () => {
        setFrames(frames => {
            if (frames.review) return frames;
            if (frames.subscription) return {
                ...frames,
                subscription: false,
                extensions: true
            }
            if (frames.extensions) return {
                ...frames,
                extensions: false,
                review: true
            }
            if (frames.orgDetails) return {
                ...frames,
                orgDetails: false,
                subscription: true
            }
        })
    }

    async function handleSub(){
        // SetIsSubscriptionProcessOnGoing(true);
        console.log(subscriptionsInfoFromAPI);

        let subscriptionSessionStorageOutput = sessionStorage.getItem("chosenSubscriptionFromAPI");
        if(subscriptionSessionStorageOutput === '' || subscriptionSessionStorageOutput === undefined) {
            subscriptionSessionStorageOutput = null;
        }
        let chosenSubscriptionToBeSentThroughAPI = JSON.parse(subscriptionSessionStorageOutput);

        let extentionSessionStorageOutput = sessionStorage.getItem("chosenExtentionObjectsFromAPI");
        if(extentionSessionStorageOutput === '' || extentionSessionStorageOutput === undefined ) {
            extentionSessionStorageOutput = null;
        }

        let chosenExtensionPlansToBeSentThroughAPI = JSON.parse(extentionSessionStorageOutput);

        if(chosenExtensionPlansToBeSentThroughAPI === undefined || chosenExtensionPlansToBeSentThroughAPI === null) {
            chosenExtensionPlansToBeSentThroughAPI = [];
            sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtensionPlansToBeSentThroughAPI));
        }

        console.log("chosenExtensionPlansToBeSentThroughAPI");
        console.log(chosenExtensionPlansToBeSentThroughAPI);
    
        const response = await addSubscriptions(
                {
                    customer_id: 'cus_OteUYhKgkeuICE',
                    subscriptions: [
                        chosenSubscriptionToBeSentThroughAPI,
                        ...chosenExtensionPlansToBeSentThroughAPI
                    ]
                }
        );

        console.log('Subscribed');
        console.log(response);
    };

    return (
        <div className={`aspect-[1400/900] bg-[#FFFFFF] flex rounded-[15px]  ${className}`} >
            <div className="h-[500px] w-1/12" >
                <VerticalNumericSteppers
                    className="ml-[40px] mt-[50px] h-full"
                    labels={["Account", "Subscription", "Extensions", "Review"]}
                    currentIndex={currentModalIndex}
                    restrictedIndices={restrictedIndices}
                />
            </div>

            <div className={`ml-[90px] w-9/12`} >
                <div className="flex mt-[20px] w-full" >
                    {
                        frames.orgDetails || openedFromAccountOverview && frames.subscription ? (
                            <></>
                        ) : (
                            <button className="text-[#B3BDC7]" onClick={onBackToPreviousStepClicked} >
                                <span className="font-[500]" >{"< back to "}</span>
                                <span className="font-[700]" >
                                    {
                                        frames.subscription ? "Account" :
                                        frames.extensions ? "Subscription" :
                                        frames.review ? "Extensions" : ""
                                    }
                                </span>
                            </button>
                        )
                    }
                    {/* <button className="text-[#B3BDC7]" >
                        <span className="font-[500]" >{"< back to "}</span><span className="font-[700]" >Subscription</span>
                    </button> */}

                    <div className="grow" ></div>

                    {
                        frames.review ? (
                            <></>
                        ) : (
                            <button className="text-[#B3BDC7]" onClick={onSkipStepClicked} >
                                <span className="font-[700]" >Skip</span>
                                <span className="font-[500]" >{" this step >"}</span>
                            </button>
                        )
                    }
                </div>

                <div className="mt-[20px] shadow-[0px_0px_30px_rgba(0,0,0,0.05)] rounded-[30px] h-3/4 w-full" >
                    {
                        frames.orgDetails ? (
                            <OrgDetailsForm
                                className={`relative top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 w-11/12`}
                                values={values}
                                setValues={setValues}
                            />
                        ) : frames.subscription ? (
                            <SubscriptionChoosingModal
                                className="h-full w-full"
                                subscriptionPlanInfo={subscriptionPlanInfo}
                                subscriptionsInfoFromAPI={subscriptionsInfoFromAPI}
                                chosenSubscriptionPlanName={chosenSubscriptionPlanName}
                                SetChosenSubscriptionPlanName={SetChosenSubscriptionPlanName}
                                activeSubscriptionName={activeSubscriptionName}
                            />
                        ) : frames.extensions ? (
                            <ExtensionsChoosingModal
                                extensions={extensions}
                                setExtensions={setExtensions}
                                extensionPlansInfo={extensionPlansData}
                            />
                        ) : frames.review ? (
                            <ReviewProduct
                                chosenSubscriptionPlanName={chosenSubscriptionPlanName}
                                subscriptionsInfo={subscriptionPlanInfo}
                                setFrames={setFrames}
                                extensions={extensions}
                                extensionPlansInfo={extensionPlansData}
                                isCCRequired={isCCRequired}
                                SetIsCCRequired={SetIsCCRequired}
                            />
                        ) : (<></>)
                    }
                </div>

                <div className="flex mt-[20px] w-full" >
                    {
                        openedFromAccountOverview ? (
                            <button 
                                className="font-[600] text-[#B3BDC7] text-[14px]" 
                                onClick={() => {
                                    if(OnCancelClicked.constructor && OnCancelClicked.constructor.name === "Function") {
                                        OnCancelClicked();
                                    }
                                }}
                            >Cancel</button>
                        ) : (<></>)
                    }
                    
                    <div className="grow" ></div>
                    <PrimaryButton
                      style={(
                        frames.review ? {
                            backgroundColor: "#38C980"
                        } : {
                            backgroundColor: "#FFA28D"
                        }
                      )}
                      className={`w-full flex justify-center disabled:opacity-60 max-w-[150px]  rounded text-white text-sm font-medium relative py-[9px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)]   
                      `}
                      /* loading={emailExistLoad}
                      disabled={
                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                      } */
                      onClick={
                        (frames.review ? handleSub : onSaveAndNextClicked)
                      }
                      children={(frames.review ? isCCRequired ? "Checkout" : "Let’s Go!" : "Save & Next")}
                    />
                </div>

                
            </div>
        </div>
    )
}

export default SubscriptionAndExtensionModal;