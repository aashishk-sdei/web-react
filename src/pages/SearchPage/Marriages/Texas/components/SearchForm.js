import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../.././../../../components/utils";
import { useTranslation } from "react-i18next";
import { DateDropdownValues, typeSearchDefaultTexasMarriages, toDoubleDigitNumber } from "../../../../../utils";
import DateField from "../../../../../components/DateComponent";
import { headerContent, getFirstNameDropDown } from "../../../../../utils/search";
import { checkMarriagePlace } from "../../../utils/common";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
const SearchForm = ({ title, width = "", defaultValues, TMClear, buttonTitle, handleSubmitTexasMarriages }) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") &&
      (values.ln.t === "" || values.ln.t?.trim() === "") &&
      values.b.y === "" &&
      values.g === "" &&
      values.s.fm.t === "" &&
      values.s.ln.t === "" &&
      values.m.y.y === "" &&
      (values.Marriage.name === "" || values.Marriage.name?.trim() === "" || values.Marriage.name === undefined)
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();
  const { gender, dropdownLoading } = useSelector((state) => {
    return state.texasMarriages;
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkMarriagePlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitTexasMarriages(valuesData, { setSubmitting });
  };
  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("b.s", "2");
      setFieldValue("s.fm.s", "0");
      setFieldValue("s.ln.s", "0");
      setFieldValue("m.l.s", "0");
      setFieldValue(`m.y.s`, Object.keys(DateDropdownValues(values.m.y.y, values.m.y.m, values.m.y.d))[0]);
      if (values?.Marriage?.id) {
        const loc = Object.keys(values.Marriage.levelData.residenceLevel);
        setFieldValue("m.li.s", loc[0]);
      }
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.b?.y && setFieldValue("b.s", "8");
      !values?.s?.fm?.t && setFieldValue("s.fm.s", "2");
      !values?.s?.ln?.t && setFieldValue("s.ln.s", "2");
      !values?.m?.y?.y && setFieldValue("m.y.s", "8");
      !values?.Marriage?.name && setFieldValue("m.l.s", "1");
    }
  };
  const defaultTexasMarriagesSearch = typeSearchDefaultTexasMarriages();
  const texasMarriagesMatchField = (setFieldValue, values) => {
    let texasMarriageshtml = null;
    texasMarriageshtml = (
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
    return texasMarriageshtml;
  };
  const getTaxesLifeEvents = async (val, setFieldValue) => {
    if (!val?.givenName) {
      return;
    }
    setFieldValue("Marriage.id", "");
    setFieldValue("Marriage.name", "");
    setFieldValue("m.y.y", "");
    setFieldValue("ln.t", val?.surname || "");
    setFieldValue("b.y", "");
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const lifeEventsData = res.data,
        Marriage = lifeEventsData?.find((data) => {
          return data.type === "Marriage";
        });
      lifeEventsData?.map((data) => {
        if (data.type === "Birth") {
          setFieldValue("b.y", data.date.Date?.YearValue || "");
          setFieldValue("b.s", "8");
        }
      });
      if (Marriage) {
        setFieldValue("Marriage.id", Marriage.location.LocationId);
        setFieldValue("Marriage.name", Marriage.location.Location);
        setFieldValue("m.l.l", Marriage.location.Location);
        setFieldValue("m.y.d", Marriage.date.Date?.DayValue || "");
        setFieldValue("m.y.y", Marriage.date.Date?.YearValue || "");
        setFieldValue("m.y.m", toDoubleDigitNumber(Marriage.date.Date?.MonthValue));
        setFieldValue("m.li.s", "4");
        setFieldValue("m.l.s", "1");
      }
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} onSubmit={handleSubmit} initialValues={defaultValues} validate={formValidate}>
        {({ isValid, dirty, isSubmitting, values, setFieldValue, setSubmitting, handleChange }) => (
          <>
            {TMClear
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
                  <label className="block text-gray-6 text-sm mb-1">{tr(t, "search.ww1.form.fmname")}</label>
                  <div className="relative">
                    <Field name={`fm.t`} id={`locations-filter-${uuidv4()}`} placeholder=" " component={SearchPeople} selectPeople={(val) => getTaxesLifeEvents(val, setFieldValue)} getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name} freeSolo={true} />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTexasMarriagesSearch, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>{yearField("Birth Year", "b", values, setFieldValue, defaultTexasMarriagesSearch)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField("Spouse First & Middle Name(s)", "s.fm", values, setFieldValue, handleChange, defaultTexasMarriagesSearch, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField("Spouse Last Name", "s.ln", values, setFieldValue, handleChange, defaultTexasMarriagesSearch, t)}</div>
              </div>
              <DateField name="m.y" yearValue={values.m.y.y} monthValue={values.m.y.m} dayValue={values.m.y.d} label="Marriage Date" values={values} setFieldValue={setFieldValue} />
              {locationField("Marriage Place", "m", "Marriage", values, setFieldValue)}
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {texasMarriagesMatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button className="disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                    {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                  </button>
                  {TMClear ? (
                    <button className="disabled:opacity-50 text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0" type="reset" disabled={!dirty || isSubmitting}>
                      {tr(t, "search.ww1.form.clear")}
                    </button>
                  ) : null}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
