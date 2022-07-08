import React, { useEffect } from "react";
import "../../../index.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { encodeDataToURL, getPageSize, formDataTrim, getUsCivilWarDefaultValue, CivilWarPK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { getCivilWarDropdownList } from "../../../../../redux/actions/civilWar";
import { getContentCatalog, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import { updateFirstName } from "../../../../../utils/search";
import CivilWarSearchForm from "../components/SearchForm";
import MetaData from "../../../MetaData";
import BannerTop from "../../../../../assets/images/ny-public-library-banner.jpg";
const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getUsCivilWarDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getCivilWarDropdownList());
    dispatch(getContentCatalog({ partitionKey: CivilWarPK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitCivilWar = (values, { setSubmitting }) => {
    setSubmitting(false);
    if (!values?.t?.l?.l) {
      delete values.t.l;
    }
    if (!values?.t?.li?.i) {
      delete values.t.li;
    }
    if (!values?.matchExact) {
      delete values.matchExact;
    }
    updateFirstName(values);
    const urlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: CivilWarPK,
    });
    history.push("/search/us-civil-war-soldiers/result?" + urlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-7 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img src={BannerTop} className="inline-block h-24 h-full w-full object-cover" alt="icon" />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <CivilWarSearchForm title={contentCatalog?.collectionTitle} width={"md:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} defaultValues={defaultValues} handleSubmitCivilWar={handleSubmitCivilWar} clear={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
