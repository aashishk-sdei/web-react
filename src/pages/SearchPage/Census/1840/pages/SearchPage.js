import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPageSize, formDataTrim, getUSFederal1800DefaultValues, encodeDataToURL, USFederal1840PK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import USFederal1840BGImage from "../../../../../assets/images/ny-public-library-banner.jpg";
import "../../../index.css";
import { getContentCatalog, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import { getUSFederal1840DropdownList } from "../../../../../redux/actions/usCensus1840";
import { useHistory } from "react-router-dom";
import USCensus1840SearchForm from "../components/SearchForm";
import { updateFirstName } from "../../../../../utils/search";
const SearchPage = () => {
  const defaultValues = getUSFederal1800DefaultValues();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getUSFederal1840DropdownList());
    dispatch(getContentCatalog({ partitionKey: USFederal1840PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUSCensus1840 = (values, { setSubmitting }) => {
    setSubmitting(false);
    updateFirstName(values)
    const USCensus1840Query = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: USFederal1840PK,
      f : false
    });
    history.push("/search/1840-united-states-federal-census/result?" + USCensus1840Query);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-7 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img src={USFederal1840BGImage} className="inline-block h-24 h-full w-full object-cover" alt="icon" />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USCensus1840SearchForm title={contentCatalog?.collectionTitle} nearestResidenceDate = {contentCatalog?.nearestResidenceDate} relationshipSearch={contentCatalog?.addRelationshipSearch} width={"md:w-1/2"} defaultValues={defaultValues} handleSubmitUSCensus1840={handleSubmitUSCensus1840} UFCClear1840={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
