export const subScriptionPlanData = [
    {
        planName: "Starter",
        activeTutorsAllowed: 1,
        activeStudentsAllowed: 30,
        freeTrialDays: 3*30,
        subscriptionPricePerMonth: 15,
        currency: "usd",
        ccRequired: false
    },
    {
        planName: "Professional",
        activeTutorsAllowed: 10,
        activeStudentsAllowed: 250,
        freeTrialDays: 2*30,
        subscriptionPricePerMonth: 29,
        currency: "usd",
        ccRequired: true
    },
    {
        planName: "Premium",
        activeTutorsAllowed: 30,
        activeStudentsAllowed: 1000,
        freeTrialDays: 14,
        subscriptionPricePerMonth: 59,
        currency: "usd",
        ccRequired: true
    },
    {
        planName: "Enterprise",
        activeTutorsAllowed: Infinity,
        activeStudentsAllowed: Infinity,
        freeTrialDays: 0,
        subscriptionPricePerMonth: 99,
        currency: "usd",
        ccRequired: true
    }
]