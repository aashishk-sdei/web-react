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
const RefineSearch = ({ Us1881DefaultValues, handleShowModal, buttonTitle, handleSubmitUsCensus1881,relationshipSearch, width = "" }) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitUsCensus1881(values, { setSubmitting });
  };
  const showNamesDiv = Us1881DefaultValues?.fm.t || Us1881DefaultValues?.ln.t;
  const getBirthOptions = () => {
    if (Us1881DefaultValues.BirthPlace?.levelData) {
      return Us1881DefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };
  const getResidenceOptions = () => {
    if (Us1881DefaultValues.RSPlace?.levelData) {
      return Us1881DefaultValues.RSPlace.levelData.residenceLevel;
    }
    return {};
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={Us1881DefaultValues} onSubmit={handleFormSubmit}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">{tr(t, "search.ww1.list.name")}</p>
                    </div>
                    {Us1881DefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1881DefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1881DefaultValues.fm.t)} />
                        </div>
                      </div>
                    )}
                    {Us1881DefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${Us1881DefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1881DefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1881DefaultValues.ln.t)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {Us1881DefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1881DefaultValues?.r?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1881DefaultValues.r?.li?.i, "r.li.s", "r.l.s", Us1881DefaultValues.RSPlace, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1881DefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Birth Place</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1881DefaultValues.b?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1881DefaultValues.b?.li?.i, "b.li.s", "b.l.s", Us1881DefaultValues.BirthPlace, setFieldValue, getBirthOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1881DefaultValues?.g ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1881DefaultValues.g}</div>
                    </div>
                  </div>
                ) : null}
                {Us1881DefaultValues?.ms ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Marital Status</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1881DefaultValues.ms}</div>
                    </div>
                  </div>
                ) : null}
                {Us1881DefaultValues?.rh ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Relation to Head of House</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1881DefaultValues.rh}</div>
                    </div>
                  </div>
                ) : null}
                {relationshipSearch && getRelationship(Us1881DefaultValues?.rs).map((y) => y)}
              </div>
            </div>
            <div className="w-full mb-2 md:pt-6 flex justify-between">
              <div className="flex buttons ml-auto">
                <div className="mr-1.5">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    type="default"
                    title={tr(t, "search.ww1.list.esearch")}
                    fontWeight="medium"
                  />
                </div>
                <Button disabled={!dirty || isSubmitting || !isValid} title={isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle} buttonType="submit" fontWeight="medium"/>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
