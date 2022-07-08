import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { sortArray, typeSearchDefaulUsCensus1871 } from "../../../../../utils";
import { getFirstNameDropDown, headerContent } from "../../../../../utils/search";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { checkBirthPlace, checkRSPlace } from "../../../utils/common";
import { dropDownField, inputField, locationField, relationShipField } from "../../../../../utils/formFields";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
const handle1871MatchCheckInput = (e, form1871Val) => {
  if (e.target.checked) {
    form1871Val.setFieldValue("fm.s", "0");
    form1871Val.setFieldValue("b.l.s", "0");
    form1871Val.setFieldValue("ln.s", "0");
    form1871Val.setFieldValue("r.l.s", "0");
    if (form1871Val.values.RSPlace.id) {
      form1871Val.setFieldValue("r.li.s", Object.keys(form1871Val.values.RSPlace.levelData.residenceLevel)[0]);
    }
    if (form1871Val.values.BirthPlace.id) {
      form1871Val.setFieldValue("b.li.s", Object.keys(form1871Val.values.BirthPlace.levelData.residenceLevel)[0]);
    }
    form1871Val.setFieldValue("matchExact", true);
  } else {
    !form1871Val.values?.fm.t && form1871Val.setFieldValue("fm.s", "2");
    !form1871Val.values?.ln.t && form1871Val.setFieldValue("ln.s", "2");
    !form1871Val.values?.BirthPlace?.name && form1871Val.setFieldValue("b.l.s", "1");
    !form1871Val.values?.RSPlace?.name && form1871Val.setFieldValue("r.l.s", "1");
    form1871Val.setFieldValue("matchExact", false);
  }
};
const SearchForm = ({ title, relationshipSearch, defaultValues, clear, buttonTitle, handleSubmitUsCensus1871, nearestResidenceDate, width = "" }) => {
  const { t } = useTranslation();
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    let relation = values.rs?.filter((y) => (y?.f && y?.f?.trim() !== "") || (y?.l && y?.l?.trim() !== ""));
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.RSPlace.name === "" || values.RSPlace.name?.trim() === "" || values.RSPlace.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && values.rh === "" && values.g === "" && !relation.length) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { gender, relationship, dropdownLoading } = useSelector((state) => {
    return state.usCensus1871;
  });
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkRSPlace(valuesData);
    checkBirthPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let rel = valuesData.rs.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUsCensus1871(formValue, { setSubmitting });
  };

  const defaultTypeCensusSearch = typeSearchDefaulUsCensus1871();
  const matchInputField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="sm:py-0 w-full flex items-center mb-4 sm:mb-0 pr-2 sm:w-auto pt-2.5 pb-3.5">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="1871MatchExact" type="checkbox" onChange={(e) => handle1871MatchCheckInput(e, { setFieldValue, values })} className="h-4 w-4 border border-gray-4 text-indigo-600 rounded-lg focus:ring-indigo-500" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label className="font-medium text-gray-7" htmlFor="1871MatchExact">
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
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.li.s", "4");
      }
    }
  };
  const getBeforeConditions = (beforeYearData, afterYearData, data, setFieldValue) => {
    getSingleBeforeConditions(beforeYearData, afterYearData, setFieldValue, data);
    if (beforeYearData.length > 1) {
      let earliestDates = sortArray(beforeYearData);
      if (afterYearData.length > 0)
        if (earliestDates[0] === data?.date?.Date?.YearValue) {
          setFieldValue("RSPlace.id", data.location.LocationId);
          setFieldValue("r.l.l", data.location.Location);
          setFieldValue("r.l.s", "1");
          setFieldValue("RSPlace.name", data.location.Location);
          setFieldValue("r.li.s", "4");
        }
    }
  };
  const getAfterConditions = (afterYearData, data, setFieldValue) => {
    if (afterYearData.length === 1) {
      setFieldValue("r.l.s", "1");
      setFieldValue("r.li.s", "4");
      setFieldValue("RSPlace.name", data.location.Location);
      setFieldValue("r.l.l", data.location.Location);
      setFieldValue("RSPlace.id", data.location.LocationId);
    }
    if (afterYearData.length > 1) {
      let afterDates = sortArray(afterYearData, true);
      if (afterDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("r.l.l", data.location.Location);
      }
    }
  };
  const getSingleYearResidenceConditions = (residenceData, setFieldValue) => {
    if (residenceData.length === 1) {
      residenceData?.forEach((data) => {
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
        setFieldValue("RSPlace.name", data.location.Location);
      });
    }
  };
  const getMultipleYearResidenceConditions = (residenceData, setFieldValue) => {
    if (residenceData.length > 1) {
      let beforeYearData = residenceData
        ?.filter((ldata) => ldata?.date?.Date.YearValue < nearestResidenceDate.yearValue)
        ?.map((ldata) => {
          return ldata?.date?.Date.YearValue;
        });
      let afterYearData = residenceData
        ?.filter((hdata) => hdata?.date?.Date.YearValue >= nearestResidenceDate.yearValue)
        ?.map((hdata) => {
          return hdata?.date?.Date.YearValue;
        });
      residenceData?.forEach((data) => {
        if (data?.date?.Date.YearValue < nearestResidenceDate.yearValue) {
          getBeforeConditions(beforeYearData, afterYearData, data, setFieldValue);
        } else {
          getAfterConditions(afterYearData, data, setFieldValue);
        }
      });
    }
  };
  const get1871LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      let LifeEventsData1871 = res.data;
      LifeEventsData1871?.map((Data1871) => {
        if (Data1871.type === "Birth") {
          setFieldValue("BirthPlace.id", Data1871.location.LocationId);
          setFieldValue("b.l.l", Data1871.location.Location);
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
          setFieldValue("b.y.y", Data1871.date.Date?.YearValue);
          setFieldValue("BirthPlace.name", Data1871.location.Location || "");
        }
      });
      let Birth = LifeEventsData1871?.filter((data) => data.type === "Birth" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      let Residence = LifeEventsData1871?.filter((data) => data.type === "Residence" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      let residenceData = [...Birth, ...Residence];
      getSingleYearResidenceConditions(residenceData, setFieldValue);
      getMultipleYearResidenceConditions(residenceData, setFieldValue);
    });
  };
  const SetEmptyFields1871 = (setFieldValue) => {
    setFieldValue("BirthPlace.id", "");
    setFieldValue("RSPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("RSPlace.name", "");
  };
  const get1871Parents = (data, i, setFieldValue) => {
    if (data.relation === "parent" && data.gender === "M") {
      setFieldValue(`rs[${i}].f`, data.givenName);
      setFieldValue(`rs[${i}].l`, data.surname);
      setFieldValue(`rs[${i}].r`, "Father");
    }

    if (data.relation === "parent" && data.gender === "F") {
      setFieldValue(`rs[${i}].f`, data.givenName);
      setFieldValue(`rs[${i}].l`, data.surname);
      setFieldValue(`rs[${i}].r`, "Mother");
    }
  };
  const getFamilyRelationships = (family, setFieldValue) => {
    if (family) {
      family.map((data, index) => {
        get1871Parents(data, index, setFieldValue);
        if (data.relation === "partner") {
          setFieldValue(`rs[${index}].l`, data.surname);
          setFieldValue(`rs[${index}].r`, "Spouse");
          setFieldValue(`rs[${index}].f`, data.givenName);
        }
        if (data.relation === "child") {
          setFieldValue(`rs[${index}].f`, data.givenName);
          setFieldValue(`rs[${index}].l`, data.surname);
          setFieldValue(`rs[${index}].r`, "Child");
        }
        if (data.relation === "sibling") {
          setFieldValue(`rs[${index}].r`, "Sibling");
          setFieldValue(`rs[${index}].l`, data.surname);
          setFieldValue(`rs[${index}].f`, data.givenName);
        }
      });
    }
  };
  const get1871PersonRelationShips = async (val, setFieldValue) => {
    await apiRequest(GET, `Persons/relationships?treeId=${val.treeId}&personId=${val.id}`).then((res) => {
      let parentsAndSiblings = res.data?.parentsAndSiblingsResult;
      let spousesAndChildren = res.data?.spousesAndChildrenResult;
      let updatedParentsAndSiblings =
        parentsAndSiblings &&
        parentsAndSiblings.map((data) => ({
          ...data,
          relation: data.relation === "child" ? "sibling" : data.relation,
        }));

      let family = [...updatedParentsAndSiblings, ...spousesAndChildren];
      getFamilyRelationships(family, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ values, isValid, dirty, isSubmitting, setSubmitting, setFieldValue, handleChange }) => (
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
              <div className="flex -mx-2 md:mb-2.5 flex-wrap">
                <div className={`w-full px-2 mb-2.5 ${width}`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-1871-field">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field
                      id={`locations-filter-${uuidv4()}`}
                      name={`fm.t`}
                      component={SearchPeople}
                      freeSolo={true}
                      placeholder=" "
                      selectPeople={(val) => {
                        if (val?.givenName) {
                          SetEmptyFields1871(setFieldValue);
                          setFieldValue("ln.t", val?.surname || "");
                          get1871LifeEvents(val, setFieldValue);
                          setFieldValue("rs", []);
                          get1871PersonRelationShips(val, setFieldValue);
                        }
                      }}
                      getOptionLabel={(option) => option?.givenName || values.fm?.t?.name}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeCensusSearch, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md mb-2.5 px-2`}>{locationField("Residence", "r", "RSPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md mb-2.5 px-2`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} mb-2.5 px-2`}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
                <div className={`w-full ${width} mb-2.5 px-2`}>{dropDownField("Relation to Head of House", "rh", values, relationship, dropdownLoading, t)}</div>
              </div>
              <div className="advance-search-wrap pt-4 mb-5">{relationshipSearch && relationShipField("rs", t)}</div>
              <div className="w-full pt-4 mb-2 sm:flex justify-between md:pt-7">
                {matchInputField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button className="bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg sm:ml-4 w-full sm:w-auto order-last disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-1" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                    {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                  </button>
                  {clear ? (
                    <button className="text-gray-7 active:bg-gray-2 bg-gray-1 rounded-lg  font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full disabled:opacity-50 sm:w-auto mt-4 sm:mt-0" type="reset" disabled={!dirty || isSubmitting}>
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
