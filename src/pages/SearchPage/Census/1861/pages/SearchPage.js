import React, { useEffect } from "react";
import "../../../index.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { encodeDataToURL, getPageSize, formDataTrim, getUsCensus1901DefaultValue, UkFederal1861PK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import UKCensus1861SearchForm from "../components/SearchForm";
import { getUkCensus1861DropdownList } from "../../../../../redux/actions/ukCensus1861";
import MetaData from "../../../MetaData";
import { getContentCatalog, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import BannerTop from "../../../../../assets/images/ny-public-library-banner.jpg";
import { updateFirstName } from "../../../../../utils/search";
const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getUsCensus1901DefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getUkCensus1861DropdownList());
    dispatch(getContentCatalog({ partitionKey: UkFederal1861PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUKCensus1861 = (value, { setSubmitting }) => {
    setSubmitting(false);
    if (!value?.r?.l?.l) {
      delete value.r.l;
    }

    if (!value?.b?.li?.i) {
      delete value.b.li;
    }
    if (!value?.b?.l?.l) {
      delete value.b.l;
    }
    if (!value?.r?.li?.i) {
      delete value.r.li;
    }
    if (!value?.matchExact) {
      delete value.matchExact;
    }
    updateFirstName(value);
    const urlQuery = encodeDataToURL({
      ...formDataTrim(value),
      pn: 1,
      ps: getPageSize(),
      ci: UkFederal1861PK,
      f : false
    });
    history.push("/search/1861-united-kingdom-census/result?" + urlQuery);
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
          <UKCensus1861SearchForm title={contentCatalog?.collectionTitle} relationshipSearch={contentCatalog?.addRelationshipSearch} width={"md:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} defaultValues={defaultValues} handleSubmitUKCensus1861={handleSubmitUKCensus1861} clear1861={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
