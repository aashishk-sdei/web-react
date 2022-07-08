import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Formik, Field,FastField} from "formik";
import { useDispatch } from 'react-redux'
import ClassNames from 'classnames'
import TreeDialogContent from "./DialogContent/TreeDialogContent";
import NoTreeDialogContent from "./DialogContent/NoTreeDialogContent";
// Components
import TailwindModal from "../../components/TailwindModal";
import Realationshipdropdown from "../../components/RelationShipDropDown"
// Common
import PersonForm from "../Common/PersonForm";
import Loader from "../../components/Loader";
import Button from "../../components/Button";
import PersonConnectedForm from "../Common/PersonConnectedForm";
import { saveParent, saveChildFromRelationShip, saveSpouseFromRelationShip, getRelations, saveNonFamily, saveSiblingFromRelationship} from "../../redux/actions/family"
import { getRecentTree } from "../../services";
import { treePeopleList } from './../../redux/actions/sidebar';
import { v4 as uuidv4 } from "uuid";
// Utils
import { tr } from "../../components/utils";
import { modalType, getConnectedNonFamilyValue, strFirstUpCase } from "../../utils";
import { useHistory } from "react-router-dom";

const Female = ["Mother", "Daughter", "Sister", "Spouse"]
const Male = ["Father", "Son", "Brother", "Spouse"]
const Other = ["Parent", "Child", "Sibling"]


const { ADD_NONFAMILY, ADD_INDIVIDUAL } = modalType;
const getModalTitle = (showDialogModal, NonFamilModal, modalPerson, treeId, modalTitle) => {
    if (showDialogModal) {
        return treeId ? 'Go to Tree?' : 'Start a tree?'
    } else if (NonFamilModal) {
        return modalTitle ? modalTitle : `Add ${getName(modalPerson)}`
    } else {
        return `Create Relationship`
    }
}
const getName = (person) => {
    let name = []
    if (person && person.firstName) {
        name.push(strFirstUpCase(person.firstName))
    }
    if (person && person.lastName) {
        name.push(strFirstUpCase(person.lastName))
    }
    return name.join(' ')
}


const getFullName = (person) => {
    let name = []
    if (person && person.givenName) {
        name.push(strFirstUpCase(person.givenName))
    }
    if (person && person.surname) {
        name.push(strFirstUpCase(person.surname))
    }
    return name.join(' ')
}


const Addnonfamily = ({ modalPerson, disableoption, handleIsLiving, handleCancel, handleChange, handleSave, handleGender, handleDraftSave, preFormik, relataionShip, ...props }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const defaultValues = getConnectedNonFamilyValue();
    const [NonFamilModal, setNonFamilModal] = useState(true)
    const [ConnectedModal, setConnectedModal] = useState(false)
    const [dropdownDisabled, setDropdownDisabled] = useState(true)
    const [showDialogModal, setShowDialogModal] = useState(false)
    const [selectedValue, setSelectedvalue] = useState(null)
    const [connectedPerson, setConnectedPerson] = useState(null)
    const [connectedPersonArray, setConnectedPersonArray] = useState(null)
    const [disabledValue, setDisabled] = useState([])
    useEffect(() => {
        if (connectedPerson) { 
            dispatch(getRelations({ treeId: connectedPerson.treeId, personId: connectedPerson.id }, setConnectedPersonArray))
        } 
    }, [connectedPerson])
   
    const getGivenName = (givennamevalue) => {
        let value;
        if (typeof givennamevalue.givenName === "string") {
            value =  givennamevalue.givenName
        } else {
            value =  givennamevalue.givenName.givenName
        }
        return value; 
}
    const disabledFn = ( option, paremtdata) => {
        let returnValue;
        if (option === "Male") {
            let existdata = paremtdata && paremtdata.length>0 && paremtdata.filter(key => key.gender === "M" )
            returnValue = existdata.length > 0 ? true : paremtdata.length ===2 ? true : false
        } else if (option === "Female") {
            let existdata = paremtdata && paremtdata.length > 0 && paremtdata.filter(key =>  key.gender === "F")
            returnValue = existdata.length > 0 ? true : paremtdata.length === 2 ?  true: false
        } else if (option === "Other") {
            let existdata = paremtdata && paremtdata.length > 0 && paremtdata.filter(key =>  key.gender === "O")
            returnValue = existdata.length > 0 ? true : paremtdata.length === 2 ? true : false
        }
        return returnValue
    }
    
    const GetFieldsMethod = ({ form }) => {
        let pn = form.values.pn
        const value = form.values.sr
        value === "family" && setConnectedPerson(pn) 
        const paremtdata = value === "family" && connectedPersonArray?.data.parentsAndSiblingsResult.filter(key => key.relation === "parent");
        if (value === "other") {
            return <>
                <Field name="rn" className="appearance-none placeholder-gray-4 pr-20 z-50 bg-transparent w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent border  focus:ring-blue-4" placeholder="Enter Relationship" type="text" />
                <span className={ClassNames(`absolute right-4 text-gray-4`, {
                    "text-maroon-5": form.values.rn.length >= 40
                })}>{form.values.rn.length}/40</span>
            </>
        } else if (value === "family" && modalPerson.gender !== undefined) {
            return <>
                <Field
                    as="select"
                    name="fm"
                    className={`appearance-none w-full pr-6 py-2 px-4 border border-gray-3 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent 
                            `}>
                    {/* disabled={keyItem === "Father" && disabledFn("Male", paremtdata.length > 0 && paremtdata)} */}
                    <option value="" selected>Search relationships</option>
                    {modalPerson.gender === "Male" && Male.map(keyItem => (
                        <option value={keyItem} disabled={keyItem === "Father" && paremtdata !== undefined &&  disabledFn("Male", paremtdata)} >{`${getName(modalPerson)} is ${getGivenName(pn)}'s ${keyItem}`}</option>
                    ))}
                    {modalPerson.gender === "Female" && Female.map(keyItem => (
                        <option value={keyItem} disabled={keyItem === "Mother" && paremtdata !== undefined && disabledFn("Female", paremtdata)} >{`${getName(modalPerson)} is ${getGivenName(pn)}'s ${keyItem}`}</option>
                    ))}
                    {modalPerson.gender === "Other" && Other.map(keyItem => (
                        <option value={keyItem} disabled={keyItem === "Parent" && paremtdata !== undefined && disabledFn("Other", paremtdata)} >{`${getName(modalPerson)} is ${getGivenName(pn)}'s ${keyItem}`}</option>
                    ))}
                </Field> 
                
            </>
        } else if (value === "family" && modalPerson.gender == undefined) {
            return <>
                <div className="relative w-full">
                    <FastField
                        name="fm"
                        autoFocus={true}
                        component={Realationshipdropdown}
                        modalPerson={modalPerson}
                        className="appearance-none placeholder-gray-4 w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent border  focus:ring-blue-4"
                        placeholder="Search your people"
                    />
                </div>
            </>
        }
        return null 
    }

    const GetFieldsMethodForopttion = ({ form }) => {
        const spouseData    = connectedPersonArray?.data?.spousesAndChildrenResult.filter(key=>key.relation==="partner")
        const values = form.values;
        if (values.fm === "Spouse") {
            return null;
        } else if (values.fm === "Son" || values.fm === "Daughter" || values.fm === "Brother") {
            return <>
                <div className="w-full mt-4">
                    <label className="block text-black typo-font-medium text-sm mb-4">
                        {`Who is ${getName(modalPerson)}'s Mother?`}
                    </label>
                    <div className="relative">
                <Field
                    as="select"
                    name="pv"
                    className={`appearance-none w-full pr-6 py-2 px-4 border border-gray-3 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent 
                            `}>
                            <option value="" selected>{`Select Mother`} </option> 
                            {spouseData && spouseData.length > 0 && spouseData.map(key => (
                                <>
                                    <option value={key.personId} >{getFullName(key)} </option>
                                </>
                     ))}        
                            <option value="Um" selected={spouseData.length === 0 ? true :false }>{`Unknown Mother`} </option> 
                </Field>
                </div>
                </div>
                {(spouseData.length === 0 || values.pv === "Um") &&<div className="flex items-start flex-wrap md:flex-nowrap relative -mx-1 md:mb-4 mt-4">
                    <div className="w-full md:w-7/12 mx-1 mb-4 md:mb-0">
                        <label className="block text-gray-6 text-sm mb-1" for="grid-first-name">{"Mother's First & Middle Name(s)"}</label>
                        <Field
                            name="Ufm"
                            class="w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent"
                            
                        />
                    </div>
                    <div className="w-full md:w-5/12 mx-1 mb-4 md:mb-0">
                        <label className="block text-gray-6 text-sm mb-1" for="grid-first-name">Mother's Maiden Name(s)</label>
                        <Field
                            name="Ulm"
                            class="w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent"
                        
                        />
                    </div>
                </div>
                }
                </>
        }
        return null
    }

    const checkDisable = () => {
        if (modalPerson) {
            if (modalPerson.requiredGender) {
                return modalPerson.gender && (modalPerson.firstName || modalPerson.lastName)
            } else {
                return (modalPerson.firstName || modalPerson.lastName || selectedValue)
            }
        } else {
            return true;
        }
    }
    const validate = (value) => {
        return value ? value :""
   }
    const handleClick = () => {
        handleSave(ADD_INDIVIDUAL)
    }
    const AfterNext = () => {
        handleSave(ADD_NONFAMILY)
        setNonFamilModal(false)
        setConnectedModal(true)
    }
    const handlebackclick = () => {
        setConnectedModal(false)
        setNonFamilModal(true)
    }
    useEffect(() => {
        let val
        if (selectedValue) {
            val = relataionShip.filter(key => key.personId === selectedValue.id)
            setDisabled(val)
        }
    }, [selectedValue])
    const filialRelationshipIdFunction = (parentData) => {
        return parentData && parentData.length > 0 ? parentData[0].relationshipId : uuidv4()
    }
    const handleSaveNonFamily = (formValues, individualPerson = false) => {
        const parentData = connectedPersonArray?.data?.parentsAndSiblingsResult
        const { pn,Ufm,pv,Ulm } = formValues.values
        const payload = {}
        const modalpersonData = selectedValue ? {
            added: true,
            firstName: selectedValue.givenName,
            lastName: selectedValue.surname,
            id: selectedValue.id,
            gender: selectedValue.gender,
            birthDate: selectedValue.birthDate.year,
            deathDate: selectedValue.deathDate.year
        } : modalPerson
        let propsid = props.preSelected && props.preSelected?.pn?.id === formValues.values?.pn?.id
        payload.gender = modalPerson.gender
        payload.lastName = modalPerson.lastName
        payload.birth = modalPerson.birth 
        payload.birthLocationId = modalPerson.birthLocationId
        payload.deathLocationId = modalPerson.deathLocationId
        payload.treeId = pn.treeId
        payload.isLiving = modalPerson.isLiving
        payload.childId = pn.id
        payload.firstName = modalPerson.firstName 
        payload.death = modalPerson.death
        payload.birthPlace = ""
        payload.deathPlace = modalPerson.deathLocation
        payload.id = modalPerson.id
        payload.filialRelationshipId = filialRelationshipIdFunction(parentData)
        payload.fromrelationship = true
        payload.pv = validate(pv)
        payload.primaryPersonId = pn.id;
        if (Ufm) {
            payload.pfirstName = validate(Ufm) 
            payload.plastName = validate(Ulm)
            payload.unknownGender = "Other"
        }
        //add parent  for male 
        modalPerson.gender === "Male" && formValues.values.sr === "family" && formValues.values.fm === "Father" && dispatch(saveParent(payload, props.addNewPeople, propsid)); 
        // For other case Parent
        modalPerson.gender === "Other" && formValues.values.sr === "family" && formValues.values.fm === "Parent" && dispatch(saveParent(payload, props.addNewPeople, propsid)); 
         //add parent  for Fe-male 
        modalPerson.gender === "Female" && formValues.values.sr === "family" && formValues.values.fm === "Mother" && dispatch(saveParent(payload, props.addNewPeople, propsid)); 
        //====Add Child for Male
        modalPerson.gender === "Male" && formValues.values.sr === "family" && formValues.values.fm === "Son" && dispatch(saveChildFromRelationShip(payload, props.addNewPeople, propsid)); 
        //Sibnling for brother  
        modalPerson.gender === "Male" && formValues.values.sr === "family" && formValues.values.fm === "Brother" && dispatch(saveSiblingFromRelationship(payload, props.addNewPeople, propsid)); 
        modalPerson.gender === "Female" && formValues.values.sr === "family" && formValues.values.fm === "Sister" && dispatch(saveSiblingFromRelationship(payload, props.addNewPeople, propsid)); 
        modalPerson.gender === "Other" && formValues.values.sr === "family" && formValues.values.fm === "Sibling" && dispatch(saveSiblingFromRelationship(payload, props.addNewPeople, propsid)); 
        // For Other child case 
        modalPerson.gender === "Other" && formValues.values.sr === "family" && formValues.values.fm === "Child" && dispatch(saveChildFromRelationShip(payload, props.addNewPeople, propsid)); 
         //====Add Child for Fe-Male
        modalPerson.gender === "Female" && formValues.values.sr === "family" && formValues.values.fm === "Daughter" && dispatch(saveChildFromRelationShip(payload, props.addNewPeople, propsid));   
        // Add spouse without child 
        modalPerson.gender === "Male" && formValues.values.sr === "family" && formValues.values.fm === "Spouse" && dispatch(saveSpouseFromRelationShip(payload, props.addNewPeople, propsid));

        modalPerson.gender === "Female" && formValues.values.sr === "family" && formValues.values.fm === "Spouse" && dispatch(saveSpouseFromRelationShip(payload, props.addNewPeople, propsid));
        //Save For Non Family person
        formValues.values.sr !== "family" && dispatch(saveNonFamily(modalpersonData, formValues.values, props.addNewPeople, individualPerson, handleCancel, propsid));
        handleCancel()
    }
    const formValidate = (values) => {
        let formError = {};
        if (!values.pn?.id) {
            formError["pn"] = "inValid"
        }
        if (!values.sr) {
            formError["sr"] = "inValid"
        }
        if (values.sr === "other" && !values.rn) {
            formError["rn"] = "inValid"
        }
        return formError;
    }
    const handleBackTreeModal = () => {
        setShowDialogModal(false)
        setConnectedModal(true)
    }
    const handleGotoTree = (data) => {
        localStorage.setItem("modalperson", JSON.stringify(props.modalPersonForm));
        let link = `/family/1`
        if (props.treeProfileId) {
            const lastTree = getRecentTree();
            if (data?.values?.pn?.treeId && data?.values?.pn?.treeId !== "00000000-0000-0000-0000-000000000000") {
                link = `/family/pedigree-view/${data?.values?.pn?.treeId}/${data?.values?.pn?.id}/4/1`
            } else {
                link = `/family/pedigree-view/${lastTree?.treeId}/${lastTree?.primaryPersonId}/${lastTree?.level}`
            }
        }
        if (handleDraftSave) {
            handleDraftSave(preFormik, link);
        } else {
            history.replace(link);
        }
    }
    const treeContentDialog = (formik) => {
        if (props.treeProfileId) {
            return <TreeDialogContent
                handleBackTreeModal={handleBackTreeModal}
                handleGotoTree={handleGotoTree}
                formik={formik}
            />
        } else {
            return <NoTreeDialogContent
                handleBackTreeModal={handleBackTreeModal}
                handleGotoTree={handleGotoTree}
            />
        }
    }
    const preSelected = props.preSelected ? props.preSelected : {}
    const preSelectedExist = !!props.preSelected
    useEffect(() => {
        dispatch(treePeopleList({ treeId: preSelected?.id }));
    }, [dispatch, ConnectedModal])
    return <>
        <TailwindModal
            showModal={true}
            innerClasses={showDialogModal ? "max-w-xl" : "max-w-144"}
            title={tr(t, getModalTitle(showDialogModal, NonFamilModal, modalPerson, props.treeProfileId, props.modalTitle))}
            modalWrap={"md:px-8 px-6 py-6"}
            modalHead={"pb-6"}
            modalPadding={ClassNames("p-0", { "text-gray-7": showDialogModal })}
            content={
                <>
                    {modalPerson ?
                        <Formik
                            enableReinitialize={true}
                            validateOnMount={true}
                            validate={formValidate}
                            // onSubmit={handleSubmit}
                            initialValues={{ ...defaultValues, ...preSelected }}>
                            {(formik) => {
                                return (<>
                                    {NonFamilModal &&
                                        <>
                                            <PersonForm
                                                modalPerson={modalPerson}
                                                disableoption={disableoption}
                                                handleChange={handleChange}
                                                handleIsLiving={handleIsLiving}
                                                handleGender={handleGender}
                                                selectedValue={selectedValue}
                                                setSelectedvalue={setSelectedvalue}
                                                allowTypeahed={props.allowTypeahed}
                                                preSelected={preSelected}
                                                {...props}
                                            />
                                            <div className="mt-10 buttons ml-auto flex items-center justify-end">
                                                <div>
                                                    <Button
                                                        type="default-dark"
                                                        tkey="Cancel"
                                                        size="large"
                                                        handleClick={handleCancel}
                                                        disabled={!checkDisable()}
                                                        id="addAction"
                                                        fontWeight="medium"
                                                    />
                                                </div>
                                                <div className="ml-2">
                                                    {props.hasPerson ?
                                                        <Button
                                                            type="primary"
                                                            tkey="Next"
                                                            size="large"
                                                            handleClick={AfterNext}
                                                            disabled={!checkDisable()}
                                                            id="addAction"
                                                            fontWeight="medium"
                                                        /> :
                                                        <Button
                                                            type="primary"
                                                            tkey="Save"
                                                            size="large"
                                                            handleClick={handleClick}
                                                            disabled={!checkDisable()}
                                                            id="addAction"
                                                            fontWeight="medium"
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </>
                                    }
                                    {ConnectedModal && <PersonConnectedForm
                                        modalPerson={modalPerson}
                                        GetFieldsMethod={GetFieldsMethod}
                                        GetFieldsMethodForopttion={GetFieldsMethodForopttion}
                                        handlebackclick={handlebackclick}
                                        handleSave={handleSaveNonFamily}
                                        getOptionDisabled={[modalPerson]}
                                        formik={formik}
                                        setConnectedPerson={setConnectedPerson}
                                        disabledValue={disabledValue}
                                        preSelected={preSelectedExist}
                                        setDropdownDisabled={setDropdownDisabled}
                                        dropdownDisabled={dropdownDisabled}
                                        setShowDialogModal={setShowDialogModal}
                                        setConnectedModal={setConnectedModal}
                                    />
                                    }
                                    {showDialogModal && treeContentDialog(formik)}
                                </>
                                )
                            }}
                        </Formik> :
                        <div className="flex justify-center items-center h-52"><Loader spinner /></div>
                    }
                </>
            }
            setShowModal={handleCancel}
        />
    </>
}
export default Addnonfamily;

