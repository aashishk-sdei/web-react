import React from "react"
import Typography from "./../../../components/Typography"

const Premium = ({ logo, getSvg, svg, planDetails, setPlanFunction, isPaySuccess }) => {
    return <div className='bg-white w-full rounded-xlg p-12'>
        <div className='mb-7'>
            <div className='logo mb-5'>
                {logo}
            </div>
            <h2 className='mb-4 text-black text-xl typo-font-bold'>Storied Ultimate</h2>
            {planDetails && Object.keys(planDetails).length !== 0 && !isPaySuccess &&
                <div>
                    <p className="typo-font-medium text-xs text-gray-5">
                        <span>{planDetails.months} Month Membership</span>
                        <span className="ml-2.5 text-blue-4 cursor-pointer" onClick={() => setPlanFunction(null)}>Change</span>
                    </p>
                    <p className="flex">
                        <Typography size={16} weight="medium"><span className="inline-flex mt-1 mr-1">$</span></Typography>
                        <Typography size={32} text="secondary" weight="bold"><span className="pr-0.5 text-black">{planDetails.total_amount}</span></Typography>
                        <Typography size={16} weight="medium"><span className="mt-3 pt-0.5 inline-flex">/mo</span></Typography>
                    </p>
                </div>
            }
        </div>
        <div className="w-full max-w-xs">
            {getSvg("3 billion+ articles.", "records")}
            {getSvg("400+ years of history.", "yearcount")}
            {getSvg("Powerful tools.", "powerful")}
            <div className="relative">
                <span className="icon absolute top-0.5 left-0">
                    {svg["global"]}
                </span>
                <div className="pl-6">
                    <Typography size={14} weight="bold" text="secondary"><span className='block'>Global content.</span></Typography>
                </div>
            </div>
        </div>
    </div>
}
export default Premium;