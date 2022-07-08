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
const RefineSearch = ({ width = "", Uk1841DefaultValues , handleShowModal, buttonTitle, handleSubmitUkCensus1841 , relationshipSearch}) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitUkCensus1841(values, { setSubmitting });
  };
  const showNamesDiv = Uk1841DefaultValues?.fm.t || Uk1841DefaultValues?.ln.t;
  const getBirthOptions = () => {
    if (Uk1841DefaultValues.BirthPlace?.levelData) {
      return Uk1841DefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };
  const getResidenceOptions = () => {
    if (Uk1841DefaultValues.RSPlace?.levelData) {
      return Uk1841DefaultValues.RSPlace.levelData.residenceLevel;
    }
    return {};
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={Uk1841DefaultValues} onSubmit={handleFormSubmit}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">{tr(t, "search.ww1.list.name")}</p>
                    </div>
                    {Uk1841DefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Uk1841DefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Uk1841DefaultValues.fm.t)} />
                        </div>
                      </div>
                    )}
                    {Uk1841DefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${Uk1841DefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Uk1841DefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} options={getFirstAndLastName()} defaultValue="0" onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, Uk1841DefaultValues.ln.t)} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {Uk1841DefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Uk1841DefaultValues?.r?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Uk1841DefaultValues.r?.li?.i, "r.li.s", "r.l.s", Uk1841DefaultValues.RSPlace, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
                {Uk1841DefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Birth Place</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{Uk1841DefaultValues.b?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(Uk1841DefaultValues.b?.li?.i, "b.li.s", "b.l.s", Uk1841DefaultValues.BirthPlace, setFieldValue, getBirthOptions)}</div>
                    </div>
                  </div>
                )}
                {Uk1841DefaultValues?.g ? (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{Uk1841DefaultValues.g}</div>
                    </div>
                  </div>
                ) : null}
                {relationshipSearch && getRelationship(Uk1841DefaultValues?.rs).map((y) => y)}
              </div>
            </div>


            <div className="mb-2 md:pt-6 flex justify-between w-full">
              <div className="buttons ml-auto flex">
                <div className="mr-1.5">
                  <Button
                    type="default"
                    title={tr(t, "search.ww1.list.esearch")}
                    handleClick={(ev) => {
                        ev.preventDefault();
                        handleShowModal(true);
                      }}
                      fontWeight="medium"
                  />
                </div>
                
                <Button  disabled={ isSubmitting  || !isValid || !dirty} buttonType="submit" title={isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle} fontWeight="medium"/>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
