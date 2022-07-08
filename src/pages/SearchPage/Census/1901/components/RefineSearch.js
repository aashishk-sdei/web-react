import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import { getFirstAndLastName, getDisabledOptions, CheckExactField } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { getFieldDropdowns } from "../../../../../utils/search";
import { getRelationship } from "../../../../../utils/formFields";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({ width = "", Us1901DefaultValues, handleShowModal, buttonTitle, handleSubmitUsCensus1901 , relationshipSearch }) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitUsCensus1901(values, { setSubmitting });
  };
  const showNamesDiv = Us1901DefaultValues?.fm.t || Us1901DefaultValues?.ln.t;
  const getBirthOptions = () => {
    if (Us1901DefaultValues.BirthPlace?.levelData) {
      return Us1901DefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };
  const getResidenceOptions = () => {
    if (Us1901DefaultValues.RSPlace?.levelData) {
      return Us1901DefaultValues.RSPlace.levelData.residenceLevel;
    }
    return {};
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={Us1901DefaultValues} onSubmit={handleFormSubmit}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">{tr(t, "search.ww1.list.name")}</p>
                    </div>
                    {Us1901DefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1901DefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1901DefaultValues.fm.t)} />
                        </div>
                      </div>
                    )}
                    {Us1901DefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${Us1901DefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1901DefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1901DefaultValues.ln.t)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {Us1901DefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1901DefaultValues?.r?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1901DefaultValues.r?.li?.i, "r.li.s", "r.l.s", Us1901DefaultValues.RSPlace, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1901DefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Birth Place</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1901DefaultValues.b?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1901DefaultValues.b?.li?.i, "b.li.s", "b.l.s", Us1901DefaultValues.BirthPlace, setFieldValue, getBirthOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1901DefaultValues?.g ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1901DefaultValues.g}</div>
                    </div>
                  </div>
                ) : null}
                {Us1901DefaultValues?.ms ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Marital Status</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1901DefaultValues.ms}</div>
                    </div>
                  </div>
                ) : null}
                {Us1901DefaultValues?.rh ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Relation to Head of House</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1901DefaultValues.rh}</div>
                    </div>
                  </div>
                ) : null}
                {relationshipSearch && getRelationship(Us1901DefaultValues?.rs).map((y) => y)}
              </div>
            </div>
            <div className="mb-2 md:pt-6 flex justify-between w-full">
              <div className="buttons ml-auto flex">
                <div className="mr-1.5">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    title={tr(t, "search.ww1.list.esearch")}
                    type="default"
                    fontWeight="medium"
                  />
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
