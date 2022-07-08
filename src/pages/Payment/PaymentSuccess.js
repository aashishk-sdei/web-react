import React, { useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import Typography from "../../components/Typography"
import Button from "../../components/Button"
import paymentSuccessVector from './../../../src/assets/images/paymentSuccessVector.svg'
import './index.css';

const PaymentSuccess = ({ planText = "You now have upgraded access to Storied Plus." }) => {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false)
    const location = useLocation()
    const getQueryParams = new URLSearchParams(location.search);
    const returnURL = getQueryParams.get('redirect')
    return <>
        <div className='w-full max-w-sm px-6 smd:px-3 m-auto pt-18 pb-10 md:py-10'>
            <div className='mb-9 flex justify-center'>
                <img src={paymentSuccessVector} alt="" />
            </div>
            <div className='mb-8 text-center'>
                <h2 className='mb-1'><Typography size={20} weight="bold" text="secondary">Payment Successful!</Typography></h2>
                <Typography size={14}>{planText}</Typography>
            </div>
            <div className='btn-wrap'>
                <Button 
                loading={isLoading}
                handleClick={() => {
                    if (returnURL) {
                        setLoading(true)
                        setTimeout(()=>{
                            setLoading(false)
                            history.replace(returnURL)
                        }, 5000)
                    } else {
                        history.goBack()
                    }
                }} size="large" title="Continue" fontWeight="medium" />
            </div>
        </div>
    </>
}

export default PaymentSuccess
