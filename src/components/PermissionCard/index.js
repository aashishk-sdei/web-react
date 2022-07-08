import React from "react";
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";
import PermissionVector from "./../../assets/images/noPermissionVector.svg";
import { useHistory } from "react-router";
const PermissionCard = () => {
    const history=useHistory();
    return (
        <div className="no-permission-block bg-gray-1 pt-30">
            <div className="flex justify-center flex-col items-center">
                <div className="vector mb-6">
                    <img src={PermissionVector} alt=""/>
                </div>
                <div className="info mb-4 text-center px-2">
                    <Typography size={14} text="secondary" weight="medium">
                        Looks like you don’t have permission to view this page.
                    </Typography>
                </div>
                <div className="bottom">
                    <Button
                        handleClick={()=>history.push('/')}
                        title="Go to homepage"
                        fontWeight="medium"
                    />
                </div>
            </div>
        </div>
    );
};
export default PermissionCard;
