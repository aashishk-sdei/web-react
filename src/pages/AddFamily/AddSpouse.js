import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Components
import TailwindModal from "../../components/TailwindModal";
import Loader from "../../components/Loader";
import Typography from "../../components/Typography";
import Checkbox from "../../components/Checkbox";
import Button from "../../components/Button";
import { titleCase } from "../../components/utils/titlecase";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { tr } from "../../components/utils";
import { modalType } from "../../utils";

const { ADD_SPOUSE } = modalType;

const AddSpouse = ({ modalPerson, dropDownPayload, handleCancel, handleSave, handleChildren, ...props }) => {
    const { t } = useTranslation();

    const [showBottomSection, setShowBottomSection] = useState(false);

    const handleSaveSpouse = () => {
        handleSave(ADD_SPOUSE)
    }

    useEffect(() => {
        if (dropDownPayload && dropDownPayload.children && modalPerson && !showBottomSection) {
            modalPerson.children = dropDownPayload.children
            setShowBottomSection(true)
        }
    }, [dropDownPayload, modalPerson, showBottomSection])

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
            title={modalPerson && `${tr(t, "addFamily.spouseTitle")} ${titleCase(modalPerson.selectedName)}`}
            content={
                <>
                    {
                        modalPerson ?
                            <>
                                <PersonForm modalPerson={modalPerson} modalType={ADD_SPOUSE} {...props} />
                                {showBottomSection && modalPerson.children && modalPerson.children.length > 0 && <BottomSection children={modalPerson.children} handleChildren={handleChildren} />}
                            </>
                            :
                            <div className="flex justify-center items-center h-52"><Loader spinner /></div>
                    }
                    <div className="mt-4 flex justify-end">
                        <Button
                            type="primary"
                            tkey="addFamily.addAction"
                            size="large"
                            handleClick={handleSaveSpouse}
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

export default AddSpouse;

const BottomSection = ({ children, handleChildren }) => {

    return (
        <div className="border-t border-gray-3 mt-4">

            <div className="modal-row mt-2">
                <Typography
                    text="secondary"
                    size={16}
                    weight="bold"
                >
                    Include these people as children of this spouse:
                </Typography>
            </div>
            {
                children.map((ele, idx) =>
                    <div key={idx} className="modal-row mt-0.5 -m-3">
                        <Checkbox id={ele.id} obj={ele} checked={ele.check} color="primary" label={`${ele.firstName} ${ele.lastName}`} labelColor="secondary" handleChange={handleChildren} />
                    </div>
                )
            }
        </div>
    )
}