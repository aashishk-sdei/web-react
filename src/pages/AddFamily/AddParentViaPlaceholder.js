import React from 'react'

// Components
import TailwindModal from "../../components/TailwindModal";
import Translator from '../../components/Translator';
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import { titleCase } from "../../components/utils/titlecase";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { modalType, MALE, FEMALE, OTHER } from "../../utils";

const { ADD_FATHER_OR_MOTHER } = modalType;

const AddParentViaPlaceholder = ({ modalPerson, handleCancel, handleSave, ...props }) => {
    
    const handleSaveParent = () => {
        handleSave(ADD_FATHER_OR_MOTHER)
    }

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

    const getTitle = () => {
        switch (true) {
            case (modalPerson && modalPerson.gender == MALE):
                return <span><Translator tkey="pedigree.dialog.header.father" />{` ${titleCase(props.childName)}`}</span>
            case (modalPerson && modalPerson.gender == FEMALE):
                return <span><Translator tkey="pedigree.dialog.header.mother" />{` ${titleCase(props.childName)}`}</span>
            case (modalPerson && modalPerson.gender == OTHER):
                return <span><Translator tkey="pedigree.dialog.header.other" />{` ${titleCase(props.childName)}`}</span>
        }
    }
    
    return (
        <TailwindModal
            showModal={true}
            innerClasses="max-w-144"
            title={getTitle()}
            content={
                <>
                    {
                        modalPerson ?
                        <PersonForm modalPerson={modalPerson} modalType={ADD_FATHER_OR_MOTHER} {...props} />
                        :
                        <div className="flex justify-center items-center h-52"><Loader spinner /></div>
                    }
                    <div className="mt-4 flex justify-end">
                        <Button 
                            type="primary" 
                            tkey="addFamily.saveAction"
                            size="large"
                            handleClick={handleSaveParent} 
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

export default AddParentViaPlaceholder;