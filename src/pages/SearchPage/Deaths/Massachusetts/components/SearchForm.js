import React from "react";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultMassachusetts,
} from "../../../../../utils";
import { getFirstNameDropDown, headerContent } from "../../../../../utils/search";
import { inputField, yearField, locationField } from "../../../../../utils/formFields";
import { checkDeathPlace } from "../../../utils/common";
import { v4 as uuidv4 } from "uuid";
import SearchPeople from "../../../../../components/SearchPeople/SearchPeople";
import { apiRequest } from "../../../../../redux/requests";
import { GET } from "../../../../../redux/constants";


const SearchForm = ({
  title,
  width = "",
  defaultValues,
  MasClear,
  buttonTitle,
  handleSubmitMassachusetts
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      (values.fm.t === "" || values.fm.t?.name?.trim() === "") &&
      (values.ln.t === "" || values.ln.t?.trim() === "") &&
      values.d.y.y === "" &&
      (values.Death.name === "" || values.Death.name?.trim() === "" || values.Death.name === undefined)
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkDeathPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitMassachusetts(valuesData, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("d.y.s", "2");
      setFieldValue("d.l.s", "0");
      if (values.Death.id) {
        const loc = Object.keys(values.Death.levelData.residenceLevel);
        setFieldValue("d.li.s", loc[0]);
      }

    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.d?.y?.y && setFieldValue("d.y.s", "8");
      !values?.Death?.name && setFieldValue("d.l.s", "1");
    }
  };

  const defaultMassachusettsSearch = typeSearchDefaultMassachusetts();
  const massachusettsmatchField = (setFieldValue, values) => {
    let massachusettshtml = null;
    massachusettshtml = (
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
    return massachusettshtml;
  };


  const getDeathLifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const deathLifeEventsData = res.data;
      deathLifeEventsData?.map((deathData) => {
        if (deathData.type === "Death") {
          setFieldValue("Death.id", deathData.location.LocationId)
          setFieldValue("Death.name", deathData.location.Location)
          setFieldValue("d.l.l", deathData.location.Location)
          setFieldValue("d.y.y", deathData.date.Date?.YearValue)
          setFieldValue("d.l.s", "1")
          setFieldValue("d.li.s", "4")
        }
      }
      )
    })
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        onSubmit={handleSubmit}
        initialValues={defaultValues}
        validate={formValidate}
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
            {MasClear
              ? headerContent({
                setSubmitting,
                handleSubmit,
                t,
                title,
                buttonTitle,
                dirty,
                isSubmitting,
                isValid,
                values,
              })
              : null}
            <Form className="w-full">
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label
                    className="block text-gray-6 text-sm mb-1"
                    htmlFor="grid-input-field"
                  >
                    {tr(t, "search.ww1.form.fmname")}
                  </label>
                  <div className="relative">
                    <Field
                      name={`fm.t`}
                      component={SearchPeople}
                      placeholder=" "
                      freeSolo={true}
                      selectPeople={(val) => {
                        if (val?.givenName) {
                          setFieldValue("Death.id", "")
                          setFieldValue("Death.name", "")
                          setFieldValue("d.y.y", "")
                          setFieldValue("ln.t", val?.surname || "")
                          getDeathLifeEvents(val, setFieldValue)
                        }
                      }}
                      getOptionLabel={(opt) => opt?.givenName || values.fm?.t?.name}
                      id={`locations-filter-${uuidv4()}`}
                    />
                    {getFirstNameDropDown(setFieldValue, values)}
                  </div>                 </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultMassachusettsSearch, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Death Year", 'd.y', values, setFieldValue, defaultMassachusettsSearch)}
                </div>
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Death Place", "d", "Death", values, setFieldValue)}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {massachusettsmatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    disabled={!dirty || !isValid || isSubmitting}
                    type="submit"
                    className="disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-4 w-full sm:w-auto order-last"
                  >
                    {isSubmitting
                      ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
                      : tr(t, buttonTitle)}
                  </button>
                  {MasClear ? (
                    <button
                      disabled={!dirty || isSubmitting}
                      type="reset"
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
