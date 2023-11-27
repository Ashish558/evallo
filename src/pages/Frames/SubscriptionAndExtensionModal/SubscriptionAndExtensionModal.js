import {
    useState,
    useEffect
} from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import OrgDetailsForm from "../OrgDetailsForm/OrgDetailsForm";
import SubscriptionChoosingModal from "../SubscriptionChoosingModal/SubscriptionChoosingModal";
import { useLazyGetSubscriptionsInfoQuery } from "../../../app/services/orgSignup";
import { extensionPlansInfo } from "../../OrgSignup/DummyData/ExtensionPlansInfo";

function SubscriptionAndExtensionModal({
    className
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
    const [subscriptionPlanInfo, SetSubscriptionPlanInfo] = useState([]);
    const [extensionPlansData, SetExtensionPlansData] = useState([]);
    const [subscriptionsInfoFromAPI, SetSubscriptionsInfoFromAPI] = useState([]);
    const [chosenSubscriptionPlanName, SetChosenSubscriptionPlanName] = useState("");

    const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();

    const fetchSubscriptionsInfo = () => {
        getSubscriptionsInfo().then((res) => {
          console.warn("Subscriptions info");
          console.warn(res.data)
          // subscriptionsInfoFromAPI = res.data.data;
          const productList = res.data.data;
          // collecting info for subscriptions
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
    
          SetSubscriptionsInfoFromAPI(res.data.data);
        }).catch((error) => {
          console.error("Error while fetching subscriptions info")
          console.error(error)
        })
    }
    
    useEffect(() => {
        fetchSubscriptionsInfo();
    }, []);

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

    return (
        <div className={`aspect-[1400/900] bg-[#FFFFFF] flex rounded-[15px]  ${className}`} >
            <div className="w-1/12" ></div>

            <div className={`ml-[90px] w-9/12`} >
                <div className="flex mt-[20px] w-full" >
                    {
                        frames.orgDetails ? (
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
                            />
                        ) : frames.extensions ? (
                            <></>
                        ) : frames.review ? (
                            <></>
                        ) : (<></>)
                    }
                </div>

                <div className="flex mt-[20px] w-full" >
                    <div className="grow" ></div>
                    <PrimaryButton
                      className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[150px]  rounded text-white text-sm font-medium relative py-[9px]      
                      `}
                      /* loading={emailExistLoad}
                      disabled={
                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                      } */
                    //   onClick={handleClick}
                      children={`Save & Next`}
                    />
                </div>

                
            </div>
        </div>
    )
}

export default SubscriptionAndExtensionModal;