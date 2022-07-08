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
const handleMatchCheckbox = (e, formik) => {
    if (e.target.checked) {
        if (formik.values.RSPlace.id) {
            formik.setFieldValue("r.li.s", Object.keys(formik.values.RSPlace.levelData.residenceLevel)[0]);
        }
        if (formik.values.BirthPlace.id) {
            formik.setFieldValue("b.li.s", Object.keys(formik.values.BirthPlace.levelData.residenceLevel)[0]);
        }
        formik.setFieldValue("ln.s", "0");
        formik.setFieldValue("b.l.s", "0");
        formik.setFieldValue("fm.s", "0");
        formik.setFieldValue("r.l.s", "0");
        formik.setFieldValue("matchExact", true);
    } else {
        !formik.values?.BirthPlace?.name && formik.setFieldValue("b.l.s", "1");
        !formik.values?.RSPlace?.name && formik.setFieldValue("r.l.s", "1");
        !formik.values?.fm.t && formik.setFieldValue("fm.s", "2");
        !formik.values?.ln.t && formik.setFieldValue("ln.s", "2");
        formik.setFieldValue("matchExact", false);

    }
};
const SearchForm = ({ title, relationshipSearch, width = "", defaultValues, clear1841, buttonTitle, handleSubmitUKCensus1841, nearestResidenceDate }) => {
  const formValidate = (values1841) => {
    let error = {
      invaild: "Inavild",
    };
    let relations = values1841.rs?.filter((y) => (y?.f && y?.f?.trim() !== "") || (y?.l && y?.l?.trim() !== ""));
    if ((values1841.fm.t === "" || values1841.fm.t?.name?.trim() === "") && (values1841.ln.t === "" || values1841.ln.t?.trim() === "") && (values1841.RSPlace.name === "" || values1841.RSPlace.name?.trim() === "" || values1841.RSPlace.name === undefined) && (values1841.BirthPlace.name === "" || values1841.BirthPlace.name?.trim() === "" || values1841.BirthPlace.name === undefined) && values1841.g === "" && !relations?.length) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { gender, dropdownLoading } = useSelector((state) => {
    return state.UkCensus1841;
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
    let rel = valuesData?.rs?.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUKCensus1841(formValue, { setSubmitting });
  };

  const defaultTypeCensusSearch1841 = typeSearchDefaulUsCensus1901();
  const matchInputField1841 = (setFieldValue, values) => {
    let html1841 = null;
    html1841 = (
      <div className="w-full flex items-center mb-4 sm:mb-0 pr-2 sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" type="checkbox" id="matchExact" onChange={(e) => handleMatchCheckbox(e, { setFieldValue, values })} className="h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg focus:ring-indigo-500" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return html1841;
  };

  const getBeforeConditions = (beforeYearData1841, afterYearData1841, data, setFieldValue) => {
    getSingleBeforeConditions(beforeYearData1841, afterYearData1841, setFieldValue, data);
    if (beforeYearData1841.length > 1) {
      const earliestDates = sortArray(beforeYearData1841);
      if (afterYearData1841.length > 0)
        if (earliestDates[0] === data?.date?.Date?.YearValue) {
          setFieldValue("RSPlace.name", data.location.Location);
          setFieldValue("RSPlace.id", data.location.LocationId);
          setFieldValue("r.l.l", data.location.Location);
          setFieldValue("r.li.s", "4");
          setFieldValue("r.l.s", "1");
        }
    }
  };

  const getSingleBeforeConditions = (beforeYearData1841, afterYearData1841, setFieldValue, data) => {
    if (beforeYearData1841.length === 1) {
      if (afterYearData1841.length === 0) {
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("r.li.s", "4");
        setFieldValue("r.l.s", "1");
      }
    }
  };

  const getAfterConditions = (afterYearData1841, data, setFieldValue) => {
    if (afterYearData1841.length === 1) {
      setFieldValue("r.li.s", "4");
      setFieldValue("r.l.s", "1");
      setFieldValue("r.l.l", data.location.Location);
      setFieldValue("RSPlace.name", data.location.Location);
      setFieldValue("RSPlace.id", data.location.LocationId);
    }
    if (afterYearData1841.length > 1) {
      const afterDates = sortArray(afterYearData1841, true);
      if (afterDates[0] === data?.date?.Date?.YearValue) {
        setFieldValue("r.l.l", data.location.Location);
        setFieldValue("r.l.s", "1");
        setFieldValue("r.li.s", "4");
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("RSPlace.name", data.location.Location);
      }
    }
  };
  const getSingleYearResidenceConditions = (residenceData1841, setFieldValue) => {
    if (residenceData1841.length === 1) {
      residenceData1841?.forEach((data) => {
        setFieldValue("RSPlace.name", data.location.Location);
        setFieldValue("RSPlace.id", data.location.LocationId);
        setFieldValue("r.li.s", "4");
        setFieldValue("r.l.s", "1");
        setFieldValue("r.l.l", data.location.Location);
      });
    }
  };
  const getMultipleYearResidenceConditions = (residenceData1841, setFieldValue) => {
    if (residenceData1841.length > 1) {
      const afterYearData1841 = residenceData1841
        ?.filter((hdata) => hdata?.date?.Date.YearValue >= nearestResidenceDate.yearValue)
        ?.map((hdata) => {
          return hdata?.date?.Date.YearValue;
        });
      const beforeYearData1841 = residenceData1841
        ?.filter((ldata) => ldata?.date?.Date.YearValue < nearestResidenceDate.yearValue)
        ?.map((ldata) => {
          return ldata?.date?.Date.YearValue;
        });

      residenceData1841?.forEach((data) => {
        if (data?.date?.Date.YearValue < nearestResidenceDate.yearValue) {
          getBeforeConditions(beforeYearData1841, afterYearData1841, data, setFieldValue);
        } else {
          getAfterConditions(afterYearData1841, data, setFieldValue);
        }
      });
    }
  };
  const get1841LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1841 = res.data;
      LifeEventsData1841?.map((Data1841) => {
        if (Data1841.type === "Birth") {
          setFieldValue("BirthPlace.name", Data1841.location.Location || "");
          setFieldValue("BirthPlace.id", Data1841.location.LocationId);
          setFieldValue("b.y.y", Data1841.date.Date?.YearValue);
          setFieldValue("b.l.l", Data1841.location.Location);
          setFieldValue("b.l.s", "1");
          setFieldValue("b.li.s", "4");
        }
      });
      const Birth = LifeEventsData1841?.filter((data) => data.type === "Birth" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const Residence = LifeEventsData1841?.filter((data) => data.type === "Residence" && data?.date?.Date.YearValue !== null)?.map((data) => {
        return data;
      });
      const residenceData1841 = [...Birth, ...Residence];
      getSingleYearResidenceConditions(residenceData1841, setFieldValue);
      getMultipleYearResidenceConditions(residenceData1841, setFieldValue);
    });
  };
    const SetEmptyFields1841 = (setFieldValue) => {
        setFieldValue("BirthPlace.id", "");
        setFieldValue("BirthPlace.name", "");
        setFieldValue("RSPlace.id", "");
        setFieldValue("RSPlace.name", "");
    };
  const get1841Parents = (data1841, index, setFieldValue) => {
    if (data1841.relation === "parent" && data1841.gender === "M") {
      setFieldValue(`rs[${index}].f`, data1841.givenName);
      setFieldValue(`rs[${index}].l`, data1841.surname);
      setFieldValue(`rs[${index}].r`, "Father");
    }

    if (data1841.relation === "parent" && data1841.gender === "F") {
      setFieldValue(`rs[${index}].f`, data1841.givenName);
      setFieldValue(`rs[${index}].l`, data1841.surname);
      setFieldValue(`rs[${index}].r`, "Mother");
    }
  };
  const getFamilyRelationships = (family1841, setFieldValue) => {
    if (family1841) {
      family1841.map((data1841, index) => {
        get1841Parents(data1841, index, setFieldValue);

        if (data1841.relation === "partner") {
          setFieldValue(`rs[${index}].l`, data1841.surname);
          setFieldValue(`rs[${index}].f`, data1841.givenName);
          setFieldValue(`rs[${index}].r`, "Spouse");
        }
        if (data1841.relation === "child") {
          setFieldValue(`rs[${index}].f`, data1841.givenName);
          setFieldValue(`rs[${index}].r`, "Child");
          setFieldValue(`rs[${index}].l`, data1841.surname);
        }
        if (data1841.relation === "sibling") {
          setFieldValue(`rs[${index}].r`, "Sibling");
          setFieldValue(`rs[${index}].f`, data1841.givenName);
          setFieldValue(`rs[${index}].l`, data1841.surname);
        }
      });
    }
  };
  const get1841PersonRelationShips = async (val, setFieldValue) => {
    await apiRequest(GET, `Persons/relationships?treeId=${val.treeId}&personId=${val.id}`).then((res) => {
      const spousesAndChildren = res.data?.spousesAndChildrenResult;
      const parentsAndSiblings = res.data?.parentsAndSiblingsResult;

      const updatedParentsAndSiblings =
        parentsAndSiblings &&
        parentsAndSiblings.map((data) => ({
          ...data,
          relation: data.relation === "child" ? "sibling" : data.relation,
        }));

      const family1841 = [...updatedParentsAndSiblings, ...spousesAndChildren];
      getFamilyRelationships(family1841, setFieldValue);
    });
  };
  return (
    <>
      <Formik enableReinitialize={true} initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ values, dirty, isSubmitting, isValid, setSubmitting, setFieldValue, handleChange }) => (
          <>
            {clear1841
              ? headerContent({
                t,
                title,
                buttonTitle,
                dirty,
                values,
                setSubmitting,
                handleSubmit,
                isSubmitting,
                isValid,
              })
              : null}
            <Form className="w-full">
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full px-2 mb-2.5 ${width}`}>
                  <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-1841-field">
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field
                      name={`fm.t`}
                      component={SearchPeople}
                      freeSolo={true}
                      placeholder=" "
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      selectPeople={(val) => {
                        if (val?.givenName) {
                          SetEmptyFields1841(setFieldValue);
                          setFieldValue("rs", []);
                          setFieldValue("ln.t", val?.surname || "");
                          get1841LifeEvents(val, setFieldValue);
                          get1841PersonRelationShips(val, setFieldValue);
                        }
                      }}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full px-2 mb-2.5 ${width} `}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultTypeCensusSearch1841, t)}</div>
              </div>

              <>
                <div className="flex flex-wrap md:mb-2.5 -mx-2 ">
                  <div className={`br-field-md  mb-2.5 px-2 w-full`}>{locationField("Residence", "r", "RSPlace", values, setFieldValue)}</div>
                </div>
                <div className="flex flex-wrap md:mb-2.5 -mx-2 ">
                  <div className={`br-field-md  mb-2.5 px-2 w-full `}>{locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}</div>
                </div>
                <div className="flex flex-wrap  md:mb-2.5 -mx-2 md:max-w-lg">
                  <div className={`w-full ${width} mb-2.5  px-2  `}>{dropDownField("Gender", "g", values, gender, dropdownLoading, t)}</div>
                </div>
                <div className="advance-search-wrap mb-5 pt-4 ">{relationshipSearch && relationShipField("rs", t)}</div>
                <div className="pt-4 mb-2 sm:flex justify-between w-full md:pt-7">
                  {matchInputField1841(setFieldValue, values)}
                  <div className="buttons sm:ml-auto sm:flex">
                    <button className="bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last disabled:opacity-50" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                      {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : tr(t, buttonTitle)}
                    </button>
                    {clear1841 ? (
                      <button className="text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0 disabled:opacity-50" type="reset" disabled={!dirty || isSubmitting}>
                        {tr(t, "search.ww1.form.clear")}
                      </button>
                    ) : null}
                  </div>
                </div>
              </>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
