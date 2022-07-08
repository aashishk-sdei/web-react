import * as CONSTANTS from './../constants/actionTypes';
import * as API_URLS from './../constants/apiUrl';

export const setPersonStory = (params, newRequest = true) => {
    return (dispatch, getState) => {
      let url = API_URLS.getPublications + `?` + params,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.REPORTSTORY.REQUEST));
      } else {
        dispatch(actionCreator(CONSTANTS.REPORTSTORY.FAILURE));
      }
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then((res) => {
          dispatch(actionCreator(CONSTANTS.REPORTSTORY.SUCCESS, res.data));
        })
        .catch((err) => {
          dispatch(actionCreator(CONSTANTS.REPORTSTORY.FAILURE, err));
        });
    };
  };