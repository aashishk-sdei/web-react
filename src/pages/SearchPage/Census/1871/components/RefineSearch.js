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
const RefineSearch = ({ Us1871DefaultValues, handleSubmitUsCensus1871, handleShowModal, buttonTitle , relationshipSearch, width = "" }) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitUsCensus1871(values, { setSubmitting });
  };
  const showNamesDiv = Us1871DefaultValues?.fm.t || Us1871DefaultValues?.ln.t;
  const getResidenceOptions = () => {
    if (Us1871DefaultValues.RSPlace?.levelData) {
      return Us1871DefaultValues.RSPlace.levelData.residenceLevel;
    }
    return {};
  };
  const getBirthOptions = () => {
    if (Us1871DefaultValues.BirthPlace?.levelData) {
      return Us1871DefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={Us1871DefaultValues} onSubmit={handleFormSubmit}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">{tr(t, "search.ww1.list.name")}</p>
                    </div>
                    {Us1871DefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1871DefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1871DefaultValues.fm.t)} />
                        </div>
                      </div>
                    )}
                    {Us1871DefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${Us1871DefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1871DefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Us1871DefaultValues.ln.t)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {Us1871DefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1871DefaultValues?.r?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1871DefaultValues.r?.li?.i, "r.li.s", "r.l.s", Us1871DefaultValues.RSPlace, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1871DefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Birthplace</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Us1871DefaultValues.b?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Us1871DefaultValues.b?.li?.i, "b.li.s", "b.l.s", Us1871DefaultValues.BirthPlace, setFieldValue, getBirthOptions)}</div>
                    </div>
                  </div>
                )}
                {Us1871DefaultValues?.g ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1871DefaultValues.g}</div>
                    </div>
                  </div>
                ) : null}
                {Us1871DefaultValues?.rh ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Relation to Head of House</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Us1871DefaultValues.rh}</div>
                    </div>
                  </div>
                ) : null}
                {relationshipSearch && getRelationship(Us1871DefaultValues?.rs).map((y) => y)}
              </div>
            </div>
            <div className="mb-2 md:pt-6 flex justify-between w-full">
              <div className="buttons ml-auto flex">
                <div className="mr-1.5">
                  <Button
                    title={tr(t, "search.ww1.list.esearch")}
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    type="default"
                    fontWeight="medium"
                  />
                </div>
                <Button buttonType="submit" disabled={!dirty || !isValid || isSubmitting} title={isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle} fontWeight="medium"/>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
