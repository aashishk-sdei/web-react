import * as CONSTANTS from "../constants/actionTypes";
import { actionCreator, callApi, getElasticQuery } from "../utils";
import * as API_URLS from "../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { encodeDataToURL, formDataTrim, CivilWarPK } from "../../utils";
import { getHeadersCountNew, dataListRecordsNew } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getCivilWarDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.CIVILWARDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(CivilWarPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.CIVILWARDROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.CIVILWARDROPDOWN.FAILURE));
      });
  };
};
export const getCensusURLString = (_values) => {
  if (_values?.r?.rp?.li?.i === "") {
    delete _values.r.rp.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitCivilWarForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().UsCensus1901,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getCensusURLString(valueData),
        url = API_URLS.CIVILWAR + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.CIVILWARPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.CIVILWAR.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.CIVILWAR.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = CivilWarPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: CivilWarPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(getState, "GET", _url, {}, false, staticheader);
          const usFederal1901DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, contentCatalog.collectionTitle))
          dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
          let dataSource = [],
            maskedList = [];
          getHeadersCountNew(contentCatalog, cKeys);
          maskedList = dataListRecordsNew(usFederal1901DataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.CIVILWARSEARCHQUERY.SUCCESS, _value));
          dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, usFederal1901DataList?.documents));
          dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog));
          dispatch(actionCreator(CONSTANTS.CIVILWAR.SUCCESS, dataSource));
          dispatch(actionCreator(CONSTANTS.CIVILWARPAGINATION.SUCCESS, usFederal1901DataList.total !== -1 ? usFederal1901DataList.total : 0));
          dispatch(actionCreator(CONSTANTS.CIVILWARMASKINGFIELD.SUCCESS, maskedList));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.CIVILWAR.FAILURE));
        });
    }
  };
};
export const clearCivilWarFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.CIVILWARSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.CIVILWARPAGINATION.SUCCESS, 0));
  };
};
