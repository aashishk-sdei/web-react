import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPageSize,
  formDataTrim,
  encodeDataToURL,
  getUSSocialSecurityDefaultValue,
  USSocialPK,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import USSocialBgImg from "../../../../../assets/images/Cemetery.jpg";
import "../../../index.css";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import { useHistory } from "react-router-dom";
import USSocialSecuritySearchForm from "../components/SearchForm";
import { updateFirstName } from "../../../../../utils/search";

const SearchPage = () => {
  const defaultValues = getUSSocialSecurityDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });

  useEffect(() => {
    dispatch(getContentCatalog({ partitionKey: USSocialPK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);

  const handleSubmitUSSocialSecurity = (values, { setSubmitting }) => {
    setSubmitting(false);
    updateFirstName(values)
    const USSocialUrlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: USSocialPK,
      f: false
    });
    history.push("/search/united-states-social-security-death-index/result?" + USSocialUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-7 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={USSocialBgImg}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USSocialSecuritySearchForm
            title={
              contentCatalog?.collectionTitle
            }
            width={"md:w-1/2"}
            nearestResidenceDate = {contentCatalog?.nearestResidenceDate}
            defaultValues={defaultValues}
            handleSubmitUSSocialSecurity={handleSubmitUSSocialSecurity}
            USClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
