import { actionCreator, callApi } from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { addMessage } from "./toastr";
import { v4 as uuidv4 } from "uuid";
import { SETMEMBERFOLLOWUNFOLLOW } from "../constants";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};

export const getFollowers = ({ pageNumber = 1, pageSize = 10 }) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.getFollowers}/${pageNumber}/${pageSize}`;
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETFOLLOWER.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETFOLLOWER.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getFollowings = ({ pageNumber = 1, pageSize = 10 }) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.getFollowings}/${pageNumber}/${pageSize}`;
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETFOLLOWING.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        res.data.forEach((e) => {
          e.isBidirectional = true;
        });
        dispatch(actionCreator(CONSTANTS.GETFOLLOWING.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const dispatchFollowUnfollow = (username, index, type, dispatch, reducerConst, modalType) => {
  if (type === "FOLLOW") {
    dispatch(actionCreator(reducerConst, { index, isFollow: true, modalType }));
    dispatch(addMessage(`You are now following ${username}`, "success"));
    dispatch(actionCreator(CONSTANTS.SETFOLLOWUNFOLLOWCOUNTUPDATE.SUCCESS, 1));
  } else {
    dispatch(actionCreator(reducerConst, { index, isFollow: false, modalType }));
    dispatch(actionCreator(CONSTANTS.SETFOLLOWUNFOLLOWCOUNTUPDATE.SUCCESS, -1));
    dispatch(addMessage(`You are no longer following ${username}`, "success"));
  }
};




const dispatchShowMessage = (username, type, dispatch) => {
  if (type === "FOLLOW") {
    dispatch(addMessage(`You are now following ${username}`, "success"));
  } else {
    dispatch(addMessage(`You are no longer following ${username}`, "success"));
  }
};

export const setFollowUnollow = (username, userId, index, type, fromWhere = "STORY", modalType = "") => {
  return (dispatch, getState) => {
    let url,
      staticHeader = createHeader();
    if (type === "FOLLOW") {
      url = `${API_URLS.setfollowUser}/${userId}`;
    } else {
      url = `${API_URLS.setUnfollowUser}/${userId}`;
    }
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then((res) => {
        switch (fromWhere) {
          case 'LIKEMOADL':
            dispatchFollowUnfollow(username, index, type, dispatch, CONSTANTS.SETFOLLOWUNFOLLOWLIKE.SUCCESS, modalType)
            break;
          case 'MODAL':
            dispatchFollowUnfollow(username, index, type, dispatch, CONSTANTS.SETFOLLOWUNFOLLOWMODAL.SUCCESS, modalType);
            break;
          case 'STORY':
            dispatchFollowUnfollow(username, index, type, dispatch, CONSTANTS.SETFOLLOWUNFOLLOW.SUCCESS, modalType);
            break;
          case 'MEMBER':
            dispatch({ type: SETMEMBERFOLLOWUNFOLLOW, payload: type !== "FOLLOW" ? false : true });
            dispatchShowMessage(username, type, dispatch);
            break;
          default:
            dispatchFollowUnfollow(username, index, type, dispatch, CONSTANTS.SETFOLLOWUNFOLLOWVIEWSTORY.SUCCESS, modalType);

        }
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getFollowUnfollowCount = () => {
  return (dispatch, getState) => {
    let url = `${API_URLS.getFollowUnfollowCount}`,
      staticHeader = createHeader();
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETFOLLOWUNFOLLOWCOUNT.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getFollowUnfollowDetail = (userId) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.getFollowUnfollowDetail}/${userId}`,
      staticHeader = createHeader();
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETFOLLOWUNFOLLOWDETAIL.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
export const getFollowUnfollowDetailClear = () => {
  return (dispatch, _getState) => {
    dispatch(actionCreator(CONSTANTS.GETFOLLOWUNFOLLOWDETAILCLEAR));
  };
};
