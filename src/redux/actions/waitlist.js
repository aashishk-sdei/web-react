import { callApi } from "../utils";
import * as API_URLS from "../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { addMessage } from "./toastr";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};

export const isEmailWhitelist = (userEmail, formik, handleLogin, handleSignup, setStepFunction, setNotIntheWhitelist, alreadyViewed) => {
  return (dispatch, getState) => {
    let url = API_URLS.isUserEmailWhitelist(userEmail),
      staticHeader = createHeader();
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then(async (_res) => {
        if (_res.data) {
          try {
            let _url = API_URLS.checkADB2CUserByEmail(userEmail),
              staticheader = createHeader(),
              userExistsApi = await callApi(getState, "GET", _url, {}, false, staticheader);
            if (userExistsApi.data) {
              setStepFunction(0)
              if (alreadyViewed) {
                localStorage.setItem("loggedInViaWhitelist", true)
              }
              handleLogin();
            } else {
              setStepFunction(0)
              handleSignup();
            }
          } catch (error) {
            formik.setSubmitting(false)
            dispatch(addMessage(error, "error"));
          }
        } else {
          formik.setSubmitting(false)
          setStepFunction(1)
          setNotIntheWhitelist(true)
        }
        return _res.data
      })
      .catch((err) => {
        formik.setSubmitting(false)
        dispatch(addMessage(err, "error"));
        return err?.response?.data;
      });
  };
};

export const addUserDetailsToWaitlist = (userName, userEmail, competitorsEmailDomainCheck, setStepFunction, formik) => {
  return (dispatch, getState) => {
    let url = API_URLS.addUserToWaitList(userName, userEmail),
      staticHeader = createHeader();
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then((_res) => {
        if (_res.status === 200) {
          if (competitorsEmailDomainCheck(userEmail)) {
            setStepFunction(4)
          } else {
            setStepFunction(3)
          }
        }
        formik.setSubmitting(false)
        return _res.data;
      })
      .catch(() => {
        formik.setSubmitting(false)
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};

