import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import { getFirstAndLastName, getDisabledOptions, CheckExactField } from "../../../../../utils";
import { getFieldDropdowns, refineSearchButtons } from "../../../../../utils/search";
import { getRelationship } from "../../../../../utils/formFields";
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({ width = "", usFederal1840DefaultValues, handleShowModal, buttonTitle, handleSubmitUSCensus1840,relationshipSearch }) => {
  const handleUSFederal1840Submit = (values, { setSubmitting }) => {
    handleSubmitUSCensus1840(values, { setSubmitting });
  };
  const showUSFederal1840NameDiv = usFederal1840DefaultValues?.fm.t || usFederal1840DefaultValues?.ln.t;
  const getResidenceOptions = () => {
    let res = {};
    if (usFederal1840DefaultValues.Residence?.levelData) {
      res = usFederal1840DefaultValues.Residence.levelData.residenceLevel;
    }
    return res;
  };
  return (
    <>
      <Formik enableReinitialize={true} onSubmit={handleUSFederal1840Submit} initialValues={usFederal1840DefaultValues}>
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form name="Census Form" className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showUSFederal1840NameDiv && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Name</p>
                    </div>
                    {usFederal1840DefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{usFederal1840DefaultValues.fm.t}</div>
                        <div className="ml-auto">
                          <Field name="fm.s" component={TWDropDownComponent} onChange={CheckExactField.bind(this, setFieldValue)} getdisabledoptions={getDisabledOptions(getFirstAndLastNameDeathOptions, usFederal1840DefaultValues.fm.t)} options={getFirstAndLastName()} defaultValue="0" />
                        </div>
                      </div>
                    )}
                    {usFederal1840DefaultValues?.ln?.t && (
                      <div className={`row flex content-row items-center ${usFederal1840DefaultValues.fm || "pb-1"}`}>
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{usFederal1840DefaultValues.ln.t}</div>
                        <div className="ml-auto">
                          <Field name="ln.s" component={TWDropDownComponent} onChange={CheckExactField.bind(this, setFieldValue)} options={getFirstAndLastName()} getdisabledoptions={getDisabledOptions(getFirstAndLastNameDeathOptions, usFederal1840DefaultValues.ln.t)} defaultValue="0" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {usFederal1840DefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs"> Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{usFederal1840DefaultValues.r?.l?.l}</div>
                      <div className="ml-auto">{getFieldDropdowns(usFederal1840DefaultValues.r?.li?.i, "r.li.s", "r.l.s", usFederal1840DefaultValues.Residence, setFieldValue, getResidenceOptions)}</div>
                    </div>
                  </div>
                )}
                {usFederal1840DefaultValues?.sr && (
                  <div className="refine-row border-b border-gray-2 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-5 text-xs">Race/Nationality</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{usFederal1840DefaultValues.sr}</div>
                    </div>
                  </div>
                )}
                {relationshipSearch && getRelationship(usFederal1840DefaultValues?.rs).map(y => y)}
              </div>
            </div>
            {refineSearchButtons(isSubmitting, isValid, dirty, buttonTitle, handleShowModal)}
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
