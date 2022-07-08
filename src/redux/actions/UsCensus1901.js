import * as CONSTANTS from "../constants/actionTypes";
import { actionCreator, callApi, getElasticQuery } from "../utils";
import * as API_URLS from "../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { encodeDataToURL, formDataTrim, USFederal1901PK } from "../../utils";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUsCensus1901DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1901PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901DROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901DROPDOWN.FAILURE));
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
export const submitUsCensus1901Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().UsCensus1901,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getCensusURLString(valueData),
        url = API_URLS.USFEDERALCENSUS1901 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901PAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1901PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: USFederal1901PK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(getState, "GET", _url, {}, false, staticheader);
          const usFederal1901DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
            dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
            dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
            dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));

          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(usFederal1901DataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901SEARCHQUERY.SUCCESS, _value));
          dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, usFederal1901DataList?.documents));
          dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog));
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901.SUCCESS, dataSource));

          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901PAGINATION.SUCCESS, usFederal1901DataList.total !== -1 ? usFederal1901DataList.total : 0));
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901MASKINGFIELD.SUCCESS, maskedList));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901.FAILURE));
        });
    }
  };
};
export const clearUs1901FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901SEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1901PAGINATION.SUCCESS, 0));
  };
};
