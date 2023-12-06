import React , {
    useState
} from 'react';
import {
    Elements,
    useStripe,
    useElements,
    PaymentElement,
} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PrimaryButton from "../Buttons/PrimaryButton";
import SecondaryButton from "../Buttons/SecondaryButton";
import { useCreateIntentMutation, useFinishSetupMutation } from '../../app/services/subscription';
import { BASE_URL } from '../../app/constants/constants';
import Modal2 from "../Modal2/Modal2";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Payment({
    chosenSubscriptionObjectFromAPI,
    chosenExtentionObjectsFromAPI = [],
    SetIsPaymentSuccessfull,
    stripeCustomerId,
    OnAddClicked,
}) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [createIntentForPayment , createIntentForPaymentResp] = useCreateIntentMutation();
    const [finishSetupForPayment , finishSetupForPaymentResp] = useFinishSetupMutation();
    const [isPaymentProcessOnGoing, SetIsPaymentProcessOnGoing] = useState(false);

    const handleError = (error) => {
        SetIsPaymentProcessOnGoing(false);
        setLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || stripeCustomerId === undefined || stripeCustomerId === "" || stripeCustomerId === null) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
        }

        SetIsPaymentProcessOnGoing(true);
        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
        handleError(submitError);
        SetIsPaymentProcessOnGoing(false);
        return;
        }

        // Create the SetupIntent and obtain clientSecret
        const res = await createIntentForPayment({ customer_id: stripeCustomerId });
        
        /* const res = await fetch(`${BASE_URL}api/stripe/create-intent`, {
        method: 'POST',
        body: JSON.stringify({ customer_id: 'cus_OteUYhKgkeuICE' })
        }); */

        console.log("response from create_intent");
        console.log(res);

        const { client_secret: clientSecret } = res.data;
        // const { client_secret: clientSecret } = await res.json();

        // Confirm the SetupIntent using the details collected by the Payment Element
        const { setupIntent, error } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required',
        confirmParams: {
            return_url: 'http://localhost:3000/settings?tab=3',
        },
        });

        console.log("setupIntent");
        console.log(setupIntent);

        if (error) {
            // This point is only reached if there's an immediate error when
            // confirming the setup. Show the error to your customer (for example, payment details incomplete)
            handleError(error);
        } else {
            // Your customer is redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer is redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
            // console.log('subscribed', res);
            const post = await finishSetupForPayment({
                setupintent: setupIntent?.id,
                subscriptions: [
                    chosenSubscriptionObjectFromAPI,
                    [...chosenExtentionObjectsFromAPI]
                ]
            });

            SetIsPaymentProcessOnGoing(false);
            console.log("response from finish_setup");
            console.log(post);
            OnAddClicked();

            if(post) {
                SetIsPaymentSuccessfull(true);
                
            }
        }
    };

    const handlePayment = () => {

    };

    
    return (
        <div className="mt-2 mb-3 w-full">
            <form onSubmit={handleSubmit} className='scale-[0.9] w-full'>
                <PaymentElement 
                    className='scale-[1]'
                />
                {errorMessage && <div>{errorMessage}</div>}
            </form>

            {/* <div className="border-[1px] mt-[25px] w-full"></div> */}

            <div className="flex items-center mt-[-40px] ml-[-40px] justify-end w-full">
                {/* <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                /> */}
                <PrimaryButton
                    className={`w-[70px] flex justify-center  bg-[#FFA28D]  disabled:opacity-60  rounded text-white text-[12px] font-medium relative py-[4px]`}
                    
                    children={`Add`}
                    onClick={handleSubmit}
                    loading={isPaymentProcessOnGoing}
                />
            </div>
        </div>
    )
}

function StripeCardDetailWidget({
    chosenSubscriptionObjectFromAPI,
    chosenExtentionObjectsFromAPI = [],
    SetIsPaymentSuccessfull,
    stripeCustomerId,
    OnAddClicked,
}) {
    const options = {
        mode: 'setup',
        currency: 'usd',
        // Fully customizable with appearance API.
        // appearance: {/*...*/},
    };
    return (
        <Elements stripe={stripePromise} options={options}>
            <Payment 
                chosenSubscriptionObjectFromAPI={chosenSubscriptionObjectFromAPI}
                chosenExtentionObjectsFromAPI={chosenExtentionObjectsFromAPI}
                SetIsPaymentSuccessfull={SetIsPaymentSuccessfull}
                stripeCustomerId={stripeCustomerId}
                OnAddClicked={OnAddClicked}
            />
        </Elements>
    )
}

function AddNewBankCardModal({
    className,
    OnCrossIconClicked,
    OnAddClicked,
    stripeCustomerId,
}) {
    return (
        <Modal2
            className={className}
            OnCrossIconClicked={OnCrossIconClicked}
            title={"Add New Payment"}
            titleClassName="font-[600] text-[20px]"
            headerClassName={`pl-[20px] pr-[20px] pb-[10px] pt-[30px]`}
        >
            <StripeCardDetailWidget 
                stripeCustomerId={stripeCustomerId}
                OnAddClicked={OnAddClicked}
            />
        </Modal2>
    )
}

export default AddNewBankCardModal;