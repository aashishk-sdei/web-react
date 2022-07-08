import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import {
  typeSearchDefaultUSCensus,
} from "../../../../../utils";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { getFirstNameDropDown, headerContent, setBestResidence, submitAndClearButtons } from "../../../../../utils/search";
import { dropDownField, inputField, locationField, relationShipField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";

const handleMatchCheckbox = (e, setFieldValue, values) => {
  if (e.target.checked) {
    setFieldValue("fm.s", "0");
    setFieldValue("ln.s", "0");
    setFieldValue("r.l.s", "0");

    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("r.li.s", loc[0]);
    }

    setFieldValue("matchExact", true);
  } else {
    setFieldValue("matchExact", false);
    !values?.fm.t && setFieldValue("fm.s", "2");
    !values?.ln.t && setFieldValue("ln.s", "2");
    !values?.Res?.name && setFieldValue("r.l.s", "1");
  }
};

export const checkRSPlaces = (values) => {
  if (values["Res"]) {
    const { name, id } = values["Res"];
    values["r"]["l"]["l"] = name ? name : "";
    values["r"]["li"]["i"] = id ? id : "";
    delete values["Res"];
  }
};



const SearchForm = ({
  title,
  relationshipSearch,
  width = "",
  defaultUSValues,
  censusClear,
  buttonTitle,
  nearestResidenceDate,
  handleSubmitUSCensus
}) => {

  const { race, dropdownLoading } =
    useSelector((state) => {
      return state.USCensus;

    });
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkRSPlaces(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let rel = valuesData.rs.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUSCensus(formValue, { setSubmitting });
  };

  const defaultUSCensusSearch = typeSearchDefaultUSCensus();
  const USCensusmatchField = (setFieldValue, values) => {
    let uscensushtml = null;
    uscensushtml = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field
            name="matchExact"
            id="matchExact"
            type="checkbox"
            onChange={(e) => handleMatchCheckbox(e, setFieldValue, values)}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-4 rounded-lg"
          />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="matchExact" className="font-medium text-gray-7">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return uscensushtml;
  };

  const formValidate1790 = (values) => {
    let error = {
      invaild: "Inavild"
    };
    let relations = values.rs?.filter(
      (y) => y?.f && y?.f?.trim() !== "" || y?.l && y?.l?.trim() !== ""
    );
    if (
      (values.fm.t === "" || values.fm.t?.name?.trim() === "") &&
      (values.ln.t === "" || values.ln.t?.trim() === "") &&
      (values.Res.name === "" || values.Res.name?.trim() === "" || values.Res.name === undefined) &&
      values.sr === "" && !relations.length
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };


  const get1790LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1790 = res.data;
      setBestResidence(LifeEventsData1790 , nearestResidenceDate , setFieldValue , "r" , "Res",false)

    })
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        onSubmit={handleSubmit}
        initialValues={defaultUSValues}
        validate={formValidate1790}
      >
        {({
          dirty,
          isSubmitting,
          isValid,
          setSubmitting,
          setFieldValue,
          handleChange,
          values,
        }) => (
          <>
            {censusClear
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
                  <label
                    className="block text-gray-6 text-sm mb-1"
                    htmlFor="grid-1790-field"
                  >
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
                          setFieldValue("Res.id", "")
                          setFieldValue("Res.name", "")
                          setFieldValue("ln.t", val?.surname || "")
                          get1790LifeEvents(val, setFieldValue)
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultUSCensusSearch, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Residence", "r", "Res", values, setFieldValue)}
                </div>

                <div className={`w-full ${width}  mb-2.5`}>
                  {dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}
                </div>
              </div>
              <div className="advance-search-wrap pt-4 mb-5">
                {relationshipSearch && relationShipField('rs', t)}
              </div>
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {USCensusmatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, censusClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm