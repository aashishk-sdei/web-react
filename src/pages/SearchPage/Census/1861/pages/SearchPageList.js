import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import UsCensus1861SearchForm from "../components/SearchForm";
import UsCensus1861RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, mergeDeep, pageRecordsCountfn, BG_GRAY_1, getUsCensus1901DefaultValue } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import USFederalTable from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";
import { getUkCensus1861DropdownList, submitUkCensus1861Form, clearuk1861FormQuery } from "../../../../../redux/actions/ukCensus1861";

const getValuesCensusForm = (formValues1861) => {
  const _values1861 = { ...formValues1861 };
  let birthObj = updateBirthPlace(_values1861),
    rsObj = updateRSPlace(_values1861);
  return {
    ..._values1861,
    ...birthObj,
    ...rsObj,
    pn: _values1861?.pn,
    ps: _values1861?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values1861 = decodeDataToURL(search);
    let obj = null,
      obj2 = null;
    if (_values1861?.b?.li?.i) {
      obj = await getLocationGUID(_values1861.b?.li?.i);
    }
    if (_values1861?.r?.li?.i) {
      obj2 = await getLocationGUID(_values1861.r?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCensus1901DefaultValue(), _values1861),
      BirthPlace: {
        id: _values1861?.b?.li?.i,
        name: _values1861?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        id: _values1861?.r?.li?.i,
        name: _values1861.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      ps: getPageSize(_values1861.ps),
    });
  } else {
    history.push("/search/1861-united-kingdom-census");
  }
};
const genarateUrl = (formValues1861, history, page = 1) => {
  const _values1861 = { ...formValues1861 };
  updateFirstName(_values1861);
  if (_values1861.BirthPlace) {
    delete _values1861.BirthPlace;
  }
  if (_values1861.RSPlace) {
    delete _values1861.RSPlace;
  }
  if (!_values1861.matchExact) {
    delete _values1861.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values1861), pn: page })}`);
};
const SearchPageList = () => {
  const [isPageLoad, setisPageLoad] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const [values, setValues] = useState(null),
    [valuesNew, setValuesNew] = useState(null);
  const newRequest = useRef(true);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.ukCensus1861;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const history = useHistory(),
    location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues1861 = values) => {
      if (formValues1861 !== null) {
        const _values1861 = getValuesCensusForm(formValues1861);
        dispatch(submitUkCensus1861Form(_values1861, newRequest.current));
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
    dispatch(getUkCensus1861DropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1861-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearuk1861FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitUkCensus1861 = (formValues1861) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues1861, history);
  };

  const { ukcensus1861List, loading, pageLoading1861, error , fuzzyMatch } = useSelector((state) => state.ukCensus1861);


  const getCensusListPage = (page) => {
    let data = { ...values, pn: page , f : false };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit , f : fuzzyMatch };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);


  const UsFederalPageRecords1861 = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);

  const handleTableColTotal = (width) => {
    setTableColTotal(width);
  };
  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  };

  const handleCensusShowModal1861 = (bool) => {
    let formValue = mergeDeep(getUsCensus1901DefaultValue(), values);
    updateDefaultFirstName(bool, formValue, setValuesNew);
    setShowModal(bool);
  };
  const buttonTitle = getButtonTitle(values);
  const getTableSize = (width) => {
    setCensusTableSize(width);
  };
  const handleCensusShowModal1861New = (bool) => {
    handleCensusShowModal1861(bool);
  };

  const getUsCensus1861HtmlData = () => {
    if (!loading) {
      return ukcensus1861List.length === 0 ? <Norecords searchResult={ukcensus1861List} isLoading={false} firstName={getFirstName(values)} /> : <USFederalTable data={ukcensus1861List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
    } else {
      return (
        <div className="fixed w-full h-full left-0 top-0 bg-white z-1000 bg-opacity-60 ">
          <div className="absolute z-50 top-50 left-2/4 top-2/4">
            <Loader />
          </div>
        </div>
      );
    }
  };
  return (
    <>
      <div className="page-wrap ww-results-wrap">
        {!pageLoading1861 ? (
          <div className="container mx-auto">
            <div className="head w-full mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    title={tr(t, "search.ww1.list.esearch")}
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal1861(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal1861New(true);
                    }}
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {UsFederalPageRecords1861 !== 0 && (
                  <p>
                    <Typography size={14} text="secondary" weight="light" fontFamily="primaryFont">
                      {PaginationResult(t, UsFederalPageRecords1861, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg text-left sm:shadow">{getUsCensus1861HtmlData()}</div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} currentPage={parseInt(values?.pn || 0)} totalRecords={totalRecords} />
                </div>
              </div>
              <div
                className={ClassNames("census mb-8 sidebar-search hidden flex-col", {
                  "sml:flex": !loading && !pageLoading1861,
                })}
              >
                <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                  <div className="head">
                    <h2 className="mb-3">
                      <Typography text="secondary" weight="medium" fontFamily="primaryFont">
                        {tr(t, "search.ww1.rsearch")}
                      </Typography>
                    </h2>
                  </div>
                  <UsCensus1861RefineSearch width={""} relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUkCensus1861={handleSubmitUkCensus1861} Uk1861DefaultValues={values} handleShowModal={handleCensusShowModal1861} buttonTitle={tr(t, "search.ww1.form.update")} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <Loader />
            </div>
          </div>
        )}
        {/*Modal Tailwind Form*/}
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1861SearchForm relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUKCensus1861={handleSubmitUkCensus1861} defaultValues={valuesNew} clear1861={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
