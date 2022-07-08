import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Screens
import AddChild from "../AddFamily/AddChild";
import AddParent from "../AddFamily/AddParent";
import AddSibling from "../AddFamily/AddSibling";
import AddSpouse from "../AddFamily/AddSpouse";
import EditPerson from "../EditPerson";
import AddParentViaPlaceholder from "../AddFamily/AddParentViaPlaceholder";

// Actions
import { cancelModal, saveParent, saveSpouse, saveSibling, saveChild, saveIndividual } from "../../redux/actions/family";

// Utils
import { OTHER, editPersonData, newPersonData, modalType } from "../../utils";
import AddIndividual from "../AddFamily/AddIndividual";
import Addnonfamily from "../AddFamily/Addnonfamily";

const { ADD_CHILD, ADD_PARENT, ADD_SIBLING, ADD_SPOUSE, EDIT_PERSON, ADD_FATHER_OR_MOTHER, ADD_INDIVIDUAL, ADD_NONFAMILY, ADD_RELATIONSHIP } = modalType;

let IS_LIVING_FLAG = true;

const Modal = ({
    treeId,
    modalAction,
    relataionShip,
    setModalAction,
    redirectUrl,
    personData,
    newParent,
    family: { personLoading, editPerson, newPerson, parentAdded, spouseAdded, updatedPerson, siblingAdded, childAdded, parentAddedViaPlaceholder, dropDownPayload, closeModalStatus, savingModal },
    person: { refetchedData },
    dispatchCancelModal,
    dispatchSaveParent,
    dispatchSaveSpouse,
    dispatchSaveSibling,
    dispatchSaveChild,
    dispatchSaveIndividual,
    ...props
}) => {
    const [modalPerson, setModalPerson] = useState(null);

    // Edit Person
    useEffect(() => {
        if (editPerson) {
            const editedDetails = editPersonData(editPerson);
            setModalPerson(editedDetails);
            IS_LIVING_FLAG = editedDetails.isLiving;
        }
    }, [setModalPerson, editPerson]);

    // New Person
    useEffect(() => {
        if (newPerson) {
            const newDetails = newPersonData(modalAction, newPerson);
            setModalPerson(newDetails);
            IS_LIVING_FLAG = newDetails.isLiving;
        }
    }, [setModalPerson, newPerson, modalAction]);

    useEffect(() => {
        if (newParent) {
            const newDetails = newPersonData(modalAction, newParent);
            setModalPerson(newDetails);
            IS_LIVING_FLAG = newDetails.isLiving;
        }
    }, [modalAction, newParent, setModalPerson])

    // Add Action Done
    useEffect(() => {
        if (parentAdded) redirectUrl(ADD_PARENT);
        if (spouseAdded) redirectUrl(ADD_SPOUSE);
        if (siblingAdded) redirectUrl(ADD_SIBLING);
        if (childAdded) redirectUrl(ADD_CHILD);
        if (parentAddedViaPlaceholder) redirectUrl(ADD_FATHER_OR_MOTHER);
        if (updatedPerson) redirectUrl(EDIT_PERSON);
    }, [parentAdded, spouseAdded, siblingAdded, childAdded, parentAddedViaPlaceholder, redirectUrl]);

    // Common Modal
    const handleCancel = async () => {
        setModalAction(null);
        setModalPerson(null);
        IS_LIVING_FLAG = true;
        await dispatchCancelModal()
    }

    // Close Modal
    useEffect(() => {
        if (refetchedData) handleCancel()
        if (closeModalStatus) handleCancel()
    }, [setModalAction, setModalPerson, dispatchCancelModal, refetchedData, closeModalStatus])

    // Modal Form Handling
    const handleIsLiving = (value) => {
        IS_LIVING_FLAG = value ? true : false;
        if (value) {
            setModalPerson({
                ...modalPerson,
                isLiving: true,
                death: "",
                deathPlace: "",
                deathLocationId: ""
            })
        } else {
            setModalPerson({
                ...modalPerson,
                isLiving: false,
            })
        }
    }

    const handleChange = (e) => {
        const { name, value, birthLocationId, deathLocationId } = e.target;
        if (name === "birthPlace") {
            setModalPerson({
                ...modalPerson,
                [name]: value,
                birthLocationId: birthLocationId || "",
                isLiving: IS_LIVING_FLAG,
            })
        }
        else if (name === "deathPlace") {
            setModalPerson({
                ...modalPerson,
                [name]: value,
                deathLocationId: deathLocationId || "",
                isLiving: IS_LIVING_FLAG,
            })
        }
        else {
            setModalPerson({
                ...modalPerson,
                [name]: value
            })
        }
    }

    const handleDeleteClicked = () => {
        let choosenPerson = { ...modalPerson};
        handleCancel();
        props.handleDeletePerson(choosenPerson);
    }
    

    const handleGender = (value) => {
        setModalPerson({
            ...modalPerson,
            gender: value === OTHER ? OTHER : value
        })
    }

    const handleSibling = (e, sibling) => {
        let mySiblings = modalPerson.siblings.reduce((res, ele) => {
            if (ele.id === sibling.id) {
                res.push({
                    ...ele,
                    check: e.target.checked
                })
            } else {
                res.push(ele);
            }
            return res;
        }, []);
        setModalPerson({
            ...modalPerson,
            siblings: mySiblings
        })
    }

    // Save Parent Via Placeholder
    const handleSaveParentViaPlaceholder = async () => {
        await props.saveplaceholderParents(modalPerson);
    }

    // Save Parent
    const handleSaveParent = async () => {
        await dispatchSaveParent(modalPerson, props.preAdd);
    }

    // Save Spouse
    const handleSaveSpouse = async () => {
        await dispatchSaveSpouse(newPerson, modalPerson, props.preAdd);
    }

    // Save Sibling
    const handleSaveSibling = async () => {
        await dispatchSaveSibling(newPerson, modalPerson, props.preAdd);
    }

    // Save Child
    const handleSaveChild = async () => {
        await dispatchSaveChild(newPerson, modalPerson, props.preAdd);
    }

    const handleSaveIndividual = async () => {
        await dispatchSaveIndividual(modalPerson, props.addNewPeople);
    }

    const handleSaveNoneIndividual = async () => {
        props.handlePerson(modalPerson)
    }

    const handleSaveParents = (option, gender) => {
        setModalPerson({
            ...modalPerson,
            existingParentIds: [
                option.id,
                option.spouseId,
            ],
            unknownGender: gender
        })
    }

    const handleSaveSpouses = (option, gender) => {
        setModalPerson({
            ...modalPerson,
            existingParentIds: [
                option.id,
                option.spouseId
            ],
            unknownGender: gender
        })
    }

    const handleChildren = (e, c) => {
        let myChildren = modalPerson.children.reduce((res, ele) => {
            if (ele.id === c.id) {
                res.push({
                    ...ele,
                    check: e.target.checked
                })
            } else {
                res.push(ele);
            }
            return res;
        }, []);
        setModalPerson({
            ...modalPerson,
            children: myChildren
        })
    }

    // Save Edit Modal
    const handleSaveEdit = () => {
        props.handleSaveEdit(editPerson, modalPerson, treeId);
        if (modalPerson.firstName.trim() !== "" || modalPerson.lastName.trim() !== "")
            handleCancel();
    }

    const setValuesModalPerson = (modalPersonData) => {
        setModalPerson(modalPersonData)
    }

    const handleSave = (modal) => {
        IS_LIVING_FLAG = true;
        if (!savingModal) {
            switch (modal) {
                case ADD_CHILD:
                    handleSaveChild();
                    break;

                case ADD_PARENT:
                    handleSaveParent();
                    break;

                case ADD_SIBLING:
                    handleSaveSibling();
                    break;

                case ADD_SPOUSE:
                    handleSaveSpouse();
                    break;

                case EDIT_PERSON:
                    handleSaveEdit();
                    break;

                case ADD_FATHER_OR_MOTHER:
                    handleSaveParentViaPlaceholder();
                    break;
                case ADD_INDIVIDUAL:
                    handleSaveIndividual();
                    break;
                case ADD_RELATIONSHIP:
                    handleSaveNoneIndividual();
                    break;
                case ADD_NONFAMILY:
                    handleSaveNoneIndividual();
                    break;
                default:
                    break;
            }
        }
    }

    const getPropsForModal = () => {
        return {
            personLoading,
            modalPerson,
            handleCancel,
            handleSave,
            handleIsLiving,
            handleChange,
            personData,
            handleGender,
            handleSibling,
            handleDeleteClicked,
            handleChildren,
            handleSaveParents,
            handleSaveSpouses,
            dropDownPayload,
            setValuesModalPerson,
            relataionShip,
            ...props
        }
    }

    switch (modalAction) {
        case ADD_CHILD:
            return (
                <AddChild {...getPropsForModal()} />
            )

        case ADD_PARENT:
            return (
                <AddParent {...getPropsForModal()} />
            )

        case ADD_SIBLING:
            return (
                <AddSibling {...getPropsForModal()} />
            )

        case ADD_SPOUSE:
            return (
                <AddSpouse {...getPropsForModal()} />
            )

        case EDIT_PERSON:
            return (
                <EditPerson {...getPropsForModal()} />
            )

        case ADD_FATHER_OR_MOTHER:
            return (
                <AddParentViaPlaceholder {...getPropsForModal()} />
            )
        case ADD_INDIVIDUAL:
            return (
                <AddIndividual {...getPropsForModal()} />
            )
        case ADD_NONFAMILY:
            return (
                <Addnonfamily {...getPropsForModal()} />
            )
        default:
            return null;

    }
}

Modal.propTypes = {
    family: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    family: state.family,
    person: state.person
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSaveParent: (modalPerson, preAdd) => dispatch(saveParent(modalPerson,false, preAdd)),
        dispatchSaveSibling: (newPerson, modalPerson, preAdd) => dispatch(saveSibling(newPerson, modalPerson, preAdd)),
        dispatchSaveSpouse: (newPerson, modalPerson, preAdd) => dispatch(saveSpouse(newPerson, modalPerson, preAdd)),
        dispatchSaveChild: (newPerson, modalPerson, preAdd) => dispatch(saveChild(newPerson, modalPerson, preAdd)),
        dispatchSaveIndividual: (modalPerson, addNewPeopleFunc) => dispatch(saveIndividual(modalPerson, addNewPeopleFunc)),
        dispatchCancelModal: () => dispatch(cancelModal()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
