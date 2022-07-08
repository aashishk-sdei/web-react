import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
    getFirstAndLastName,
    getDisabledOptions,
    CheckExactField,
    CheckExactFieldLocation,
    getResidenceText,
    getFormattedDate,
    DateDropdownValues,
} from "../../../../../utils";
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    NYDeathsDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitNYDeaths,
}) => {
    const handleNYDeathsSubmit = (values, { setSubmitting }) => {
        handleSubmitNYDeaths(values, { setSubmitting });
    };
    const showMassachussetsNameDiv = NYDeathsDefaultValues?.fm.t || NYDeathsDefaultValues?.ln.t;


    const getDeathOptions = () => {
        if (NYDeathsDefaultValues.Death?.levelData) {
            return NYDeathsDefaultValues.Death.levelData.residenceLevel;
        }

        return {};
    };

    const getDeathFieldDropdowns = (
        locationfield,
        bool,
        name,
        nameId,
        setFieldValue
    ) => {
        if (bool) {
            return (
                <Field
                    onChange={CheckExactFieldLocation.bind(
                        this,
                        setFieldValue,
                        locationfield
                    )}
                    name={nameId}
                    options={getDeathOptions()}
                    component={TWDropDownComponent}
                />
            );
        } else {
            return (
                <Field
                    onChange={CheckExactField.bind(this, setFieldValue)}
                    name={name}
                    options={getResidenceText()}
                    component={TWDropDownComponent}
                />
            );
        }
    };


    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleNYDeathsSubmit}
                initialValues={NYDeathsDefaultValues}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="deathsForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showMassachussetsNameDiv && (
                                    <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-5 text-xs">Name</p>
                                        </div>
                                        {NYDeathsDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYDeathsDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYDeathsDefaultValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {NYDeathsDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${NYDeathsDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYDeathsDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYDeathsDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {NYDeathsDefaultValues?.g && (
                                    <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-5 text-xs">Gender</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm">{NYDeathsDefaultValues.g}</div>
                                        </div>
                                    </div>
                                )}

                                {NYDeathsDefaultValues?.d?.y?.y && (
                                    <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-5 text-xs">Death Date</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {getFormattedDate(NYDeathsDefaultValues?.d.y.y, NYDeathsDefaultValues?.d.y.m, NYDeathsDefaultValues?.d.y.d)}
                                            </div>
                                            <div className="ml-auto">
                                                <Field
                                                    name={`d.y.s`}
                                                    options={DateDropdownValues(NYDeathsDefaultValues.d.y.y, NYDeathsDefaultValues.d.y.m, NYDeathsDefaultValues.d.y.d)}
                                                    component={TWDropDownComponent}
                                                    onChange={CheckExactField.bind(this, setFieldValue)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {NYDeathsDefaultValues?.d?.l?.l && (
                                    <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-5 text-xs"> Death Place</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {NYDeathsDefaultValues.d?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getDeathFieldDropdowns(
                                                    NYDeathsDefaultValues.Death,
                                                    NYDeathsDefaultValues.d?.li?.i,
                                                    "d.l.s",
                                                    "d.li.s",
                                                    setFieldValue,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        {/** NY Deaths  Form Button **/}
                        <div className="mb-2 md:pt-6 flex justify-between w-full">
                            <div className="buttons ml-auto flex">
                                <div className="mr-1.5">
                                    <Button
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowModal(true);
                                        }}
                                        type="default"
                                        title="Edit Search"
                                        fontWeight="medium"
                                    />
                                </div>
                                <Button
                                    buttonType="submit"
                                    title={isSubmitting ? "Loading..." : buttonTitle}
                                    disabled={!dirty || isSubmitting || !isValid}
                                    fontWeight="medium"
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default RefineSearch;
