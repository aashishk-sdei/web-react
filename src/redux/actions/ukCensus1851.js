import * as CONSTANTS from "../constants/actionTypes";
import { actionCreator, callApi, getElasticQuery } from "../utils";
import * as API_URLS from "../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { encodeDataToURL, formDataTrim, UkFederal1851PK } from "../../utils";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUkCensus1851DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(UkFederal1851PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.FAILURE));
      });
  };
};
export const getCensusURLString = (_values) => {
  if (_values?.b?.li?.i === "") {
    delete _values.b.li.i;
  }
  if (_values?.r?.rp?.li?.i === "") {
    delete _values.r.rp.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUkCensus1851Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().ukCensus1851,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getCensusURLString(valueData),
        url = API_URLS.UKFEDERALCENSUS1851 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851PAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = UkFederal1851PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: UkFederal1851PK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(getState, "GET", _url, {}, false, staticheader);
          const ukFederal1851DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
            dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
            dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
            dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));
          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(ukFederal1851DataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851SEARCHQUERY.SUCCESS, _value));
          dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, ukFederal1851DataList?.documents));
          dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog));
          dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851.SUCCESS, dataSource));

          dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851PAGINATION.SUCCESS, ukFederal1851DataList.total !== -1 ? ukFederal1851DataList.total : 0));
          dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851MASKINGFIELD.SUCCESS, maskedList));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851.FAILURE));
        });
    }
  };
};
export const clearuk1851FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851SEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.UKFEDERALCENSUS1851PAGINATION.SUCCESS, 0));
  };
};
