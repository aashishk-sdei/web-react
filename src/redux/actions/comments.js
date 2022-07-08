import { actionCreator, callApi } from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import {CLEARCOMMENTS} from "../constants/index"

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};

export const getComments = ({ pageNumber = 1, pageSize = 10,storyId,loadMordata }) => {
  return (dispatch, getState) => {
    let url = API_URLS.getComments(pageNumber, pageSize, storyId);
    let staticHeader = createHeader();

    dispatch(actionCreator(CONSTANTS.GETCOMMENTS.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        if(res?.data?.length < 20){
          loadMordata.current = false
        }
        if (pageNumber === 2 && getState().comments.list.length <= 0) {
          setTimeout(() => {
            dispatch(actionCreator(CONSTANTS.GETCOMMENTS.SUCCESS, res.data));
          }, 1000);
        } else {
          dispatch(actionCreator(CONSTANTS.GETCOMMENTS.SUCCESS, res.data));
        }
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.GETCOMMENTS.FAILURE, err));
      });
  };
};
export const addComments = (data) => {
  return (dispatch, getState) => {
    let commentobj = {
      content:data.content,
      storyId: data.storyId,
      commentId:data.commentId,
      commenterProfileImageUrl:data.commenterProfileImageUrl,
    }
    let url = API_URLS.addComments()
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.ADDCOMMENTS.REQUEST));
    callApi(getState, "POST", url, commentobj, false, staticHeader)
      .then((_res) => {
        dispatch(actionCreator(CONSTANTS.ADDCOMMENTS.SUCCESS, data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.ADDCOMMENTS.FAILURE, err));
      });
  };
};
export const countComments = (storyId) => {
  return (dispatch, getState) => {
    let url = API_URLS.countcomments(storyId);
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.COUNTCOMMENTS.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.COUNTCOMMENTS.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.COUNTCOMMENTS.FAILURE, err));
      });
  };
};

export const clearComments = () => {
  return (dispatch) => {
    dispatch(actionCreator(CLEARCOMMENTS,[]))
  };
}
