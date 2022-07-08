import React from "react";
import Button from "../../../components/Button";

const NoTreeDialogContent = ({handleBackTreeModal, handleGotoTree}) => {
    return <>
        <div>
            Family relationships can only be added from a family tree. Would you like to start a family tree?
        </div>
        <div className="mt-4">
            We’ll save this story as a draft so you can come back to it later.
        </div>
        <div className="flex justify-end mt-10">
            <div>
                <Button
                    type="default-dark"
                    title="Back"
                    size="large"
                    handleClick={() => handleBackTreeModal()}
                    fontWeight="medium"
                />
            </div>
            <div className="ml-2">
                <Button
                    handleClick={() => handleGotoTree()}
                    size="large"
                    title="Start a Tree"
                    fontWeight="medium"
                />
            </div>
        </div>
    </>
}
export default NoTreeDialogContent