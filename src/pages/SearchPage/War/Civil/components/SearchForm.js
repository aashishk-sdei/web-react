import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { sortArray, typeSearchDefaulCivilWar } from "../../../../../utils";
import { getFirstNameDropDown, headerContent } from "../../../../../utils/search";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { checkTourPlace } from "../../../utils/common";
import { useTranslation } from "react-i18next";
import { dropDownField, inputField, locationField } from "../../../../../utils/formFields";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
const handleMatchCheckbox = (e, form) => {
  if (e.target.checked) {
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
    if (form.values.TourPlace.id) {
      form.setFieldValue("t.li.s", Object.keys(form.values.TourPlace.levelData.residenceLevel)[0]);
    }
    form.setFieldValue("matchExact", true);
  } else {
    form.setFieldValue("matchExact", false);
    !form.values?.fm.t && form.setFieldValue("fm.s", "2");
    !form.values?.ln.t && form.setFieldValue("ln.s", "2");
    !form.values?.TourPlace?.name && form.setFieldValue("t.l.s", "1");
  }
};
const SearchForm = ({ title, width = "", defaultValues, clear, buttonTitle, handleSubmitCivilWar, nearestResidenceDate }) => {
  const { t } = useTranslation();
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.TourPlace.name === "" || values.TourPlace.name?.trim() === "" || values.TourPlace.name === undefined) && values.a === "" && values.gr === "" && values.er === "" && values.u === "") {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { allegiance, miltaryRank, miltaryEnlistment, dropdownLoading } = useSelector((state) => {
    return state.civilWar;
  });
  const defaultTypeCensusSearch = typeSearchDefaulCivilWar();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkTourPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let formValue = { ...valuesData };
    handleSubmitCivilWar(formValue, { setSubmitting });
  };
  const matchInputField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="w-full flex items-center mb-4 sm:mb-0 pr-2 sm:w-auto pt-2.5 sm:py-0 pb-3.5 ">
        <div className="flex items-center h-5">
          <Field name="matchExact" type="checkbox" id="matchExact" onChange={(e) => handleMatchCheckbox(e, { setFieldValue, values })} className="h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg focus:ring-indigo-500" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label className="font-medium text-gray-7" htmlFor="matchExact">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return html;
  };
  const getSingleBeforeConditions = (beforeYearData, afterYearData, setFieldValue, data) => {
    if (beforeYearData.length === 1) {
      if (afterYearData.length === 0) {
        setFieldValue("t.l.s", "1");
        setFieldValue("t.li.s", "4");
        setFieldValue("TourPlace.id", data.location.LocationId);
        setFieldValue("TourPlace.name", data.location.Location);
        setFieldValue("t.l.l", data.location.Location);
      }
    }
  };
  const getBeforeConditions = (beforeYearData, afterYearData, data, setFieldValue) => {
    getSingleBeforeConditions(beforeYearData, afterYearData, setFieldValue, data);
    if (beforeYearData.length > 1) {
      const earliestDates = sortArray(beforeYearData);
      if (afterYearData.length > 0)
        if (earliestDates[0] === data?.date?.Date?.YearValue) {
          setFieldValue("t.l.s", "1");
          setFieldValue("t.li.s", "4");
          setFieldValue("t.l.l", data.location.Location);
          setFieldValue("TourPlace.id", data.location.LocationId);
          setFieldValue("TourPlace.name", data.location.Location);
        }
    }
  };
  const getAfterConditions = (data, afterYearData, setFieldValue) => {
    if (afterYearData.length === 1) {
      setFieldValue("t.li.s", "4");
      setFieldValue("t.l.l", data.location.Location);
      setFieldValue("TourPlace.id", data.location.LocationId);
      setFieldValue("TourPlace.name", data.location.Location);
      setFieldValue("t.l.s", "1");
    }
    if (afterYearData.length > 1) {
      const afterDates = sortArray(afterYearData, true);
      if (afterDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("t.li.s", "4");
        setFieldValue("t.l.s", "1");
        setFieldValue("TourPlace.name", data.location.Location);
        setFieldValue("TourPlace.id", data.location.LocationId);
        setFieldValue("t.l.l", data.location.Location);
      }
    }
  };
  const getSingleYearResidenceConditions = (tourResidenceData, setFieldValue) => {
    if (tourResidenceData.length === 1) {
      tourResidenceData?.forEach((data) => {
        setFieldValue("TourPlace.id", data.location.LocationId);
        setFieldValue("t.l.l", data.location.Location);
        setFieldValue("t.l.s", "1");
        setFieldValue("t.li.s", "4");
        setFieldValue("TourPlace.name", data.location.Location);
      });
    }
  };
  const getMultipleYearResidenceConditions = (tourResidenceData, setFieldValue) => {
    if (tourResidenceData.length > 1) {
      const beforeYearData = tourResidenceData
        ?.filter((ldata) => ldata?.date?.Date.YearValue < nearestResidenceDate.yearValue)
        ?.map((ldata) => {
          return ldata?.date?.Date.YearValue;
        });
      const afterYearData = tourResidenceData
        ?.filter((hdata) => hdata?.date?.Date.YearValue >= nearestResidenceDate.yearValue)
        ?.map((hdata) => {
          return hdata?.date?.Date.YearValue;
        });
      tourResidenceData?.forEach((data) => {
        if (data?.date?.Date.YearValue < nearestResidenceDate.yearValue) {
          getBeforeConditions(beforeYearData, afterYearData, data, setFieldValue);
        } else {
          getAfterConditions(data, afterYearData, setFieldValue);
        }
      });
    }
  };
  const getCivilWarLifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsCivilWar = res.data;
      const Residence = LifeEventsCivilWar?.filter((data) => data.type === "Residence" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const tourResidenceData = [...Residence];
      getSingleYearResidenceConditions(tourResidenceData, setFieldValue);
      getMultipleYearResidenceConditions(tourResidenceData, setFieldValue);
    });
  };
  const SetEmptyFieldsCivilWar = (setFieldValue) => {
    setFieldValue("TourPlace.id", "");
    setFieldValue("TourPlace.name", "");
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ values, isSubmitting, dirty, isValid, setSubmitting, setFieldValue, handleChange }) => (
          <>
            {clear
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
              <div className="flex-wrap flex -mx-2 md:mb-2.5">
                <div className={`w-full px-2 mb-2.5 ${width}`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-civilwar-field">
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
                          SetEmptyFieldsCivilWar(setFieldValue);
                          setFieldValue("ln.t", val?.surname || "");
                          getCivilWarLifeEvents(val, setFieldValue);
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeCensusSearch, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Allegiance", "a", values, allegiance, dropdownLoading, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Military Enlistment Rank", "er", values, miltaryEnlistment, dropdownLoading, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Military Rank", "gr", values, miltaryRank, dropdownLoading, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-civilwar-unit-name">
                    Unit
                  </label>
                  <Field name="u" id="grid-civilwar-unit" type="text" className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent`} onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Military Service Location", "t", "TourPlace", values, setFieldValue)}</div>
              </div>
              <div className="pt-4 mb-2 sm:flex justify-between w-full md:pt-7">
                {matchInputField(setFieldValue, values)}
                <div className="buttons sm:flex sm:ml-auto">
                  <button type="submit" disabled={!dirty || isSubmitting || !isValid} className="bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last disabled:opacity-50">
                    {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                  </button>
                  {clear ? (
                    <button type="reset" disabled={!dirty || isSubmitting} className="text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0 disabled:opacity-50">
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
