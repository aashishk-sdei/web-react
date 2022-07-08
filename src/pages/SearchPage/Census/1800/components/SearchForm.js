import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultUSFederal1800,
} from "../../../../../utils";
import { getFirstNameDropDown, headerContent, setBestResidence } from "../../../../../utils/search";
import { dropDownField, inputField, locationField, relationShipField } from "../../../../../utils/formFields";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";


const checkResidence = (values) => {
  if (values["Residence"]) {
    const { name, id } = values["Residence"];
    values["r"]["l"]["l"] = name ? name : "";
    values["r"]["li"]["i"] = id ? id : "";
    delete values["Residence"];
  }
};

const SearchForm = ({
  title,
  relationshipSearch,
  width = "",
  defaultValues,
  USFClear,
  buttonTitle,
  handleSubmitUSFederal1800,
  nearestResidenceDate,
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };
    let relations = values.rs?.filter(
      (y) => y?.f && y?.f?.trim() !== "" || y?.l && y?.l?.trim() !== ""
    );
    if (
      (values.fm.t === "" || values.fm.t?.name?.trim() === "") &&
      (values.ln.t === "" || values.ln.t?.trim() === "") &&
      (values.Residence.name === "" || values.Residence.name?.trim() === "" || values.Residence.name === undefined) &&
      values.sr === "" && !relations.length
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { race, dropdownLoading } = useSelector((state) => { return state.usFederal1800; });
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResidence(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    let rel = valuesData.rs.filter((y) => y.f !== "" || y.l !== "");
    let formValue = { ...valuesData, rs: rel };
    handleSubmitUSFederal1800(formValue, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("r.l.s", "0");
      if (values?.Residence?.id) {
        const loc = Object.keys(values.Residence.levelData.residenceLevel);
        setFieldValue("r.li.s", loc[0]);
      }

    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.Residence?.name && setFieldValue("r.l.s", "1");
    }
  };

  const defaultUSFederal1800Search = typeSearchDefaultUSFederal1800();
  const USFederal1800MatchField = (setFieldValue, values) => {
    let USFederal1800html = null;
    USFederal1800html = (
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
    return USFederal1800html;
  };


  const get1800LifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const LifeEventsData1800 = res.data;
      setBestResidence(LifeEventsData1800 , nearestResidenceDate , setFieldValue , "r" , "Residence",false)

    })
  }

  return (
    <>
      <Formik
        initialValues={defaultValues}
        validate={formValidate}
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          setSubmitting,
          handleChange,
          values,
          dirty,
          isValid,
          isSubmitting,
        }) => (
          <>
            {USFClear
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
                    htmlFor="grid-1800-field"
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
                          setFieldValue("Residence.id", "")
                          setFieldValue("Residence.name", "")
                          setFieldValue("ln.t", val?.surname || "")
                          get1800LifeEvents(val, setFieldValue)
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultUSFederal1800Search, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Residence", "r", "Residence", values, setFieldValue, "City, County")}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}
                </div>
              </div>
              <div className="advance-search-wrap pt-4 mb-5">
                {relationshipSearch && relationShipField('rs', t)}
              </div>
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {USFederal1800MatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                    className="disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last"
                  >
                    {isSubmitting
                      ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
                      : tr(t, buttonTitle)}
                  </button>
                  {USFClear ? (
                    <button
                      type="reset"
                      disabled={!dirty || isSubmitting}
                      className="disabled:opacity-50 text-gray-7 active:bg-gray-2 rounded-lg bg-gray-1 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0"
                    >
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
