import React from "react";
import { useTranslation } from "react-i18next";

// Components
import TailwindModal from "../../components/TailwindModal";
import Loader from "../../components/Loader";
import Button from "../../components/Button";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { modalType } from "../../utils";
import { tr } from "../../components/utils";
import { titleCase } from "../../components/utils/titlecase";


const { EDIT_PERSON } = modalType;

const EditPerson = ({ modalPerson, handleCancel, handleSave, handleDeleteClicked, ...props }) => {
    const { t } = useTranslation();

    const from = "quick-edit";

    const handleSaveEdit = () => {
        handleSave(EDIT_PERSON)
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

    return (
        <TailwindModal
            showModal={true}
            innerClasses="max-w-144"
            title={modalPerson ? ` ${tr(t, "pedigree.dialog.header.edit")} ${titleCase(modalPerson.firstName)} ${titleCase(modalPerson.lastName)}` : ""}
            content={
                <>
                    {
                        modalPerson ?
                            <PersonForm modalPerson={modalPerson} from={from} {...props} />
                            :
                            <div className="flex justify-center items-center h-52"><Loader spinner /></div>
                    }
                    <div className="mt-4 flex w-full">
                        {modalPerson && modalPerson.nodeType && modalPerson.nodeType !== "HOME_PERSON" && (
                            <Button
                                icon="trash"
                                size="large"
                                tkey="addFamily.delete"
                                fontWeight="medium"
                                type="link-danger" 
                                handleClick={handleDeleteClicked} /> )}
                        <div className="mr-2 ml-auto">
                            <Button
                                type="default"
                                tkey="addFamily.cancelAction"
                                size="large"
                                fontWeight="medium"
                                handleClick={handleCancel}
                                id="cancelAction"
                            />
                        </div>
                        <Button
                            type="primary"
                            tkey="addFamily.saveAction"
                            size="large"
                            fontWeight="medium"
                            handleClick={handleSaveEdit}
                            disabled={!checkDisable()}
                            id="addAction"
                        />
                    </div>
                </>
            }
            setShowModal={handleCancel}
        />
    )
}

export default EditPerson;