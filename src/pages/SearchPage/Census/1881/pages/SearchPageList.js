import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import { useHistory, useLocation } from "react-router-dom";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { getUsCensus1881DropdownList, submitUsCensus1881Form, clearUs1881FormQuery } from "../../../../../redux/actions/UsCensus1881";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import UsCensus1881SearchForm from "../components/SearchForm";
import UsCensus1881RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, getUsCensus1881DefaultValue, mergeDeep, pageRecordsCountfn, BG_GRAY_1 } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import Uk1881Table from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";

const get1881CensusFormVal = (formValues) => {
  let _values = { ...formValues };
  let resObj = updateRSPlace(_values),
    birthObj = updateBirthPlace(_values);
  return {
    ..._values,
    ...resObj,
    ...birthObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const get1881Data = async (search, history, setValues) => {
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
      ...mergeDeep(getUsCensus1881DefaultValue(), _values),
      RSPlace: {
        id: _values?.r?.li?.i,
        name: _values.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      BirthPlace: {
        id: _values?.b?.li?.i,
        name: _values?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      ps: getPageSize(_values.ps),
    });
  } else {
    history.push("/search/1881-united-kingdom-census");
  }
};
const genarate1881Url = (formValue, history, page = 1) => {
  let _values = { ...formValue };
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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory(),
    location = useLocation();
  const [isPageLoad, setisPageLoad] = useState(true);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.usCensus1881;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const newRequest = useRef(true);
  const getCensusList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = get1881CensusFormVal(formValues);
        dispatch(submitUsCensus1881Form(_values, newRequest.current));
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
    dispatch(getUsCensus1881DropdownList());
  }, [dispatch]);
  useEffect(() => {
    get1881Data(location.search, history, setValues);
  }, [setValues, location.search, history]);
  const { usCensus1881List, loading, pageLoading, error , fuzzyMatch } = useSelector((state) => state.usCensus1881);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1881-united-kingdom-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearUs1881FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitUsCensus1881 = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarate1881Url({...formValues , f : false}, history);
  };
  const getCensusListPage = (page) => {
    let data = { ...values, pn: page , f : fuzzyMatch };
    genarate1881Url(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarate1881Url(data, history);
    setisPageLoad(false);
  };
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const Us1881PageRecords = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);
  const handleCensusShowModal = (bool) => {
    let formValue = mergeDeep(getUsCensus1881DefaultValue(), values);
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

  const getUsCensus1881HtmlData = () => {
    if (!loading) {
      return usCensus1881List.length === 0 ? <Norecords searchResult={usCensus1881List} isLoading={false} firstName={getFirstName(values)} /> : <Uk1881Table data={usCensus1881List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
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
            <div className="w-full head  mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    type="default"
                    title={tr(t, "search.ww1.list.esearch")}
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    title={tr(t, "search.ww1.list.nsearch")}
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModalNew(true);
                    }}
                    type="default"
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {Us1881PageRecords !== 0 && (
                  <p>
                    <Typography size={14} weight="light" fontFamily="primaryFont" text="secondary">
                      {PaginationResult(t, Us1881PageRecords, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid" id="us-1871-refine-search">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="bg-white table-content text-left sm:shadow sm:rounded-lg">{getUsCensus1881HtmlData()}</div>
                </div>
                <div className="px-3 relative -top-4 sml:top-0 pb-2 sml:px-0 sml:pb-5">
                  <TWPaginationComponent currentPage={parseInt(values?.pn || 0)} limitPerPage={parseInt(values?.ps || 20)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} totalRecords={totalRecords} />
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
                  <UsCensus1881RefineSearch width={""} relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUsCensus1881={handleSubmitUsCensus1881} Us1881DefaultValues={values} handleShowModal={handleCensusShowModal} buttonTitle={tr(t, "search.ww1.form.update")} />
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
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1881SearchForm relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUsCensus1881={handleSubmitUsCensus1881} defaultValues={valuesNew} clear={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
