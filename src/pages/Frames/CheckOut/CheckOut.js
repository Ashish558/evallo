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
    // const chosenSubscriptionPlan = subscriptionsInfo.find(item => item.planName === values.subscriptionPlan);
    const [chosenSubscriptionObjectFromAPI, SetChosenSubscriptionObjectFromAPI] = useState();
    const [chosenExtentionObjectsFromAPI, SetChosenExtentionObjectsFromAPI] = useState([]);
    const [addSubscriptions, addSubscriptionsResp] = useAddSubscriptionsMutation()

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

    /* const chosenExtensionPlans = extensionPlansInfo.filter(item => {
        if(item.planName === "" || item.planName === undefined || item.planName === null) return false;
        for(let i = 0; i < extensions.length; i++) {
            if(extensions[i].text === item.planName && extensions[i].checked) return true;
        }
        return false;
    }) */

    useEffect(() => {
        if(!(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0)) {
            SetChosenExtentionObjectsFromAPI(subscriptionsInfoFromAPI[3]);
        }
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
                    if(item.extensionPriceOption === undefined || item.extensionPriceOption === null || item.extensionPriceOption.length === 0) continue;
                    let chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
                    let chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
                    let extDiscount = 0;
                    if(
                        !(extensionDiscounts === undefined ||
                        extensionDiscounts === null ||
                        extensionDiscounts.length === 0) 
                    ) {
                        extDiscount = extensionDiscounts.find(j => j.planName === item.planName).discountPercent * chosenPackage.pricePerMonth / 100;
                    }
    
                    const extPrice = chosenPackage.pricePerMonth - extDiscount;
    
                    newTotalMonthlyCost += extPrice;
                }
            }

            return newTotalMonthlyCost;
        })
    },[chosenSubscriptionPlan, chosenExtensionPlans, subscriptionDiscount, extensionDiscounts]);

    /* let totalMonthlyCost = 0;
    totalMonthlyCost += chosenSubscriptionPlan.pricePerMonth; */

    /* for(let i = 0; i < chosenExtensionPlans.length; i++) {
        let item = chosenExtensionPlans[i]
        if(item.extensionPriceOption === undefined || item.extensionPriceOption === null || item.extensionPriceOption.length === 0) continue;
        let chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
        let chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
        totalMonthlyCost += chosenPackage.pricePerMonth
    } */

    /* for(let i = 0; i < discountCodes.length; i++) {
        totalMonthlyCost -= discountCodes[i].price
    }
    totalMonthlyCost = totalMonthlyCost < 0 ? 0 : totalMonthlyCost */

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
        /* if(!(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0)) {
            chosenExtensionPlansToBeSentThroughAPI.push(subscriptionsInfoFromAPI[3]);
        } */

        if(chosenExtensionPlansToBeSentThroughAPI === undefined || chosenExtensionPlansToBeSentThroughAPI === null) {
            chosenExtensionPlansToBeSentThroughAPI = [];
            sessionStorage.setItem("chosenExtentionObjectsFromAPI", JSON.stringify(chosenExtensionPlansToBeSentThroughAPI));
        }

        console.log("chosenExtensionPlansToBeSentThroughAPI");
        console.log(chosenExtensionPlansToBeSentThroughAPI);

        /* const response = await fetch(
            `${BASE_URL}api/stripe/add_subscriptions`,
            {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json', // Set the content type to JSON.
                },
                body: JSON.stringify({
                  customer_id: 'cus_OteUYhKgkeuICE',
                  subcriptions: [
                    chosenSubscriptionToBeSentThroughAPI,
                    // [...chosenExtensionPlansToBeSentThroughAPI]
                  ],
                }),
              }
        ) */

        
        const response = await addSubscriptions(
                {
                    customer_id: 'cus_OteUYhKgkeuICE',
                    subscriptions: [
                        chosenSubscriptionToBeSentThroughAPI,
                        ...chosenExtensionPlansToBeSentThroughAPI
                    ]
                }
        );
       

        // const data = await response.json();
        console.log('Subscribed');
        console.log(response);
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
                canAddPromoCode={true}
                planDisplayName={chosenSubscriptionPlan.planDisplayName}
                activeTutorsAllowed={chosenSubscriptionPlan.activeTutorsAllowed}
                activeStudentsAllowed={chosenSubscriptionPlan.activeStudentsAllowed}
                ccRequired={chosenSubscriptionPlan.ccRequired}
                currency={chosenSubscriptionPlan.currency}
                subscriptionPricePerMonth={chosenSubscriptionPlan.pricePerMonth}
                freeTrialDays={chosenSubscriptionPlan.freeTrialDays}
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
                    return (
                        <CheckOutExtensionsReview
                            className={"mt-[25px]"}
                            canAddPromoCode={true}
                            planDisplayName={item.planDisplayName}
                            extensionPriceOption={chosenPackage}
                            subscriptionPricePerMonth={chosenPackage.pricePerMonth}
                            setFrames={setFrames}
                            setcurrentStep={setcurrentStep}
                            chosenExtentionObjectsFromAPI={chosenExtentionObjectsFromAPI}
                            extensionDiscounts={extensionDiscounts}
                            SetExtensionDiscounts={SetExtensionDiscounts}
                        />
                    )
                })}

                </>)
            }

            {/* <CheckOutExtensionsReview
                planDisplayName={"Assignments"}
                extensionPriceOption={{
                    planDisplayName: "1 - 500",
                    description: [
                        "Assign up to 500 tests / assignments per month",
                        "Included in Free Trial period based on your selected subscription."
                    ]
                }}
            /> */}

            <div className="border-[1px] mt-[25px] w-full"></div>

                {/* {
                    promoCodes.map(pc => {
                        return (
                            <div className="flex justify-between mt-[15px]">
                                <div>
                                    <div className="text-[#26435F]">{pc.code}</div>
                                    <div className="text-[#38C980]">{pc.discount}% Discount</div>
                                </div>
                                <div className="font-semibold text-[#38C980]">- ${pc.price}.00 / Month</div>
                            </div>
                        )
                    })
                }*/}

                <div className="flex justify-between mt-[15px] text-[#26435F]">
                    <div>Total Payment</div>
                    <div>${formattedNumber(totalMonthlyCost)} + Taxes</div>
                </div>

            <div className="border-[1px] mb-[40px] mt-[25px] w-full"></div>

            {
                chosenSubscriptionPlan.ccRequired ?
                (
                    <Payment
                        setFrames={setFrames}
                        setcurrentStep={setcurrentStep}
                        chosenSubscriptionObjectFromAPI={chosenSubscriptionObjectFromAPI}
                        chosenExtentionObjectsFromAPI={chosenExtentionObjectsFromAPI}
                    />
                ) :
                (<></>)
            }

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    children={`Subscribe`}
                    onClick={handleSub}
                    
                />
            </div>
        </div>
    )
}
