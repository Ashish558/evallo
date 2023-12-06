import {
    useState,
    useEffect
} from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import OrgDetailsForm from "../OrgDetailsForm/OrgDetailsForm";
import SubscriptionChoosingModal from "../SubscriptionChoosingModal/SubscriptionChoosingModal";
import { useLazyGetSubscriptionsInfoQuery } from "../../../app/services/orgSignup";
import { extensionPlansInfo } from "./DummyData/ExtensionPlansInfo";
import ReviewProduct from "../ReviewProduct/ReviewProduct";
import ExtensionsChoosingModal from "../ExtensionsChoosingModal/ExtensionsChoosingModal";
import VerticalNumericSteppers from "../../../components/VerticalNumericSteppers/VerticalNumericSteppers";
import { extensionsData } from "./data";
import { comingSoonExtensionData } from "./DummyData/ComingSoonExtensionData";
import { useAddSubscriptionsMutation } from "../../../app/services/subscription";
import { useLazyGetAuthQuery, useLazyGetOrganizationQuery, useLazyGetPersonalDetailQuery } from "../../../app/services/users";
import { useUpdateOrganizationDetailMutation } from "../../../app/services/organization";
import { useSelector } from "react-redux";

const TEMPORARY_CHOSEN_SUBSCRIPTION_PLAN_NAME = "TEMPORARY_CHOSEN_SUBSCRIPTION_PLAN_NAME";
const TEMPORARY_CHOSEN_EXTENSIONS_NAME = "TEMPORARY_CHOSEN_EXTENSIONS_NAME";

function SubscriptionAndExtensionModal({
    className,
    openSubscriptionModal = true,
    openExtensionsModal,
    updateSubscriptionMode = false,
    OnCancelClicked,
    subscriptionsInfoFromAPI_Param,
    activeSubscriptionName = "",
    OnCheckoutClicked,
}) {
    const [values, setValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        role: "",
        userId: "",
        registrationAs: "",
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
        subscriptionPlan: "",
        extensionsPlans: [],
        extensionsPricePlan: "",
    });

    const [companyInfo, SetCompanyInfo] = useState({
        nameOfBusiness: "",
        accountType: "",
        businessEntity: "",
        website: "",
        streetAddress: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
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
        (updateSubscriptionMode ? activeSubscriptionName : "Professional")
    );
    const [isCCRequired, SetIsCCRequired] = useState(false);
    const [stripeCustomerId, SetStripeCustomerId] = useState("");
    const [isPaymentSuccessfullyComplete, SetIsPaymentSuccessfullyComplete] = useState(false);
    const [isExtensionStepComplete, SetIsExtensionStepComplete] = useState(false);

    const [getSubscriptionsInfo, getSubscriptionsInfoResp] = useLazyGetSubscriptionsInfoQuery();
    const [addSubscriptions, addSubscriptionsResp] = useAddSubscriptionsMutation();
    const [getPersonalDetail, getPersonalDetailResp] = useLazyGetPersonalDetailQuery();
    const [getOrgDetails, getOrgDetailsResp] = useLazyGetOrganizationQuery();
    const [updateOrgDetails, ] = useUpdateOrganizationDetailMutation();
    const { organization } = useSelector((state) => state.organization);
;
    function OnExtensionsChanged() {
        let output = sessionStorage.getItem("chosenExtentionObjectsFromAPI");
        if(output === '' || output === undefined ) {
          output = null;
        }
        let chosenExtentionObjectsFromAPI = JSON.parse(output);
        if(chosenExtentionObjectsFromAPI === undefined || chosenExtentionObjectsFromAPI === null) {
          chosenExtentionObjectsFromAPI = [];
        }
    
        for(let i = 0; i < extensions.length; i++) {
        //   if(!extensions[i].checked) continue;
          const ext = extensions[i];
    
          const chosenExtension = subscriptionsInfoFromAPI.find(item => {
            if(item && item.product) {
                return item.product.metadata.type === "extension" && 
                   item.product.name === ext.text && 
                   item.lookup_key === ext.packageName;
            }
            return false;
          });
    
          chosenExtentionObjectsFromAPI = chosenExtentionObjectsFromAPI.filter(item => {
            if(item && item.product && item.product.metadata) {
                return item.product.metadata.type === "extension" && item.product.name !== ext.text;
            }
            return false;
          })

          if(!extensions[i].checked) {
            continue;
          }
    
          chosenExtentionObjectsFromAPI.push(chosenExtension);
    
        //   sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtentionObjectsFromAPI));
        }

        sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtentionObjectsFromAPI));
    }
    
    useEffect(() => {
        OnExtensionsChanged();
    }, [extensions]);

    useEffect(() => {
        for(let i = 0; i < extensions.length; i++) {
            if(extensions[i].checked) {
                SetIsExtensionStepComplete(true);
                return;
            }
        }

        SetIsExtensionStepComplete(false);
    }, [extensions]);

    useEffect(() => {
        const chosenSubscriptionFromAPI = subscriptionsInfoFromAPI.find(item => {
            if(item.product) {
                return item.product.name === chosenSubscriptionPlanName;
            }
            return false
        })
        sessionStorage.setItem("chosenSubscriptionFromAPI", JSON.stringify(chosenSubscriptionFromAPI));
        console.log("chosenSubscriptionFromAPI");
        console.log(chosenSubscriptionFromAPI);
    }, [subscriptionsInfoFromAPI, chosenSubscriptionPlanName]);

    /* useEffect(() => {
        for(let i = 0; i < extensions.length; i++) {
            if(extensions[i].checked) {
                SetIsCCRequired(true);
                break;
            }
        }
    }, [extensions]); */

    function loadOrgDetails() {
        getPersonalDetail()
            .then(data => {
                console.log("getPersonalDetail");
                console.log(data);
                const user = data.data.data.user;
            
                getOrgDetails(user.associatedOrg)
                .then(data => {
                    console.log("getOrgDetails");
                    console.log(data);
                    sessionStorage.setItem("orgDetails", JSON.stringify(data.data));
                    if(data && data.data && data.data.stripeCustomerDetails) {
                        SetStripeCustomerId(data.data.stripeCustomerDetails.id);
                    }

                    if(data && data.data && data.data.organisation && data.data.user) {
                        setValues((prev) => {
                            return {
                                ...prev,
                                company: data.data.organisation.company,
                                registrationAs: data.data.user.registrationAs,
                                companyType: data.data.organisation.companyType,
                                website: data.data.organisation.website,
                                address: data.data.organisation.address,
                                country: data.data.organisation.country,
                                city: data.data.organisation.city,
                                state: data.data.organisation.state,
                                zip: data.data.organisation.zip,
                            }
                        })
                        /* SetCompanyInfo({
                            nameOfBusiness: data.data.organisation.company,
                            accountType: data.data.user.registrationAs,
                            businessEntity: data.data.organisation.companyType,
                            streetAddress: data.data.organisation.address,
                            country: data.data.organisation.country,
                            city: data.data.organisation.zip,
                            state: data.data.organisation.state
                        }) */
                    }

                })
                .catch(error => {
                    console.log("Error in getOrgDetails");
                    console.log(error);
                });
        
            })
            .catch(error => {
            console.log("Error in getPersonalDetail");
            console.log(error);
            });
    }

    useEffect(() => {
        loadOrgDetails();

    }, []);

    function loadSubscriptionAndExtensionInfo(productList) {
        if(!(productList.constructor && productList.constructor.name === "Array")) return;
        console.log(productList);

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
            //   const extInfoFromDummyData = extensionPlansInfo.find(item => item.planName === product.product.name);
            //   console.log("extInfoFromDummyData");
            //   console.log(extInfoFromDummyData);
            //   if(extInfoFromDummyData === null || extInfoFromDummyData === undefined) return extList;
    
              if(productInfo === undefined || productInfo === null) {
                let productInfo = {};
                productInfo.id = product.product.id;
                productInfo.planName = product.product.name;
                productInfo.planDisplayName = product.product.name;
                productInfo.description = "";//[...extInfoFromDummyData.description]
                productInfo.extensionPriceOptionHeadingLabel = ""
                productInfo.extensionPriceOptionHeadingStatement = ""
                
    
                //const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
                let packInfo = {}
                packInfo.id = product.id;
                packInfo.planName = product.lookup_key;
                packInfo.planDisplayName = product.nickname;
                packInfo.description = "";//[...packInfoFromDummyData.description];
                packInfo.pricePerMonth = product.unit_amount / 100;
                packInfo.currency = product.currency;
                packInfo.apiObject = product;
                if(product.lookup_key === "p1") {
                    packInfo.numberOfAssignments = 100
                }
                if(product.lookup_key === "p2") {
                    packInfo.numberOfAssignments = 500
                }
                if(product.lookup_key === "p3") {
                    packInfo.numberOfAssignments = 1500
                }
                if(product.lookup_key === "p4") {
                    packInfo.numberOfAssignments = Infinity
                }
    
                productInfo.extensionPriceOption = [packInfo]
                newExtList.push(productInfo);
                return newExtList;
              }
    
              //const packInfoFromDummyData = extInfoFromDummyData.extensionPriceOption.find(item => item.planName === product.lookup_key);
              let packInfo = {}
              packInfo.planName = product.lookup_key;
              
              const extPriceOption = productInfo.extensionPriceOption;
              // if pack info already exists in the extensions data then don't do anything else
              if(extPriceOption.findIndex(item => item.planName === packInfo.planName) !== -1) return newExtList;
    
              packInfo.id = product.id;
              packInfo.planDisplayName = product.nickname;
              packInfo.description = ""; //[...packInfoFromDummyData.description];
              packInfo.pricePerMonth = product.unit_amount / 100;
              packInfo.currency = product.currency;
              packInfo.apiObject = product;
    
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
        const chosenSubName = sessionStorage.getItem(TEMPORARY_CHOSEN_SUBSCRIPTION_PLAN_NAME);
        if(!(chosenSubName === "" || chosenSubName === undefined || chosenSubName === null)) {
            SetChosenSubscriptionPlanName(chosenSubName);
        }

        let ext = sessionStorage.getItem(TEMPORARY_CHOSEN_EXTENSIONS_NAME);
        
        if(!(ext === undefined || ext === null)) {
            ext = JSON.parse(ext);
            console.log("ext");
            console.log(ext);
            setExtensions(ext);
        }
    }, []);
    
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
        if(updateSubscriptionMode && openSubscriptionModal) {
            setFrames({
                orgDetails: false,
                subscription: true,
                extensions: false,
                review: false,
            })
            return;
        }

        if(updateSubscriptionMode && openExtensionsModal) {
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
        if(updateSubscriptionMode) {
            SetRestrictedIndices([0]);
        }
    },[updateSubscriptionMode]);

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
            return frames;
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
            return frames;
        })
    }

    const onSaveAndNextClicked = () => {
        console.log('frames--', frames);
        if(frames.orgDetails){
            console.log('click', values);
            updateOrgDetails({...values, orgId:organization._id})
            .then((res) => {
                if(res.error){
                    console.log('err', res.error);
                    return
                }
                setFrames(frames => {
                    if (frames.orgDetails) return {
                        ...frames,
                        orgDetails: false,
                        subscription: true
                    }
                    return frames;
                })
            })
            .catch(error => {
                console.error("Error from updateOrgDetails");
                console.error(error);
            })
        }

        if(frames.subscription) {
            sessionStorage.setItem(TEMPORARY_CHOSEN_SUBSCRIPTION_PLAN_NAME,
                                   chosenSubscriptionPlanName
            );
        }

        if(frames.extensions) {
            sessionStorage.setItem(TEMPORARY_CHOSEN_EXTENSIONS_NAME,
                                   JSON.stringify(extensions)
            );
        }

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
            return frames;
        });
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

        if(stripeCustomerId === "" || stripeCustomerId === undefined || stripeCustomerId === null) return;
    
        const response = await addSubscriptions(
                {
                    customer_id: stripeCustomerId,
                    subscriptions: [
                        chosenSubscriptionToBeSentThroughAPI,
                        ...chosenExtensionPlansToBeSentThroughAPI
                    ]
                }
        );

        console.log('Subscribed');
        console.log(response);
        sessionStorage.removeItem(TEMPORARY_CHOSEN_SUBSCRIPTION_PLAN_NAME);
        sessionStorage.removeItem(TEMPORARY_CHOSEN_EXTENSIONS_NAME);
    };

    function OnVerticalNumericSteppersStepClicked(index) {
        if(index === 0) {
            setFrames({
                orgDetails: true,
                subscription: false,
                extensions: false,
                review: false,
            })
            return;
        }

        if(index === 1) {
            setFrames({
                orgDetails: false,
                subscription: true,
                extensions: false,
                review: false,
            })
            return;
        }

        if(index === 2) {
            setFrames({
                orgDetails: false,
                subscription: false,
                extensions: true,
                review: false,
            })
            return;
        }

        if(index === 3) {
            setFrames({
                orgDetails: false,
                subscription: false,
                extensions: false,
                review: true,
            })
            return;
        }
    }

    return (
        <div className={`aspect-[1400/900] bg-[#FFFFFF] flex rounded-[15px]  ${className} overflow-auto`} >
            <div className="h-[500px] w-1/12" >
                <VerticalNumericSteppers
                    className="ml-[34px] mt-[135px] h-[630px]"
                    labels={["Account", "Subscription", "Extensions", "Review"]}
                    currentIndex={currentModalIndex}
                    restrictedIndices={restrictedIndices}
                    onStepClicked={OnVerticalNumericSteppersStepClicked}
                    incompleteIndices={(
                        isExtensionStepComplete ? [] : [2]
                    )}
                />
            </div>

            <div className={`ml-[90px] w-9/12`} >
                <div className="flex mt-[30px] w-full" >
                    {
                        frames.orgDetails || updateSubscriptionMode && frames.subscription ? (
                            <></>
                        ) : (
                            <button className="text-[#B3BDC7] text-[18.67px]" onClick={onBackToPreviousStepClicked} >
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
                            <button className="text-[#B3BDC7] text-[18.67px]" onClick={onSkipStepClicked} >
                                <span className="font-[700]" >Skip</span>
                                <span className="font-[500]" >{" this step >"}</span>
                            </button>
                        )
                    }
                </div>

                <div className="mt-[43px] shadow-[0px_0px_30px_rgba(0,0,0,0.05)] rounded-[30px] h-[700px] w-[1100px]" >
                    {
                        frames.orgDetails ? (
                            <OrgDetailsForm
                                className={`relative top-1/2 left-1/2 -translate-x-2/4 -translate-y-2/4 w-11/12`}
                                values={values}
                                setValues={setValues}
                                companyInfo={companyInfo}
                                SetCompanyInfo={SetCompanyInfo}

                            />
                        ) : frames.subscription ? (
                            <SubscriptionChoosingModal
                                className="h-full w-full"
                                subscriptionPlanInfo={subscriptionPlanInfo}
                                subscriptionsInfoFromAPI={subscriptionsInfoFromAPI}
                                chosenSubscriptionPlanName={chosenSubscriptionPlanName}
                                SetChosenSubscriptionPlanName={SetChosenSubscriptionPlanName}
                                activeSubscriptionName={activeSubscriptionName}
                                updateSubscriptionMode={updateSubscriptionMode}
                            />
                        ) : frames.extensions ? (
                            <ExtensionsChoosingModal
                                extensions={extensions}
                                setExtensions={setExtensions}
                                extensionPlansInfo={extensionPlansData}
                                updateExtensionMode={updateSubscriptionMode}
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
                                stripeCustomerId={stripeCustomerId}
                                SetIsPaymentSuccessfull={SetIsPaymentSuccessfullyComplete}
                            />
                        ) : (<></>)
                    }
                </div>

                <div className="flex mt-[20px] w-[1100px]" >
                    {
                        updateSubscriptionMode ? (
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
                      className={`w-[150px] h-[50px] flex justify-center disabled:opacity-60   rounded text-white text-sm font-medium relative py-[11.5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)]   
                      `}
                      /* loading={emailExistLoad}
                      disabled={
                        values.email === "" || !isChecked || !emailValidation.test(values.email)? true : false
                      } */
                      disabled={frames.review ? isCCRequired ? isPaymentSuccessfullyComplete ? false : true : false : false}
                      onClick={
                        // (frames.review ? handleSub : onSaveAndNextClicked)
                        () => {
                            (frames.review ? handleSub() : onSaveAndNextClicked());
                            if(OnCheckoutClicked.constructor && OnCheckoutClicked.constructor.name === "Function" && frames.review) {
                                OnCheckoutClicked();
                            }
                        }
                      }
                    //   children={(frames.review ? isCCRequired ? "Checkout" : "Let’s Go!" : "Save & Next")}
                      children={(
                      <span 
                        className="text-[16.67px] text-[#fff] font-[100]"
                      >
                        {(frames.review ? isCCRequired ? "Checkout" : "Let’s Go!" : "Save & Next")}
                      </span>)}
                    />
                </div>

                
            </div>
        </div>
    )
}

export default SubscriptionAndExtensionModal;