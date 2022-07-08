import React from "react"
import Typography from "./../../../../components/Typography"

const StartPlus = ({ logo }) => {
    return <div className='mb-7'>
        <div className='flex items-center lg:hidden mb-7'>
            <div className='logo mr-4'>{logo}</div>
            <h2><Typography size={20} text='secondary' weight="bold">Storied Plus</Typography></h2>
        </div>
        <div className="lg:hidden mb-9">
            <p><Typography size={12} weight="medium"><span className="block relative -bottom-0.5">Early Access Pricing</span></Typography></p>
            <p className="flex">
                <Typography size={16} weight="medium"><span className="inline-flex mt-1">$</span></Typography>
                <Typography size={32} text="secondary" weight="bold"><span className="pr-0.5">4.99</span></Typography>
                <Typography size={16} weight="medium"><span className="mt-3 pt-0.5 inline-flex">/mo</span></Typography>
            </p>
        </div>
    </div>
}
export default StartPlus