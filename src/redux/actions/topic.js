import { v4 as uuidv4 } from "uuid";
import { getOwner } from "../../services";
import { CURRENTTOPICCLEAR, GET } from "../constants";
import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { apiRequest } from "../requests";
import { actionCreator, callApi } from "../utils";
import { addMessage } from "./toastr";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const getTopics = () => {
  return (dispatch, getState) => {
    let url = `${API_URLS.GetTopics()}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.TOPICS.REQUEST });
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch({ type: CONSTANTS.TOPICS.SUCCESS, payload: res.data });
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.TOPICS.FAILURE });
      });
  };
};

export const assignTopicToStory = (story, storyIndex, topicData, resetForm) => {
  return (dispatch, getState) => {
    const storyId = story?.storyId;
    const topicId = topicData.topicId;
    let url = `${API_URLS.assignTopicToStory({ storyId, topicId })}`,
      staticHeader = createHeader();

    dispatch({ type: CONSTANTS.ASSIGNTOPICTOSTORY.REQUEST });
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then(() => {
        const arr = story?.topics;
        arr.push(topicId);
        const payload = {
          storyIndex: storyIndex,
          storyId: story?.storyId,
          arr: arr,
        };
        dispatch({ type: CONSTANTS.ASSIGNTOPICTOSTORY.SUCCESS, payload });
        dispatch(addMessage("Topic Assigned to Story", "success"));
        resetForm();
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.ASSIGNTOPICTOSTORY.FAILURE });
        dispatch(addMessage("Some Error Occured", "error"));
      });
  };
};

export const removeTopicFromStory = (data, storyIndex) => {
  return (dispatch, getState) => {
    const storyId = data.storyId;
    const topicId = data.topicId;
    let url = `${API_URLS.removeTopicFromStory({ storyId, topicId })}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.REMOVETOPICFROMSTORY.REQUEST });
    callApi(getState, "POST", url, data, false, staticHeader)
      .then(() => {
        const payload = {
          storyId: data.storyId,
          topicId: data.topicId,
          storyIndex: storyIndex,
        };
        dispatch({ type: CONSTANTS.REMOVETOPICFROMSTORY.SUCCESS, payload });
        dispatch(addMessage("Topic Removed From Story", "success"));
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.REMOVETOPICFROMSTORY.FAILURE });
        dispatch(addMessage("Some Error Occured", "error"));
      });
  };
};

const getAdminStoriesAPICall = (getState, url, requestData, staticHeader, newRequest, dispatch, isPaginationLoading) => {
  isPaginationLoading.current = true;
  callApi(getState, "GET", url, requestData, false, staticHeader)
    .then((res) => {
      const dataRespo = res.data;
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GETADMINSTORIES.SUCCESS, dataRespo));
      } else {
        dispatch(actionCreator(CONSTANTS.GETADMINSTORIESPAGINATION.SUCCESS, dataRespo));
        isPaginationLoading.current = false;
      }
    })
    .catch((err) => {
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GETADMINSTORIES.FAILURE, err?.response?.status));
      } else {
        dispatch(actionCreator(CONSTANTS.GETADMINSTORIESPAGINATION.FAILURE, err));
        isPaginationLoading.current = false;
      }
    });
};

export const getAdminStories = (data, newRequest = true, isPaginationLoading = {}) => {
  return (dispatch, getState) => {
    let url = API_URLS.getAdminStories(data),
      staticHeader = createHeader();

    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETADMINSTORIES.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETADMINSTORIESPAGINATION.REQUEST));
    }
    getAdminStoriesAPICall(getState, url, data, staticHeader, newRequest, dispatch, isPaginationLoading);
  };
};

export const getAdminStoryAndUpdateList = (data) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewAdminStory(data),
      staticHeader = createHeader();
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then(async (res) => {
        let userUrl = API_URLS.getADB2CUserInfo(res?.data?.authorId),
          folloInfoUrl = `${API_URLS.getFollowUnfollowDetail}/${res?.data?.authorId}`,
          followbool = await callApi(getState, "GET", folloInfoUrl, {}, false, staticHeader),
          authorData = await callApi(getState, "GET", userUrl, {}, false, staticHeader);
        res.data.author = authorData?.data;
        res.data.isFollow = followbool?.data;
        dispatch(actionCreator(CONSTANTS.GETADMINSTORYANDUPDATELIST.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const getAdminStoriesCountAPICall = (getState, url, requestData, staticHeader, dispatch) => {
  callApi(getState, "GET", url, requestData, false, staticHeader)
    .then((res) => {
      dispatch(actionCreator(CONSTANTS.GETADMINSTORIESCOUNT.SUCCESS, res.data?.resultData?.AllStoryCount || 0));
    })
    .catch(() => {
      dispatch(actionCreator(CONSTANTS.GETADMINSTORIESCOUNT.FAILURE, {}));
    });
};

export const getAdminStoriesCount = () => {
  let requestData = { authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getAdminStoriesCount,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETADMINSTORIESCOUNT.REQUEST));
    getAdminStoriesCountAPICall(getState, url, requestData, staticHeader, dispatch);
  };
};
export const getTopicByName = (topicName) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.GetTopicByName(topicName)}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.TOPICBYID.REQUEST });
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch({ type: CONSTANTS.TOPICBYID.SUCCESS, payload: res.data });
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.TOPICBYID.FAILURE });
      });
  };
};

export const followTopic = (topicId, setFollow) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.followTopic(topicId)}`,
      staticHeader = createHeader();

    dispatch({ type: CONSTANTS.FOLLOWTOPIC.REQUEST });
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then(() => {
        dispatch({ type: CONSTANTS.FOLLOWTOPIC.SUCCESS });
        dispatch(actionCreator(CONSTANTS.SETFOLLOWUNFOLLOWCOUNTUPDATE.SUCCESS, 1));
        setFollow();
        dispatch(addMessage("Topic Followed", "success"));
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.FOLLOWTOPIC.FAILURE });
        dispatch(addMessage("Some Error Occured", "error"));
      });
  };
};

export const unFollowTopic = (topicId, setFollow) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.unFollowTopic(topicId)}`,
      staticHeader = createHeader();

    dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.REQUEST });
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then(() => {
        dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.SUCCESS });
        setFollow();
        dispatch(addMessage("Topic Unfollowed", "success"));
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.FAILURE });
        dispatch(addMessage("Some Error Occured", "error"));
      });
  };
};

export const getFollowedTopics = ({ topicpageNumber = 1, pageSize = 10 }) => {
  return (dispatch, getState) => {
    const pageNumber = topicpageNumber;
    let url = `${API_URLS.getFollowedTopics}/${pageNumber}/${pageSize}`;
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETFOLLOWEDTOPICS.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETFOLLOWEDTOPICS.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const getTopicbyId = (topicId) => {
  return (dispatch, getState) => {
    let url = API_URLS.getTopicbyId(topicId),
      staticHeader = createHeader();
    return callApi(getState, "GET", url, {}, false, staticHeader)
      .then(async (res) => {
        await apiRequest(GET, `TopicAuthority/id/${topicId}`).then((topicres) => {
          dispatch(actionCreator(CONSTANTS.GETTOPICBYID.SUCCESS, { ...res.data, primaryUrl: topicres.data.primaryUrl }));
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const clearFollowedTopicList = () => {
  return (dispatch, _getState) => {
    dispatch(actionCreator(CONSTANTS.CLEARTOPICLIST.SUCCESS));
  };
};

export const currentTopicClear = () => {
  return (dispatch) => {
    dispatch({ type: CURRENTTOPICCLEAR });
  };
};

export const unFollowTopicModal = (topicId, setIsFollowed) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.unFollowTopic(topicId)}`,
      staticHeader = createHeader();

    dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.REQUEST });
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then(() => {
        const payload = topicId;
        dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.SUCCESS, payload });
        dispatch(actionCreator(CONSTANTS.SETFOLLOWUNFOLLOWCOUNTUPDATE.SUCCESS, -1));
        setIsFollowed(true);
        dispatch(addMessage("Topic Unfollowed", "success"));
      })
      .catch(() => {
        dispatch({ type: CONSTANTS.UNFOLLOWTOPIC.FAILURE });
        dispatch(addMessage("Some Error Occured", "error"));
      });
  };
};

export const isImgvalid = (payload) => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.ISIMGVALID.SUCCESS, payload));
  };
};
