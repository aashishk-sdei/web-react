import React, { useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import AdvancedSearchForm from "./AdvancedSearchForm";
import EventFieldForm from "./EventFieldForm";
import TWDropDownComponent from "./../../../components/TWDropDown/TWDropDownComponent";
import { getFirstAndLastName, getDisabledOptions, DateDropdownValues, toDoubleDigitNumber } from "../../../utils";
import Translator from "../../../components/Translator";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import SearchPeople from "../../../components/SearchPeople/SearchPeople";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../redux/requests";
import { GET } from "../../../redux/constants";



const getFirstAndLastNameOptions = getFirstAndLastName();
const handleMatchCheckbox = (e, form, option) => {
  if (e.target.checked) {
    form.setFieldValue("matchExact", true);
    let lifeEvent = form?.values?.ls || [];
    for (let i = 0; i < lifeEvent.length; i++) {
      if ((lifeEvent[i]?.y?.y !== "" && e.target.checked) || (lifeEvent[i]?.y?.y === "" && e.target.checked)) {
        form.setFieldValue(`ls[${i}].y.s`, Object.keys(DateDropdownValues(form?.values?.ls[i]?.y?.y, form?.values?.ls[i]?.y?.m, form?.values?.ls[i]?.y?.d))[0]);
      }
      form.setFieldValue(`ls[${i}].l.s`, "0");
      if (form?.values?.ls?.[i]?.li?.i) {
        let id = form?.values?.ls?.[i]?.li?.i;
        let oi = option.findIndex((item) => item?.id === id);
        const loc = Object.keys(option[oi].option);
        loc[0] && form.setFieldValue(`ls[${i}].li.s`, loc[0]);
      }
    }
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
  } else {
    handlematchElse(form);
  }
};
const handlematchElse = (form) => {
  form.setFieldValue("matchExact", false);
  !form.values?.fm.t && form.setFieldValue("fm.s", "2");
  !form.values?.ln.t && form.setFieldValue("ln.s", "2");
  !form.values?.l?.l && form.setFieldValue("l.s", "1");
  !form.values?.y?.y && form.setFieldValue("y.s", "8");
};
const checkExactField = (formik, e) => {
  const value = parseInt(e.target.value);
  if (value !== 0) {
    formik.setFieldValue("matchExact", false);
  }
};
const matchField = (advanceSearch, formik, option) => {
  let html = null;
  if (advanceSearch) {
    html = (
      <div className="flex items-start mb-4 sm:mb-0 pr-2">
        <div className="flex items-center h-5">
          <Field name="matchExact" type="checkbox" id="matchExact" onChange={(e) => handleMatchCheckbox(e, formik, option)} className="focus:ring-indigo-5 h-4 w-4 text-indigo-6 border border-gray-4 rounded-lg" />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
  }
  return html;
};



const handleNameChange = (e, formik, name, match) => {
  formik.handleChange(e);
  if (!e.target.value) {
    formik.setFieldValue(`${name}.s`, getFirstAndLastNameOptions[match] || "2");
  } else {
    if (formik.values.matchExact) {
      formik.setFieldValue(`${name}.s`, getFirstAndLastNameOptions[match] || "0");
    }
  }
};



const UniversalSearchForm = ({ _handFormsubmit, handleSubmit, initialValues, isEdit, formVaildate, location, setellOptions = [], showHeader = true, advancedOpen = false, isGlobal }) => {
  const { t } = useTranslation();
  const [option, setOptionVal] = useState(setellOptions);
  const [advanceSearch, setAdvancedSearch] = useState(advancedOpen);
  const [personSearch, setPersonSearch] = useState(false);


  const inputRefs = useRef({});



  const getcond = (formik) => {
    return !formik.dirty || !formik.isValid;
  };
  const handleReset = (formik) => {
    formik.resetForm();
    setAdvancedSearch(false);
    setPersonSearch(false);
  };



  const getFirstNameDropdown = (formik, setRef) => {
    let html = null;
    if (formik.values?.fm?.t?.givenName?.givenName || formik.values?.fm?.t?.name) {
      html = (
        <Field
          name="fm.s"
          component={TWDropDownComponent}
          onChange={checkExactField.bind(this, formik)}
          options={getFirstAndLastNameOptions}
          defaultValue="0"
          getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, formik.values?.fm?.t)}
          inputRef={(ref) => {
            setRef(ref);
          }}
          onKeyDown={(e) => handleFocus(e, "lastBroad")}
        />
      );
    }
    return html;
  };
  const getLastDropdown = (formik, setRef) => {
    let html = null;
    if (formik.values?.ln?.t?.trim()) {
      html = (
        <Field
          name="ln.s"
          component={TWDropDownComponent}
          onChange={checkExactField.bind(this, formik)}
          options={getFirstAndLastNameOptions}
          defaultValue="0"
          getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, formik.values?.ln?.t)}
          inputRef={(ref) => {
            setRef(ref);
          }}
        />
      );
    }
    return html;
  };



  const buttonlabel = tr(t, "search.unisearchform.search");



  const getLifeEvents = (val, formik) => {
   return apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      setPersonSearch(true);
      formik.setFieldValue(`personSearch`, true);
      const lifeEventsData = res.data;
      return lifeEventsData?.map((data) => {
        const EventDate = data?.date?.Date;
        return {
          le: data.type,
          l: {
            l: data.location.Location,
            s: "1",
          },
          li: {
            i: data.location.LocationId,
            name: data.location.Location,
            s: "4",
          },



          ...(EventDate?.YearValue && {
            y: {
              y: EventDate?.YearValue,
              s: "8",
              ...(EventDate?.MonthValue && {
                [`m`]: toDoubleDigitNumber(EventDate?.MonthValue),
              }),
              ...(EventDate?.DayValue && {
                [`d`]: EventDate?.DayValue,
              }),
            },
          }),
        };
      });
    });
  };

  const getParents = (data) => {
    if (data.relation === "parent" && data.gender === "M") {
      return "Father"
    }
    if (data.relation === "parent" && data.gender === "F") {
      return "Mother"
    }
  }

  const getFamilyRelationships = (family) => {
    if (family) {
      return family.map((data) => {
        setAdvancedSearch(true);

        const familyRelation = () => {

          if (data.relation === "sibling") {
            return "Sibling"
          }
          if (data.relation === "child") {
            return "Child"
          }
          if (data.relation === "partner") {
            return "Spouse"
          }
          return getParents(data)

        }
        return {
          f: data?.givenName,
          l: data?.surname,
          r: familyRelation()
        }
      });
    }
  };

  const getPersonRelationShips = (val) => {

    return apiRequest(GET, `Persons/relationships?treeId=${val.treeId}&personId=${val.id}`).then((res) => {
      const parentsAndSiblings = res.data?.parentsAndSiblingsResult;
      const spousesAndChildren = res.data?.spousesAndChildrenResult;

      const updatedParentsAndSiblings =
        parentsAndSiblings &&
        parentsAndSiblings.map((data) => ({
          ...data,
          relation: data.relation === "child" ? "sibling" : data.relation,
        }));

      const family = [...updatedParentsAndSiblings, ...spousesAndChildren];
      return getFamilyRelationships(family);
    });
  };



  const Initiallocation = {
    le: "",
    l: { l: "", s: "1" },
    y: { y: "", m: "", d: "", s: "8" },
    li: { i: "", s: "4", name: "" },
  };



  const handleFocus = (e, element) => {
    if (e.keyCode == 9 && inputRefs.current[element]) {
      e.preventDefault();
      inputRefs.current[element].focus();
    }
  };

  const getLifeEventsandFamilyRelations =  async (val , formik) => {
      const [lData , fData] = await Promise.all([getLifeEvents(val , formik) , getPersonRelationShips(val)])
       formik.setValues(
        {
          fm: {
            t: val,
            s: "2",
          },
          ln: {
            t: val?.surname || "",
            s: "2",
          },
          ls: lData || [],
          rs: fData || [],
        },
        false
      );
  }



  return (
    <>
      <Formik initialValues={initialValues} validate={formVaildate} onSubmit={handleSubmit}>
        {(formik) => {
          return (
            <>
              <Form className="w-full">
                <div className="flex flex-wrap -mx-2 mb-5 md:mb-2.5">
                  <div className={`w-full md:w-1/2 px-2 mb-3`}>
                    <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-cause">
                      {tr(t, "f&mName")}
                    </label>
                    <div className="relative">
                      <Field
                        name={`fm.t`}
                        component={SearchPeople}
                        childRef={(ref) => (inputRefs.current["firstName"] = ref)}
                        freeSolo={true}
                        placeholder=" "
                        selectPeople={(val) => {
                          if (val?.givenName) {
                            formik.setFieldValue("ln.t", val?.surname || "");
                            formik.setFieldValue("ls", [Initiallocation]);
                            formik.setFieldValue("rs", []);
                            getLifeEventsandFamilyRelations(val , formik)
                          }
                        }}
                        getOptionLabel={(opt) => opt?.givenName || formik.values.fm?.t?.name}
                        id={`locations-filter-${uuidv4()}`}
                        onKeyDown={(e) => handleFocus(e, "lastName")}
                      />
                      {getFirstNameDropdown(formik, (ref) => (inputRefs.current["firstBroad"] = ref))}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label className="block text-gray-6 text-sm mb-1" htmlFor="grid-last-name">
                      {tr(t, "LastName")}
                    </label>
                    <Field name="ln.t" innerRef={(ref) => (inputRefs.current["lastName"] = ref)} onKeyDown={(e) => handleFocus(e, "firstBroad")} className="appearance-none block w-full h-10 text-gray-7 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent" id="grid-last-name" type="text" onChange={(e) => handleNameChange(e, formik, "ln", "ln.s")} />



                    {getLastDropdown(formik, (ref) => (inputRefs.current["lastBroad"] = ref))}
                  </div>
                </div>
                <EventFieldForm location={location} setellOptions={option} formik={formik} setOptionVal={setOptionVal} noPopup={showHeader} isEdit={isEdit} isGlobal={isGlobal} personSearch={personSearch} />
                {advanceSearch ? <AdvancedSearchForm formik={formik} /> : null}
                <div className="mb-2 pt-6 flex justify-end sm:justify-between w-full items-center">
                  {matchField(advanceSearch, formik, option)}
                  {!advanceSearch ? (
                    <button className="text-blue-5 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-3 sm:px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset" type="button" onClick={() => setAdvancedSearch(true)}>
                      {tr(t, "search.unisearchform.adsearch")}
                    </button>
                  ) : null}
                  <div className="buttons flex items-center justify-end">
                    <button className="text-gray-7 hidden sm:block active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black" type="button" onClick={() => handleReset(formik)}>
                      {tr(t, "search.unisearchform.clr")}
                    </button>
                    <button className={`bg-blue-4 w-28 active:bg-blue-5 text-white font-semibold text-base px-3 sm:px-6 py-2 ml-3 sm:ml-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-2 focus:ring-blue-2 focus:ring-blue-200 ${!(formik.dirty && formik.isValid) ? "opacity-50 cursor-default" : ""}`} disabled={getcond(formik)} type="submit">
                      {buttonlabel}
                    </button>
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};



export default UniversalSearchForm;