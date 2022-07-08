import React, { useEffect } from "react";
import "../../../index.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { encodeDataToURL, getPageSize, formDataTrim, getUsCensus1901DefaultValue, UkFederal1851PK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import UKCensus1851SearchForm from "../components/SearchForm";
import { getUkCensus1851DropdownList } from "../../../../../redux/actions/ukCensus1851";
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
    dispatch(getUkCensus1851DropdownList());
    dispatch(getContentCatalog({ partitionKey: UkFederal1851PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUKCensus1851 = (formValue, { setSubmitting }) => {
    setSubmitting(false);
    if (!formValue?.r?.l?.l) {
      delete formValue.r.l;
    }

    if (!formValue?.b?.li?.i) {
      delete formValue.b.li;
    }
    if (!formValue?.b?.l?.l) {
      delete formValue.b.l;
    }
    if (!formValue?.r?.li?.i) {
      delete formValue.r.li;
    }
    if (!formValue?.matchExact) {
      delete formValue.matchExact;
    }
    updateFirstName(formValue);
    const urlQuery = encodeDataToURL({
      ...formDataTrim(formValue),
      pn: 1,
      ps: getPageSize(),
      ci: UkFederal1851PK,
      f : false
    });
    history.push("/search/1851-united-kingdom-census/result?" + urlQuery);
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
          <UKCensus1851SearchForm title={contentCatalog?.collectionTitle} relationshipSearch={contentCatalog?.addRelationshipSearch} width={"md:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} defaultValues={defaultValues} handleSubmitUKCensus1851={handleSubmitUKCensus1851} clear1851={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
