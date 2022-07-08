import React, { useMemo, useState, useEffect } from "react";
import TailwindModal from "../../../components/TailwindModal";
import Button from "../../../components/Button";
import { decodeJWTtoken, getSubscription, getSubscriptionDetails } from '../../../services';
import { userPayWallDetailAll, newSubscriberData } from './../../../utils'
import {
    BUNDLE_PLAN_ID_YEARLY,
    BUNDLE_PLAN_ID_HALF_YEARLY,
    BUNDLE_PLAN_ID_MONTHLY,
    STAR_PLUS_PLAN_ID,
    planDetail,
    EARLIER_PLAN_ID
} from "../../../utils/constant"
import { getRenewDate } from "./../billingMethod"

//Css
import "./../index.css";
import { Link } from "react-router-dom";
import { cancelPayment, getBillingInformation } from "../../../redux/actions/payments";
import { useDispatch, useSelector } from "react-redux";
import CancelSubscription from "./CancelSubscription"
import CancelSuccess from "./CancelSuccess"
import CommonHtml from "./CommonHtml"
import Loader from "../../../components/Loader";
const mobileCheck = <div className="w-7/12 px-1.5 text-center">
    <div className="flex flex-wrap -mx-1.5 h-full">
        <div className="w-1/2 px-6 py-6 text-center bg-gray-1 border-l-1 border-r-1 border-gray-2 flex items-center justify-center">
            <svg className="inline" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10.5925L4.675 15.808C4.8144 16.0162 5.00151 16.1882 5.22077 16.3095C5.44003 16.4308 5.68509 16.498 5.93555 16.5055C6.18602 16.5129 6.43466 16.4605 6.66077 16.3525C6.88687 16.2445 7.08392 16.084 7.2355 15.8845L19 1" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
        <div className="w-1/2 py-6 px-6 text-center flex items-center justify-center">
            <svg className="inline" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10.5925L4.675 15.808C4.8144 16.0162 5.00151 16.1882 5.22077 16.3095C5.44003 16.4308 5.68509 16.498 5.93555 16.5055C6.18602 16.5129 6.43466 16.4605 6.66077 16.3525C6.88687 16.2445 7.08392 16.084 7.2355 15.8845L19 1" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    </div>
</div>
const mobileCheckUltimate = <div className="w-7/12 px-1.5 text-center">
    <div className="flex flex-wrap -mx-1.5 h-full">
        <div className="w-1/2 px-6 py-6 text-center bg-gray-1 border-l-1 border-r-1 border-gray-2">

        </div>
        <div className="w-1/2 py-6 px-6 text-center flex items-center justify-center">
            <svg className="inline" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10.5925L4.675 15.808C4.8144 16.0162 5.00151 16.1882 5.22077 16.3095C5.44003 16.4308 5.68509 16.498 5.93555 16.5055C6.18602 16.5129 6.43466 16.4605 6.66077 16.3525C6.88687 16.2445 7.08392 16.084 7.2355 15.8845L19 1" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>
    </div>
</div>
const Billing = () => {
    const dispatch = useDispatch()
    const [openMemCancelModal, setMemCancelModal] = useState(false);
    const [openMemberDelModal, setMemberDelModal] = useState(false);
    const [openMemDropModal, setMemDropModal] = useState(false);
    const encodeUrlReturn = '/settings/3';
    const expirypaywall = useMemo(() => {
        if (getSubscription()) {
            let subdata = getSubscriptionDetails();
            return newSubscriberData(subdata);
        }
        else {
            return userPayWallDetailAll(decodeJWTtoken());
        }
    }, [])
    useEffect(() => {
        if (expirypaywall && expirypaywall.recurlyId) {
            dispatch(getBillingInformation(expirypaywall.recurlyId))
        }
    }, [expirypaywall])
    const handleSubmitReason = (values, { setSubmitting }) => {
        let obj = {
            "RecurlySubscriptionUuid": expirypaywall.recurlyId,
            "CancelReason": values.reasonType === "Other" ? values.reason : values.reasonType,
            "CancelReasonId": 0
        }
        dispatch(cancelPayment(obj, { setMemCancelModal, setMemDropModal, setSubmitting }))
    }
    const { billingInfo, bilingLoading } = useSelector((state) => state.paymenttax)
    let isbundlePlan = expirypaywall && [BUNDLE_PLAN_ID_YEARLY, BUNDLE_PLAN_ID_HALF_YEARLY, BUNDLE_PLAN_ID_MONTHLY].includes(expirypaywall.planId) 
    let isEarlyPlan = expirypaywall && [STAR_PLUS_PLAN_ID, EARLIER_PLAN_ID].includes(expirypaywall.planId)
    if(billingInfo?.subscriptionStatus === "Cancelled") {
        isbundlePlan = true
        isEarlyPlan = true
    } else if(billingInfo?.subscriptionStatus === "Expired") {
        isbundlePlan = false
        isEarlyPlan = false
    }
    if(bilingLoading) {
        return <Loader />
    }
    return <>
        <div className="pt-30">
            <div className="w-full md:max-w-5xl px-6 mx-auto">
                <div className="setting-col-8 mx-auto">
                    <div class="relative planBox mb-12">
                        <h2 className="typo-font-medium text-xl text-gray-7 mb-4">Available Plans</h2>
                        <div className=" hidden md:block ">
                            <div className="rounded-2xl border-1 border-gray-2">
                                <div className="flex flex-wrap h-full">
                                    <div className="w-5/12 px-10 py-10 text-right">
                                    </div>
                                    <div className="w-7/12 px-1.5 text-center">
                                        <div className="flex flex-wrap -mx-1.5 h-full">
                                            <div className="w-1/2 px-2 py-10 text-center bg-gray-1 border-l-1 border-r-1 border-gray-2 border-l-1 border-r-1 border-gray-2">
                                                <div className="relative flex justify-center">
                                                    <span className="text-skyblue-6 border-2 border-skyblue-6 typo-font-bold text-md px-2 rounded-lg">Plus</span>
                                                </div>
                                            </div>
                                            <div className="w-1/2 px-2 py-10 text-center">
                                                <div className="relative flex justify-center">
                                                    <span className="text-purple-6 border-2 border-purple-6 typo-font-bold text-md px-2 rounded-lg">Ultimate</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-10 py-10 text-right">
                                        <span className="text-gray-7">Price / month</span>
                                    </div>
                                    <div className="w-7/12 px-1.5 text-center">
                                        <div className="flex flex-wrap -mx-1.5 h-full">
                                            <div className="w-1/2 px-2 py-10 text-center bg-gray-1 border-l-1 border-r-1 border-gray-2 border-l-1 border-r-1 border-gray-2">
                                                <span className="text-gray-7 typo-font-medium text-3xl"><sup className="text-sm -top-4 mr-1">$</sup>4.99</span>
                                            </div>
                                            <div className="w-1/2 px-2 py-10 text-center">
                                                <div className="relative flex justify-center">
                                                    <div className="text-gray-5 text-xs -top-3.5 absolute">Starting at</div>
                                                    <span className="text-gray-7 typo-font-medium text-3xl"><sup className="text-sm -top-4 mr-1">$</sup>12.49</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">View stories shared with me</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Receive clues about people in your family tree</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Record your own stories</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">View all public stories from people you follow</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Ten free newspaper views</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Access to Storied records</span>
                                    </div>
                                    {mobileCheck}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Access to over 3 billion newspaper articles</span>
                                    </div>
                                    {mobileCheckUltimate}
                                </div>
                                <div className="flex flex-wrap border-t-1 border-gray-2 h-full">
                                    <div className="w-5/12 px-6 py-6 text-right">
                                        <span className="text-gray-7">Included subscription to NewspaperArchive</span>
                                    </div>
                                    {mobileCheckUltimate}
                                </div>
                            </div>
                            <div className="flex flex-wrap h-full">
                                <div className="w-5/12 px-6 py-6 text-right">
                                </div>
                                <div className="w-7/12 px-1.5 text-center">
                                    <div className="flex flex-wrap -mx-1.5 h-full">
                                        {!isEarlyPlan ? <Link to={`/payment?redirect=${encodeUrlReturn}`} className="w-1/2 px-6 py-6 text-center">
                                            <button type="button" class="btn mx-auto bg-skyblue-6 btn-large  flex justify-center items-center">
                                                <span class="typo-font-medium text-white">Get Plus</span>
                                            </button>
                                        </Link>:<div className="w-1/2 px-6 py-6 text-center"></div>}
                                        {!isbundlePlan && <Link to={`/payment/bundle?redirect=${encodeUrlReturn}`} className="w-1/2 py-6 px-6 text-center">
                                            <button type="button" class="btn mx-auto bg-purple-6 btn-large  flex justify-center items-center">
                                                <span class="typo-font-medium text-white">Get Ultimate</span>
                                            </button>
                                        </Link>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:hidden block">
                            <div className="rounded-2xl border-1 border-gray-2 shadow shadow-md  mb-10">
                                <div className="flex flex-wrap justify-center  py-3.5">
                                    <span className="text-skyblue-6 border-3 border-skyblue-6 typo-font-bold text-2xl px-2 rounded-lg">Plus</span>
                                </div>
                                <div className="flex flex-wrap justify-center border-t-1 border-gray-2 py-6">
                                    <div class="relative flex justify-center">
                                        <div class="text-gray-7 typo-font-medium text-3xl"><sup class="text-sm -top-4 mr-1">$</sup>4.99<span className="text-gray-6">/mo</span></div>
                                    </div>
                                </div>
                                {!isEarlyPlan && <Link to={`/payment?redirect=${encodeUrlReturn}`} className="flex flex-wrap justify-center  border-t-1 border-gray-2 py-3.5">
                                    <button type="button" class="btn bg-skyblue-6 btn-large  flex justify-center items-center">
                                        <span class="typo-font-medium text-white">Get Plus</span>
                                    </button>
                                </Link>}
                                <div className="flex flex-col flex-wrap justify-center  border-t-1 border-gray-2 pt-4 pb-6 px-4">
                                    <h4 className="mb-4 text-sm">Storied Plus includes</h4>
                                    <ul className="text-gray-7 text-xs">
                                        <CommonHtml />
                                        <li className="flex items-center mt-4">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 13L13 1" stroke="#9D9FA2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13 13L1 1" stroke="#9D9FA2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span className="ml-3.5 text-gray-5">Access to over 3 billion newspaper articles</span>
                                        </li>
                                        <li className="flex items-center mt-4">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 13L13 1" stroke="#9D9FA2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13 13L1 1" stroke="#9D9FA2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span className="ml-3.5 text-gray-5">Included subscription to NewspaperArchive</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="rounded-2xl border-1 border-gray-2 shadow shadow-md">
                                <div className="flex flex-wrap justify-center  py-3.5">
                                    <span className="text-purple-6 border-3 border-purple-6 typo-font-bold text-2xl px-2 rounded-lg">Ultimate</span>
                                </div>
                                <div className="flex flex-wrap justify-center border-t-1 border-gray-2 py-6">
                                    <div class="relative flex justify-center">
                                        <div class="text-gray-5 text-xs -top-3.5 absolute">Starting at</div>
                                        <span class="text-gray-7 typo-font-medium text-3xl"><sup class="text-sm -top-4 mr-1">$</sup>12.49</span>
                                    </div>
                                </div>
                                {!isbundlePlan && <Link to={`/payment/bundle?redirect=${encodeUrlReturn}`} className="flex flex-wrap justify-center  border-t-1 border-gray-2 py-3.5">
                                    <button type="button" class="btn bg-purple-6 btn-large  flex justify-center items-center">
                                        <span class="typo-font-medium text-white">Get Ultimate</span>
                                    </button>
                                </Link>}
                                <div className="flex flex-col flex-wrap justify-center  border-t-1 border-gray-2 pt-4 pb-6 px-4">
                                    <h4 className="mb-4 text-sm">Storied Ultimate includes</h4>
                                    <ul className="text-gray-7 text-xs">
                                        <CommonHtml />
                                        <li className="flex items-center mt-4">
                                            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 7.395L3.45 10.872C3.54293 11.0108 3.66768 11.1254 3.81385 11.2063C3.96002 11.2872 4.12339 11.332 4.29037 11.337C4.45735 11.342 4.6231 11.307 4.77384 11.235C4.92458 11.163 5.05595 11.056 5.157 10.923L13 1" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span className="ml-3.5">Access to over 3 billion newspaper articles</span>
                                        </li>
                                        <li className="flex items-center mt-4">
                                            <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 7.395L3.45 10.872C3.54293 11.0108 3.66768 11.1254 3.81385 11.2063C3.96002 11.2872 4.12339 11.332 4.29037 11.337C4.45735 11.342 4.6231 11.307 4.77384 11.235C4.92458 11.163 5.05595 11.056 5.157 10.923L13 1" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span className="ml-3.5">Included subscription to NewspaperArchive</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {expirypaywall && !["Cancelled", "Expired"].includes(billingInfo?.subscriptionStatus) && <div className="mb-12 pb-12">
                        <h2 className="typo-font-medium text-xl text-gray-7 mb-4">Current Plan</h2>
                        <div className="md:px-3 md:py-6 rounded-2xl border-1 border-gray-2">
                            <div className="flex items-center flex-wrap -mx-1.5">
                                <div className="md:w-4/12 md:px-1.5 px-6 pt-6 md:pt-0">
                                    <span className="text-gray-7 w-full">{planDetail[expirypaywall.planId].basicName}</span>
                                </div>
                                <div className="md:w-4/12 w-full md:px-1.5 px-6 pb-6 md:pb-0 border-b-1 border-gray-2 md:border-0">
                                    <span className="text-gray-6 flex">{planDetail[expirypaywall.planId].amountText}</span>
                                    {([BUNDLE_PLAN_ID_YEARLY, BUNDLE_PLAN_ID_HALF_YEARLY, BUNDLE_PLAN_ID_MONTHLY].includes(expirypaywall.planId)) && <Link to={`/payment/bundle?redirect=${encodeUrlReturn}`} className="text-blue-4 text-xs">Change Duration</Link>}
                                </div>
                                <div className="md:w-4/12 w-full px-1.5 md:text-right text-center py-6 md:py-0">
                                    <span className="text-maroon-5 typo-font-medium text-md cursor-pointer" onClick={() => { setMemberDelModal(true); }}>Cancel Membership</span>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
        <TailwindModal
            title="Cancel Membership"
            showClose={true}
            innerClasses={"max-w-105.5"}
            titleFontWeight={"typo-font-bold"}
            modalWrap={"py-6 px-8"}
            modalHead={"pb-6"}
            modalPadding={"p-0"}
            content={
                <>
                    <div className="text-gray-6 text-md typo-font-medium text-left text-md mb-4">We're sorry to see you go!</div>
                    <span className="text-gray-7 text-left text-sm block mb-4 md:pr-12">If you cancel your membership, you will lose access at the end of your current billing period on <b>{getRenewDate(billingInfo)}</b>.</span>
                    <div className="buttons mt-10 ml-auto flex items-center justify-end">
                        <div>
                            <Button
                                size="large"
                                title="Back"
                                fontWeight="medium"
                                onClick={() => { setMemberDelModal(false) }}
                                type="default-dark"
                            />
                        </div>
                        <div className="ml-2">
                            <Button
                                size="large"
                                title="Next"
                                fontWeight="medium"
                                onClick={() => { setMemberDelModal(false); setMemCancelModal(true); }}
                            />
                        </div>
                    </div>
                </>
            }
            showModal={openMemberDelModal}
            setShowModal={setMemberDelModal}
        />
        <CancelSubscription
            handleSubmitReason={handleSubmitReason}
            setMemberDelModal={setMemberDelModal}
            setMemCancelModal={setMemCancelModal}
            openMemCancelModal={openMemCancelModal}
        />
        <CancelSuccess 
            setMemDropModal={setMemDropModal}
            openMemDropModal={openMemDropModal}
        />
    </>
}
export default Billing;