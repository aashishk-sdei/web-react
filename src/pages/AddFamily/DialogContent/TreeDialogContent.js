import React from "react";
import Button from "../../../components/Button";

const TreeDialogContent = ({handleBackTreeModal, handleGotoTree, formik=null}) => {
    let content = <>
        <div>
            Family relationships can only be added from your family tree. It looks like <span className="typo-font-bold capitalize">{formik?.values?.pn?.name}</span> is not in your tree. Would you like to view your tree to add a new relationship?
        </div>
    </>
    if(formik.values.pn?.treeId && formik.values.pn?.treeId !== "00000000-0000-0000-0000-000000000000") {
        content = <>Family relationships can only be added from your family tree. Would you like to view <span className="typo-font-bold capitalize">{formik?.values?.pn?.name}</span> in your tree? We’ll save this story as a draft so you can come back to it later.</>
    }
    return <>
        <div>
            {content}
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
                    handleClick={() => handleGotoTree(formik)}
                    size="large"
                    title="View in Tree"
                    fontWeight="medium"
                />
            </div>
        </div>
    </>
}
export default TreeDialogContent