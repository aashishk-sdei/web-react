import { v4 as uuidv4 } from "uuid";
import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import {callApi } from "../utils";
import { addMessage } from "./toastr";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const submitCCPA = (data , resetForm) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.ccpa}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.CCPA.REQUEST });
    callApi(getState, "PUT", url, data, false, staticHeader)
      .then(() => {
        dispatch({ type: CONSTANTS.CCPA.SUCCESS});
        resetForm()
        dispatch(addMessage("Submitted successfully", "success"))
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.CCPA.FAILURE });
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};
