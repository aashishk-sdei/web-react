import React from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import { getFirstAndLastName, getDisabledOptions, CheckExactField } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { getFieldDropdowns } from "../../../../../utils/search";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({ width = "", civilWarDefaultValues, handleShowModal, buttonTitle, handleSubmitCivilWar }) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitCivilWar(values, { setSubmitting });
  };
  const showNamesDiv = civilWarDefaultValues?.fm.t || civilWarDefaultValues?.ln.t;
  const getResidenceOptions = () => {
    if (civilWarDefaultValues.TourPlace?.levelData) {
      return civilWarDefaultValues.TourPlace.levelData.residenceLevel;
    }
    return {};
  };
  const showModal = (e) => {
    e.preventDefault();
    handleShowModal(true);
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={civilWarDefaultValues} onSubmit={handleFormSubmit}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">{tr(t, "search.ww1.list.name")}</p>
                    </div>
                    {civilWarDefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{civilWarDefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, civilWarDefaultValues.fm.t)} />
                        </div>
                      </div>
                    )}
                    {civilWarDefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${civilWarDefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{civilWarDefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, civilWarDefaultValues.ln.t)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {civilWarDefaultValues?.a ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Allegiance</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{civilWarDefaultValues.a}</div>
                    </div>
                  </div>
                ) : null}
                {civilWarDefaultValues?.er ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Military Enlistment Rank</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{civilWarDefaultValues.er}</div>
                    </div>
                  </div>
                ) : null}
                {civilWarDefaultValues?.gr ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Military Rank</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{civilWarDefaultValues.gr}</div>
                    </div>
                  </div>
                ) : null}
                {civilWarDefaultValues?.u ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Unit</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{civilWarDefaultValues.u}</div>
                    </div>
                  </div>
                ) : null}
                {civilWarDefaultValues?.t?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Military Service Location</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{civilWarDefaultValues?.t?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(civilWarDefaultValues.t?.li?.i, "t.li.s", "t.l.s", civilWarDefaultValues.TourPlace, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-2 flex justify-between w-full md:pt-6">
              <div className="buttons flex ml-auto">
                <div className="mr-1.5">
                  <Button handleClick={(e) => showModal(e)} title={tr(t, "search.ww1.list.esearch")} type="default" fontWeight="medium"/>
                </div>
                <Button buttonType="submit" disabled={!dirty || isSubmitting || !isValid} title={isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle} fontWeight="medium"/>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
