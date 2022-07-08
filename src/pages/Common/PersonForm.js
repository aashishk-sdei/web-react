import React, { useState, useEffect } from "react";
import "./index.css";
// Components
import Input from "../../components/Input";
import SelectButton from "../../components/SelectButton";
import Checkbox from "../../components/Checkbox";
import Typography from "../../components/Typography";
import Location from "../../components/SearchLocation/Location";
import { useTranslation } from 'react-i18next';
//utlis
import { showBirthandDeath } from "shared-logics"
import { tr } from "../../components/utils"
import { getPersonProfileUrl } from "../../components/utils/genderIcon"
import { MALE, FEMALE, OTHER, strFirstUpCase } from '../../utils';
import { Formik, Field } from "formik";
import SearchPeople from "../../components/SearchPeople/SearchPeople";
const PersonForm = ({
    disableoption,
    modalPerson: {  firstName, lastName, isLiving, gender, birth, birthPlace, death, deathPlace },
    handleIsLiving,
    handleChange,
    handleGender,
    modalType,
    allowTypeahed,
    setValuesModalPerson,
    preSelected,
    selectedValue,
    setSelectedvalue
}) => {
    const { t } = useTranslation();
    const [selectedBirthValue, setSelectedBirthValue] = useState({ id: null, name: birthPlace });
    const [selectedDeathValue, setSelectedDeathValue] = useState({ id: null, name: deathPlace });
    useEffect(() => {
        document.activeElement.blur();
        const firstNameElem = document.getElementById("firstName");
        if(firstNameElem) firstNameElem.focus();
        if (navigator.vendor.toLowerCase() === "apple computer, inc." && modalType === "ADD_PARENT") {
            document.activeElement.blur();
            setTimeout(() => {
                if (firstNameElem) firstNameElem.focus();
            }, 0.1);
        }
    }, [])

    useEffect(() => {
        setSelectedBirthValue({ id: null, name: birthPlace });
        setSelectedDeathValue({ id: null, name: deathPlace });
    }, [birthPlace, setSelectedBirthValue, deathPlace, setSelectedDeathValue])

    const handleCheck = (event) => {
        if (event.target.checked) setSelectedDeathValue({ id: null, name: "" });
        handleIsLiving(event.target.checked);
        setTimeout(() => {
            const checkBox = document.getElementById("isLiving");
            if (checkBox) checkBox.focus();
        }, 100);
    };
    const handleBirthPlace = (obj, event) => {
        const { locationId, value } = obj.target
        if (obj && selectedBirthValue.name !== value) {
            if (event && event.preventDefault) event.preventDefault();
            setSelectedBirthValue({ id: locationId, name: value })
            const e = {
                target: {
                    name: "birthPlace",
                    value,
                    birthLocationId: locationId || ""
                }
            }
            handleChange(e);
            if (isLiving) {
                setTimeout(() => {
                    const isLivingInput = document.getElementById("isLiving");
                    if(isLivingInput) isLivingInput.focus();
                }, 500)
            } else {
                const deathInput = document.getElementById("death");
                if(deathInput) deathInput.focus();
            }
        }
    }

    const handleDeathPlace = (obj, event) => {
        const { locationId, value } = obj.target
        if (obj && selectedDeathValue.name !== value) {
            if (event && event.preventDefault) event.preventDefault();
            setSelectedDeathValue({ id: locationId, name: value })
            const e = {
                target: {
                    name: "deathPlace",
                    value,
                    deathLocationId: locationId || ""
                }
            }
            handleChange(e);
            setTimeout(() => {
                const isLivingInput = document.getElementById("isLiving");
                isLivingInput.focus();
            }, 500)
        }
    }

    const disableArray = preSelected && preSelected.pn ? [preSelected.pn] : []
    const nameSurname = () => {
        let name = []
        if (selectedValue&& selectedValue.name) {
            name.push(strFirstUpCase(selectedValue.name))
        }
        return name.join(' '); 
    }
    return (
        <>
            {selectedValue &&<div className="modal-res-row py-4 border-t-1 border-b-1 border-gray-2 mb-5">
                <div className="flex items-center">
                    <div className="inline">
                        <img src={getPersonProfileUrl(selectedValue)} alt="Story Pic" className="object-cover w-10 h-10" />
                    </div>
                    <div className="pl-2">
                        <h2 className="text-sm font-semibold break-all">{nameSurname()}</h2>
                        <p className="text-xs text-gray-5 pt-1 break-all">{showBirthandDeath(selectedValue.birthDate.year, selectedValue.deathDate.year, selectedValue.isLiving, disableoption)}</p>
                    </div>
                </div>
                <button className="w-10 h-10 bg-gray-1 rounded-lg flex justify-center items-center absolute right-0 hover:bg-gray-2" onClick={() => {
                    setSelectedvalue(null); setValuesModalPerson({
                        id: "",
                        firstName: "",
                        lastName: "",
                        isLiving: true,
                        gender: "",
                        birth: "",
                        birthPlace: "",
                        death: "",
                        deathPlace: "",
                        added: false
                    });
                }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13L13 1" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M13 13L1 1" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            }
            <div className="relative">
                {selectedValue && <div className="absolute h-full w-full bg-white opacity-50 z-40 left-0 top-0"></div>}
            <div className="modal-res-row">
                <div className="w-full smm:w-3/5 mb-2 smm:mb-0">
                    {allowTypeahed === true ?
                        <Formik
                                initialValues={{ firstName: { id: "", name: firstName } }}
                            enableReinitialize={true}
                        >
                            {(formik) => {
                                return (
                                    <>
                                        <div className="mb-1 truncate">
                                            <Typography size={14} text="default" >{tr(t, "f&mName")}</Typography>
                                        </div>
                                        <div className="relative">
                                            <Field
                                                name={`firstName`}
                                                component={SearchPeople}
                                                freeSolo={true}
                                                disabled={selectedValue === null ? false : true}
                                                placeholder=""
                                                selectPeople={(val) => {
                                                    if (val?.id) {
                                                        setSelectedvalue(val)
                                                        setValuesModalPerson({
                                                            id: "",
                                                            firstName: "",
                                                            lastName: "",
                                                            isLiving: val ?.isLiving,
                                                            gender: "",
                                                            birth: "",
                                                            birthPlace: "",
                                                            death: "",
                                                            deathPlace: "",
                                                            added: true
                                                        })
                                                    } else {
                                                        handleChange({ target: { name: "firstName", value: val.name } })
                                                        formik.setFieldValue("firstName",  val.name)
                                                    }
                                                }}
                                                getOptionLabel={(opt) => {
                                                    return opt.name || firstName
                                                }}
                                                id="firstName"
                                                autoFocus="autoFocus"
                                                getOptionDisabled={disableArray}
                                            />
                                        </div>
                                    </>
                                );
                            }}
                        </Formik>
                            :
                        <Input
                            id="firstName"
                            label={tr(t, "f&mName")}
                            type="text"
                            name="firstName"
                            value={firstName}
                            placeholder=""
                            autoFocus="autoFocus"
                            position={firstName.length}
                            handleChange={handleChange}
                            />
                        }
                      
                </div>
                <div className="w-full smm:w-2/5 ml-0 smm:ml-2">
                    <Input
                        id="lastName"
                        label={tr(t, "LastName")}
                        type="text"
                        name="lastName"
                        value={lastName}
                        placeholder=""
                        handleChange={handleChange}
                    />
                </div>
            </div>
            <div className="modal-row">
                <div className="mb-1">
                    <Typography
                        size={14}
                        text="default"
                        tkey="pedigree.dialog.form.gender"
                    >
                    </Typography>
                </div>
                <div className="flex">
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.male")}
                        select={gender === MALE ? true : false}
                        handleSelect={handleGender}
                    />
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.female")}
                        select={gender === FEMALE ? true : false}
                        handleSelect={handleGender}
                    />
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.other")}
                        select={gender === OTHER ? true : false}
                        handleSelect={handleGender}
                    />
                </div>
            </div>
            <div className="modal-row modal-res-row">
                <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
                    <Input
                        id="birth"
                        label="pedigree.dialog.form.bdoy"
                        type="text"
                        name="birth"
                        value={birth}
                        placeholder=""
                        handleChange={handleChange}
                    />
                </div>
                <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
                    <>
                        <Typography
                            size={14}
                            text="default"
                            tkey="pedigree.dialog.form.bplace"
                        >
                        </Typography>
                        <div className="mt-1 location-autocomplete">
                            <Location
                                id="birthPlace"
                                name="birthPlace"
                                value={selectedBirthValue.name}
                                placeholder="pedigree.dialog.form.placeholder.bplace"
                                handleSelectedValue={handleBirthPlace}
                                    freeSolo={true}
                                    
                                modalType={modalType}
                                isLiving={isLiving}
                                dataSource="birthPlaceOptions"
                            />
                        </div>
                    </>
                </div>
            </div>

            {
                !isLiving &&
                <div className="modal-row modal-res-row">
                    <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
                        <Input
                            id="death"
                            label="pedigree.dialog.form.ddoy"
                            type="text"
                            name="death"
                            value={death}
                            placeholder=""
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
                        <>
                            <Typography
                                size={14}
                                text="default"
                                tkey="pedigree.dialog.form.dplace"
                            >
                            </Typography>
                            <div className="mt-1 location-autocomplete">
                                <Location
                                    id="deathPlace"
                                    name="deathPlace"
                                    value={selectedDeathValue.name}
                                    placeholder="pedigree.dialog.form.placeholder.dplace"
                                    handleSelectedValue={handleDeathPlace}
                                    freeSolo={true}
                                    locationType="death-place"
                                    modalType={modalType}
                                    isLiving={isLiving}
                                    dataSource="deathPlaceOptions"
                                />
                            </div>
                        </>
                    </div>
                </div>
            }
            <div className="modal-row -ml-3 mt-3">
                    <Checkbox id="isLiving" disabled={selectedValue ? true : false} obj={null} checked={isLiving} color="primary" label="pedigree.nodeform.living" labelColor="secondary" handleChange={handleCheck} />
            </div>
            </div>
        </>
    )
}

export default PersonForm;