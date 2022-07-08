import React from "react";
import { useTranslation } from "react-i18next";

// Components
import TailwindModal from "../../components/TailwindModal";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { tr } from "../../components/utils";
import { modalType } from "../../utils";

const { ADD_INDIVIDUAL } = modalType;

const AddIndividual = ({ modalPerson, handleIsLiving, handleCancel, handleChange, handleGender, handleSave, ...props }) => {
    const { t } = useTranslation();
    const checkDisable = () => {
        if (modalPerson) {
            if (modalPerson.requiredGender) {
                return modalPerson.gender && (modalPerson.firstName || modalPerson.lastName)
            } else {
                return (modalPerson.firstName || modalPerson.lastName)
            }
        } else {
            return true;
        } 
    }
    
    const handleSaveIndivudal = () => {
        handleSave(ADD_INDIVIDUAL)
    }

    return (
        <TailwindModal
            showModal={true}
            innerClasses="max-w-144"
            title={tr(t, "addFamily.individualTitle")}
            content={
                <>
                    {
                        modalPerson ?
                            <>
                                <PersonForm 
                                    modalPerson={modalPerson} 
                                    handleChange={handleChange} 
                                    handleIsLiving={handleIsLiving}
                                    handleGender={handleGender} 
                                    {...props} 
                                /> 
                            </>
                            :
                            <div className="flex justify-center items-center h-52"><Loader spinner /></div>
                    }
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="primary"
                            tkey="addFamily.addAction"
                            size="large"
                            handleClick={handleSaveIndivudal}
                            disabled={!checkDisable()}
                            id="addAction"
                            fontWeight="medium"
                        />
                    </div>
                </>
            }
            setShowModal={handleCancel}
            modalType="Family"
        />
    )
}
export default AddIndividual;

