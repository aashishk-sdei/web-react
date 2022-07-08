import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi, getElasticQuery } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, irishPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getIrishDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.IRISHDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(irishPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.IRISHDROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.IRISHDROPDOWN.FAILURE));
      });
  };
};
export const getIrishURLString = (_values) => {
  if (_values?.pr?.li?.i === "") {
    delete _values.pr.li.i;
  }
  if (_values?.pd?.li?.i === "") {
    delete _values.pd.li.i;
  }
  if (_values?.id?.li?.i === "") {
    delete _values.id.li.i;
  }
  if (_values?.b?.y?.y === "") {
    delete _values.b.y.y;
  }
  return encodeDataToURL({ ..._values });
};
export const submitIrishForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().irish,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getIrishURLString({ ...formDataTrim(valueData) }),
        url = API_URLS.IRISHSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.IRISHPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.IRISHMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.IRISH.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = irishPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: irishPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const irishDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
            dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
            dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
            dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));
          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(irishDataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.IRISHSEARCHQUERY.SUCCESS, _value));
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              irishDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.IRISH.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.IRISHPAGINATION.SUCCESS,
              irishDataList.total !== -1 ? irishDataList.total : 0
            )
          );
          dispatch(
            actionCreator(CONSTANTS.IRISHMASKINGFIELD.SUCCESS, maskedList)
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.IRISH.FAILURE));
        });
    }
  };
};
export const clearIrishFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.IRISHSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.IRISHPAGINATION.SUCCESS, 0));
  };
};
