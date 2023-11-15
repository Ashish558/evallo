import CheckOutExtensionsReview from "../../../components/CheckOutExtensionsReview/CheckOutExtensionsReview";
import CheckOutSubscriptionReview from "../../../components/CheckOutSubscriptionReview/CheckOutSubscriptionReview";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import { 
    useState,
    useEffect,
 } from "react";
import {
    Elements,
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "../../Frames/Payment/Payment";
import { BASE_URL } from "../../../app/constants/constants";
import { useAddSubscriptionsMutation } from "../../../app/services/subscription";
import { formattedNumber } from "../../../utils/utils";

export default function CheckOut({
    setFrames,
    values,
    extensions = [
        {
            text: "",
            checked: false,
            packageName: ""
        }
    ],
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
    subscriptionsInfo = [{
        id: "",
        planName: "",
        planDisplayName: "",
        activeTutorsAllowed: 0,
        activeStudentsAllowed: 0,
        ccRequired: false,
        currency: "usd",
        freeTrialDays: 0,
        pricePerMonth: 0
    }],
    setcurrentStep,
    clientSecret,
    subscriptionsInfoFromAPI = [],
    handleSignup,
    isSubscriptionProcessOnGoing,
    SetIsSubscriptionProcessOnGoing
}) {

    const handleSubmit = () => {
        setFrames((prev) => {
          return { ...prev, extensions: false, checkout: true };
        });
        // setcurrentStep(currentStep => currentStep + 1)
      };

    const handleBack = () => {
        setFrames((prev) => {
            return { ...prev, checkout: false, extensions: true };
        });
        // setcurrentStep(currentStep => currentStep - 1)
    };

    const [subscriptionDiscount, SetSubscriptionDiscount] = useState({
        /*
            apiResonse: null
            code: "",
            discountPercent: 0
        */
    })

    const [extensionDiscounts, SetExtensionDiscounts] = useState([
        /*
        {
            planName: "",
            apiResonse: null,
            code: "",
            discountPercent: 0
        }
        */
    ])

    const [discountCodes, SetDiscountCodes] = useState([
        /* {
            
            apiResponse: null,
            code: "Promo code 1",
            discount: 15,
            price: 10
        },
        {
            code: "Promo code 2",
            discount: 5,
            price: 7
        },
        {
            code: "Promo code 3",
            discount: 50,
            price: 20
        }, */
    ]);

    const [chosenSubscriptionPlan, SetChosenSubscriptionPlan] = useState(
        subscriptionsInfo.find(item => item.planName === values.subscriptionPlan)
    );
    const [chosenSubscriptionObjectFromAPI, SetChosenSubscriptionObjectFromAPI] = useState();
    const [chosenExtentionObjectsFromAPI, SetChosenExtentionObjectsFromAPI] = useState([]);
    const [addSubscriptions, addSubscriptionsResp] = useAddSubscriptionsMutation();
    const [isPaymentSuccessfull, SetIsPaymentSuccessfull] = useState(false);
    const [isCCRequired, SetIsCCRequired] = useState(false);

    useEffect(() => {
        console.log("chosenSubscriptionFromAPI from sessionStorage");
        console.log(
            JSON.parse(
                sessionStorage.getItem("chosenSubscriptionFromAPI")
            )
        );
        SetChosenSubscriptionObjectFromAPI(
            subscriptionsInfoFromAPI.find(item => item.id === chosenSubscriptionPlan.id)
        );
    }, []);

    const [chosenExtensionPlans, SetChosenExtensionPlans] = useState(
        extensionPlansInfo.filter(item => {
            if(item.planName === "" || item.planName === undefined || item.planName === null) return false;
            for(let i = 0; i < extensions.length; i++) {
                if(extensions[i].text === item.planName && extensions[i].checked) return true;
            }
            return false;
        })
    );

    const [totalMonthlyCost, SetTotalMonthlyCost] = useState(0);

    useEffect(() => {
        let extentionSessionStorageOutput = sessionStorage.getItem("chosenExtentionObjectsFromAPI");
        if(extentionSessionStorageOutput === '' || extentionSessionStorageOutput === undefined ) {
            extentionSessionStorageOutput = null;
        }

        let chosenExtentionObjectsFromAPI = JSON.parse(extentionSessionStorageOutput);

        if(chosenExtentionObjectsFromAPI === undefined || chosenExtentionObjectsFromAPI === null) {
            chosenExtentionObjectsFromAPI = [];
            sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtentionObjectsFromAPI));
        }

        SetChosenExtentionObjectsFromAPI(chosenExtentionObjectsFromAPI);

    }, [chosenExtensionPlans])

    useEffect(() => {
        SetTotalMonthlyCost(totalMonthlyCost => {
            let newTotalMonthlyCost = 0;
            if(chosenSubscriptionPlan) {
                const subDiscount = (
                subscriptionDiscount === undefined || 
                subscriptionDiscount === null || 
                Object.keys(subscriptionDiscount).length === 0 ? 0 : subscriptionDiscount.discountPercent * chosenSubscriptionPlan.pricePerMonth / 100);
                const subPrice = chosenSubscriptionPlan.pricePerMonth - subDiscount;
                
                newTotalMonthlyCost += subPrice;
            }

            if(chosenExtensionPlans) {
                for(let i = 0; i < chosenExtensionPlans.length; i++) {
                    let item = chosenExtensionPlans[i]
                    if(Object.keys(item).length === 0 && item.extensionPriceOption === undefined || item.extensionPriceOption === null || item.extensionPriceOption.length === 0) continue;
                    let chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
                    let chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
                    let extDiscount = 0;
                    if(
                        !(extensionDiscounts === undefined ||
                        extensionDiscounts === null ||
                        extensionDiscounts.length === 0) 
                    ) {
                        const extDiscountObject = extensionDiscounts.find(j => j.planName === item.planName);
                        const discountPercent = extDiscountObject && extDiscountObject.discountPercent ? extDiscountObject.discountPercent : 0;
                        extDiscount = discountPercent * chosenPackage.pricePerMonth / 100;
                    }
    
                    const extPrice = chosenPackage.pricePerMonth - extDiscount;
    
                    newTotalMonthlyCost += extPrice;
                }
            }

            return newTotalMonthlyCost;
        })
    },[chosenSubscriptionPlan, chosenExtensionPlans, subscriptionDiscount, extensionDiscounts]);

    useEffect(() => {
        SetIsCCRequired(chosenSubscriptionPlan && chosenSubscriptionPlan.ccRequired || chosenExtensionPlans && chosenExtensionPlans.length > 0);
    }, [chosenSubscriptionPlan, chosenExtensionPlans])

    const paymentElementOptions = {
        layout: "tabs"
    }

    const appearance = {
        theme: 'stripe',
      };
      const options = {
        clientSecret,
        appearance,
    };


    const handleSub = async () => {
        SetIsSubscriptionProcessOnGoing(true);
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

        if(response) {
            handleSignup();
        }
    };

    return (
        <div className="mt-2 mb-3">
            <div>
                <div
                    className={`block text-base font-semibold text-[#26435F] ml-0 text-[16px]`}
                >Review Your Selections</div>
                <div
                    className={`text-sm text-[#26435F] font-[300]`}
                >For detailed breakdown of features, please visit our <a href="#" className="text-[#24A3D9]">pricing page</a>.
                </div>
            </div>

            <div className="font-semibold mt-[20px] text-[#FFA28D] text-[16px]">Subscription</div>

            <CheckOutSubscriptionReview
                className={"mt-[5px]"}
                canChangePlan={!(isPaymentSuccessfull && isCCRequired)}
                canAddPromoCode={true}
                planDisplayName={chosenSubscriptionPlan && chosenSubscriptionPlan.planDisplayName ? chosenSubscriptionPlan.planDisplayName : null}
                activeTutorsAllowed={chosenSubscriptionPlan && chosenSubscriptionPlan.activeTutorsAllowed ? chosenSubscriptionPlan.activeTutorsAllowed : null}
                activeStudentsAllowed={chosenSubscriptionPlan && chosenSubscriptionPlan.activeStudentsAllowed ? chosenSubscriptionPlan.activeStudentsAllowed : null}
                ccRequired={chosenSubscriptionPlan && chosenSubscriptionPlan.ccRequired ? chosenSubscriptionPlan.ccRequired : null}
                currency={chosenSubscriptionPlan && chosenSubscriptionPlan.currency ? chosenSubscriptionPlan.currency : null}
                subscriptionPricePerMonth={chosenSubscriptionPlan && chosenSubscriptionPlan.pricePerMonth ? chosenSubscriptionPlan.pricePerMonth : null}
                freeTrialDays={chosenSubscriptionPlan && chosenSubscriptionPlan.freeTrialDays ? chosenSubscriptionPlan.freeTrialDays : null}
                setFrames={setFrames}
                setcurrentStep={setcurrentStep}
                chosenSubscriptionObjectFromAPI={chosenSubscriptionObjectFromAPI}
                subscriptionDiscount={subscriptionDiscount}
                SetSubscriptionDiscount={SetSubscriptionDiscount}
            />

            {(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0) ? (<></>) :
                
                (<>
                <div className="font-semibold mb-[-20px] mt-[20px] text-[#FFA28D] text-[16px]">Extensions / Add-Ons</div>
                
                {chosenExtensionPlans.map(item => {
                    const chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
                    const chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
                    const extObjectFromAPI = chosenExtentionObjectsFromAPI.find(i => {
                        return i.product.name === item.planName && i.lookup_key === chosenPackageName;
                    })

                    const extDiscount = extensionDiscounts.find(i => i.planName === item.planName);
                    return (
                        <CheckOutExtensionsReview
                            className={"mt-[25px]"}
                            canChangePlan={!(isPaymentSuccessfull && isCCRequired)}
                            canAddPromoCode={true}
                            planName={item.planName}
                            planDisplayName={item.planDisplayName}
                            extensionPriceOption={chosenPackage}
                            subscriptionPricePerMonth={chosenPackage.pricePerMonth}
                            setFrames={setFrames}
                            setcurrentStep={setcurrentStep}
                            chosenExtentionObjectFromAPI={extObjectFromAPI}
                            extensionDiscount={extDiscount}
                            SetExtensionDiscounts={SetExtensionDiscounts}
                        />
                    )
                })}

                </>)
            }

            <div className="border-[1px] mt-[25px] w-full"></div>

                <div className="flex justify-between mt-[15px] text-[#26435F]">
                    <div>Total Payment</div>
                    <div>${formattedNumber(totalMonthlyCost)} + Taxes</div>
                </div>

            <div className="border-[1px] mb-[40px] mt-[25px] w-full"></div>

            {
                isCCRequired ?
                (
                    <Payment
                        setFrames={setFrames}
                        setcurrentStep={setcurrentStep}
                        chosenSubscriptionObjectFromAPI={chosenSubscriptionObjectFromAPI}
                        chosenExtentionObjectsFromAPI={chosenExtentionObjectsFromAPI}
                        SetIsPaymentSuccessfull={SetIsPaymentSuccessfull}
                    />
                ) :
                (<></>)
            }

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                    disabled={isPaymentSuccessfull && isCCRequired}
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    children={`Subscribe`}
                    onClick={handleSub}
                    loading={isSubscriptionProcessOnGoing}
                    disabled={!isPaymentSuccessfull && isCCRequired}
                />
            </div>
        </div>
    )
}
