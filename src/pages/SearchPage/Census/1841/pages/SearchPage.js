import React, { useEffect } from "react";
import "../../../index.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { encodeDataToURL, getPageSize, formDataTrim, getUsCensus1841DefaultValue, UKFederal1841PK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import UKCensus1841SearchForm from "../components/SearchForm";
import { getUkCensus1841DropdownList } from "../../../../../redux/actions/Ukcensus1841";
import MetaData from "../../../MetaData";
import { getContentCatalog, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import BannerTop from "../../../../../assets/images/ny-public-library-banner.jpg";
import { updateFirstName } from "../../../../../utils/search";
const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getUsCensus1841DefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getUkCensus1841DropdownList());
    dispatch(getContentCatalog({ partitionKey: UKFederal1841PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUKCensus1841 = (values1841, { setSubmitting }) => {
    setSubmitting(false);
    if (!values1841?.b?.l?.l) {
      delete values1841.b.l;
    }
    if (!values1841?.b?.li?.i) {
      delete values1841.b.li;
    }
    if (!values1841?.r?.l?.l) {
      delete values1841.r.l;
    }
    if (!values1841?.r?.li?.i) {
      delete values1841.r.li;
    }
    if (!values1841?.matchExact) {
      delete values1841.matchExact;
    }
    updateFirstName(values1841);
    const urlQuery = encodeDataToURL({
      ...formDataTrim(values1841),
      pn: 1,
      ps: getPageSize(),
      ci: UKFederal1841PK,
      f : false
    });
    history.push("/search/1841-united-kingdom-census/result?" + urlQuery);
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
          <UKCensus1841SearchForm title={contentCatalog?.collectionTitle} relationshipSearch={contentCatalog?.addRelationshipSearch} width={"md:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} defaultValues={defaultValues} handleSubmitUKCensus1841={handleSubmitUKCensus1841} clear1841={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
