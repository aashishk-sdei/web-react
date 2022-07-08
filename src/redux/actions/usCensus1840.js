import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi, getElasticQuery } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USFederal1840PK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSFederal1840DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1840DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1840PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1840DROPDOWN.SUCCESS, res.data)
        );
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1840DROPDOWN.FAILURE));
      });
  };
};
export const getUSFederal1840URLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederal1840Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().usCensus1840,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSFederal1840URLString(valueData),
        url = API_URLS.USFEDERALCENSUS1840 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1840PAGINATION.REQUEST)
        );
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1840MASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1840.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1840PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: USFederal1840PK,
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
          const usFederal1840DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
            dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
            dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
            dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));
          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(
            usFederal1840DataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1840SEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usFederal1840DataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERALCENSUS1840.SUCCESS, dataSource)
          );

          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1840PAGINATION.SUCCESS,
              usFederal1840DataList.total !== -1
                ? usFederal1840DataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1840MASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1840.FAILURE));
        });
    }
  };
};
export const clearUsFederal1840FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USFEDERALCENSUS1840SEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1840PAGINATION.SUCCESS, 0));
  };
};
