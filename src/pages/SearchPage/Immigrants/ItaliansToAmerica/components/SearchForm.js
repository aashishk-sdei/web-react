import React from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { tr } from "../../../../../components/utils";
import Translator from "../../../../../components/Translator";
import DateField from "../../../../../components/DateComponent";
import { checkBirthPlace, checkResPlace, checkIDestPlace, checkPDepartPlace } from "../../../utils/common";
import { typeSearchDefaultItaliansToAmerica, DateDropdownValues, toDoubleDigitNumber, sortArray } from "../../../../../utils";
import { headerContent, submitAndClearButtons, getFirstNameDropDown } from "../../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { immigrationFields } from "../../../../../utils/formFields/immigrationForm";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
const SearchForm = ({ title, width = "", defaultValues, italianClear, buttonTitle, handleSubmitForm, nearestResidenceDate, inputWidth = "" }) => {
  const { t } = useTranslation();

  const { gender, occupation, dropdownLoading } = useSelector((state) => {
    return state.italiansToAmerica;
  });
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.PDepart.name === "" || values.PDepart.name?.trim() === "" || values.PDepart.name === undefined) && (values.IDest.name === "" || values.IDest.name?.trim() === "" || values.IDest.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && (values.Res.name === "" || values.Res.name?.trim() === "" || values.Res.name === undefined) && values.ad.y === "" && values.b.y.y === "" && values.g === "" && values.o === "" && values.s === "") {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkPDepartPlace(valuesData);
    checkIDestPlace(valuesData);
    checkResPlace(valuesData);
    checkBirthPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitForm(valuesData, { setSubmitting });
  };
  const handleLocationField = (setFieldValue, values) => {
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.PDepart.id) {
      const loc = Object.keys(values.PDepart.levelData.residenceLevel);
      setFieldValue("d.li.s", loc[0]);
    }
    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("pr.li.s", loc[0]);
    }
    if (values.IDest.id) {
      const loc = Object.keys(values.IDest.levelData.residenceLevel);
      setFieldValue("id.li.s", loc[0]);
    }
  };
  const handleMatchCheckbox = (e, values, setFieldValue) => {
    if (e.target.checked) {
      setFieldValue("ln.s", "0");
      setFieldValue("fm.s", "0");
      setFieldValue("pr.l.s", "0");
      setFieldValue("b.l.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("id.l.s", "0");
      setFieldValue("d.l.s", "0");
      setFieldValue("matchExact", true);
      setFieldValue(`ad.s`, Object.keys(DateDropdownValues(values.ad.y, values.ad.m, values.ad.d))[0]);
      handleLocationField(setFieldValue, values);
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.BirthPlace?.name && setFieldValue("b.l.s", "4");
      !values?.Res?.name && setFieldValue("pr.l.s", "1");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.IDest?.name && setFieldValue("id.l.s", "1");
      !values?.PDepart?.name && setFieldValue("d.l.s", "1");
      !values?.ad?.y && setFieldValue(`ad.s`, "8");
    }
  };
  const defaultTypeItaliansSearch = typeSearchDefaultItaliansToAmerica();
  const italianMatchField = (setFieldValue, values) => {
    let formHtml = null;
    formHtml = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="matchExact" type="checkbox" onChange={(e) => handleMatchCheckbox(e, values, setFieldValue)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg" />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return formHtml;
  };
  const resetItalianField = (setFieldValue) => {
    setFieldValue("Res.id", "");
    setFieldValue("Res.name", "");
    setFieldValue("pr.l.l", "");
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("b.l.l", "");
    setFieldValue("b.y.y", "");
    setFieldValue("ad.y", "");
    setFieldValue("ad.m", "");
    setFieldValue("ad.d", "");
    setFieldValue("PDepart.id", "");
    setFieldValue("PDepart.name", "");
    setFieldValue("d.l.l", "");
    setFieldValue("IDest.id", "");
    setFieldValue("IDest.name", "");
    setFieldValue("id.l.l", "");
  };
  const setItalianFormValue = (italianLifeEvents, setFieldValue) => {
    const preResidence = italianLifeEvents?.filter(data => (data.type === "Residence" || data.type === "Birth") && data?.date?.Date.YearValue <= nearestResidenceDate.yearValue)?.map((data) => {
      return data
    });

    const beforeYearsData = preResidence.map((data) => {
      return data?.date?.Date.YearValue
    })

    const closestDates = sortArray(beforeYearsData);
    preResidence && preResidence.map((data) => {
      if (closestDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("Res.id", data.location.LocationId);
        setFieldValue("Res.name", data.location.Location);
        setFieldValue("pr.l.l", data.location.Location);
        setFieldValue("pr.li.s", "4");
        setFieldValue("pr.l.s", "1");
      }
    })

    const immigration = italianLifeEvents?.find((data) => {
      return data.type === "Immigration";
    }),
      arrivalEvent = italianLifeEvents?.find((data) => {
        return data.type === "Arrival";
      }),
      departureEvent = italianLifeEvents?.find((data) => {
        return data.type === "Departure";
      });
    if (arrivalEvent) {
      setFieldValue("ad.d", arrivalEvent.date.Date?.DayValue || "");
      setFieldValue("ad.m", toDoubleDigitNumber(arrivalEvent.date.Date?.MonthValue));
      setFieldValue("ad.y", arrivalEvent.date.Date?.YearValue || "");
    }
    if (immigration) {
      setFieldValue("PDepart.id", immigration.location.LocationId);
      setFieldValue("PDepart.name", immigration.location.Location);
      setFieldValue("d.l.l", immigration.location.Location);
      setFieldValue("d.l.s", "1");
      setFieldValue("d.li.s", "4");
    }
    if (departureEvent) {
      setFieldValue("IDest.id", departureEvent.location.LocationId);
      setFieldValue("IDest.name", departureEvent.location.Location);
      setFieldValue("id.l.l", departureEvent.location.Location);
      setFieldValue("id.l.s", "1");
      setFieldValue("id.li.s", "4");
    }
  };
  const getItalianLifeEvents = async (val, setFieldValue) => {
    if (!val?.givenName) {
      return;
    }
    resetItalianField(setFieldValue);
    setFieldValue("ln.t", val?.surname || "");
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const italianLifeEvents = res.data;
      italianLifeEvents?.map((data) => {
        if (data.type === "Birth") {
          setFieldValue("b.y.s", "8");
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
          setFieldValue("BirthPlace.id", data.location.LocationId);
          setFieldValue("BirthPlace.name", data.location.Location || '');
          setFieldValue("b.l.l", data.location.Location);
          setFieldValue("b.y.y", data.date.Date?.YearValue || "");
        }
      });
      setItalianFormValue(italianLifeEvents, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} onSubmit={handleSubmit} validate={formValidate}>
        {({ setSubmitting, setFieldValue, handleChange, dirty, isSubmitting, isValid, values }) => (
          <>
            {italianClear
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
                    <Field id={`locations-filter-${uuidv4()}`} name={`fm.t`} placeholder=" " component={SearchPeople} selectPeople={(val) => getItalianLifeEvents(val, setFieldValue)} getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name} freeSolo={true} />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeItaliansSearch, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>{locationField("Previous Residence", "pr", "Res", values, setFieldValue)}</div>
              </div>
              <DateField name="ad" yearValue={values.ad.y} monthValue={values.ad.m} dayValue={values.ad.d} label="Arrival Date" values={values} setFieldValue={setFieldValue} />
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>{yearField("Birth Year", "b.y", values, setFieldValue, defaultTypeItaliansSearch)}</div>
              </div>

              {immigrationFields(values, setFieldValue, gender, dropdownLoading, t)}
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-italian-ship-name">
                    Ship
                  </label>
                  <Field name="s" maxLength="35" id="grid-italian-ship" type="text" className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent ${inputWidth}`} onChange={(e) => handleChange(e)} />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}</div>
              </div>
              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {italianMatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, italianClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
