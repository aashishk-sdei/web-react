import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ClassNames from "classnames";
import NYDeathsLoader from "../../../../../components/Loader";
import Typography from "../../../../../components/Typography";
import Button from "../../../../../components/Button";
import TWPaginationComponent from "../../../../../components/Pagination/TWPaginationComponent";
import TailwindModal from "../../../../../components/TailwindModal";
import {
    submitNYDeathsForm,
    clearNYDeathsFormQuery,
    getNYDeathsDropdownList
} from "../../../../../redux/actions/NYDeaths";
import { addFooterGray, addFooterWhite } from "../../../../../redux/actions/layout"
import { getLocationGUID } from "../../../../../redux/actions/ww1";
import { ssdi, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import {
    pageRecordsCountfn,
    getButtonTitle,
    getFirstName,
    decodeDataToURL,
    encodeDataToURL,
    getPageSize,
    mergeDeep,
    formDataTrim,
    getNewYorkDeathsDefaultValue,
    BG_GRAY_1,
} from "../../../../../utils";
import NYDeathsTable from "../../../Table";
import Norecords from "../../../NoRecord";
import "../../../index.css";
import NYDeathsSearchForm from "../components/SearchForm";
import NYDeathsRefineSearch from "../components/RefineSearch";
import { ListingPageheaderContent, PaginationResult, updateDefaultFirstName, updateFirstName } from "../../../../../utils/search";
import { updateDeathPlace } from "../../../utils/common";



const getValuesForm = (formValues) => {
    const _values = { ...formValues };
    let deathObj = updateDeathPlace(_values , true);
    return {
        ..._values,
        ...deathObj,
        pn: _values?.pn,
        ps: _values?.ps,
    };
};
const setFormData = (setValues, _NYDvalues, DeathObj) => {
    setValues({
        ...mergeDeep(getNewYorkDeathsDefaultValue(), _NYDvalues),
        ps: getPageSize(_NYDvalues.ps),
        Death: {
            id: _NYDvalues?.d?.li?.i,
            name: _NYDvalues?.d?.l?.l,
            ...(DeathObj ? { levelData: DeathObj } : {}),
        },
    });
};
const getData = async (NYDsearch, history, setValues) => {
    if (NYDsearch) {
        const _values = decodeDataToURL(NYDsearch);
        let NYDeathObj = null;
        if (_values?.d?.li?.i) {
            NYDeathObj = await getLocationGUID(_values.d?.li?.i);
        }
        setFormData(setValues, _values, NYDeathObj);
    } else {
        history.push("/search/new-york-state-deaths");
    }
};
const genarateUrl = (formValues, history, page = 1) => {
    const _NYDValues = { ...formValues };

    if (!_NYDValues.fm.t) {
        delete _NYDValues.fm;
    }
    if (!_NYDValues.ln.t) {
        delete _NYDValues.ln;
    }
    if (_NYDValues.Death) {
        delete _NYDValues.Death;
    }
    updateFirstName(_NYDValues)
    if (!_NYDValues.matchExact) {
        delete _NYDValues.matchExact;
    }
    history.push(`?${encodeDataToURL({ ...formDataTrim(_NYDValues), pn: page })}`);
};

const SearchPageList = () => {
    const newRequest = useRef(true);
    const location = useLocation();
    const history = useHistory();
    const [isPageLoad, setisPageLoad] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [values, setValues] = useState(null);
    const [tableColWidth, setTableColWidth] = useState([]);
    const [tableColTotal, setTableColTotal] = useState(0);
    const [tableSize, setTableSize] = useState(null);
    const [valuesNew, setValuesNew] = useState(null);

    const { contentCatalog } = useSelector((state) => {
        return state.sidebar;
      });

    const { totalRecords, maskingFields } = useSelector(
        (state) => {
            return state.NYDeaths;
        }
    );
    
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const getNYDeathsList = useCallback(
        (formValues = values) => {
            if (formValues !== null) {
                const _values = getValuesForm(formValues);
                dispatch(submitNYDeathsForm(_values, newRequest.current));
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
        getData(location.search, history, setValues);
    }, [setValues, location.search, history]);
    useEffect(() => {
        getNYDeathsList();
        return () => {
            let pathName = history.location.pathname;
            if (pathName !== "/search/new-york-state-deaths/result" && pathName.split("/")?.[1] !== "records") {
                localStorage.removeItem('switch_status');
                dispatch(updateContentCatalog())
                dispatch(clearNYDeathsFormQuery())
            }
        }
    }, [dispatch,getNYDeathsList]);

    const { NYDeathsList, loading, NYDeathsPageLoading, error , fuzzyMatch } = useSelector(
        (state) => state.NYDeaths
    );

    const handleSubmitNYDeaths = (formValuesNY) => {
        newRequest.current = true;
        setShowModal(false);
        genarateUrl({...formValuesNY , f : false}, history);
    };
    const getNYDeathsListPage = (page) => {
        let data = { ...values, pn: page , f : fuzzyMatch };
        genarateUrl(data, history, page);
        setisPageLoad(false);
    };
    const changeLimit = (pageLimit) => {
        let data = { ...values, pn: 1, ps: pageLimit };
        genarateUrl(data, history);
        setisPageLoad(false);
    };

    useEffect(() => {
        dispatch(getNYDeathsDropdownList());
      }, [dispatch]);
  
    const NYDeathspageRecords = useMemo(() => {
        return pageRecordsCountfn(
            loading,
            error,
            totalRecords,
            values?.ps,
            values?.pn
        );
    }, [loading, error, totalRecords, values]);

    useEffect(() => {
        dispatch(ssdi({}));
    }, [dispatch]);


    const buttonTitle = getButtonTitle(values);
    const handleShowNYDModalNew = (bool) => {
        handleShowNYDModal(bool);
    };
    const getTableSize = (width) => {
        setTableSize(width);
    };
    const handleShowNYDModal = (bool) => {
        let formValue = mergeDeep(getNewYorkDeathsDefaultValue(), values);
        updateDefaultFirstName(bool , formValue , setValuesNew)
        setShowModal(bool);
    };

    const handleTableColWidth = (width) => {
        setTableColWidth(width);
    };
    const handleTableColTotal = (width) => {
        setTableColTotal(width);
    };
    const getDeathsHTMLData = () => {
        if (loading) {
            return (
                <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                    <div className="absolute top-50 z-50 top-2/4 left-2/4">
                        <NYDeathsLoader />
                    </div>
                </div>
            );
        } else {
            return NYDeathsList.length === 0 ? (
                <Norecords
                    searchResult={NYDeathsList}
                    isLoading={false}
                    firstName={getFirstName(values)}
                />
            ) : (
                <NYDeathsTable
                    tableSize={getTableSize}
                    handleTableColWidth={handleTableColWidth}
                    handleTableColTotal={handleTableColTotal}
                    data={NYDeathsList}
                    maskingFields={maskingFields}
                    error={error}
                    loading={loading}
                    isPageLoad={isPageLoad}
                    tableColWidth={tableColWidth}
                    tableColTotal={tableColTotal}
                    isNewSearch={true}
                />
            );
        }
    };
    return (
        <>
            <div className="page-wrap ww-results-wrap" id="NYDeaths-form">
                {NYDeathsPageLoading ? (
                    <div className="fixed w-full h-full z-1000 left-0 top-0 bg-white bg-opacity-60">
                        <div className="absolute top-50 z-50 top-2/4 left-2/4">
                            <NYDeathsLoader />
                        </div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="head w-full text-center mb-4">
                            {ListingPageheaderContent(contentCatalog?.collectionTitle)}
                            <div className="edit-new-link-wrap text-center mb-5 sml:hidden">
                                <div className="links w-full flex justify-center">
                                    <Button
                                        type="default"
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowNYDModal(true);
                                        }}
                                        title="Edit Search"
                                        fontWeight="medium"
                                    />
                                    <Button
                                        title="New Search"
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowNYDModalNew(true);
                                        }}
                                        type="default"
                                        fontWeight="medium"
                                    />
                                </div>
                            </div>
                            <div>
                                {NYDeathspageRecords !== 0 && (
                                    <p>
                                        <Typography
                                            fontFamily="primaryFont"
                                            size={14}
                                            text="secondary"
                                            weight="light"
                                        >

                                            {PaginationResult(
                                                t,
                                                NYDeathspageRecords,
                                                values?.ps,
                                                values?.pn,
                                                totalRecords
                                            )}

                                        </Typography>{" "}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="ww-grid">
                            <div className="relative ww-col-right">
                                <div className="flex">
                                    <div className="table-content bg-white sm:rounded-lg sm:shadow text-left">
                                        {getDeathsHTMLData()}
                                    </div>
                                </div>
                                <div className="px-3 sml:px-0 relative -top-4 sml:top-0 pb-2 sml:pb-5">
                                    <TWPaginationComponent
                                        tableSize={tableSize}
                                        currentPage={parseInt(values?.pn || 0)}
                                        totalRecords={totalRecords}
                                        limitPerPage={parseInt(values?.ps || 20)}
                                        getList={getNYDeathsListPage}
                                        changeLimit={changeLimit}
                                    />
                                </div>
                            </div>
                            <div
                                className={ClassNames("mb-8 sidebar-search hidden flex-col", {
                                    "sml:flex": !NYDeathsPageLoading && !loading,
                                })}
                            >
                                <div className="bg-white sm:rounded-lg shadow p-3 md:py-5 md:px-6">
                                    <div className="head">
                                        <h2 className="mb-3">
                                            <Typography
                                                fontFamily="primaryFont"
                                                text="secondary"
                                                weight="medium"
                                            >
                                                Revise Search
                                            </Typography>
                                        </h2>
                                    </div>
                                    <NYDeathsRefineSearch
                                        width={""}
                                        handleSubmitNYDeaths={handleSubmitNYDeaths}
                                        NYDeathsDefaultValues={values}
                                        handleShowModal={handleShowNYDModal}
                                        buttonTitle="Update"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/*Modal Tailwind Form*/}
                <TailwindModal
                    title={contentCatalog?.collectionTitle}
                    showClose={true}
                    content={
                        <NYDeathsSearchForm
                            inputWidth={""}
                            width={"sm:w-1/2"}
                            handleSubmitNewYork={handleSubmitNYDeaths}
                            defaultValues={valuesNew}
                            NewYorkClear={false}
                            buttonTitle={buttonTitle}
                        />
                    }
                    showModal={showModal}
                    setShowModal={setShowModal}
                    isPropagation={false}
                />
            </div>
        </>
    );
};
export default SearchPageList;
