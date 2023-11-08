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
    // const secretKey = "sk_test_51O1tgLSFF3kgujFeaEQ6Uh7PkOtF4SgSk5ATR8xxmCgLGIW4lkkDzeLDKMoMfjAwZVQyTDJjBkTCwJiIMGgVqrlQ00b9M9MyKZ"
    // const publishableKey = "pk_test_51O1tgLSFF3kgujFe23VYSyhW5lbx2N3b7cjC1q1Q1alW9lwocUKObR8j4hBdpYx5xzDnFcPsNBbkzDu6hcDmHSP3004Sr0qX5e";
    // const stripePromise = loadStripe(publishableKey);
    // const stripe_From_Req = require("stripe")(secretKey);

    // const stripe = useStripe();
    // const elements = useElements();

    // const [clientSecret, SetClientSecret] = useState();

    /*
    useEffect(async () => {
        const paymentIntent = await stripe_From_Req.paymentIntents.create({
          amount: 1,
          currency: "usd",
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });
    
        console.log(paymentIntent.client_secret)
    
        SetClientSecret(paymentIntent.client_secret);
      }, [])
      */

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

    const [promoCodes, SetPromoCodes] = useState([
        {
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
        },
    ]);
    /*
        promocodes = [
            {
                code: "",
                discount: 0, // in percent
                price: 0, // amount discounted on selected package
            }
        ]
    */
   

    // useEffect(() => {
    //     if (!stripe) {
    //         return;
    //     }

        

    //     if (!clientSecret) {
    //         return;
    //     }

    //     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
    //         console.log(paymentIntent)
    //         switch (paymentIntent.status) {
    //         case "succeeded":
    //             console.log("Payment succeeded!");
    //             break;
    //         case "processing":
    //             console.log("Your payment is processing.");
    //             break;
    //         case "requires_payment_method":
    //             console.log("Your payment was not successful, please try again.");
    //             break;
    //         default:
    //             console.log("Something went wrong.");
    //             break;
    //         }
    //     });
    // }, [stripe]);

    const chosenSubscriptionPlan = subscriptionsInfo.find(item => item.planName === values.subscriptionPlan);
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
    }, [])

    const chosenExtensionPlans = extensionPlansInfo.filter(item => {
        if(item.planName === "" || item.planName === undefined || item.planName === null) return false;
        for(let i = 0; i < extensions.length; i++) {
            if(extensions[i].text === item.planName && extensions[i].checked) return true;
        }
        return false;
    })

    useEffect(() => {
        if(!(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0)) {
            SetChosenExtentionObjectsFromAPI(subscriptionsInfoFromAPI[3]);
        }
    }, [chosenExtensionPlans])

    let totalMonthlyCost = 0;
    totalMonthlyCost += chosenSubscriptionPlan.pricePerMonth;
    for(let i = 0; i < chosenExtensionPlans.length; i++) {
        let item = chosenExtensionPlans[i]
        if(item.extensionPriceOption === undefined || item.extensionPriceOption === null || item.extensionPriceOption.length === 0) continue;
        let chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
        let chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
        totalMonthlyCost += chosenPackage.pricePerMonth
    }

    for(let i = 0; i < promoCodes.length; i++) {
        totalMonthlyCost -= promoCodes[i].price
    }
    totalMonthlyCost = totalMonthlyCost < 0 ? 0 : totalMonthlyCost

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

        let chosenSubscriptionToBeSentThroughAPI = chosenSubscriptionObjectFromAPI;

        let chosenExtensionPlansToBeSentThroughAPI = [];
        if(!(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0)) {
            chosenExtensionPlansToBeSentThroughAPI.push(subscriptionsInfoFromAPI[3]);
        }

        console.log(chosenExtensionPlans);
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

        
        const response = await addSubscriptions(JSON.stringify(
                {
                    customer_id: 'cus_OteUYhKgkeuICE',
                    subscriptions: [
                        chosenSubscriptionToBeSentThroughAPI,
                        // ...chosenExtensionPlansToBeSentThroughAPI
                    ]
                })
        );
       

        const data = await response.json();
        console.log('Subscribed');
        console.log(data);
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
                    <div>${totalMonthlyCost}.00 + Taxes</div>
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
