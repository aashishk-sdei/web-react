import React, { useState} from "react";
import { Form, FastField, Field} from "formik";
import SearchPeople from "../../components/SearchPeople/SearchPeople"
import Button from "../../components/Button";
import { strFirstUpCase } from "../../utils";
import { useFeatureFlag }  from "./../../services/featureFlag"

const firstNameLastname = (person) => {
    let name = []
    if (person.firstName) {
        name.push(strFirstUpCase(person.firstName))
    }
    if (person.lastName) {
        name.push(strFirstUpCase(person.lastName))
    }
    return name.join(' ');
}

const disableFamilyOption = (val, setDropdownDisabled) => {
    if (val.treeId && val.treeId !== "00000000-0000-0000-0000-000000000000") {
        setDropdownDisabled(false)
    } else {
        setDropdownDisabled(true)
    }
}

const DropDownValues = [
    { id: 1, value: 'family', name: 'Family' },
    { id: 1, value: 'friend', name: 'Friend' },
    { id: 1, value: 'classmate', name: 'Classmate' },
    { id: 1, value: 'neighbor', name: 'Neighbor' },
    { id: 1, value: 'military comrade', name: 'Military Comrade' },
    { id: 1, value: 'colleague', name: 'Colleague' },
    { id: 1, value: 'fellow congregant', name: 'Fellow Congregant' },
    { id: 1, value: 'other', name:'Other'},
 
]
const PersonConnectedForm = ({  GetFieldsMethodForopttion, formik, GetFieldsMethod, handlebackclick, handleSave, modalPerson, setDropdownDisabled, setShowDialogModal, setConnectedModal, getOptionDisabled, preSelected, disabledValue }) => {
    const { enabled: accessAddFamilyRelationship } = useFeatureFlag("AddFamilyRelationship");
    const [saveButton, setSaveButton] = useState(false)
    const valueToRemove = 'Family'
    const filteredItems = disabledValue.length > 0 && disabledValue[0].connection.filter(item => item !== valueToRemove);
    const checkDisable = (dropdownValue) => {
        return filteredItems.length > 0 && filteredItems.includes(dropdownValue)
    }
    return (
        <>
            <Form>
                <div className="w-full mb-4">
                    <label className="block text-black typo-font-medium text-sm mb-4">
                        {`Who is ${firstNameLastname(modalPerson)} connected to?`}
                    </label>
                    <div className="relative">
                        <FastField
                            name="pn"
                            autoFocus={true}
                            disabled={preSelected}
                            getOptionDisabled={getOptionDisabled}
                            component={SearchPeople} 
                            className="appearance-none placeholder-gray-4 w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent border  focus:ring-blue-4"
                            placeholder="Search your people"
                            selectPeople={(val) => {
                                disableFamilyOption(val, setDropdownDisabled)
                                formik.setFieldValue("pn", val)
                            }}
                        />


                    </div>
                </div>
                <div className="w-full mb-4">
                    <label
                        className="block text-black typo-font-medium text-sm mb-4"
                    > What is their relationship?
                    </label>
                    <div className="relative">
                        <Field
                            as="select"
                            name="sr"
                            onChange={(e) => {
                                if (e.target.value === "family") {
                                
                                    // if (accessAddFamilyRelationship) {
                                    //     setShowDialogModal(true);
                                    //     setConnectedModal(false);
                                    //     formik.setFieldValue("sr", "");
                                    // } else {
                                        formik.handleChange(e); 
                                    // }
                                    
                                } else {
                                    formik.handleChange(e);
                                }
                            }}
                            className={`appearance-none w-full pr-6 py-2 px-4 border border-gray-3 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent 
                            `}>
                            <option value="" selected>Select relationship</option>
                            {DropDownValues.map(keyItem => (
                                <option value={keyItem.value} disabled={checkDisable(keyItem.name)} >{keyItem.name}</option>
                            ))}
                        </Field>
                        <div className="absolute right-0 top-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </div>
                    </div>
                    <div className="flex items-center relative mt-4">
                        <Field component={GetFieldsMethod} name="options" />
                    </div>
                    <div className="w-full">
                        <Field component={GetFieldsMethodForopttion} name="options" />
                    </div>
                </div>
                <div className="w-full">
                    <div className="mt-10 buttons ml-auto flex items-center">
                        <div className="w-4/12">
                            <Button
                                type="default-dark"
                                tkey="Back"
                                size="large"
                                handleClick={handlebackclick}
                                id="addAction"
                                fontWeight="medium"
                            />
                        </div>
                        <div className="w-8/12 ">
                            <div className="flex justify-end">
                                <div>
                                    <Button
                                        type="default-dark"
                                        tkey="Skip"
                                        size="large"
                                        handleClick={() => handleSave(formik, true)}
                                        id="addAction"
                                        fontWeight="medium"
                                    />
                                </div>
                                <div className="ml-2">
                                    <Button
                                        type="primary"
                                        tkey={saveButton ? "Loading..." : "Save"}
                                        size="large"
                                        disabled={(!preSelected && !formik.dirty) || !formik.isValid || formik.isSubmitting}
                                        handleClick={() => { setSaveButton(true); handleSave(formik); }}
                                        id="addAction"
                                        fontWeight="medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Form>
        </>
    );
}
export default PersonConnectedForm;