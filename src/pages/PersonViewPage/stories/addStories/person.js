import React, { useEffect, useState } from 'react';
import { Field } from "formik";
import Typography from "./../../../../components/Typography";
import SearchPeople from "./../../../../components/SearchPeople/SearchPeople"
import { getDateString } from "./../../../../components/utils"
import { getPersonProfileUrl } from "./../../../../components/utils/genderIcon"
import { treePeopleList } from './../../../../redux/actions/sidebar';
import { addIndividual } from './../../../../redux/actions/family';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from "uuid";
import { getShortGender, modalType } from '../../../../utils';
import Modal from "../../../Common/Modal";

const {
    ADD_INDIVIDUAL, ADD_NONFAMILY
} = modalType;

const getLabel = (option) => {
    const name = [];
    if (option.givenName) {
        name.push(option.givenName);
    }
    if (option.surname) {
        name.push(option.surname);
    }
    return name.join(" ");
}

const Person = ({ form, field, treeProfileId, handleDraftSave, preFormik }) => {
    const dispatch = useDispatch();
    const { storyId, treeId, primaryPersonId } = useParams();
    const [openFamilyModal, setFamilyModal] = useState(false);
    const [modalAction, setModalAction] = useState(ADD_INDIVIDUAL);
    const [modalPerson, setModalPerson] = useState(null);
    const [hasPerson, setHasPerson] = useState(treeId || treeProfileId)
    useEffect(() => {
        if (storyId && field.value[0] && field.value[0].treeId !== "00000000-0000-0000-0000-000000000000") {
            dispatch(treePeopleList({ treeId: field.value[0].treeId }));
        } else {
            dispatch(treePeopleList({ treeId: treeId || treeProfileId }));
        }
    }, [dispatch, treeId, storyId])

    const {
        treePeople
    } = useSelector(state => {
        return state.sidebar
    });
    useEffect(()=>{
        if(!treeId && !treeProfileId && field.value.length === 0 && treePeople?.length === 0) {
            dispatch(treePeopleList({treeId: null})).then((data)=>{
                setHasPerson(data.length !== 0)
            });
        } else {
            setHasPerson(true)
        }
    }, [treeId, treeProfileId, field.value, treePeople])
   
    useEffect(() => {
        if (
            !(field.value && field.value.length > 0) &&
            treePeople &&
            treePeople.length &&
            primaryPersonId
        ) {
            let defaultPerson = treePeople.filter(
                (item) => item.id === primaryPersonId
            );
            let _defaultPerson = { ...defaultPerson[0], givenName: defaultPerson[0]?.givenName?.givenName, surname: defaultPerson[0]?.surname?.surname }
            form.setFieldValue(field.name, [
                { ..._defaultPerson, defaultPerson: true },
            ]);
        }
    }, [treePeople, primaryPersonId, field.value, form, field.name]);

    const removePerson = (index) => {
        let valueTemp = [...field.value]
        valueTemp.splice(index, 1)
        form.setFieldValue(field.name, valueTemp)
    }

    const selectPeople = (val) => {
        if (val.id) {
            const isNotExist = field.value.findIndex((_person) => _person.id === val.id) === -1
            isNotExist && form.setFieldValue(field.name, [val, ...field.value])
            form.setFieldValue("search", { "id": "", "name": "" })
        }
    }
    const addNewItem = (name) => {
        const _name = name.name.split(' ');
        const obj = {
            firstName: (_name.length > 1) ? _name.slice(0, -1).join(' ') : _name[0],
            lastName: (_name.length > 1) ? _name.slice(-1).join(' ') : "",
            isLiving: true,
            id: uuidv4(),
            birth: "",
            death: ""
        }
        setFamilyModal(true)
        setModalAction(ADD_NONFAMILY);
        setModalPerson(obj)
        dispatch(addIndividual(obj))
    }

    const redirectUrl = async () => {
        setModalAction(null);
    }
    const handlePerson = (_modalPerson) => {
        setModalPerson(_modalPerson)
    }
    const addNewPeople = (_modalPerson) => {
        form.setFieldValue(field.name, [{
            ..._modalPerson,
            givenName: _modalPerson.givenName.givenName || "",
            surname: _modalPerson.surname.surname || "",
            gender: _modalPerson.gender.gender ? getShortGender(_modalPerson.gender.gender) : ""
        }, ...field.value])
        form.setFieldValue("search", { "id": "", "name": "" })
        setFamilyModal(false)
    }

    return (
        <>
            <div className="story-box add-person-box">
                <div className="story-body">
                    <div className="story-title mb-6">
                        <h2><Typography text="secondary" size={32} weight="lyon-medium">Who is in this story?</Typography></h2>
                    </div>
                    <div className="sm:mb-12">
                        <div className="who-is mb-4 relative">
                            <Field
                                name="search"
                                addNewText="+ Add %s as a new person"
                                autoFocus={true}
                                component={SearchPeople}
                                addNew={true}
                                placeholder={"Add People from your tree"}
                                freeSolo={true}
                                highlight={true}
                                height={32}
                                fontSize={14}
                                popoverMt={28}
                                options={treePeople}
                                selectPeople={selectPeople}
                                getOptionDisabled={field.value}
                                addNewItem={addNewItem}
                            />
                        </div>
                        <div className="persons-wrap">
                            {field.value && field.value.map((_person, index) => <div key={index} className="persons-in-story relative mb-4 ">
                                {_person.defaultPerson !== true && <button onClick={() => removePerson(index)} type="button" className="bg-gray-1 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset absolute top-2/4 transform -translate-y-2/4 right-0">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 14L14 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M14 14L2 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>}
                                <div className="flex items-center pr-12" >
                                    <div className="media w-10 h-10 overflow-hidden mr-2 avtar-square-large">
                                        <img src={getPersonProfileUrl(_person)} alt="Story Pic" className="object-cover w-10 h-10" />
                                    </div>
                                    <div className="media-text flex-1 avtar-square-large-name my-auto">
                                        <h3 className="text-sm typo-font-medium main-title"  >{getLabel(_person)}</h3>
                                        <p className="text-xs sub-title">{getDateString(_person)}</p>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {openFamilyModal === true && <Modal
                treeId={"00000000-0000-0000-0000-000000000000"}
                modalAction={modalAction}
                setModalAction={setModalAction}
                handlePerson = {handlePerson}
                redirectUrl={redirectUrl}
                addNewPeople={addNewPeople}
                handleDraftSave={handleDraftSave}
                treeProfileId = {treeProfileId}
                preFormik={preFormik}
                modalPersonForm = {modalPerson}
                hasPerson = {hasPerson}
            />
            }
        </>)
}

export default Person