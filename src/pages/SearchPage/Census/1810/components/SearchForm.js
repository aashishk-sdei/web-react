import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { typeSearchDefaultUSFederal1800 } from "../../../../../utils";
import { getFirstNameDropDown, headerContent, setBestResidence, submitAndClearButtons } from "../../../../../utils/search";
import { checkResidencePlace } from "../../../utils/common";
import { dropDownField, inputField, locationField, relationShipField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";

const SearchForm = ({ title, relationshipSearch, width = "", defaultValues, USCClear, buttonTitle, handleSubmitUSCensus1810, nearestResidenceDate }) => {
  const formValidate = (values) => {
    let error = {
      invalid: "Invalid",
    };
    let relations = values.rs?.filter((y) => (y?.f && y?.f?.trim() !== "") || (y?.l && y?.l?.trim() !== ""));
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && values.sr === "" && (values.Residence.name === "" || values.Residence.name?.trim() === "" || values.Residence.name === undefined) && !relations.length) {
      error.invalid = "Invalid";
    } else {
      error = {};
    }
    return error;
  };
  const { race, dropdownLoading } = useSelector((state) => {
    return state.usCensus1810;
  });
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResidencePlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let rel = valuesData.rs.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUSCensus1810(formValue, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("r.l.s", "0");
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      if (values?.Residence?.id) {
        const loc = Object.keys(values.Residence.levelData.residenceLevel);
        setFieldValue("r.li.s", loc[0]);
      }
    } else {
      setFieldValue("matchExact", false);
      !values?.Residence?.name && setFieldValue("r.l.s", "1");
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
    }
  };

  const defaultUSFederal1810Search = typeSearchDefaultUSFederal1800();
  const USFederal1810MatchField = (setFieldValue, values) => {
    let USFederal1810html = null;
    USFederal1810html = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="matchExact" type="checkbox" onChange={(e) => handleMatchCheckbox(e, setFieldValue, values)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return USFederal1810html;
  };


  const get1810LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1810 = res.data;
      setBestResidence(LifeEventsData1810 , nearestResidenceDate , setFieldValue , "r" , "Residence",false)
    });
  };

  return (
    <>
      <Formik initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ setFieldValue, setSubmitting, handleChange, values, dirty, isValid, isSubmitting }) => (
          <>
            {USCClear
              ? headerContent({
                t,
                title,
                buttonTitle,
                dirty,
                isSubmitting,
                isValid,
                values,
                setSubmitting,
                handleSubmit,
              })
              : null}
            <Form className="w-full">
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-1810-field">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field
                      name={`fm.t`}
                      component={SearchPeople}
                      freeSolo={true}
                      placeholder=" "
                      selectPeople={(val) => {
                        if (val?.givenName) {
                          setFieldValue("Residence.id", "");
                          setFieldValue("Residence.name", "");
                          setFieldValue("ln.t", val?.surname || "");
                          get1810LifeEvents(val, setFieldValue);
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultUSFederal1810Search, t)}</div>
              </div>
              <div className="flex flex-wrap md:mb-2.5 -mx-2">
                <div className={`w-full ${width} mb-2.5 px-2`}>{locationField("Residence", "r", "Residence", values, setFieldValue)}</div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}</div>
              </div>
              <div className="advance-search-wrap mb-5 pt-4">{relationshipSearch && relationShipField("rs", t)}</div>
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {USFederal1810MatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, USCClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
