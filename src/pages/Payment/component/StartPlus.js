import React from "react"
import Typography from "./../../../components/Typography"

const StartPlus = ({ logo, getSvg, svg }) => {
    return <div className='bg-white w-full rounded-xlg p-12'>
        <div className='mb-6'>
            <div className='logo mb-4'>
                {logo}
            </div>
            <h2 className='mb-3'><Typography size={20} text='secondary' weight="bold">Storied Plus</Typography></h2>
            <div>
                <p><Typography size={12} weight="medium"><span className="block relative -bottom-0.5">Early Access Pricing</span></Typography></p>
                <p className="flex">
                    <Typography size={16} weight="medium"><span className="inline-flex mt-1">$</span></Typography>
                    <Typography size={32} text="secondary" weight="bold"><span className="pr-0.5">4.99</span></Typography>
                    <Typography size={16} weight="medium"><span className="mt-3 pt-0.5 inline-flex">/mo</span></Typography>
                </p>
            </div>
        </div>
        <div className="w-full max-w-xs pt-1 smd:pr-2">
            {getSvg("400 million+ records.", "records")}
            {getSvg("Automated Clues.", "clues")}
            {getSvg("Unlimited access to stories.", "access")}
            <div className="relative">
                <span className="icon absolute top-0.5 left-0">
                    {svg["history"]}
                </span>
                <div className="pl-6">
                    <Typography size={14} weight="bold" text="secondary"><span className='block'>Affordable family history.</span></Typography>
                </div>
            </div>
        </div>
    </div>
}
export default StartPlus;