import React, { useState } from "react";
import TailwindModal from "../../components/TailwindModal";
import Typography from "../../components/Typography"
import Button from "../../components/Button";
import cardIco from "../../assets/images/card-added.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import CardForm from "./PlanPage/CardForm";
import { getRenewDate } from "./billingMethod"
const getDate = (date) => {
    const _date = new Date(date);
    return `${_date.getDate()} ${_date.toLocaleString('default', { month: 'short' })} ${_date.getFullYear()}`
}

const Billing = ({ expirypaywall, accessPage, flagLoading }) => {
    const [openCardModal, setCardModal] = useState(false);
    const [openCardaddedModal, setCardaddedModal] = useState(false);
    const { billingInfo, bilingLoading } = useSelector((state) => state.paymenttax)
    let activePlan = null
    let paymentMethod = null

    if (expirypaywall && billingInfo) {
        activePlan = <><div className="prop-primary">
            <label className="prop-label">Active Plan</label>
            <div className="prop-link">
                <Link to="/plans" className="btn link-white btn-medium">
                    <span className="typo-font-medium">Manage</span>
                </Link>
            </div>
        </div>
            <div className="prop-readonly">
                <div className="line-clamp-2">{billingInfo.planName}
                    {billingInfo.subscriptionStatus === "Expired" && <span className="text-maroon-5 ml-6">Expired</span>}
                    {billingInfo.subscriptionStatus === "Cancelled" && <span className="text-maroon-5 ml-6">Cancelled</span>}
                </div>
            </div>
        </>
        paymentMethod = <>
            <div className="prop-primary">
                <label className="prop-label">Payment Method</label>
                <div className="prop-link">
                    <Button
                        type="link-white"
                        title="Update"
                        fontWeight="medium"
                        onClick={() => setCardModal(true)}
                    />
                </div>
            </div>
            <div className="prop-readonly">
                <div className="truncate">Card ending in {billingInfo.creditCardNumber.replaceAll("*", "")}
                    {billingInfo.cardStatus === "Expired" && <span className="text-maroon-5 ml-6">Expired</span>}
                    {billingInfo.cardStatus === "Cancelled" && <span className="text-maroon-5 ml-6">Cancelled</span>}
                </div>
            </div>
        </>
    } else {
        activePlan = <><div className="prop-primary">
            <label className="prop-label">Active Plan</label>
            <div className="prop-link">
                <Link to="/plans" className="btn link-white btn-medium">
                    <span className="typo-font-medium">Upgrade</span>
                </Link>
            </div>
        </div>
            <div className="prop-readonly">
                <div className="line-clamp-2 text-gray-6">No active plan</div>
            </div>
        </>
        paymentMethod = <>
            <div className="prop-primary">
                <label className="prop-label">Payment Method</label>
            </div>
            <div className="prop-readonly">
                <div className="truncate text-gray-6">None</div>
            </div>
        </>
    }
    const billingHTML = (bilingLoading) ? <Loader /> : <div>
        <h2 className="setting-heading">Billing</h2>
        <div className="setting-content ">
            <div className="setting-col-8">
                <div className="prop-view">
                    {activePlan}
                </div>
                <div className="prop-view">
                    {paymentMethod}
                </div>
                {expirypaywall && billingInfo && <>
                    <div className="prop-view">
                        <div className="prop-primary">
                            <label className="prop-label">Renewal Date</label>
                        </div>
                        <div className="prop-readonly">
                            <div className="truncate">{getRenewDate(billingInfo)}</div>
                        </div>
                    </div>
                    <div className="prop-view">
                        <div className="prop-primary">
                            <label className="prop-label">Active Since</label>
                        </div>
                        <div className="prop-readonly">
                            <div className="truncate">{getDate(billingInfo.activationDate)}</div>
                        </div>
                    </div></>}
            </div>
        </div>
    </div>
    if(flagLoading) {
        return <Loader />
    }  
    return accessPage ? <>
        {billingHTML}
        <CardForm
            openCardModal={openCardModal}
            setCardModal={setCardModal}
            setCardaddedModal={setCardaddedModal}
            expirypaywall={expirypaywall}
        />
        <TailwindModal
            showClose={true}
            innerClasses={"max-w-105.5"}
            titleFontWeight={"typo-font-medium"}
            modalWrap={"py-6 px-8"}
            modalHead={"pb-0"}
            modalPadding={"p-0  -mt-2"}
            content={
                <>
                    <div className="mb-8">
                        <img src={cardIco} className="mx-auto" />
                    </div>
                    <h4 className="text-center mb-4 typo-font-bold text-xl">Card Added</h4>
                    <span className="text-center text-gray-7 block mb-4">Your card has successfully been added.</span>
                    <Button
                        size="large"
                        fontWeight="medium"
                        width="full"
                        title="Close"
                        onClick={() => { setCardaddedModal(false); }}
                    />
                </>
            }
            showModal={openCardaddedModal}
            setShowModal={setCardaddedModal}
        />
    </> : <div>
        <h2 className="setting-heading">Billing</h2>
        <div className="setting-content ">
            <Typography size={16}>Coming soon</Typography>
        </div>
    </div>
}

export default Billing;