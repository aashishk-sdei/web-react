import { v4 as uuidv4 } from "uuid";
import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import {callApi } from "../utils";
import { addMessage } from "./toastr";
import { setMiloDetails } from "./user";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const addMiloDetails = (data , setShowModal , resetForm) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.milopreferences}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.ADDMILODETAILS.REQUEST });
    callApi(getState, "POST", url, data, false, staticHeader)
      .then(() => {
        dispatch({ type: CONSTANTS.ADDMILODETAILS.SUCCESS});
        dispatch(setMiloDetails(data))
        dispatch(addMessage("Milo details added successfully", "success"))
        resetForm()
        setShowModal(false)
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.ADDMILODETAILS.FAILURE });
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};


export const updateMiloDetails = (payload , data) => {
    return (dispatch, getState) => {
        let url = `${API_URLS.milopreferencesupdate}`,
            staticHeader = createHeader();
        dispatch({ type: CONSTANTS.UPDATEMILODETAILS.REQUEST });
        callApi(getState, "POST", url, payload, false, staticHeader)
            .then(() => {
                dispatch({ type: CONSTANTS.UPDATEMILODETAILS.SUCCESS });
                dispatch(setMiloDetails(data))
                dispatch(addMessage("Milo details updated successfully", "success"))
            })
            .catch(() => {
                dispatch({ type: CONSTANTS.UPDATEMILODETAILS.FAILURE });
                dispatch(addMessage("Something went wrong", "error"))
            });
    };
};