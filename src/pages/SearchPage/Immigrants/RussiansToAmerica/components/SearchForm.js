import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Translator from "../../../../../components/Translator";
import { typeSearchDefaultRussian, DateDropdownValues, toDoubleDigitNumber, sortArray } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { arrivalPlace, checkBirthPlace, departPlace, resPlace } from "../../../utils/common";
import DateField from "../../../../../components/DateComponent";
import { headerContent, submitAndClearButtons, getFirstNameDropDown } from "../../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";

const SearchForm = ({ title, width = "", defaultValues, russiaClear, buttonTitle, handleSubmitRussian, nearestResidenceDate, inputWidth = "" }) => {
  const { t } = useTranslation();

  const { dropdownLoading, gender, occupation } = useSelector((state) => state.russian);
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };

    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") &&
      (values.ln.t === "" || values.ln.t?.trim() === "") &&
      values.b.y.y === "" &&
      (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) &&
      values.a.y.y === "" &&
      (values.ArrivalPlace.name === "" || values.ArrivalPlace.name?.trim() === "" || values.ArrivalPlace.name === undefined) &&
      values.g === "" &&
      (values.Depart.name === "" || values.Depart.name?.trim() === "" || values.Depart.name === undefined) &&
      (values.Res.name === "" || values.Res.name?.trim() === "" || values.Res.name === undefined) &&
      values.s === "" && values.o === ""
    ) {
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
    checkBirthPlace(valuesData);
    arrivalPlace(valuesData);
    departPlace(valuesData);
    resPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitRussian(valuesData, { setSubmitting });
  };

  const defaultTypeSearch = typeSearchDefaultRussian();

  const handleShip = (e, handleChange) => {
    handleChange(e);
  };

  const handleLocationFields = (setFieldValue, values) => {
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.ArrivalPlace.id) {
      const loc = Object.keys(values.ArrivalPlace.levelData.residenceLevel);
      setFieldValue("a.li.s", loc[0]);
    }
    if (values.Depart.id) {
      const loc = Object.keys(values.Depart.levelData.residenceLevel);
      setFieldValue("d.li.s", loc[0]);
    }
    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("r.li.s", loc[0]);
    }
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("b.l.s", "0");
      setFieldValue(`a.y.s`, Object.keys(DateDropdownValues(values.a.y.y, values.a.y.m, values.a.y.d))[0]);
      setFieldValue("a.l.s", "0");
      setFieldValue("d.l.s", "0");
      setFieldValue("r.l.s", "0");
      handleLocationFields(setFieldValue, values);
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.BirthPlace?.name && setFieldValue("b.l.s", "1");
      !values?.a?.y?.y && setFieldValue(`a.y.s`, "8");
      !values?.ArrivalPlace?.name && setFieldValue("a.l.s", "1");
      !values?.Depart?.name && setFieldValue("d.l.s", "1");
      !values?.Res?.name && setFieldValue("r.l.s", "1");
    }
  };

  const getMatchCheckField = (setFieldValue, values) => {
    let russianhtml = null;
    russianhtml = (
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
    return russianhtml;
  };
  const resetRussianField = (setFieldValue) => {
    setFieldValue("Res.id", "");
    setFieldValue("Res.name", "");
    setFieldValue("pr.l.l", "");
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("b.l.l", "");
    setFieldValue("b.y.y", "");
    setFieldValue("a.l.l", "");
    setFieldValue("ArrivalPlace.id", "");
    setFieldValue("ArrivalPlace.name", "");
    setFieldValue("a.y.y", "");
    setFieldValue("a.y.m", "");
    setFieldValue("a.y.d", "");
    setFieldValue("Depart.id", "");
    setFieldValue("Depart.name", "");
    setFieldValue("d.l.l", "");
  };
  const setRussianFormValue = (russianLifeEvents, setFieldValue) => {
    const pResidence = russianLifeEvents?.filter(data => (data.type === "Residence" || data.type === "Birth") && data?.date?.Date.YearValue <= nearestResidenceDate.yearValue)?.map((data) => {
      return data
    });

    const beforeYearsData = pResidence.map((data) => {
      return data?.date?.Date.YearValue
    })

    const closestDates = sortArray(beforeYearsData);
    pResidence && pResidence.map((data) => {
      if (closestDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("Res.id", data.location.LocationId);
        setFieldValue("Res.name", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
      }
    })

    const immigration = russianLifeEvents?.find((data) => {
      return data.type === "Immigration";
    }),
      arrivalEvent = russianLifeEvents?.find((data) => {
        return data.type === "Arrival";
      });

    if (arrivalEvent) {
      setFieldValue("a.l.l", arrivalEvent.location.Location);
      setFieldValue("ArrivalPlace.id", arrivalEvent.location.LocationId);
      setFieldValue("ArrivalPlace.name", arrivalEvent.location.Location);
      setFieldValue("a.l.s", "1");
      setFieldValue("a.li.s", "4");
      setFieldValue("a.y.y", arrivalEvent.date.Date?.YearValue || "");
      setFieldValue("a.y.d", arrivalEvent.date.Date?.DayValue || "");
      setFieldValue("a.y.m", toDoubleDigitNumber(arrivalEvent.date.Date?.MonthValue));
    }
    if (immigration) {
      setFieldValue("Depart.id", immigration.location.LocationId);
      setFieldValue("Depart.name", immigration.location.Location);
      setFieldValue("d.l.l", immigration.location.Location);
      setFieldValue("d.li.s", "4");
      setFieldValue("d.l.s", "1");
    }
  };
  const getRussianLifeEvents = async (val, setFieldValue) => {
    if (!val?.givenName) {
      return;
    }
    resetRussianField(setFieldValue);
    setFieldValue("ln.t", val?.surname || "");
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const russianLifeEvents = res.data;
      russianLifeEvents?.map((data) => {
        if (data.type === "Birth") {
          setFieldValue("BirthPlace.id", data.location.LocationId);
          setFieldValue("BirthPlace.name", data.location.Location || '');
          setFieldValue("b.l.l", data.location.Location);
          setFieldValue("b.y.y", data.date.Date?.YearValue || "");
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
          setFieldValue("b.y.s", "8");
        }
      });
      setRussianFormValue(russianLifeEvents, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} onSubmit={handleSubmit} validate={formValidate}>
        {({ dirty, isSubmitting, isValid, setSubmitting, setFieldValue, handleChange, values }) => (
          <>
            {russiaClear
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
                    <Field name={`fm.t`} id={`locations-filter-${uuidv4()}`} placeholder=" " component={SearchPeople} selectPeople={(val) => getRussianLifeEvents(val, setFieldValue)} getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name} freeSolo={true} />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeSearch, t)}</div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>{yearField("Birth Year", "b.y", values, setFieldValue, defaultTypeSearch)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
              </div>

              <DateField name="a.y" yearValue={values.a.y.y} monthValue={values.a.y.m} dayValue={values.a.y.d} label="Arrival Date" values={values} setFieldValue={setFieldValue} />

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Arrival Place", "a", "ArrivalPlace", values, setFieldValue)}</div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Place of Departure", "d", "Depart", values, setFieldValue)}</div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Previous Residence", "r", "Res", values, setFieldValue)}</div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-german-ship-name">
                    Ship
                  </label>
                  <Field name="s" maxLength="35" id="grid-ship" type="text" className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent ${inputWidth}`} onChange={(e) => handleShip(e, handleChange)} />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}</div>
              </div>

              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {getMatchCheckField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, russiaClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default SearchForm;
