import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { sortArray, typeSearchDefaulUsCensus1881 } from "../../../../../utils";
import { getFirstNameDropDown, headerContent } from "../../../../../utils/search";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { checkBirthPlace, checkRSPlace } from "../../../utils/common";
import { useTranslation } from "react-i18next";
import { dropDownField, inputField, locationField, relationShipField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
const handle1881MatchCheckInput = (e, formVal) => {
  if (e.target.checked) {
    formVal.setFieldValue("fm.s", "0");
    formVal.setFieldValue("ln.s", "0");
    formVal.setFieldValue("b.l.s", "0");
    formVal.setFieldValue("r.l.s", "0");
    if (formVal.values.RSPlace.id) {
      formVal.setFieldValue("r.li.s", Object.keys(formVal.values.RSPlace.levelData.residenceLevel)[0]);
    }
    if (formVal.values.BirthPlace.id) {
      formVal.setFieldValue("b.li.s", Object.keys(formVal.values.BirthPlace.levelData.residenceLevel)[0]);
    }
    formVal.setFieldValue("matchExact", true);
  } else {
    formVal.setFieldValue("matchExact", false);
    !formVal.values?.fm.t && formVal.setFieldValue("fm.s", "2");
    !formVal.values?.ln.t && formVal.setFieldValue("ln.s", "2");
    !formVal.values?.RSPlace?.name && formVal.setFieldValue("r.l.s", "1");
    !formVal.values?.BirthPlace?.name && formVal.setFieldValue("b.l.s", "1");
  }
};
const SearchForm = ({ title, relationshipSearch, defaultValues, clear, buttonTitle, handleSubmitUsCensus1881, nearestResidenceDate, width = "" }) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    let relations = values.rs?.filter((y) => (y?.f && y?.f?.trim() !== "") || (y?.l && y?.l?.trim() !== ""));
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.RSPlace.name === "" || values.RSPlace.name?.trim() === "" || values.RSPlace.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && values.g === "" && values.ms === "" && values.rh === "" && !relations.length) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { gender, maritalStatus, relationship, dropdownLoading } = useSelector((state) => {
    return state.usCensus1881;
  });
  const { t } = useTranslation();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkBirthPlace(valuesData);
    checkRSPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let rel = valuesData.rs.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUsCensus1881(formValue, { setSubmitting });
  };

  const defaultTypeCensusSearch = typeSearchDefaulUsCensus1881();
  const matchInputField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="w-full flex items-center mb-4 sm:mb-0 pr-2 sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="1881MatchExact" type="checkbox" onChange={(e) => handle1881MatchCheckInput(e, { setFieldValue, values })} className="h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg focus:ring-indigo-500" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label className="font-medium text-gray-7" htmlFor="1881MatchExact">
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
        setFieldValue("r.l.s", "1");
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.li.s", "4");
      }
    }
  };
  const getBeforeConditions = (beforeYearData, afterYearData, formvalue, setFieldValue) => {
    getSingleBeforeConditions(beforeYearData, afterYearData, setFieldValue, formvalue);
    if (beforeYearData.length > 1) {
      const earliestDates = sortArray(beforeYearData);
      if (afterYearData.length > 0)
        if (earliestDates[0] === formvalue?.date?.Date?.YearValue) {
          setFieldValue("RSPlace.id", formvalue.location.LocationId);
          setFieldValue("RSPlace.name", formvalue.location.Location);
          setFieldValue("r.l.l", formvalue.location.Location);
          setFieldValue("r.l.s", "1");
          setFieldValue("r.li.s", "4");
        }
    }
  };
  const getAfterConditions = (afterYearData, formvalue, setFieldValue) => {
    if (afterYearData.length === 1) {
      setFieldValue("r.l.s", "1");
      setFieldValue("r.li.s", "4");
      setFieldValue("r.l.l", formvalue.location.Location);
      setFieldValue("RSPlace.id", formvalue.location.LocationId);
      setFieldValue("RSPlace.name", formvalue.location.Location);
    }
    if (afterYearData.length > 1) {
      const afterDates = sortArray(afterYearData, true);
      if (afterDates[0] === formvalue?.date?.Date?.YearValue) {
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
        setFieldValue("r.l.l", formvalue.location.Location);
        setFieldValue("RSPlace.id", formvalue.location.LocationId);
        setFieldValue("RSPlace.name", formvalue.location.Location);
      }
    }
  };
  const getSingleYearResidenceConditions = (resData, setFieldValue) => {
    if (resData.length === 1) {
      resData?.forEach((item) => {
        setFieldValue("RSPlace.id", item.location.LocationId);
        setFieldValue("RSPlace.name", item.location.Location);
        setFieldValue("r.l.l", item.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
      });
    }
  };
  const getMultipleYearResidenceConditions = (resData, setFieldValue) => {
    if (resData.length > 1) {
      const beforeYearData = resData
        ?.filter((y) => y?.date?.Date.YearValue < nearestResidenceDate.yearValue)
        ?.map((item) => {
          return item?.date?.Date.YearValue;
        });
      const afterYearData = resData
        ?.filter((item) => item?.date?.Date.YearValue >= nearestResidenceDate.yearValue)
        ?.map((item) => {
          return item?.date?.Date.YearValue;
        });
      resData?.forEach((data) => {
        if (data?.date?.Date.YearValue < nearestResidenceDate.yearValue) {
          getBeforeConditions(beforeYearData, afterYearData, data, setFieldValue);
        } else {
          getAfterConditions(afterYearData, data, setFieldValue);
        }
      });
    }
  };
  const get1881LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1881 = res.data;
      LifeEventsData1881?.map((Data1881) => {
        if (Data1881.type === "Birth") {
          setFieldValue("BirthPlace.id", Data1881.location.LocationId);
          setFieldValue("BirthPlace.name", Data1881.location.Location || "");
          setFieldValue("b.l.l", Data1881.location.Location);
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
          setFieldValue("b.y.y", Data1881.date.Date?.YearValue);
        }
      });
      const Birth = LifeEventsData1881?.filter((data) => data.type === "Birth" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const Residence = LifeEventsData1881?.filter((data) => data.type === "Residence" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const resData = [...Birth, ...Residence];
      getSingleYearResidenceConditions(resData, setFieldValue);
      getMultipleYearResidenceConditions(resData, setFieldValue);
    });
  };
  const SetEmptyFields1881 = (setFieldValue) => {
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("RSPlace.id", "");
    setFieldValue("RSPlace.name", "");
  };
  const get1881Parents = (data, idx, setFieldValue) => {
    if (data.relation === "parent" && data.gender === "M") {
      setFieldValue(`rs[${idx}].f`, data.givenName);
      setFieldValue(`rs[${idx}].l`, data.surname);
      setFieldValue(`rs[${idx}].r`, "Father");
    }

    if (data.relation === "parent" && data.gender === "F") {
      setFieldValue(`rs[${idx}].f`, data.givenName);
      setFieldValue(`rs[${idx}].l`, data.surname);
      setFieldValue(`rs[${idx}].r`, "Mother");
    }
  };
  const getFamilyRelationships = (family, setFieldValue) => {
    if (family) {
      family.map((data, idx) => {
        get1881Parents(data, idx, setFieldValue);

        if (data.relation === "partner") {
          setFieldValue(`rs[${idx}].l`, data.surname);
          setFieldValue(`rs[${idx}].f`, data.givenName);
          setFieldValue(`rs[${idx}].r`, "Spouse");
        }
        if (data.relation === "child") {
          setFieldValue(`rs[${idx}].f`, data.givenName);
          setFieldValue(`rs[${idx}].r`, "Child");
          setFieldValue(`rs[${idx}].l`, data.surname);
        }
        if (data.relation === "sibling") {
          setFieldValue(`rs[${idx}].r`, "Sibling");
          setFieldValue(`rs[${idx}].f`, data.givenName);
          setFieldValue(`rs[${idx}].l`, data.surname);
        }
      });
    }
  };
  const get1881PersonRelationShips = async (value, setFieldValue) => {
    await apiRequest(GET, `Persons/relationships?treeId=${value.treeId}&personId=${value.id}`).then((res) => {
      const parentsAndSiblings = res.data?.parentsAndSiblingsResult;
      const spousesAndChildren = res.data?.spousesAndChildrenResult;

      const updatedParentsAndSiblings =
        parentsAndSiblings &&
        parentsAndSiblings.map((item) => ({
          ...item,
          relation: item.relation === "child" ? "sibling" : item.relation,
        }));

      const family = [...updatedParentsAndSiblings, ...spousesAndChildren];
      getFamilyRelationships(family, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ values, setSubmitting, setFieldValue, handleChange, dirty, isSubmitting, isValid }) => (
          <>
            {clear
              ? headerContent({
                  t,
                  title,
                  buttonTitle,
                  dirty,
                  isValid,
                  values,
                  isSubmitting,
                  setSubmitting,
                  handleSubmit,
                })
              : null}
            <Form className="w-full">
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full px-2 mb-2.5 ${width}`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-1881-field">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field
                      name={`fm.t`}
                      component={SearchPeople}
                      freeSolo={true}
                      placeholder=" "
                      selectPeople={(value) => {
                        if (value?.givenName) {
                          SetEmptyFields1881(setFieldValue);
                          setFieldValue("ln.t", value?.surname || "");
                          setFieldValue("rs", []);
                          get1881LifeEvents(value, setFieldValue);
                          get1881PersonRelationShips(value, setFieldValue);
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeCensusSearch, t)}</div>
              </div>
              <div className="flex -mx-2 flex-wrap md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Residence", "r", "RSPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex -mx-2 flex-wrap md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex -mx-2 flex-wrap md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Marital Status", "ms", values, maritalStatus, dropdownLoading, t)}</div>
              </div>
              <div className="flex -mx-2 flex-wrap md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Relation to Head of House", "rh", values, relationship, dropdownLoading, t)}</div>
              </div>
              <div className="advance-search-wrap mb-5 pt-4">{relationshipSearch && relationShipField("rs", t)}</div>
              <div className="pt-4 mb-2 sm:flex justify-between w-full md:pt-7">
                {matchInputField(setFieldValue, values)}
                <div className="buttons sm:flex sm:ml-auto">
                  <button className="bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last disabled:opacity-50" type="submit" disabled={isSubmitting || !dirty || !isValid}>
                    {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                  </button>
                  {clear ? (
                    <button type="reset" className="text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0 disabled:opacity-50" disabled={isSubmitting || !dirty}>
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
