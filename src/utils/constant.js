export const NEWSPAPER_URL = "https://newspaperarchive.com"
export const IMAGEPATH = "/thumbimage.ashx?i="
export const EARLIER_PLAN_ID = "19578"
export const BUNDLE_PLAN_ID = "19580"
export const BUNDLE_PLAN_ID_YEARLY = "19582"
export const BUNDLE_PLAN_ID_HALF_YEARLY = "19581"
export const BUNDLE_PLAN_ID_MONTHLY = "19580"
export const STAR_PLUS_PLAN_ID = "19583"
export const planDetail = {
    [EARLIER_PLAN_ID]: { planid: EARLIER_PLAN_ID, amount: 4.99, planName: "Storied Plus", basicName: "Storied Plus", amountText: "Monthly - $4.99/mo", prefix: "mo" },
    [STAR_PLUS_PLAN_ID]: { planid: STAR_PLUS_PLAN_ID, amount: 4.99, planName: "Storied Plus" , basicName: "Storied Plus", amountText: "Monthly - $4.99/mo", prefix: "mo"},
    [BUNDLE_PLAN_ID_YEARLY]: { planid: BUNDLE_PLAN_ID_YEARLY, amount: 149.99, planName: "Storied Ultimate - 12 Month Membership", basicName: "Storied Ultimate", amountText: "12 Month - $12.49/mo", prefix: "yr" },
    [BUNDLE_PLAN_ID_HALF_YEARLY]: { planid: BUNDLE_PLAN_ID_HALF_YEARLY, amount: 89.99, planName: "Storied Ultimate - 6 Month Membership", basicName: "Storied Ultimate", amountText: "6 Month - $14.99/mo", prefix: "6 mos" },
    [BUNDLE_PLAN_ID_MONTHLY]: { planid: BUNDLE_PLAN_ID_MONTHLY, amount: 24.99, planName: "Storied Ultimate - 1 Month Membership", basicName: "Storied Ultimate", amountText: "1 Month - $24.99/mo", prefix: "mo" }
}
