import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { getUsCensus1901DropdownList, submitUsCensus1901Form, clearUs1901FormQuery } from "../../../../../redux/actions/UsCensus1901";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import UsCensus1901SearchForm from "../components/SearchForm";
import UsCensus1901RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, getUsCensus1901DefaultValue, mergeDeep, pageRecordsCountfn, BG_GRAY_1 } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import Uk1901Table from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";

const getValuesCensusForm = (formValues) => {
  const _values = { ...formValues };
  let birthObj = updateBirthPlace(_values),
    rsObj = updateRSPlace(_values);
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
    if (_values?.b?.li?.i) {
      obj = await getLocationGUID(_values.b?.li?.i);
    }
    if (_values?.r?.li?.i) {
      obj2 = await getLocationGUID(_values.r?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCensus1901DefaultValue(), _values),
      BirthPlace: {
        id: _values?.b?.li?.i,
        name: _values?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        id: _values?.r?.li?.i,
        name: _values.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      ps: getPageSize(_values.ps),
    });
  } else {
    history.push("/search/1901-united-kingdom-census");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  updateFirstName(_values);
  if (_values.BirthPlace) {
    delete _values.BirthPlace;
  }
  if (_values.RSPlace) {
    delete _values.RSPlace;
  }
  if (!_values.matchExact) {
    delete _values.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values), pn: page })}`);
};
const SearchPageList = () => {
  const history = useHistory(),
    location = useLocation();
  const [isPageLoad, setisPageLoad] = useState(true);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.UsCensus1901;
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
        dispatch(submitUsCensus1901Form(_values, newRequest.current));
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
    dispatch(getUsCensus1901DropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1901-united-kingdom-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearUs1901FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitUsCensus1901 = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl({...formValues , f: false}, history);
  };
  const { UsCensus1901List, loading, pageLoading, error , fuzzyMatch } = useSelector((state) => state.UsCensus1901);

  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const getCensusListPage = (page) => {
    let data1901 = { ...values, pn: page , f: fuzzyMatch };
    genarateUrl(data1901, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data1901 = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data1901, history);
    setisPageLoad(false);
  };
 
  const UsFederalPageRecords = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);
  const handleCensusShowModal = (bool) => {
    let formValue = mergeDeep(getUsCensus1901DefaultValue(), values);
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

  const getUsCensus1901HtmlData = () => {
    if (!loading) {
      return UsCensus1901List.length === 0 ? <Norecords searchResult={UsCensus1901List} isLoading={false} firstName={getFirstName(values)} /> : <Uk1901Table data={UsCensus1901List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
    } else {
      return (
        <div className="fixed w-full h-full left-0 top-0 bg-white bg-opacity-60 z-1000">
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
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModalNew(true);
                    }}
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {UsFederalPageRecords !== 0 && (
                  <p>
                    <Typography size={14} text="secondary" weight="light" fontFamily="primaryFont">
                      {PaginationResult(t, UsFederalPageRecords, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg text-left sm:shadow">{getUsCensus1901HtmlData()}</div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} currentPage={parseInt(values?.pn || 0)} totalRecords={totalRecords} />
                </div>
              </div>
              <div
                className={ClassNames("census mb-8 sidebar-search hidden flex-col", {
                  "sml:flex": !loading && !pageLoading,
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
                  <UsCensus1901RefineSearch width={""} relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUsCensus1901={handleSubmitUsCensus1901} Us1901DefaultValues={values} handleShowModal={handleCensusShowModal} buttonTitle={tr(t, "search.ww1.form.update")} />
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
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1901SearchForm relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUsCensus1901={handleSubmitUsCensus1901} defaultValues={valuesNew} clear={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
