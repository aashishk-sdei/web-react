import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout"
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import UsCensus1841SearchForm from "../components/SearchForm";
import UsCensus1841RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, mergeDeep, pageRecordsCountfn, BG_GRAY_1, getUsCensus1841DefaultValue } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import USFederalTable from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";
import {getUkCensus1841DropdownList, submitUkCensus1841Form  , clearuk1841FormQuery} from "../../../../../redux/actions/Ukcensus1841";

const getValuesCensusForm = (formValues1841) => {
  const _values1841 = { ...formValues1841 };
  let birthObj = updateBirthPlace(_values1841),
    rsObj = updateRSPlace(_values1841);
  return {
    ..._values1841,
    ...birthObj,
    ...rsObj,
    pn: _values1841?.pn,
    ps: _values1841?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values1841 = decodeDataToURL(search);
    let obj = null,
      obj2 = null;
    if (_values1841?.b?.li?.i) {
      obj = await getLocationGUID(_values1841.b?.li?.i);
    }
    if (_values1841?.r?.li?.i) {
      obj2 = await getLocationGUID(_values1841.r?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCensus1841DefaultValue(), _values1841),
      BirthPlace: {
        id: _values1841?.b?.li?.i,
        name: _values1841?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        id: _values1841?.r?.li?.i,
        name: _values1841.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      ps: getPageSize(_values1841.ps),
    });
  } else {
    history.push("/search/1841-united-kingdom-census");
  }
};
const genarateUrl = (formValues1841, history, page = 1) => {
  const _values1841 = { ...formValues1841 };
  updateFirstName(_values1841);
  if (_values1841.BirthPlace) {
    delete _values1841.BirthPlace;
  }
  if (_values1841.RSPlace) {
    delete _values1841.RSPlace;
  }
  if (!_values1841.matchExact) {
    delete _values1841.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values1841), pn: page })}`);
};
const SearchPageList = () => {
 
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [isPageLoad, setisPageLoad] = useState(true);
  const [valuesNew, setValuesNew] = useState(null);
  const [values, setValues] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.UkCensus1841;
  });
  
  const history = useHistory(),
  location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues1841 = values) => {
      if (formValues1841 !== null) {
        const _values1841 = getValuesCensusForm(formValues1841);
        dispatch(submitUkCensus1841Form(_values1841, newRequest.current));
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
    dispatch(getUkCensus1841DropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1841-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearuk1841FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitUkCensus1841 = (formValues1841) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl({...formValues1841 , f : false}, history);
  };

  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const { Ukcensus1841List, loading, pageLoading1841, error , fuzzyMatch } = useSelector((state) => state.UkCensus1841);


  const getCensusListPage = (page) => {
    let data = { ...values, pn: page  , f : fuzzyMatch};
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
 


  const UsFederalPageRecords1841 = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);

  const handleTableColTotal = (width) => {
    setTableColTotal(width);
  };
  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  };

  const handleCensusShowModal1841 = (bool) => {
    let formValue = mergeDeep(getUsCensus1841DefaultValue(), values);
    updateDefaultFirstName(bool, formValue, setValuesNew);
    setShowModal(bool);
  };
  const buttonTitle = getButtonTitle(values);
  const getTableSize = (width) => {
    setCensusTableSize(width);
  };
  const handleCensusShowModal1841New = (bool) => {
    handleCensusShowModal1841(bool);
  };


  const getUsCensus1841HtmlData = () => {
    if (!loading) {
      return Ukcensus1841List.length === 0 ? <Norecords searchResult={Ukcensus1841List} isLoading={false} firstName={getFirstName(values)} /> : <USFederalTable data={Ukcensus1841List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
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
        {!pageLoading1841 ? (
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
                      handleCensusShowModal1841(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal1841New(true);
                    }}
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {UsFederalPageRecords1841 !== 0 && (
                  <p>
                    <Typography size={14} text="secondary" weight="light" fontFamily="primaryFont">
                      {PaginationResult(t, UsFederalPageRecords1841, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg text-left sm:shadow">{getUsCensus1841HtmlData()}</div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} currentPage={parseInt(values?.pn || 0)} totalRecords={totalRecords} />
                </div>
              </div>
              <div
                className={ClassNames("census mb-8 sidebar-search hidden flex-col", {
                  "sml:flex": !loading && !pageLoading1841,
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
                  <UsCensus1841RefineSearch width={""} relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUkCensus1841={handleSubmitUkCensus1841} Uk1841DefaultValues={values} handleShowModal={handleCensusShowModal1841} buttonTitle={tr(t, "search.ww1.form.update")} />
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
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1841SearchForm  relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUKCensus1841={handleSubmitUkCensus1841} defaultValues={valuesNew} clear1841={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
