import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi, getElasticQuery } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, NewYorkPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getNYDeathsURLString = (_values) => {
  if (_values?.d?.li?.i === "") {
    delete _values.d.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const getNYDeathsDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.NYDEATHSDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(NewYorkPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.NYDEATHSDROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.NYDEATHSDROPDOWN.FAILURE));
      });
  };
};

export const submitNYDeathsForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().NYDeaths,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getNYDeathsURLString({
          ...formDataTrim(valueData),
        }),
        url = API_URLS.NYDEATHS + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.NYDEATHSPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.NYDEATHSMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.NYDEATHS.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = NewYorkPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: NewYorkPK,
            }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const NewYorkDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
            dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
            dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
            dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));
          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(
            NewYorkDataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(CONSTANTS.NYDEATHSSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              NewYorkDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.NYDEATHS.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.NYDEATHSPAGINATION.SUCCESS,
              NewYorkDataList.total !== -1
                ? NewYorkDataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.NYDEATHSMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.NYDEATHS.FAILURE));
        });
    }
  };
};
export const clearNYDeathsFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.NYDEATHSSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.NYDEATHSPAGINATION.SUCCESS, 0));
  };
};
