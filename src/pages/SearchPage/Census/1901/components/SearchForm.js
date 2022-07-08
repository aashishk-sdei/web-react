import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import { sortArray, typeSearchDefaulUsCensus1901 } from "../../../../../utils";
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
const handleMatchCheckbox = (e, form) => {
  if (e.target.checked) {
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
    form.setFieldValue("b.l.s", "0");
    form.setFieldValue("r.l.s", "0");
    if (form.values.RSPlace.id) {
      form.setFieldValue("r.li.s", Object.keys(form.values.RSPlace.levelData.residenceLevel)[0]);
    }
    if (form.values.BirthPlace.id) {
      form.setFieldValue("b.li.s", Object.keys(form.values.BirthPlace.levelData.residenceLevel)[0]);
    }
    form.setFieldValue("matchExact", true);
  } else {
    form.setFieldValue("matchExact", false);
    !form.values?.fm.t && form.setFieldValue("fm.s", "2");
    !form.values?.ln.t && form.setFieldValue("ln.s", "2");
    !form.values?.RSPlace?.name && form.setFieldValue("r.l.s", "1");
    !form.values?.BirthPlace?.name && form.setFieldValue("b.l.s", "1");
  }
};
const SearchForm = ({ title, relationshipSearch, width = "", defaultValues, clear, buttonTitle, handleSubmitUsCensus1901, nearestResidenceDate }) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    let relations = values.rs?.filter((y) => (y?.f && y?.f?.trim() !== "") || (y?.l && y?.l?.trim() !== ""));
    if ((values.fm.t === "" || values.fm.t?.name?.trim() === "") && (values.ln.t === "" || values.ln.t?.trim() === "") && (values.RSPlace.name === "" || values.RSPlace.name?.trim() === "" || values.RSPlace.name === undefined) && (values.BirthPlace.name === "" || values.BirthPlace.name?.trim() === "" || values.BirthPlace.name === undefined) && values.g === "" && values.ms === "" && !relations.length && values.rh === "") {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { gender, maritalStatus, relationship, dropdownLoading } = useSelector((state) => {
    return state.UsCensus1901;
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
    handleSubmitUsCensus1901(formValue, { setSubmitting });
  };

  const defaultTypeCensusSearch = typeSearchDefaulUsCensus1901();
  const matchInputField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="w-full flex items-center mb-4 sm:mb-0 pr-2 sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="matchExact" type="checkbox" onChange={(e) => handleMatchCheckbox(e, { setFieldValue, values })} className="h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg focus:ring-indigo-500" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
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
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
      }
    }
  };
  const getBeforeConditions = (beforeYearData, afterYearData, data, setFieldValue) => {
    getSingleBeforeConditions(beforeYearData, afterYearData, setFieldValue, data);
    if (beforeYearData.length > 1) {
      const earliestDates = sortArray(beforeYearData);
      if (afterYearData.length > 0)
        if (earliestDates[0] === data?.date?.Date?.YearValue) {
          setFieldValue("RSPlace.id", data.location.LocationId);
          setFieldValue("RSPlace.name", data.location.Location);
          setFieldValue("r.l.l", data.location.Location);
          setFieldValue("r.l.s", "1");
          setFieldValue("r.li.s", "4");
        }
    }
  };
  const getAfterConditions = (afterYearData, data, setFieldValue) => {
    if (afterYearData.length === 1) {
      setFieldValue("r.l.s", "1");
      setFieldValue("r.li.s", "4");
      setFieldValue("r.l.l", data.location.Location);
      setFieldValue("RSPlace.id", data.location.LocationId);
      setFieldValue("RSPlace.name", data.location.Location);
    }
    if (afterYearData.length > 1) {
      const afterDates = sortArray(afterYearData, true);
      if (afterDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
      }
    }
  };
  const getSingleYearResidenceConditions = (residenceData, setFieldValue) => {
    if (residenceData.length === 1) {
      residenceData?.forEach((data) => {
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
      });
    }
  };
  const getMultipleYearResidenceConditions = (residenceData, setFieldValue) => {
    if (residenceData.length > 1) {
      const beforeYearData = residenceData
        ?.filter((ldata) => ldata?.date?.Date.YearValue < nearestResidenceDate.yearValue)
        ?.map((ldata) => {
          return ldata?.date?.Date.YearValue;
        });
      const afterYearData = residenceData
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
  const get1901LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1901 = res.data;
      LifeEventsData1901?.map((Data1901) => {
        if (Data1901.type === "Birth") {
          setFieldValue("BirthPlace.id", Data1901.location.LocationId);
          setFieldValue("BirthPlace.name", Data1901.location.Location || "");
          setFieldValue("b.l.l", Data1901.location.Location);
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
          setFieldValue("b.y.y", Data1901.date.Date?.YearValue);
        }
      });
      const Birth = LifeEventsData1901?.filter((data) => data.type === "Birth" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const Residence = LifeEventsData1901?.filter((data) => data.type === "Residence" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const residenceData = [...Birth, ...Residence];
      getSingleYearResidenceConditions(residenceData, setFieldValue);
      getMultipleYearResidenceConditions(residenceData, setFieldValue);
    });
  };
  const SetEmptyFields1901 = (setFieldValue) => {
    setFieldValue("BirthPlace.id", "");
    setFieldValue("BirthPlace.name", "");
    setFieldValue("RSPlace.id", "");
    setFieldValue("RSPlace.name", "");
  };
  const get1901Parents = (data, index, setFieldValue) => {
    if (data.relation === "parent" && data.gender === "M") {
      setFieldValue(`rs[${index}].f`, data.givenName);
      setFieldValue(`rs[${index}].l`, data.surname);
      setFieldValue(`rs[${index}].r`, "Father");
    }

    if (data.relation === "parent" && data.gender === "F") {
      setFieldValue(`rs[${index}].f`, data.givenName);
      setFieldValue(`rs[${index}].l`, data.surname);
      setFieldValue(`rs[${index}].r`, "Mother");
    }
  };
  const getFamilyRelationships = (family, setFieldValue) => {
    if (family) {
      family.map((data, index) => {
        get1901Parents(data, index, setFieldValue);

        if (data.relation === "partner") {
          setFieldValue(`rs[${index}].l`, data.surname);
          setFieldValue(`rs[${index}].f`, data.givenName);
          setFieldValue(`rs[${index}].r`, "Spouse");
        }
        if (data.relation === "child") {
          setFieldValue(`rs[${index}].f`, data.givenName);
          setFieldValue(`rs[${index}].r`, "Child");
          setFieldValue(`rs[${index}].l`, data.surname);
        }
        if (data.relation === "sibling") {
          setFieldValue(`rs[${index}].r`, "Sibling");
          setFieldValue(`rs[${index}].f`, data.givenName);
          setFieldValue(`rs[${index}].l`, data.surname);
        }
      });
    }
  };
  const get1901PersonRelationShips = async (val, setFieldValue) => {
    await apiRequest(GET, `Persons/relationships?treeId=${val.treeId}&personId=${val.id}`).then((res) => {
      const parentsAndSiblings = res.data?.parentsAndSiblingsResult;
      const spousesAndChildren = res.data?.spousesAndChildrenResult;

      const updatedParentsAndSiblings =
        parentsAndSiblings &&
        parentsAndSiblings.map((data) => ({
          ...data,
          relation: data.relation === "child" ? "sibling" : data.relation,
        }));

      const family = [...updatedParentsAndSiblings, ...spousesAndChildren];
      getFamilyRelationships(family, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ values, dirty, isSubmitting, isValid, setSubmitting, setFieldValue, handleChange }) => (
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
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full px-2 mb-2.5 ${width}`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-1901-field">
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
                          SetEmptyFields1901(setFieldValue);
                          setFieldValue("ln.t", val?.surname || "");
                          setFieldValue("rs", []);
                          get1901LifeEvents(val, setFieldValue);
                          get1901PersonRelationShips(val, setFieldValue);
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
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Residence", "r", "RSPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Marital Status", "ms", values, maritalStatus, dropdownLoading, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Relation to Head of House", "rh", values, relationship, dropdownLoading, t)}</div>
              </div>
              <div className="advance-search-wrap pt-4 mb-5">{relationshipSearch && relationShipField("rs", t)}</div>
              <div className="pt-4 mb-2 sm:flex justify-between w-full md:pt-7">
                {matchInputField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button className="bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last disabled:opacity-50" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                    {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                  </button>
                  {clear ? (
                    <button className="text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0 disabled:opacity-50" type="reset" disabled={!dirty || isSubmitting}>
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
