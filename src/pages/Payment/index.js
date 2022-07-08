import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useParams } from "react-router-dom";
import './index.css';
import Typography from "./../../components/Typography"
import Icon from "./../../components/Icon"
import PaymentShowcase from './../../../src/assets/images/paymentShowcase.jpg'
import PaymentForm from './PaymentForm';
import PaymentSuccess from './PaymentSuccess';
import svg from "./paymentIcon";
import StartPlusMobile from "./component/mobile/StartPlus"
import PremiumMobile from "./component/mobile/Premium";
import StartPlus from "./component/StartPlus"
import Premium from "./component/Premium";
import {
    EARLIER_PLAN_ID,
    BUNDLE_PLAN_ID,
    BUNDLE_PLAN_ID_YEARLY,
    BUNDLE_PLAN_ID_HALF_YEARLY,
    BUNDLE_PLAN_ID_MONTHLY,
    STAR_PLUS_PLAN_ID,
    planDetail
} from "../../utils/constant"
import {
    userPayWallDetail,
    newSubscriberData
} from "./../../utils";
import { getBillingInformation, getCalculateRefundAmount, getCountriesWithAbbr, getTaxApiDetails, resetStatus } from "../../redux/actions/payments";
import { decodeJWTtoken, getSubscriptionDetails, getSubscription } from "./../../services";
import Ordersummary from './component/Ordersummary';
import PlanSelect from './PlanSelect';
import Loader from '../../components/Loader';
const plans = Object.values(planDetail)
const logo = <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M31.9949 0H16.7896V32H31.9949V0ZM7.05566 3.35107V28.6632H14.8019V3.35107H7.05566ZM0 6.82019H5.07076V25.1762H0V6.82019Z" fill="#FC4040" />
</svg>
const getSvg = (title, icon) => <div className="relative mb-5 pb-0.5">
    <span className="icon absolute top-0.5 left-0">
        {svg[icon]}
    </span>
    <div className="pl-6">
        <Typography size={14} weight="bold" text="secondary"><span className="block">{title}</span></Typography>
    </div>
</div>
const getComponentRender = (planName) => {
    let PaymetDetailLeft = StartPlus
    let PaymetDetailLeftMobile = StartPlusMobile
    let buttonText = "Start Storied Plus"
    let planText = "You now have upgraded access to Storied Plus."
    let planId = EARLIER_PLAN_ID
    if (planName === 'bundle') {
        PaymetDetailLeft = Premium
        PaymetDetailLeftMobile = PremiumMobile
        buttonText = "View Summary"
        planText = "You now have upgraded access to Storied Ultimate."
        planId = BUNDLE_PLAN_ID
    } else if (planName === "early") {
        buttonText = "View Summary"
        planId = STAR_PLUS_PLAN_ID
        PaymetDetailLeftMobile = StartPlusMobile
    }
    return {
        PaymetDetailLeft,
        PaymetDetailLeftMobile,
        buttonText,
        planText,
        planId
    }
}
const planDetailsObject = (value) => {
    let obj = {}
    switch (value) {
        case BUNDLE_PLAN_ID_YEARLY:
            obj.planId = BUNDLE_PLAN_ID_YEARLY
            obj.title = "12 Months"
            obj.description = "Billed at $149.99 annually"
            obj.total_amount = "12.49"
            obj.months = "12"
            obj.offer = "50"
            obj.popular = "MOST POPULAR"
            break;
        case BUNDLE_PLAN_ID_HALF_YEARLY:
            obj.planId = BUNDLE_PLAN_ID_HALF_YEARLY
            obj.title = "6 Months"
            obj.description = "Billed at $89.99 semi-annually"
            obj.total_amount = "14.99"
            obj.months = "6"
            obj.offer = "40"
            obj.popular = false
            break;
        case BUNDLE_PLAN_ID_MONTHLY:
            obj.planId = BUNDLE_PLAN_ID_MONTHLY
            obj.title = "1 Month"
            obj.description = ""
            obj.total_amount = "24.99"
            obj.months = "1"
            obj.offer = ""
            obj.popular = false
            break;
        case STAR_PLUS_PLAN_ID:
            obj.planId = STAR_PLUS_PLAN_ID
            obj.title = ""
            obj.description = ""
            obj.total_amount = "4.99"
            obj.months = "1"
            obj.offer = ""
            obj.popular = false
            break;
        default:
            break;
    }
    return obj;
}

const allPlans = [
    planDetailsObject(BUNDLE_PLAN_ID_YEARLY),
    planDetailsObject(BUNDLE_PLAN_ID_HALF_YEARLY),
    planDetailsObject(BUNDLE_PLAN_ID_MONTHLY),
]

const widthClass = (selectedPlan) => {
    return selectedPlan === null ? "max-w-full" : "max-w-sm"
}

const Payment = () => {
    const dispatch = useDispatch();
    const location = useLocation()
    const getQueryParams = new URLSearchParams(location.search);
    const failureURL = getQueryParams.get('failure')
    const returnURL = getQueryParams.get('redirect')
    const expirypaywallDetail = useMemo(() => {
        if (getSubscription()) {
            let subdata = getSubscriptionDetails();
            if (subdata?.endDate) {
                return newSubscriberData(subdata);
            }
        } else {
            return userPayWallDetail(decodeJWTtoken());
        }
    }, [])
    const { planName } = useParams();
    const [ordersummarypage, setordersummarypage] = useState(false)
    const [reversevalue, setReverse] = useState(false);
    const [reverseForm, setReverseForm] = useState(false);
    const [formData, setformData] = useState({})
    const history = useHistory();
    const { isPaySuccess } = useSelector((state) => state.payment);
    const { data } = useSelector((state) => state.paymenttax)
    const [planSelection, setPlanSelection] = useState(planName === 'bundle' ? null : EARLIER_PLAN_ID);
    const [selectDefault, setSelectDefault] = useState(true);
    const [loading, setLoading] = useState(false)

    const showStep = planName === "early" ? false : true;
    const setSelectDefaultFunction = (defaultOption) => {
        setSelectDefault(defaultOption)
    }
    const getRefundAmountFunc = async (currentPlanId, currentActivationDate) => {
        return dispatch(getCalculateRefundAmount(currentPlanId, currentActivationDate))
    }
    useEffect(() => {
        if (planSelection && expirypaywallDetail?.planId) {
            let planAmount = plans.filter(x => x.planid == planSelection)
            let planAmountReuslt = Number(planAmount?.[0]?.amount)
            setSummaryInfo(planAmountReuslt, planSelection)
        }
        return () => {
            dispatch(resetStatus())
        }
    }, [expirypaywallDetail])
    const setSummaryInfo = async (planAmountReuslt, planID) => {
        setLoading(true)
        await dispatch(getBillingInformation(expirypaywallDetail.recurlyId)).then(async (billingResponse) => {
            if (billingResponse) {
                let refundAmountReponse = await getRefundAmountFunc(expirypaywallDetail.planId, billingResponse.activationDate)
                if (refundAmountReponse) {
                    const purchaseFormData = {
                        "UpgradePlanInformation": {
                            "CurrentPlanId": expirypaywallDetail.planId,
                            "NewPlanId": planID,
                            "NewPlanAmount": planAmountReuslt,
                            "RefundAmount": refundAmountReponse,
                            "RecurlySubscriptionUuid": expirypaywallDetail.recurlyId
                        },
                        "UserInformation": {
                            "PlanId": planID,
                        },
                        "CreditCardInformation": {
                            "CreditCardNumber": billingResponse.creditCardNumber
                        }
                    }
                    const taxDetailsformData = {
                        country: billingResponse.country,
                        zipcode: billingResponse.zipCode,
                        amount: planAmountReuslt
                    }
                    return dispatch(getTaxApiDetails(taxDetailsformData, setformData, purchaseFormData, setordersummarypage))
                }
            }
        })
        setordersummarypage(!!expirypaywallDetail)
        setLoading(false)
    }
    const setPlanFunction = (planID) => {
        setPlanSelection(planID)
        if (planID !== null) {
            if (expirypaywallDetail) {
                let planAmount = plans.filter(x => x.planid == planID)
                let planAmountReuslt = Number(planAmount?.[0]?.amount)
                setSummaryInfo(planAmountReuslt, planID)
            }
        } else {
            setordersummarypage(false)
        }
    }
    const {
        PaymetDetailLeft,
        PaymetDetailLeftMobile,
        buttonText,
        planText
    } = getComponentRender(planName)
    useEffect(() => {
        document.querySelector(".shadow-md.header").style.display = "none";
        return _ => {
            document.querySelector(".shadow-md.header").style.display = "";
        }
    }, []);
    useEffect(() => {
        dispatch(getCountriesWithAbbr());
    }, [])
    const {
        counties,
    } = useSelector(state => state.location);
    const changeCreditcard = (_formData) => {
        setReverse(true)
        setReverseForm(_formData)
        setordersummarypage(false)
    }

    const calculateValues = (planIdValue, dataValue) => {
        let planAmount = plans.filter(x => x.planid == planIdValue)
        const _amount = Number(dataValue) + Number(planAmount?.[0]?.amount)
        return Math.round(_amount * 100) / 100
    }
    const getPaymentForm = () => {
        if (planSelection === null) {
            return <PlanSelect
                planSelection={expirypaywallDetail?.planId}
                setPlanFunction={setPlanFunction}
                showStep={showStep}
                allPlans={allPlans}
                selectDefault={selectDefault}
                setSelectDefaultFunction={setSelectDefaultFunction}
            />
        } else {
            return <PaymentForm
                showStep={showStep}
                buttonText={buttonText}
                planId={planSelection}
                plans={plans}
                setformData={setformData}
                countyLoading={setordersummarypage}
                setordersummarypage={setordersummarypage}
                counties={counties}
                reversevalue={reversevalue}
                reverseForm={reverseForm}
                expirypaywall={expirypaywallDetail}
            />
        }
    }
    const ordersummarypageHtml = () => {
        if (ordersummarypage === false) {
            return (<PaymetDetailLeftMobile logo={logo} planDetails={planDetailsObject(planSelection)} setPlanFunction={setPlanFunction} />, getPaymentForm())
        }
        if (ordersummarypage === true) {
            return getOrderSummary()
        }
    }
    const getOrderSummary = () => {
        return ordersummarypage && <Ordersummary
            formData={formData}
            planId={planSelection}
            setordersummarypage={setordersummarypage}
            data={data}
            totalAmount={calculateValues(planSelection, data)}
            plans={plans}
            changeCreditcard={() => { changeCreditcard(formData) }}
            isUpgrade={!!expirypaywallDetail}
        />
    }
    if (loading) {
        return <Loader />
    }
    return <>
        <div className="flex w-full">
            <div className='absolute top-6 right-6'>
                {planName !== "early" && <Icon
                    background
                    handleClick={() => {
                        if (failureURL && !isPaySuccess) {
                            history.replace(failureURL)
                        } else if (returnURL) {
                            history.replace(returnURL)
                        } else {
                            history.goBack()
                        }
                    }}
                    id="&quot;icon-&quot; + crypt"
                    type="delete"
                />}
            </div>
            <div className='w-2/4 bg-gray-2 overflow-hidden relative hidden lg:flex'>
                <div className='relative w-full h-full'>
                    <img className='absolute left-0 top-0 w-full h-full object-cover' src={PaymentShowcase} alt="" />
                    <div className='absolute bg-black w-full h-full z-10 top-0 left-0 opacity-50'></div>
                    <div className='w-full max-w-sm absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4 z-50 px-3'>
                        <PaymetDetailLeft logo={logo} getSvg={getSvg} svg={svg} planDetails={planDetailsObject(planSelection)} setPlanFunction={setPlanFunction} isPaySuccess={isPaySuccess} />
                    </div>
                </div>
            </div>
            <div className='w-full lg:w-2/4 flex'>
                {isPaySuccess ? <PaymentSuccess planText={planText} /> :
                    <div className={`w-full px-6 smd:px-3 m-auto pt-18 pb-10 md:py-10 ${widthClass(planSelection)}`}>
                        {ordersummarypageHtml()}
                    </div>
                }
            </div>
        </div>
    </>
}

export default Payment