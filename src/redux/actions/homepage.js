import * as API_URLS from "./../constants/apiUrl";
import * as CONSTANTS from "./../constants/actionTypes";
import { getOwner, getRecentTree, setRecentTree } from "../../services";
import { v4 as uuidv4 } from "uuid";
import { POST, CLEAR_STORY_LIKES_PERSONS, MILO_MODAL, GET } from "../constants";
import { actionCreator, callApi } from "../utils";
import { apiRequest } from "../requests";
import { addMessage } from "./toastr";
import { updateTreesOptimistically } from "../helpers/homePagePayloads";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};

const getTotalStoriesCount = (dispatch, requestId) => {
  apiRequest(GET, `Topic/storiesCount/${requestId}`).then((res) => {
    const totalCount = res.data;
    dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.SUCCESS, totalCount));
  });
};

const getStoriesAPICall = (getState, url, requestData, staticHeader, newRequest, dispatch, { isPaginationLoading, moreDataAvail, getTotalStories = false }) => {
  isPaginationLoading.current = true;
  callApi(getState, "GET", url, requestData, false, staticHeader)
    .then((res) => {
      const { stories } = getState().homepage;
      const dataRespo = res.data;
      if (!dataRespo.length && moreDataAvail?.current) {
        moreDataAvail.current = false;
      }
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GETSTORIES.SUCCESS, dataRespo));
        if (getTotalStories) {
          getTotalStoriesCount(dispatch, requestData.requestId);
        }
      } else {
        if (requestData.pageNumber === 2 && stories.length === 0) {
          setTimeout(() => {
            dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.SUCCESS, dataRespo));
            isPaginationLoading.current = false;
          }, 3500);
        } else {
          dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.SUCCESS, dataRespo));
          isPaginationLoading.current = false;
        }
      }
    })
    .catch((err) => {
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GETSTORIES.FAILURE, err?.response?.data));
      } else {
        dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.FAILURE, err));
        isPaginationLoading.current = false;
      }
    });
};
export const getStories = (data, newRequest = true, isPaginationLoading = {}, homepage = false, moreDataAvail = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.getOwnStories(data),
      staticHeader = createHeader();
    if (homepage) {
      url = API_URLS.getHomepageStories(data);
    }
    if (data.treeId) {
      url = API_URLS.getStories(data);
    }
    if (data.categoryName) {
      if (data.categoryName === "Drafts") {
        url = url + `?storyStatus=Draft`;
      } else {
        url = url + `?categoryName=${data.categoryName}`;
      }
    }
    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETSTORIES.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.REQUEST));
    }
    getStoriesAPICall(getState, url, data, staticHeader, newRequest, dispatch, { isPaginationLoading, moreDataAvail, getTotalStories: false });
  };
};

export const getHomeStoryAndUpdateList = (data) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStory(data),
      staticHeader = createHeader();
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then(async (res) => {
        let reportUrl = API_URLS.countcomments(res?.data?.storyId)
        let commentsapi = null
        if(data?.showComment){
          commentsapi = await callApi(getState, "GET", reportUrl, {}, false, staticHeader);
        }
        let userUrl = API_URLS.getADB2CUserInfo(res?.data?.authorId),
          folloInfoUrl = `${API_URLS.getFollowUnfollowDetail}/${res?.data?.authorId}`,
          followbool = await callApi(getState, "GET", folloInfoUrl, {}, false, staticHeader),
          authorData = await callApi(getState, "GET", userUrl, {}, false, staticHeader),
          reportcount =  commentsapi;
        res.data.author = authorData?.data;
        res.data.isFollow = followbool?.data;
        res.data.isReportCount = reportcount?.data
         dispatch(actionCreator(CONSTANTS.GETHOMESTORYANDUPDATELIST.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

const getStoriesCountAPICall = (getState, url, requestData, staticHeader, dispatch) => {
  callApi(getState, "GET", url, requestData, false, staticHeader)
    .then((res) => {
      dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.SUCCESS, res.data?.resultData?.AllStoryCount || 0));
    })
    .catch((_err) => {
      dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.FAILURE, {}));
    });
};

export const getStoriesCount = () => {
  let requestData = { authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getStoriesCount(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.REQUEST));
    getStoriesCountAPICall(getState, url, requestData, staticHeader, dispatch);
  };
};

export const getTreesListAsync = () => {
  let requestData = { authorId: getOwner() };
  let url = API_URLS.getTreesASYNC(requestData),
    staticHeader = createHeader();
  return apiRequest("GET", url, requestData, false, staticHeader)
    .then((res) => {
      return res.data || [];
    })
    .catch((_err) => {
      return [];
    });
};

export const updateTreeName = (trees, treeId, treeName) => async (dispatch) => {
  try {
    const payload = updateTreesOptimistically(trees, treeId, treeName);
    dispatch({
      type: CONSTANTS.UPDATE_TREENAME_SUCCESS,
      payload: payload,
    });
    await apiRequest("PUT", `Trees/treename/${treeId}/${treeName}`);
    dispatch(addMessage("updateTreeName.success", "success"));
  } catch (err) {
    dispatch(addMessage("updateTreeName.failure", "error"));
    dispatch({
      type: CONSTANTS.UPDATE_TREENAME_FAILURE,
      payload: { msg: err },
    });
  }
};
export const getTreesList = () => {
  let requestData = { authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getTreesList(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETTREESLIST.REQUEST));
    callApi(getState, "GET", url, requestData, false, staticHeader)
      .then((res) => {
        const latestTree = getRecentTree();
        if (latestTree === null && res.data && res.data.length > 0) {
          let recentTree = "";
          recentTree = { treeId: res.data[0].treeId, primaryPersonId: res.data[0].homePersonId, level: 4 };
          setRecentTree(recentTree);
        }
        dispatch(actionCreator(CONSTANTS.GETTREESLIST.SUCCESS, res.data || []));
      })
      .catch((_err) => {
        dispatch(actionCreator(CONSTANTS.GETTREESLIST.FAILURE, {}));
      });
  };
};
export const getNewsPaperFreeViewsCount = (setViewCount) => {
  return (dispatch, getState) => {
    let url = API_URLS.getNewsPaperFreeViewsCount(),
      staticHeader = createHeader();
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        localStorage.setItem("allocatedViews", parseInt(res?.data?.allocatedViews || 0));
        localStorage.setItem("viewCount", parseInt(res?.data?.freeViewsConsumed || 0));
        localStorage.setItem("remainingFreeViews", parseInt(res?.data?.remainingFreeViews || 0));
        setViewCount && setViewCount(parseInt(res?.data?.freeViewsConsumed || 0));
        dispatch(actionCreator(CONSTANTS.GETNEWSPAPERFREEVIEWSCOUNT.SUCCESS, res.data || []));
      })
      .catch((_err) => {
        dispatch(actionCreator(CONSTANTS.GETNEWSPAPERFREEVIEWSCOUNT.FAILURE, {}));
      });
  };
};
export const updateNewsPaperViewPageUrl = (pageURL, setOpenUpgradeModal, setViewCount) => {
  return (dispatch, getState) => {
    let url = API_URLS.registerUpdateNewsPaperView(pageURL),
      staticHeader = createHeader();
    let viewCount = parseInt(localStorage.getItem("viewCount"));
    let allocatedViews = parseInt(localStorage.getItem("allocatedViews"));
    if (viewCount < allocatedViews) {
      callApi(getState, "PUT", url, {}, false, staticHeader)
        .then((res) => {
          dispatch(getNewsPaperFreeViewsCount(setViewCount));
          dispatch(actionCreator(CONSTANTS.UPDATENEWSPAPERVIEWSPAGEURL.SUCCESS, res.data || []));
        })
        .catch((_err) => {
          dispatch(actionCreator(CONSTANTS.UPDATENEWSPAPERVIEWSPAGEURL.FAILURE, {}));
        });
    } else {
      setOpenUpgradeModal(true);
    }
  };
};
export const addRecentViewTree = async (treeId) => {
  await apiRequest(POST, `User/addrecentlyviewedtree/${treeId}`, {});
};

export const getRecentPeopleList = () => {
  let requestData = { authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getRecentPeople(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.REQUEST));
    callApi(getState, "GET", url, requestData, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.SUCCESS, res.data || []));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.FAILURE));
      });
  };
};

export const updateStoryIsLiked = (storyId, isLiked, storyIndex) => {
  const requestData = { storyId: storyId, isLiked: isLiked, storyIndex: storyIndex };
  return (dispatch, getState) => {
    let url = API_URLS.updateStoryIsLiked(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.UPDATESTORYISLIKED.REQUEST));
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then((_res) => {
        dispatch(actionCreator(CONSTANTS.UPDATESTORYISLIKED.SUCCESS, requestData));
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
        return err?.response?.data;
      });
  };
};

export const storylikespersons = (storyId, pageNumber, pageSize, _isLikesPageLoading = {}) => {
  const requestData = { storyId, pageNumber, pageSize };
  return (dispatch, getState) => {
    let url = API_URLS.storylikespersons(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.STORYLIKESPERSONS.REQUEST, pageNumber));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.STORYLIKESPERSONS.SUCCESS, { data: res.data, pageNumber } || {}));
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
        return err?.response?.data;
      });
  };
};

export const getStoriesByTopic = (data, newRequest = true, isPaginationLoading = {}, moreDataAvail = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.GetStoriesByTopic(data),
      staticHeader = createHeader();
    if (data.treeId) {
      url = API_URLS.getStories(data);
    }
    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETSTORIES.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.REQUEST));
    }
    getStoriesAPICall(getState, url, data, staticHeader, newRequest, dispatch, { isPaginationLoading, moreDataAvail, getTotalStories: true });
  };
};

export const clearStorylikespersons = () => async (dispatch) => {
  dispatch({ type: CLEAR_STORY_LIKES_PERSONS });
};

export const isMiloModalOpen = (payload) => {
  return (dispatch) => {
    dispatch({ type: MILO_MODAL, payload });
  };
};
