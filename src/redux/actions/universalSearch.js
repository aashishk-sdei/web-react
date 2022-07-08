import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { getuniversalQuery } from "./../../utils";
import { actionCreator, callApi, getElasticQuery, getUSFieldValue } from "./../utils";
import fieldList from "./../utils/fieldList.json";
import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const getFielddata = (appenedFiles, name, item, filed, maskingFields) => {
  let data = [],
    mask = [];
  item.assertions.forEach((element) => {
    if (element[filed[0].key]) {
      getUSFieldValue(data, mask, filed[0], element, maskingFields);
    }
  });
  if (data.length !== 0) {
    appenedFiles.push({
      key: name,
      value: data,
      mask: mask[0],
    });
  }
};
export const submitUniversalSearchForm = (value, isLoggedIn) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().search;
    if (sQuery !== value.query) {
      dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCH.REQUEST));
      let query = await getuniversalQuery(value.query);
      let url = `${API_URLS.CONTENTSEARCH}?${query}`,
        staticHeader = createHeader();
      staticHeader.isloggedin = isLoggedIn;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then((res) => {
          let dataResponse = res.data;
          dispatch(actionCreator(CONSTANTS.SET_COLLECTION_NAME, "Universal Search"))
          dispatch(actionCreator(CONSTANTS.SET_ELASTIC_QUERY, getElasticQuery(res)));
          dispatch(actionCreator(CONSTANTS.SET_FUZZY_MATCH, res?.data?.fuzzyMatch));

          dataResponse.documents = dataResponse.documents.map((item) => {
            let appenedFiles = [];
            fieldList.forEach((_filed) => {
              if (typeof _filed.label === "string") {
                item && getFielddata(appenedFiles, _filed.label, item, _filed.data, dataResponse.maskingFields);
              }
            });
            return { ...item, appenedFiles: appenedFiles };
          });
          dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCHQUERY.SUCCESS, value.query));
          dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, dataResponse?.documents));
          dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCH.SUCCESS, dataResponse));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCH.FAILURE));
        });
    }
  };
};
export const collectionDropdown = () => {
  return (dispatch, getState) => {
    let url = `${API_URLS.collectionDropDown}`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.COLEECTIONDROPDOWN.REQUEST));

    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        const dataResponse = res.data;
        dispatch(actionCreator(CONSTANTS.COLEECTIONDROPDOWN.SUCCESS, dataResponse));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.COLEECTIONDROPDOWN.FAILURE));
      });
  };
};

export const getImageFromImageId = ({ partitionKey, imageId = uuidv4() }) => {
  let getState = () => {
      return {};
    },
    url = `${API_URLS.getImageFromImageId}/${partitionKey}/${imageId}.jpg`,
    staticHeader = createHeader();
  return callApi(getState, "GET", url, {}, false, staticHeader)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return "";
    });
};

export const placeAuthority = (value) => {
  let getState = () => {
      return {};
    },
    url = `${API_URLS.PLACEAUTHIRITY}/${value}`,
    staticHeader = createHeader();
  return callApi(getState, "GET", url, value, false, staticHeader)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export const placeAuthorityAll = (value) => {
  let getState = () => {
      return {};
    },
    url = `${API_URLS.PLACEAUTHIRITYALL}?LI=${value}`,
    staticHeader = createHeader();
  return callApi(getState, "GET", url, value, false, staticHeader)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
export const clearUniversalFormQuery = (payload) => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.UNIVERSALSEARCH.FAILURE));
  };
};

export const getEventDropdown = () => {
  return (dispatch, getState) => {
    let url = `${API_URLS.eventDropDown}`,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.LIFEEVENTDROPDOWN.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.LIFEEVENTDROPDOWN.SUCCESS, res.data));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.LIFEEVENTDROPDOWN.FAILURE));
      });
  };
};

export const getSearchPeople = (reqId, page, str) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.SEARCHPEOPLE(reqId, page, str)}`,
      staticHeader = createHeader();
    if (reqId) staticHeader["wa-requestId"] = reqId;
    dispatch(actionCreator(CONSTANTS.SEARCHPEOPLE.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        let data = [];
        if (res.data) {
          data = res.data.map((item) => ({ ...item, name: `${item.givenName} ${item.surname}` }));
        }
        if (page === 1) {
          dispatch(actionCreator(CONSTANTS.SEARCHPEOPLE.SUCCESS, data));
        } else {
          dispatch(actionCreator(CONSTANTS.SEARCHPEOPLEPAGINATE.SUCCESS, res.data));
        }
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.SEARCHPEOPLE.FAILURE));
      });
  };
};
