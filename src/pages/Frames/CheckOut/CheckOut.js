import CheckOutExtensionsReview from "../../../components/CheckOutExtensionsReview/CheckOutExtensionsReview";
import CheckOutSubscriptionReview from "../../../components/CheckOutSubscriptionReview/CheckOutSubscriptionReview";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

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
        planName: "",
        planDisplayName: "",
        description: [],
        freeTrialDays: 0,
        subscriptionPricePerMonth: 0
    }],
    setcurrentStep
}) {

    const handleSubmit = () => {
        setFrames((prev) => {
          return { ...prev, extensions: false, checkout: true };
        });
        setcurrentStep(currentStep => currentStep + 1)
      };

    const handleBack = () => {
        setFrames((prev) => {
            return { ...prev, checkout: false, extensions: true };
        });
        setcurrentStep(currentStep => currentStep - 1)
    };

    const chosenSubscriptionPlan = subscriptionsInfo.find(item => item.planName === values.subscriptionPlan);

    const chosenExtensionPlans = extensionPlansInfo.filter(item => {
        for(let i = 0; i < extensions.length; i++) {
            if(extensions[i].text === item.planName && extensions[i].checked) return true;
        }
        return false;
    })

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
                description={chosenSubscriptionPlan.description}
                subscriptionPricePerMonth={chosenSubscriptionPlan.subscriptionPricePerMonth}
                freeTrialDays={chosenSubscriptionPlan.freeTrialDays}
                setFrames={setFrames}
                setcurrentStep={setcurrentStep}
            />

            <div className="font-semibold mt-[20px] text-[#FFA28D] text-[16px]">Extensions / Add-Ons</div>

            {(chosenExtensionPlans === undefined || chosenExtensionPlans === null || chosenExtensionPlans.length === 0) ? (<></>) :
                chosenExtensionPlans.map(item => {
                    const chosenPackageName = extensions.find(i => i.text === item.planName).packageName;
                    const chosenPackage = item.extensionPriceOption.find(pack => pack.planName === chosenPackageName);
                    return (
                        <CheckOutExtensionsReview
                            className={"mt-[25px]"}
                            planDisplayName={item.planDisplayName}
                            extensionPriceOption={chosenPackage}
                            setFrames={setFrames}
                            setcurrentStep={setcurrentStep}
                        />
                    )
                })
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

            <div className="border-[1px] mt-[25px] w-full"></div>

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    children={`Checkout`}
                    
                />
            </div>
        </div>
    )
}
