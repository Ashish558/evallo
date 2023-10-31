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
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";

const stripePromise = loadStripe('pk_test_51NoBsUSF4WnDe9WBCtTkvFmGCbP7V13FRSIeozP8zfnhFFlSrYRlcQ2j6is9viJUjCrENLlq7uauG5ztDOsLBpdA00QIKLXblk');

function Payment({
    setFrames,
    setcurrentStep,
}) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);

    const handleError = (error) => {
        setLoading(false);
        setErrorMessage(error.message);
    };

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe) {
        // Stripe.js hasn't yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
        }

        setLoading(true);

        // Trigger form validation and wallet collection
        const { error: submitError } = await elements.submit();
        if (submitError) {
        handleError(submitError);
        return;
        }

        // Create the SetupIntent and obtain clientSecret
        const res = await fetch('http://localhost:3000/api/stripe/create-intent', {
        method: 'POST',
        });

        const { client_secret: clientSecret } = await res.json();

        // Confirm the SetupIntent using the details collected by the Payment Element
        const { setupIntent, error } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required',
        confirmParams: {
            return_url: 'https://stackblitz-starters-vzyaus.stackblitz.io/payment',
        },
        });

        if (error) {
        // This point is only reached if there's an immediate error when
        // confirming the setup. Show the error to your customer (for example, payment details incomplete)
        handleError(error);
        } else {
        // Your customer is redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer is redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
        // console.log('subscribed', res);
        const post = await fetch(
            `http://localhost:3000/api/stripe/finish_setup`,
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                setupintent: setupIntent?.id,
            }),
            }
        );

        const resp = await post.json();
        }
    };

    const handleBack = () => {
        setFrames((prev) => {
            return { ...prev, payment: false, extensions: true };
        });
        // setcurrentStep(currentStep => currentStep - 1)
    };

    const handleNext = () => {
        setFrames((prev) => {
            return { ...prev, payment: false, checkout: true };
        });
        // setcurrentStep(currentStep => currentStep + 1)
    };

    
    return (
        <div className="mt-2 mb-3">
            <form onSubmit={handleSubmit}>
                <PaymentElement />
                <button type="submit" disabled={!stripe || loading}>
                    Submit
                </button>
                {errorMessage && <div>{errorMessage}</div>}
            </form>

            <div className="border-[1px] mt-[25px] w-full"></div>

            <div className="flex items-center mt-[50px] justify-end">
                <SecondaryButton
                    children="Go back"
                    className="text-sm mr-6 bg-white text-[#cad0db] border-[1.7px] border-[#D0D5DD] py-2 "
                    onClick={handleBack}
                />
                <PrimaryButton
                    className={`w-full flex justify-center  bg-[#FFA28D]  disabled:opacity-60 max-w-[110px]  rounded text-white text-sm font-medium relative py-[9px]`}
                    
                    children={`Next`}
                    onClick={handleNext}
                />
            </div>
        </div>
    )
}

export default function PaymentWrapper({
    setFrames,
    setcurrentStep,
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
                setFrames={setFrames}
                setcurrentStep={setcurrentStep}
            />
        </Elements>
    )
}