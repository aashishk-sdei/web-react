import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { getUsCensus1871DropdownList, submitUsCensus1871Form, clearUs1871FormQuery } from "../../../../../redux/actions/UsCensus1871";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import UsCensus1871SearchForm from "../components/SearchForm";
import UsCensus1871RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, getUsCensus1871DefaultValue, mergeDeep, pageRecordsCountfn, BG_GRAY_1 } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import Uk1871Table from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";

const getValuesCensusForm = (formValues) => {
  let _values = { ...formValues };
  let rsObj = updateRSPlace(_values),
    birthObj = updateBirthPlace(_values);
  return {
    ..._values,
    ...birthObj,
    ...rsObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let obj = null,
      obj2 = null;
    if (_values?.r?.li?.i) {
      obj2 = await getLocationGUID(_values.r?.li?.i);
    }
    if (_values?.b?.li?.i) {
      obj = await getLocationGUID(_values.b?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCensus1871DefaultValue(), _values),
      BirthPlace: {
        name: _values?.b?.l?.l,
        id: _values?.b?.li?.i,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        name: _values.r?.l?.l,
        id: _values?.r?.li?.i,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      ps: getPageSize(_values.ps),
    });
  } else {
    history.push("/search/1871-united-kingdom-census");
  }
};
const genarate1871Url = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  updateFirstName(_values);
  if (_values.RSPlace) {
    delete _values.RSPlace;
  }
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (!_values.matchExact) {
    delete _values.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};
const SearchPageList = () => {
  const history = useHistory(),
    location = useLocation();
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.usCensus1871;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesCensusForm(formValues);
        dispatch(submitUsCensus1871Form(_values, newRequest.current));
      }
      newRequest.current = false;
    },
    [dispatch, values, newRequest]
  );
  useEffect(() => {
    dispatch(addFooterWhite(BG_GRAY_1));
    return () => {
      dispatch(addFooterGray());
    };
  }, [dispatch]);
  useEffect(() => {
    dispatch(getUsCensus1871DropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1871-united-kingdom-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearUs1871FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  
  const { usCensus1871List, loading, pageLoading, error , fuzzyMatch } = useSelector((state) => state.usCensus1871);


  const handleSubmitUsCensus1871 = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarate1871Url({ ...formValues, f: false }, history);
  };
  const getCensusListPage = (page) => {
    let data = { ...values, pn: page , f : fuzzyMatch };
    genarate1871Url(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarate1871Url(data, history);
    setisPageLoad(false);
  };
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const Us1871PageRecords = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);
  const handleCensusShowModal = (bool) => {
    let formValue = mergeDeep(getUsCensus1871DefaultValue(), values);
    updateDefaultFirstName(bool, formValue, setValuesNew);
    setShowModal(bool);
  };
  const buttonTitle = getButtonTitle(values);
  const getTableSize = (width) => {
    setCensusTableSize(width);
  };
  const handleCensusShowModalNew = (bool) => {
    handleCensusShowModal(bool);
  };
  const handleTableColTotal = (width) => {
    setTableColTotal(width);
  };
  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  };

  const getUsCensus1871HtmlData = () => {
    if (!loading) {
      return usCensus1871List.length === 0 ? <Norecords isLoading={false} searchResult={usCensus1871List} firstName={getFirstName(values)} /> : <Uk1871Table data={usCensus1871List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
    } else {
      return (
        <div className="fixed w-full h-full left-0 top-0 bg-white z-1000 bg-opacity-60">
          <div className="absolute top-50 z-50 left-2/4 top-2/4">
            <Loader />
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className="page-wrap ww-results-wrap">
        {!pageLoading ? (
          <div className="container mx-auto">
            <div className="head w-full mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    title={tr(t, "search.ww1.list.esearch")}
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal(true);
                    }}
                    type="default"
                    fontWeight="medium"
                  />
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModalNew(true);
                    }}
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {Us1871PageRecords !== 0 && (
                  <p>
                    <Typography size={14} text="secondary" weight="light" fontFamily="primaryFont">
                      {PaginationResult(t, Us1871PageRecords, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="ww-col-right relative">
                <div className="flex">
                  <div className="table-content sm:rounded-lg text-left sm:shadow bg-white">{getUsCensus1871HtmlData()}</div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} totalRecords={totalRecords} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} currentPage={parseInt(values?.pn || 0)} />
                </div>
              </div>
              <div
                className={ClassNames("census flex-col mb-8 sidebar-search hidden", {
                  "sml:flex": !loading && !pageLoading,
                })}
              >
                <div className="bg-white shadow p-3 md:py-5 md:px-6 sm:rounded-lg">
                  <div className="head">
                    <h2 className="mb-3">
                      <Typography text="secondary" weight="medium" fontFamily="primaryFont">
                        {tr(t, "search.ww1.rsearch")}
                      </Typography>
                    </h2>
                  </div>
                  <UsCensus1871RefineSearch relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUsCensus1871={handleSubmitUsCensus1871} Us1871DefaultValues={values} handleShowModal={handleCensusShowModal} buttonTitle={tr(t, "search.ww1.form.update")} width={""} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed bg-opacity-60 w-full h-full z-1000 left-0 top-0 bg-white ">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <Loader />
            </div>
          </div>
        )}
        {/*Modal Tailwind Form*/}
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1871SearchForm relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUsCensus1871={handleSubmitUsCensus1871} defaultValues={valuesNew} clear={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
