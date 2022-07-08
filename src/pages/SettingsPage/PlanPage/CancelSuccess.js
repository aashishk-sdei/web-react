import React, { useState } from "react";
import TailwindModal from "../../../components/TailwindModal";
import Button from "../../../components/Button";
import { getRenewDate } from "./../billingMethod"
import memberDrop from "../../../assets/images/memberdrop.svg";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const CancelSuccess = ({ setMemDropModal, openMemDropModal }) => {
    const history = useHistory()
    const [loading, setLoading] = useState(false)
    const { billingInfo } = useSelector((state) => state.paymenttax)
    return <TailwindModal
        showClose={true}
        innerClasses={"max-w-105.5"}
        titleFontWeight={"typo-font-medium"}
        modalWrap={"py-6 px-8"}
        modalHead={"pb-0"}
        modalPadding={"p-0  -mt-2"}
        content={
            <>
                <div className="mb-8">
                    <img src={memberDrop} className="mx-auto" />
                </div>
                <h4 className="text-center mb-4 typo-font-bold text-xl">Membership Cancelled</h4>
                <span className="text-gray-5 text-left text-sm block mb-4">Your membership has been cancelled, but you will have access until the end of your current billing period on <b>{getRenewDate(billingInfo)}</b>.</span>
                <Button
                    size="large"
                    fontWeight="medium"
                    width="full"
                    title="Close"
                    loading={loading}
                    onClick={() => {
                        setLoading(true)
                        setTimeout(() => {
                            setMemDropModal(false);
                            setLoading(false)
                            history.replace('/settings/3')
                        }, 5000)
                    }}
                />
            </>
        }
        showModal={openMemDropModal}
        setShowModal={setMemDropModal}
    />
}
export default CancelSuccess