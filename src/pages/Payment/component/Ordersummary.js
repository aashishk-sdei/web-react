import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { submitCardDetails, updateUpgradePlans } from "../../../redux/actions/payments";
import Button from "../../../components/Button"
const lastCreditCardNumver = (value) => {
    let cNo = '';
    if (value.CreditCardInformation) {
        cNo = value.CreditCardInformation.CreditCardNumber
        cNo = cNo.substring(cNo.length - 4);
    }
    return cNo;
}

const Ordersummary = ({ formData, changeCreditcard, plans, planId, totalAmount, setordersummarypage, isUpgrade }) => {
    const { data } = useSelector((state) => state.paymenttax)
    const planAmount = plans.filter(x => x.planid == planId)
    const dispatch = useDispatch();
    const [initialValues, setInitialValues] = useState({
        checkTerms: false
    })
    const handleInputChange = ({ target }) => {
        const { name, value } = target;
        if (name === "checkTerms") {
            setInitialValues(prevState => ({
                ...prevState,
                [name]: target.checked
            }));
        } else {
            setInitialValues(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };
    const formSubmit = () => {
        if (initialValues.checkTerms) {
        const { BillingInformation, CreditCardInformation, UserInformation, UpgradePlanInformation } = formData
        const object = {
            BillingInformation: BillingInformation,
            CreditCardInformation: CreditCardInformation,
            UserInformation: UserInformation
        }
        if (isUpgrade) {
            dispatch(updateUpgradePlans(UpgradePlanInformation, setordersummarypage));
        } else {
            dispatch(submitCardDetails(object, setordersummarypage));
        }
    }
    }
    const { isLoading } = useSelector((state) => state.payment);
    return (
        <div key="Payment" className='form paymentdetail-form'>
            <Formik
                initialValues={initialValues}
                validateOnChange={false}
                validateOnBlure={true}
                enableReinitialize={true}
                onSubmit={formSubmit}
            >
                {(_formik) => {
                    return (
                        <Form>
                            <div className="max-w-97.5 w-full mx-auto pt-18 pb-10 md:py-10 md:px-6 px-0">
                                <div className="mb-8">
                                    <h3 className="defaultText secondary-color text-2xl typo-font-medium">Order Summary</h3>
                                </div>
                                <ul className="mb-8">
                                    <li className="flex justify-between text-gray-6">
                                        <span className="flex items-center">
                                            <svg className="mr-2" width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.0667 1.5H1.93333C1.41787 1.5 1 1.91787 1 2.43333V10.8333C1 11.3488 1.41787 11.7667 1.93333 11.7667H14.0667C14.5821 11.7667 15 11.3488 15 10.8333V2.43333C15 1.91787 14.5821 1.5 14.0667 1.5Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M1 4.30005H15" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M3.80078 7.1001H8.93411" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M3.80078 8.96655H7.06745" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            Visa ending in <span className="text-gray-7 typo-font-medium ml-1">{lastCreditCardNumver(formData)}</span>
                                        </span>
                                        <span className="text-right  typo-font-bold text-blue-4 cursor-pointer" onClick={() => changeCreditcard(formData)}>Change</span>
                                    </li>
                                </ul>
                                <div>
                                    <p className="text-gray-6 text-sm mb-2">Selected Plan</p>
                                    <p className="text-gray-7 text-md mb-2 border-b border-gray-3 pb-2">{`${planAmount[0]?.planName}`}</p>
                                    <ul className="mb-8">
                                        <li className="flex text-gray-6 mb-2">
                                            <span className="md:w-1/2 w-7/12">Billed at</span>
                                            <span className="md:w-1/2 w-5/12 text-right">${`${planAmount[0]?.amount}/${planAmount[0]?.prefix}`}</span>
                                        </li>
                                        <li className="flex text-gray-6 mb-2">
                                            <span className="md:w-1/2 w-7/12">Estimated Sales Tax</span>
                                            <span className="md:w-1/2 w-5/12 text-right">${`${data}/${planAmount[0]?.prefix}`}</span>
                                        </li>
                                        <li className="flex text-gray-7 typo-font-medium">
                                            <span className="md:w-1/2 w-7/12 uppercase text-md">Total</span>
                                            <span className="md:w-1/2 w-5/12 text-right text-md">${`${totalAmount}/${planAmount[0]?.prefix}`}</span>
                                        </li>
                                    </ul>
                                    <div className="acceptagree flex  mb-8">
                                        <Field type="checkbox" className="w-auto mr-2" name="checkTerms" checked={initialValues?.checkTerms} onChange={handleInputChange} />
                                        <label className="text-xs">I have read and agree to the <Link to={"/terms"} className="text-blue-4 underline">Terms and Conditions</Link> and <Link to={"/privacy"} className="text-blue-4 underline">Privacy Policy</Link>. I consent to provide my billing information and email address for the purposes of creating and maintaining my account.</label>
                                    </div>
                                    <div className="mb-4">
                                        <Button
                                            buttonType="submit"
                                            size="large"
                                            title={isLoading ? "Processing..." : "Confirm Upgrade"}
                                            loading={isLoading}
                                            width="full"
                                            disabled={!initialValues?.checkTerms}
                                            fontWeight="medium"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <span className="mr-2 text-gray-5 text-xs">Powered by</span>
                                        <svg width="34" height="14" viewBox="0 0 34 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_906_7938)">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M34.044 7.23345C34.044 4.84094 32.8714 2.95312 30.6301 2.95312C28.3793 2.95312 27.0176 4.84094 27.0176 7.21476C27.0176 10.0278 28.6252 11.4483 30.9327 11.4483C32.0581 11.4483 32.9092 11.1959 33.5522 10.8408V8.97169C32.9092 9.28949 32.1716 9.4857 31.2353 9.4857C30.318 9.4857 29.5047 9.16797 29.4007 8.06519H34.0251C34.0251 7.94367 34.044 7.45773 34.044 7.23345ZM29.3723 6.34558C29.3723 5.28953 30.0248 4.85029 30.6206 4.85029C31.1975 4.85029 31.8122 5.28953 31.8122 6.34558H29.3723Z" fill="#747578" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M23.3675 2.95312C22.4407 2.95312 21.845 3.38302 21.514 3.68208L21.3911 3.10265H19.3105V13.9997L21.6748 13.5043L21.6842 10.8595C22.0247 11.1025 22.5259 11.4483 23.3581 11.4483C25.0509 11.4483 26.5924 10.1025 26.5924 7.14C26.5829 4.42973 25.0225 2.95312 23.3675 2.95312ZM22.8002 9.39225C22.2422 9.39225 21.9112 9.19597 21.6842 8.953L21.6748 5.48579C21.9206 5.21477 22.2611 5.02785 22.8002 5.02785C23.6607 5.02785 24.2565 5.98111 24.2565 7.20538C24.2565 8.45768 23.6702 9.39225 22.8002 9.39225Z" fill="#747578" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0586 2.40183L18.4323 1.89716V0L16.0586 0.495319V2.40183Z" fill="#747578" />
                                                <path d="M18.4323 3.11182H16.0586V11.2892H18.4323V3.11182Z" fill="#747578" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5143 3.80356L13.363 3.11198H11.3203V11.2894H13.6845V5.74745C14.2425 5.02783 15.1882 5.15868 15.4813 5.26148V3.11198C15.1787 2.99984 14.0723 2.79423 13.5143 3.80356Z" fill="#747578" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.78572 1.08423L6.47821 1.5702L6.46875 9.05602C6.46875 10.4392 7.51844 11.4579 8.91811 11.4579C9.69352 11.4579 10.261 11.3177 10.5731 11.1495V9.2523C10.2705 9.37382 8.77623 9.80369 8.77623 8.42056V5.10285H10.5731V3.11223H8.77623L8.78572 1.08423Z" fill="#747578" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M2.39259 5.4858C2.39259 5.12131 2.69522 4.98113 3.19642 4.98113C3.91515 4.98113 4.82301 5.19608 5.54174 5.57924V3.38302C4.75681 3.07462 3.98135 2.95312 3.19642 2.95312C1.27668 2.95312 0 3.94376 0 5.59794C0 8.17733 3.59362 7.76615 3.59362 8.87824C3.59362 9.30818 3.21534 9.44832 2.68576 9.44832C1.90083 9.44832 0.898407 9.13059 0.104026 8.70072V10.925C0.983514 11.2988 1.87247 11.4577 2.68576 11.4577C4.65279 11.4577 6.00512 10.495 6.00512 8.82217C5.99567 6.03718 2.39259 6.53251 2.39259 5.4858Z" fill="#747578" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_906_7938">
                                                    <rect width="34" height="14" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )
                }
                }
            </Formik>
        </div>
    )
}

export default Ordersummary
