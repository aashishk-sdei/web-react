import React from "react";
import Typography from "../../components/Typography";
import GroupBookIcon from "./../../assets/images/groupbook-icon.svg";

const PaywallTemp = () => {
    return (
        <>
            <div className="vector flex w-full justify-center mb-8">
                <img src={GroupBookIcon} alt="welcome to Storied" />
            </div>
            <div className="create-info text-center mb-8 w-full flex flex-col mx-auto">
                <h3 className="mb-2.5 text-gray-7 text-2xl mb-1.5 typo-font-bold">This Page is Paywall Page</h3>
                <p className="info-sp-block">
                    <Typography size={16} text="secondary">
                        This page is already viewed, looged in users Paywall Page
                    </Typography>
                </p>
            </div>
        </>
    );
};
export default PaywallTemp;
