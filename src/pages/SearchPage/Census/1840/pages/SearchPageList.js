import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassNames from "classnames";
import USCensusLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import { clearUsFederal1840FormQuery, submitUSFederal1840Form , getUSFederal1840DropdownList } from "../../../../../redux/actions/usCensus1840";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout"
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import { pageRecordsCountfn, getButtonTitle, getFirstName, decodeDataToURL, encodeDataToURL, getPageSize, mergeDeep, formDataTrim, getUSFederal1800DefaultValues, BG_GRAY_1 } from "../../../../../utils";
import USFederal1840Table from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";
import { updateResidenceField } from "../../../utils/common";
import USCensus1840ReineSearch from "../components/RefineSearch";
import USCensus1840SearchForm from "../components/SearchForm";
const getValuesForm = (formValue) => {
  let value1840 = { ...formValue };
  let Residenceobj = updateResidenceField(value1840);
  return {
    ...value1840,
    ...Residenceobj,
  };
};
const setFormData = (setValues, formValue1840, Residenceobj) => {
  setValues({
    ...mergeDeep(getUSFederal1800DefaultValues(), formValue1840),
    Residence: {
      id: formValue1840?.r?.li?.i,
      name: formValue1840?.r?.l?.l,
      ...(Residenceobj ? { levelData: Residenceobj } : {}),
    },
    ps: getPageSize(formValue1840.ps),
  });
};

const genarateUrl = (formValue, history, page = 1) => {
  const _USValues1840 = { ...formValue };
  if (!_USValues1840.fm.t) {
    delete _USValues1840.fm;
  }
  if (!_USValues1840.ln.t) {
    delete _USValues1840.ln;
  }
  if (_USValues1840.Residence) {
    delete _USValues1840.Residence;
  }
  if (!_USValues1840.matchExact) {
    delete _USValues1840.matchExact;
  }
  updateFirstName(_USValues1840)
  history.push(`?${encodeDataToURL({ ...formDataTrim(_USValues1840), pn: page })}`);
};

const getData = async (search, history, setValues) => {
  if (search) {
    let ResObj = null;
    let _values = decodeDataToURL(search);
    if (_values?.r?.li?.i) {
      ResObj = await getLocationGUID(_values.r?.li?.i);
    }
    setFormData(setValues, _values, ResObj);
  } else {
    history.push("/search/1840-united-states-federal-census");
  }
};

const SearchPageList = () => {
  const newRequest = useRef(true),
    location = useLocation();
  const [tableSize, setTableSize] = useState(null);
  const [tableColTotal, setTableColTotal] = useState(0);
  const [tableColWidth, setTableColWidth] = useState([]);
  const history = useHistory();
  const { totalRecords, maskingFields } = useSelector((state) => {
    return state.usCensus1840;
  });
  const [isPageLoad, setisPageLoad] = useState(true),
    [showModal, setShowModal] = useState(false),
    [values, setValues] = useState(null),
    [valuesNew, setValuesNew] = useState(null);
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getUSFederal1840List = useCallback(
    (formValues = values) => {
      if (formValues !== null) {
        const _values = getValuesForm(formValues);
        dispatch(submitUSFederal1840Form(_values, newRequest.current));
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
    dispatch(getUSFederal1840DropdownList())
  }, [])
  useEffect(() => {
    getData(location.search, history, setValues);
  }, [setValues, location.search, history]);
  useEffect(() => {
    getUSFederal1840List();
    return () => {
      let pathName = history.location.pathname;
      if (pathName !== "/search/1840-united-states-federal-census/result" && pathName.split("/")?.[1] !== "records") {
        localStorage.removeItem("switch_status");
        dispatch(updateContentCatalog());
        dispatch(clearUsFederal1840FormQuery());
      }
    };
  }, [dispatch, getUSFederal1840List]);
  const handleSubmitUSCensus1840 = (formValues) => {
    newRequest.current = true;
    setShowModal(false);
    genarateUrl({...formValues , f : false}, history);
  };

  const { usFederal1840List, loading, UFC1840pageLoading, error , fuzzyMatch } = useSelector((state) => state.usCensus1840);


  const changeLimit = (pageLimit) => {
    let data = { ...values, pn: 1, ps: pageLimit };
    genarateUrl(data, history);
    setisPageLoad(false);
  };
  const getUSFederal1840ListPage = (page) => {
    let data = { ...values, pn: page , f : fuzzyMatch };
    genarateUrl(data, history, page);
    setisPageLoad(false);
  };
  const USFederal1840pageRecords = useMemo(() => {
    return pageRecordsCountfn(loading, error, totalRecords, values?.ps, values?.pn);
  }, [loading, error, totalRecords, values]);

  const handleTableColWidth = (width) => {
    setTableColWidth(width);
  },
  handleTableColTotal = (width) => {
    setTableColTotal(width);
  };

  useEffect(() => {
    dispatch(ssdi({}));
  }, [dispatch]);
  const buttonTitle = getButtonTitle(values);
  const handleUFCShowModal1840New = (bool) => {
    handleUFCShowModal1840(bool);
  };
  const handleUFCShowModal1840 = (bool) => {
    let formValue = mergeDeep(getUSFederal1800DefaultValues(), values);
    updateDefaultFirstName(bool, formValue, setValuesNew)
    setShowModal(bool);
  };
  const getTableSize = (width) => {
    setTableSize(width);
  };
  
  const getUSCensus1840html = () => {
    if (loading) {
      return (
        <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
          <div className="absolute top-50 z-50 top-2/4 left-2/4">
            <USCensusLoader />
          </div>
        </div>
      );
    } else {
      return usFederal1840List.length === 0 ? <Norecords searchResult={usFederal1840List} isLoading={false} firstName={getFirstName(values)} /> : <USFederal1840Table tableSize={getTableSize} handleTableColWidth={handleTableColWidth} handleTableColTotal={handleTableColTotal} data={usFederal1840List} maskingFields={maskingFields} error={error} loading={loading} isPageLoad={isPageLoad} tableColWidth={tableColWidth} tableColTotal={tableColTotal} isNewSearch={true} />;
    }
  };
  return (
    <>
      <div className="page-wrap ww-results-wrap">
        {UFC1840pageLoading ? (
          <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
            <div className="absolute top-50 z-50 top-2/4 left-2/4">
              <USCensusLoader />
            </div>
          </div>
        ) : (
          <div className="container mx-auto">
            <div className="head w-full mb-4 text-center">
              {ListingPageheaderContent(contentCatalog?.collectionTitle)}
              <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                <div className="links w-full flex justify-center">
                  <Button
                    type="default"
                    title="Edit Search"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleUFCShowModal1840(true);
                    }}
                    fontWeight="medium"
                  />
                  <Button
                    type="default"
                    title="New Search"
                    handleClick={(e) => {
                      e.preventDefault();
                      handleUFCShowModal1840New(true);
                    }}
                    fontWeight="medium"
                  />
                </div>
              </div>
              <div>
                {USFederal1840pageRecords !== 0 && (
                  <p>
                    <Typography fontFamily="primaryFont" size={14} text="secondary" weight="light">
                      {PaginationResult(t, USFederal1840pageRecords, values?.ps, values?.pn, totalRecords)}
                    </Typography>{" "}
                  </p>
                )}
              </div>
            </div>
            <div className="ww-grid">
              <div className="relative ww-col-right">
                <div className="flex">
                  <div className="table-content bg-white sm:rounded-lg sm:shadow text-left">{getUSCensus1840html()}</div>
                </div>
                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                  <TWPaginationComponent getList={getUSFederal1840ListPage} tableSize={tableSize} totalRecords={totalRecords} changeLimit={changeLimit} limitPerPage={parseInt(values?.ps || 20)} currentPage={parseInt(values?.pn || 0)} />
                </div>
              </div>
              <div className={ClassNames("mb-8 sidebar-search hidden flex-col", { "sml:flex": !UFC1840pageLoading && !loading })}>
                <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                  <div className="head">
                    <h2 className="mb-3">
                      <Typography weight="medium" text="secondary" fontFamily="primaryFont">
                        Revise Search
                      </Typography>
                    </h2>
                  </div>
                  <USCensus1840ReineSearch relationshipSearch={contentCatalog?.addRelationshipSearch} width={""} handleSubmitUSCensus1840={handleSubmitUSCensus1840} usFederal1840DefaultValues={values} handleShowModal={handleUFCShowModal1840} buttonTitle="Update" />
                </div>
              </div>
            </div>
          </div>
        )}
        <TailwindModal title={contentCatalog?.collectionTitle} showClose={true} content={<USCensus1840SearchForm relationshipSearch={contentCatalog?.addRelationshipSearch} inputWidth={""} width={"sm:w-1/2"} nearestResidenceDate = {contentCatalog?.nearestResidenceDate} handleSubmitUSCensus1840={handleSubmitUSCensus1840} defaultValues={valuesNew} UFCClear={false} buttonTitle={buttonTitle} />} showModal={showModal} setShowModal={setShowModal} isPropagation={false} />
      </div>
    </>
  );
};
export default SearchPageList;
