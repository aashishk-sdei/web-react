import React from "react";
import Button from "./../Button";
import TailwindModal from "./../TailwindModal";

const TailwindModalDialog = ({
    showModal,
    setShowModal,
    handleAction,
    content,
    title,
    loading
}) => {
    return <TailwindModal showModal={showModal}   
    innerClasses = "max-w-edit-search-modal-w modal-xs" 
    setShowModal = {setShowModal}
    title={title}
    content={
        <><p>{content}</p>
        <div className="flex justify-end mt-10">
            <Button 
            size="large"
            type="default"
            handleClick={(e) => {
                e.preventDefault();
                setShowModal(false);
            }}
            fontWeight="medium"
            title="Cancel"/>
      <div className="ml-2">
      <Button 
            handleClick={(e) => {
                e.preventDefault();
                handleAction();
            }}
            loading={loading}
            size="large"
            type="danger"
            fontWeight="medium"
            title="Delete"/>
      </div>
            </div>
        </>
    }
    />
}
export default TailwindModalDialog