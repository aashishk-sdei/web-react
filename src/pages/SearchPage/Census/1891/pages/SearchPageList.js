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
import UsCensus1891SearchForm from "../components/SearchForm";
import UsCensus1891RefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, mergeDeep, pageRecordsCountfn, BG_GRAY_1, getUsCensus1901DefaultValue } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import USFederalTable from "../../../Table";
import { updateBirthPlace, updateRSPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";
import {getUkCensus1891DropdownList, submitUkCensus1891Form  , clearuk1891FormQuery} from "../../../../../redux/actions/Ukcensus1891";

const getValuesCensusForm = (formValues1891) => {
  const _values1891 = { ...formValues1891 };
  let birthObj = updateBirthPlace(_values1891),
    rsObj = updateRSPlace(_values1891);
  return {
    ..._values1891,
    ...birthObj,
    ...rsObj,
    pn: _values1891?.pn,
    ps: _values1891?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values1891 = decodeDataToURL(search);
    let obj = null,
      obj2 = null;
    if (_values1891?.b?.li?.i) {
      obj = await getLocationGUID(_values1891.b?.li?.i);
    }
    if (_values1891?.r?.li?.i) {
      obj2 = await getLocationGUID(_values1891.r?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCensus1901DefaultValue(), _values1891),
      BirthPlace: {
        id: _values1891?.b?.li?.i,
        name: _values1891?.b?.l?.l,
        ...(obj ? { levelData: obj } : {}),
      },
      RSPlace: {
        id: _values1891?.r?.li?.i,
        name: _values1891.r?.l?.l,
        ...(obj2 ? { levelData: obj2 } : {}),
      },
      ps: getPageSize(_values1891.ps),
    });
  } else {
    history.push("/search/1891-united-kingdom-census");
  }
};
const genarateUrl = (formValues1891, history, page = 1) => {
  const _values1891 = { ...formValues1891 };
  updateFirstName(_values1891);
  if (_values1891.BirthPlace) {
    delete _values1891.BirthPlace;
  }
  if (_values1891.RSPlace) {
    delete _values1891.RSPlace;
  }
  if (!_values1891.matchExact) {
    delete _values1891.matchExact;
  }
  history.push(`?${encodeDataToURL({ ...formDataTrim(_values1891), pn: page })}`);
};
const SearchPageList = () => {
 
  const [isPageLoad, setisPageLoad] = useState(true);
  const [values, setValues] = useState(null);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const newRequest = useRef(true);
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.UkCensus1891;
  });
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const history = useHistory(),
  location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues1891 = values) => {
      if (formValues1891 !== null) {
        const _values1891 = getValuesCensusForm(formValues1891);
        dispatch(submitUkCensus1891Form(_values1891, newRequest.current));
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
    dispatch(getUkCensus1891DropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1891-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearuk1891FormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitUkCensus1891 = (formValues1891) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl({...formValues1891 , f: false}, history);
  };

  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);

  const { Ukcensus1891List, loading, pageLoading1891, error , fuzzyMatch } = useSelector((state) => state.UkCensus1891);


  const getCensusListPage = (page) => {
    let data1891 = { ...values, pn: page , f : fuzzyMatch };
    genarateUrl(data1891, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data1891 = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data1891, history);
    setisPageLoad(false);
  };
  


  const UsFederalPageRecords1891 = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);

  const handleTableColTotal = (width) => {
    setTableColTotal(width);
  };
  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  };

  const handleCensusShowModal1891 = (bool) => {
    let formValue = mergeDeep(getUsCensus1901DefaultValue(), values);
    updateDefaultFirstName(bool, formValue, setValuesNew);
    setShowModal(bool);
  };
  const buttonTitle = getButtonTitle(values);
  const getTableSize = (width) => {
    setCensusTableSize(width);
  };
  const handleCensusShowModal1891New = (bool) => {
    handleCensusShowModal1891(bool);
  };


  const getUsCensus1891HtmlData = () => {
    if (!loading) {
      return Ukcensus1891List.length === 0 ? <Norecords searchResult={Ukcensus1891List} isLoading={false} firstName={getFirstName(values)} /> : <USFederalTable data={Ukcensus1891List} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
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
        {!pageLoading1891 ? (
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
                      handleCensusShowModal1891(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    title={tr(t, "search.ww1.list.nsearch")}
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal1891New(true);
                    }}
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {UsFederalPageRecords1891 !== 0 && (
                  <p>
                    <Typography size={14} text="secondary" weight="light" fontFamily="primaryFont">
                      {PaginationResult(t, UsFederalPageRecords1891, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg text-left sm:shadow">{getUsCensus1891HtmlData()}</div>
                </div>

                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} currentPage={parseInt(values?.pn || 0)} totalRecords={totalRecords} />
                </div>
              </div>
              <div
                className={ClassNames("census mb-8 sidebar-search hidden flex-col", {
                  "sml:flex": !loading && !pageLoading1891,
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
                  <UsCensus1891RefineSearch width={""} relationshipSearch={contentCatalog?.addRelationshipSearch} handleSubmitUkCensus1891={handleSubmitUkCensus1891} Uk1891DefaultValues={values} handleShowModal={handleCensusShowModal1891} buttonTitle={tr(t, "search.ww1.form.update")} />
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
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<UsCensus1891SearchForm  relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitUKCensus1891={handleSubmitUkCensus1891} defaultValues={valuesNew} clear1891={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
