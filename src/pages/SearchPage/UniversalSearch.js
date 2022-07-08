import React, { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import {
  encodeDataToURL,
  universalInitialValues,
  formDataTrim,
  formVaildate,
} from "./../../utils";
import { collectionDropdown, getEventDropdown } from './../../redux/actions/universalSearch';
import UniversalSearchForm from "./UniversalSearchForm";
import HistoricalNewspapers from "./HistoricalNewspapers"
import Collectionlist from "./Collectionlist";
import "./index.css";

const UniversalSearch = () => {
  const history = useHistory();
  const { location, initialValues } = universalInitialValues();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getEventDropdown())
    dispatch(collectionDropdown())
  }, [dispatch])

  const handFormsubmit = (formik) => {
    if (formik.dirty && formik.isValid) {
      formik.handleSubmit();
    }
  };
  const handleSubmit = (values, _props) => {
    let ls = values.ls.filter((y) => {
      return (y.l?.l !== "" && y?.li?.i !== "") || y?.y?.y !== "";
    });
    ls = ls.filter((y) => {
      if (y.li?.i) {
        delete y.l;
      } else {
        delete y.li;
      }
      if (!y.y?.y) {
        delete y.y;
      }
      return !Array.isArray(y) || (!y?.y?.y && (!y?.li?.i || !y?.l?.l));
    });
    if (!values.matchExact) {
      delete values.matchExact
    }
    let rel = values.rs.filter((y) => y.f !== "" || y.l !== "");
    if (values?.fm?.t?.givenName) {
      values["fm"]["t"] = values?.fm?.t?.givenName
    }
    if (values?.fm?.t?.name) {
      values["fm"]["t"] = values?.fm?.t?.name
    }
    let formValue = { ...values, ls, rs: rel, pn: initialValues.pn, ps: initialValues.ps , f:false };
    const urlQuery = encodeDataToURL({ ...formDataTrim(formValue) });
    history.push(`/search/all-historical-records/result?${urlQuery}&isglobal=true`);
  };

  return (
    <>

      <div className="main-container bg-white md:bg-gray-2">
        <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
          <HistoricalNewspapers border={true} />
          <div className="bg-white tw-search-form-card md:rounded-2xl py-5 px-4 md:p-10 md:shadow-search-modal md:mt-0 mb-6 max-w-src-modal-w w-full mx-auto relative sm:border-b border-gray-3">
            <UniversalSearchForm
              handFormsubmit={handFormsubmit}
              handleSubmit={handleSubmit}
              initialValues={initialValues}
              formVaildate={formVaildate}
              location={location}
            />
          </div>
          <Collectionlist />
        </div>
      </div>
    </>
  );
};
export default UniversalSearch;
