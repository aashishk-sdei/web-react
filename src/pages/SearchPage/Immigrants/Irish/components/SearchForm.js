import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { typeSearchDefaultIrish, DateDropdownValues, toDoubleDigitNumber, sortArray } from "../../../../../utils";
import { checkIDestPlace, checkBirthPlace, checkPDepartPlace, checkResPlace } from "../../../utils/common";
import IrishDateField from "../../../../../components/DateComponent";
import { headerContent, submitAndClearButtons, getFirstNameDropDown } from "../../../../../utils/search";
import { dropDownField, inputField, locationField } from "../../../../../utils/formFields";
import { immigrationFields } from "../../../../../utils/formFields/immigrationForm";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
const SearchForm = ({ title, width = "", defaultValues, IrishClear, buttonTitle, handleSubmitIrish, nearestResidenceDate }) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.Res.name === "" || values.Res.name?.trim() === "" || values.Res.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && values.ad.y === "" && values.g === "" && (values.PDepart.name === "" || values.PDepart.name?.trim() === "" || values.PDepart.name === undefined) && (values.IDest.name === "" || values.IDest.name?.trim() === "" || values.IDest.name === undefined) && values.o === "" && values.rh === "") {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();
  const { gender, occupation, relationToHead, dropdownLoading } = useSelector((state) => {
    return state.irish;
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResPlace(valuesData);
    checkBirthPlace(valuesData);
    checkIDestPlace(valuesData);
    checkPDepartPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitIrish(valuesData, { setSubmitting });
  };
  const setSearchFields = (setFieldValue, values) => {
    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("pr.li.s", loc[0]);
    }
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.IDest.id) {
      const loc = Object.keys(values.IDest.levelData.residenceLevel);
      setFieldValue("id.li.s", loc[0]);
    }
    if (values.PDepart.id) {
      const loc = Object.keys(values.PDepart.levelData.residenceLevel);
      setFieldValue("d.li.s", loc[0]);
    }
  };
  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("pr.l.s", "0");
      setFieldValue("b.l.s", "0");
      setFieldValue("id.l.s", "0");
      setFieldValue("d.l.s", "0");
      setFieldValue(`ad.s`, Object.keys(DateDropdownValues(values.ad.y, values.ad.m, values.ad.d))[0]);
      setSearchFields(setFieldValue, values);
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.Res?.name && setFieldValue("pr.l.s", "1");
      !values?.IDest?.name && setFieldValue("id.l.s", "1");
      !values?.PDepart?.name && setFieldValue("d.l.s", "1");
      !values?.BirthPlace?.name && setFieldValue("b.l.s", "1");
      !values?.ad?.y && setFieldValue(`ad.s`, "8");
    }
  };
  const defaultIrishSearch = typeSearchDefaultIrish();
  const irishmatchField = (setFieldValue, values) => {
    let irishhtml = null;
    irishhtml = (
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
    return irishhtml;
  };
  const resetIrishField = (setFieldValue) => {
    setFieldValue("Res.id", "");
    setFieldValue("Res.name", "");
    setFieldValue("pr.l.l", "");
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("b.l.l", "");
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
  const setIrishFormValue = (irishLifeEvents, setFieldValue) => {
    const prResidence = irishLifeEvents
      ?.filter((data) => (data.type === "Residence" || data.type === "Birth") && data?.date?.Date.YearValue <= nearestResidenceDate.yearValue)
      ?.map((data) => {
        return data;
      });

    const beforeYearsData = prResidence.map((data) => {
      return data?.date?.Date.YearValue;
    });

    const closestDates = sortArray(beforeYearsData);
    prResidence &&
      prResidence.map((data) => {
        if (closestDates[0] === data?.date?.Date?.YearValue) {
          setFieldValue("Res.id", data.location.LocationId);
          setFieldValue("Res.name", data.location.Location);
          setFieldValue("pr.l.l", data.location.Location);
          setFieldValue("pr.li.s", "4");
          setFieldValue("pr.l.s", "1");
        }
      });

    const arrival = irishLifeEvents?.find((data) => {
        return data.type === "Arrival";
      }),
      departure = irishLifeEvents?.find((data) => {
        return data.type === "Departure";
      }),
      immigration = irishLifeEvents?.find((data) => {
        return data.type === "Immigration";
      });
    if (arrival) {
      setFieldValue("ad.d", arrival.date.Date?.DayValue || "");
      setFieldValue("ad.y", arrival.date.Date?.YearValue || "");
      setFieldValue("ad.m", toDoubleDigitNumber(arrival.date.Date?.MonthValue));
    }
    if (departure) {
      setFieldValue("IDest.id", departure.location.LocationId);
      setFieldValue("IDest.name", departure.location.Location);
      setFieldValue("id.l.l", departure.location.Location);
      setFieldValue("id.l.s", "1");
      setFieldValue("id.li.s", "4");
    }
    if (immigration) {
      setFieldValue("PDepart.id", immigration.location.LocationId);
      setFieldValue("PDepart.name", immigration.location.Location);
      setFieldValue("d.l.l", immigration.location.Location);
      setFieldValue("d.l.s", "1");
      setFieldValue("d.li.s", "4");
    }
  };
  const getIrishLifeEvents = async (val, setFieldValue) => {
    if (!val?.givenName) {
      return;
    }
    resetIrishField(setFieldValue);
    setFieldValue("ln.t", val?.surname || "");
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const irishLifeEvents = res.data;
      irishLifeEvents?.map((data) => {
        if (data.type === "Birth") {
          setFieldValue("BirthPlace.id", data.location.LocationId);
          setFieldValue("BirthPlace.name", data.location.Location || "");
          setFieldValue("b.l.l", data.location.Location);
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
        }
      });
      setIrishFormValue(irishLifeEvents, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} onSubmit={handleSubmit} initialValues={defaultValues} validate={formValidate}>
        {({ dirty, isSubmitting, isValid, setSubmitting, setFieldValue, handleChange, values }) => (
          <>
            {IrishClear
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
              <div className="flex flex-wrap md:mb-2.5 -mx-2">
                <div className={`w-full ${width} mb-2.5 px-2`}>
                  <label htmlFor="grid-input-field" className="text-gray-6 block text-sm mb-1">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field id={`locations-filter-${uuidv4()}`} name={`fm.t`} component={SearchPeople} placeholder=" " freeSolo={true} selectPeople={(val) => getIrishLifeEvents(val, setFieldValue)} getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name} />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultIrishSearch, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>{locationField("Previous Residence", "pr", "Res", values, setFieldValue)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
              </div>
              <IrishDateField name="ad" yearValue={values.ad.y} monthValue={values.ad.m} dayValue={values.ad.d} label="Arrival Date" values={values} setFieldValue={setFieldValue} />
              {immigrationFields(values, setFieldValue, gender, dropdownLoading, t, width)}
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Relation to Head of House", "rh", values, relationToHead, dropdownLoading, t)}</div>
              </div>
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {irishmatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, IrishClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
