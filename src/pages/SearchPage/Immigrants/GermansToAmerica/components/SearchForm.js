import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { typeSearchDefaultGermanToAmerica, DateDropdownValues, toDoubleDigitNumber, sortArray } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Translator from "../../../../../components/Translator";
import { checkBirthPlace, checkResPlace, checkIDestPlace, checkPDepartPlace } from "../../../utils/common";
import DateField from "../../../../../components/DateComponent";
import { headerContent, submitAndClearButtons, getFirstNameDropDown } from "../../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { immigrationFields } from "../../../../../utils/formFields/immigrationForm";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
const SearchForm = ({ title, width = "", defaultValues, germanClear, buttonTitle, handleSubmitGermanToAmerica, nearestResidenceDate, inputWidth = "" }) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.PDepart.name === "" || values.PDepart.name?.trim() === "" || values.PDepart.name === undefined) && (values.Res.name === "" || values.Res.name?.trim() === "" || values.Res.name === undefined) && (values.IDest.name === "" || values.IDest.name?.trim() === "" || values.IDest.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && values.ad.y === "" && values.b.y.y === "" && values.g === "" && values.s === "" && values.o === "") {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();
  const { gender, occupation, dropdownLoading } = useSelector((state) => {
    return state.germanToAmerica;
  });
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResPlace(valuesData);
    checkBirthPlace(valuesData);
    checkPDepartPlace(valuesData);
    checkIDestPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitGermanToAmerica(valuesData, { setSubmitting });
  };

  const handleLocationField = (setFieldValue, values) => {
    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("pr.li.s", loc[0]);
    }
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.PDepart.id) {
      const loc = Object.keys(values.PDepart.levelData.residenceLevel);
      setFieldValue("d.li.s", loc[0]);
    }
    if (values.IDest.id) {
      const loc = Object.keys(values.IDest.levelData.residenceLevel);
      setFieldValue("id.li.s", loc[0]);
    }
  };
  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("pr.l.s", "0");
      setFieldValue("b.l.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("d.l.s", "0");
      setFieldValue("id.l.s", "0");
      setFieldValue(`ad.s`, Object.keys(DateDropdownValues(values.ad.y, values.ad.m, values.ad.d))[0]);
      handleLocationField(setFieldValue, values);
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.Res?.name && setFieldValue("pr.l.s", "1");
      !values?.BirthPlace?.name && setFieldValue("b.l.s", "4");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.PDepart?.name && setFieldValue("d.l.s", "1");
      !values?.IDest?.name && setFieldValue("id.l.s", "1");
      !values?.ad?.y && setFieldValue(`ad.s`, "8");
    }
  };
  const defaultTypeGermanSearch = typeSearchDefaultGermanToAmerica();
  const germanmatchField = (setFieldValue, values) => {
    let germanhtml = null;
    germanhtml = (
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
    return germanhtml;
  };
  const handleShip = (e, handleChange) => {
    handleChange(e);
  };
  const resetGermanField = (setFieldValue) => {
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("b.l.l", "");
    setFieldValue("b.y.y", "");
    setFieldValue("Res.id", "");
    setFieldValue("Res.name", "");
    setFieldValue("pr.l.l", "");
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
  const setGermanFormValue = (germanLifeEvents, setFieldValue) => {

    const prevResidence = germanLifeEvents?.filter(data => (data.type === "Residence" || data.type === "Birth") && data?.date?.Date.YearValue <= nearestResidenceDate.yearValue)?.map((data) => {
      return data
    });

    const beforeYearData = prevResidence.map((data) => {
      return data?.date?.Date.YearValue
    })

    const closestDates = sortArray(beforeYearData);
    prevResidence && prevResidence.map((data) => {
      if (closestDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("Res.id", data.location.LocationId);
        setFieldValue("Res.name", data.location.Location);
        setFieldValue("pr.l.l", data.location.Location);
        setFieldValue("pr.li.s", "4");
        setFieldValue("pr.l.s", "1");
      }
    })

    const arrival = germanLifeEvents?.find((data) => {
      return data.type === "Arrival";
    }),
      immigration = germanLifeEvents?.find((data) => {
        return data.type === "Immigration";
      }),
      departure = germanLifeEvents?.find((data) => {
        return data.type === "Departure";
      });
    if (arrival) {
      setFieldValue("ad.d", arrival.date.Date?.DayValue || "");
      setFieldValue("ad.m", toDoubleDigitNumber(arrival.date.Date?.MonthValue));
      setFieldValue("ad.y", arrival.date.Date?.YearValue || "");
    }
    if (immigration) {
      setFieldValue("PDepart.id", immigration.location.LocationId);
      setFieldValue("PDepart.name", immigration.location.Location);
      setFieldValue("d.l.l", immigration.location.Location);
      setFieldValue("d.li.s", "4");
      setFieldValue("d.l.s", "1");
    }
    if (departure) {
      setFieldValue("IDest.id", departure.location.LocationId);
      setFieldValue("IDest.name", departure.location.Location);
      setFieldValue("id.l.l", departure.location.Location);
      setFieldValue("id.li.s", "4");
      setFieldValue("id.l.s", "1");
    }

  };
  const getGermanLifeEvents = async (val, setFieldValue) => {
    if (!val?.givenName) {
      return;
    }
    resetGermanField(setFieldValue);
    setFieldValue("ln.t", val?.surname || "");
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const germanLifeEvents = res.data;
      germanLifeEvents?.map((data) => {
        if (data.type === "Birth") {
          setFieldValue("BirthPlace.id", data.location.LocationId);
          setFieldValue("BirthPlace.name", data.location.Location || '');
          setFieldValue("b.l.l", data.location.Location);
          setFieldValue("b.y.y", data.date.Date?.YearValue || "");
          setFieldValue("b.y.s", "8");
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
        }
      });
      setGermanFormValue(germanLifeEvents, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} onSubmit={handleSubmit} validate={formValidate}>
        {({ setSubmitting, setFieldValue, handleChange, dirty, isSubmitting, isValid, values }) => (
          <>
            {germanClear
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
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-input-field">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field name={`fm.t`} component={SearchPeople} placeholder=" " freeSolo={true} selectPeople={(val) => getGermanLifeEvents(val, setFieldValue)} getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name} id={`locations-filter-${uuidv4()}`} />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeGermanSearch, t)} </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>{locationField("Previous Residence", "pr", "Res", values, setFieldValue)}</div>
              </div>
              <DateField setFieldValue={setFieldValue} values={values} dayValue={values.ad.d} monthValue={values.ad.m} yearValue={values.ad.y} name="ad" label="Arrival Date" />
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>{yearField("Birth Year", "b.y", values, setFieldValue, defaultTypeGermanSearch)}</div>
              </div>

              {immigrationFields(values, setFieldValue, gender, dropdownLoading, t)}

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-german-ship-name">
                    Ship
                  </label>
                  <Field name="s" maxLength="35" id="grid-german-ship" type="text" className={`appearance-none block w-full h-10 text-gray-7 border border-gray-3 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent ${inputWidth}`} onChange={(e) => handleShip(e, handleChange)} />
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}</div>
              </div>

              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {germanmatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, germanClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
