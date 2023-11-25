import {
    useState
} from "react";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import OrgDetailsForm from "../OrgDetailsForm/OrgDetailsForm";

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
                            <></>
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