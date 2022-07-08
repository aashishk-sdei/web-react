import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClassNames from "classnames";
import { useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { getCivilWarDropdownList, submitCivilWarForm, clearCivilWarFormQuery } from "../../../../../redux/actions/civilWar";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout";
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import CiviWarSearchForm from "../components/SearchForm";
import CivilWarRefineSearch from "../components/RefineSearch";
import { getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, formDataTrim, getUsCivilWarDefaultValue, mergeDeep, pageRecordsCountfn, BG_GRAY_1 } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import CivilWarTable from "../../../Table";
import { updateTourPlace } from "../../../utils/common";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";

const getValuesCensusForm = (formValues) => {
  const _values = { ...formValues };
  let rsObj = updateTourPlace(_values);
  return {
    ..._values,
    ...rsObj,
    pn: _values?.pn,
    ps: _values?.ps,
  };
};
const getData = async (search, history, setValues) => {
  if (search) {
    const _values = decodeDataToURL(search);
    let obj1 = null;
    if (_values?.t?.li?.i) {
      obj1 = await getLocationGUID(_values.t?.li?.i);
    }
    setValues({
      ...mergeDeep(getUsCivilWarDefaultValue(), _values),
      TourPlace: {
        id: _values?.t?.li?.i,
        name: _values.t?.l?.l,
        ...(obj1 ? { levelData: obj1 } : {}),
      },
      ps: getPageSize(_values.ps),
    });
  } else {
    history.push("/search/us-civil-war-soldiers");
  }
};
const genarateUrl = (formValues, history, page = 1) => {
  const _values = { ...formValues };
  updateFirstName(_values);
  if (_values.TourPlace) {
    delete _values.TourPlace;
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
  const [isPageLoad, setisPageLoad] = useState(true);
  const [censusTableSize, setCensusTableSize] = useState(null);
  const [tableColWidth, setTableColWidth] = useState([]);
  const [tableColTotal, setTableColTotal] = useState(0);
  const [valuesNew, setValuesNew] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newRequest = useRef(true);
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.civilWar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getCensusList = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesCensusForm(formValues);
        dispatch(submitCivilWarForm(_values, newRequest.current));
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
    dispatch(getCivilWarDropdownList());
  }, [dispatch]);
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getCensusList();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/us-civil-war-soldiers/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearCivilWarFormQuery());
      }
    };
  }, [dispatch, getCensusList]);
  const handleSubmitCivilWar = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl(formValues, history);
  };
  const getCensusListPage = (page) => {
    let data = { ...values, pn: page };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const { civilWarList, loading, pageLoading, error } = useSelector((state) => state.civilWar);
  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const UsFederalPageRecords = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);
  const handleCensusShowModal = (bool) => {
    let formValue = mergeDeep(getUsCivilWarDefaultValue(), values);
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

  const getCivilWarHtmlData = () => {
    if (!loading) {
      return civilWarList.length === 0 ? <Norecords searchResult={civilWarList} isLoading={false} firstName={getFirstName(values)} /> : <CivilWarTable data={civilWarList} maskingFields={maskingFields} error={error} loading={loading} tableSize={getTableSize} isPageLoad={isPageLoad} tableColWidth={tableColWidth} handleTableColWidth={handleTableColWidth} tableColTotal={tableColTotal} handleTableColTotal={handleTableColTotal} isNewSearch={true} />;
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
      <div className="ww-results-wrap page-wrap">
        {!pageLoading ? (
          <div className="container mx-auto">
            <div className="head w-full mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    type="default"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleCensusShowModal(true);
                    }}
                    title={tr(t, "search.ww1.list.esearch")}
                    fontWeight="medium"
                  />
                  <Button
                    type="default"
                    title={tr(t, "search.ww1.list.nsearch")}
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
                    <Typography text="secondary" weight="light" fontFamily="primaryFont" size={14}>
                      {PaginationResult(t, UsFederalPageRecords, values?.ps, values?.pn, totalRecords)}
                    </Typography>
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg text-left sm:shadow">{getCivilWarHtmlData()}</div>
                </div>
                <div className="px-3 relative -top-4 sml:top-0 pb-2 sml:pb-5 sml:px-0">
                  <TWPaginationComponent limitPerPage={parseInt(values?.ps || 20)} currentPage={parseInt(values?.pn || 0)} changeLimit={changeLimit} tableSize={censusTableSize} getList={getCensusListPage} totalRecords={totalRecords} />
                </div>
              </div>
              <div
                className={ClassNames("census sidebar-search mb-8 flex-col hidden", {
                  "sml:flex": !loading && !pageLoading,
                })}
              >
                <div className="sm:rounded-lg shadow p-3 md:py-5 md:px-6 bg-white">
                  <div className="head">
                    <h2 className="mb-3">
                      <Typography text="secondary" fontFamily="primaryFont" weight="medium">
                        {tr(t, "search.ww1.rsearch")}
                      </Typography>
                    </h2>
                  </div>
                  <CivilWarRefineSearch width={""} handleSubmitCivilWar={handleSubmitCivilWar} civilWarDefaultValues={values} handleShowModal={handleCensusShowModal} buttonTitle={tr(t, "search.ww1.form.update")} />
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
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<CiviWarSearchForm inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate={contentCatalog?.nearestResidenceDate} handleSubmitCivilWar={handleSubmitCivilWar} defaultValues={valuesNew} clear={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
