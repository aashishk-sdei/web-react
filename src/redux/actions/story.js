import { actionCreator, callApi } from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { addMessage } from "./toastr";
import { getOwner } from "../../services";
import { FEATURED_STORY_ID_REDIRECT } from "../constants";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const createMultipartHeader = () => {
  return {
    ...createHeader(),
    "Content-Type": "multipart/form-data",
  };
};
const createTextTypeQA = () => {
  return {
    "Content-Length": 0,
    "Content-Type": "text/plain",
  };
};

const getParamKey = (key, authorId) => {
  if (authorId) {
    return `&${key}`;
  } else {
    return `?${key}`;
  }
};

export const getStory = (data, newRequest = true, isPagintionLoading = {}, isMemberStories = false) => {
  let requestData = { ...data, authorId: data?.authorId };
  return (dispatch, getState) => {
    let url = isMemberStories ? API_URLS.getMemberStories(requestData) : API_URLS.getStories(requestData),
      staticHeader = createHeader();
    if (data.categoryName) {
      if (data.categoryName === "Drafts") {
        url = url + `${getParamKey("storyStatus", data.authorId)}=Draft`;
      } else {
        url = url + `${getParamKey("categoryName", data.authorId)}=${data.categoryName}`;
      }
    }
    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETSTORY.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.REQUEST));
    }
    setTimeout(() => {
      isPagintionLoading.current = true;
      callApi(getState, "GET", url, requestData, false, staticHeader)
        .then((res) => {
          const dataRespo = res.data;
          if (newRequest) {
            dispatch(actionCreator(CONSTANTS.GETSTORY.SUCCESS, dataRespo));
          } else {
            dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.SUCCESS, dataRespo));
            isPagintionLoading.current = false;
          }
        })
        .catch((err) => {
          if (newRequest) {
            dispatch(actionCreator(CONSTANTS.GETSTORY.FAILURE, err.response.data));
          } else {
            dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.FAILURE, err));
            isPagintionLoading.current = false;
          }
        });
    }, 1000);
  };
};

export const getStoryAndUpdateList = (data) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStory(data),
      staticHeader = createHeader();
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETSTORYANDUPDATELIST.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
const editSuccessStory = ({ dispatch, setSubmitting, res, treeId, personId, ref, history, viewTree }) => {
  setSubmitting(false);
  dispatch(actionCreator(CONSTANTS.POSTSTORY.SUCCESS, res.data));
  dispatch(addMessage("Story has been updated succesfully", "success"));
  if (viewTree) {
    history.replace(viewTree)
  } else if (ref !== "1" && treeId && personId) {
    history.push(`/family/person-page/${treeId}/${personId}?tab=0`);
  } else {
    if (ref === "1") {
      history.push("/stories");
    } else {
      history.push("/");
    }
  }
};
export const editStory = (formData, history, treeId, personId, setSubmitting, { ref, ActionProps, values, viewTree }) => {
  return (dispatch, getState) => {
    let url = API_URLS.editStoryApi,
      staticHeader = createMultipartHeader();

    dispatch(actionCreator(CONSTANTS.POSTSTORY.REQUEST));
    ActionProps.resetForm({ values });
    setSubmitting(true);
    callApi(getState, "PUT", url, formData, false, staticHeader)
      .then((res) => {
        if (formData.get("status") === "Draft") {
          setSubmitting(false);
          dispatch(actionCreator(CONSTANTS.POSTSTORY.SUCCESS, res.data));
          dispatch(addMessage("Your draft is saved for later in your stories", "success"));
          if (viewTree) {
            history.replace(viewTree)
          }
        } else {
          editSuccessStory({ dispatch, setSubmitting, res, treeId, personId, ref, history, viewTree });
        }
      })
      .catch((err) => {
        setSubmitting(false);
        dispatch(actionCreator(CONSTANTS.SAVETOTREE.FAILURE, err?.response?.data));
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
      });
  };
};
const getCta = (data, mediaId, history) => {
  if (mediaId) {
    return { cta: { action: () => history.push(`/stories/view/0/${data.get("storyId")}?mediaId=${mediaId}`), text: "View" } };
  }
  return null;
};
const getValue = (data, mediaId, history) => {
  if (mediaId) {
    return { cta: { action: () => history.push(`/stories/view/1/${data.get("storyId")}`), text: "View" } };
  }
  return null;
};
const addStorySuccess = ({ dispatch, res, history, textVal, person_id, tree_id, ref, mediaId, callback, data }) => {
  setTimeout(() => {
    dispatch(actionCreator(CONSTANTS.POSTSTORY.SUCCESS, res.data));
    dispatch(addMessage("Story has been created succesfully", "success", textVal));
    if (ref !== "1" && tree_id && person_id) {
      let urlCal = `/family/person-page/${tree_id}/${person_id}?tab=0`;
      history.push(urlCal);
    } else {
      if (ref === "1") {
        history.push("/stories");
      } else if (ref === "4" && mediaId) {
        history.push(`/media/view-image/${mediaId}`);
        // For Redirection to Story Page when going back from Media Viewer
        dispatch({
          type: FEATURED_STORY_ID_REDIRECT,
          payload: data.get("storyId"),
        });
      } else if (ref === "6" && mediaId) {
        history.replace(`/media/view-image/${mediaId}/newspaper`);
        // For Redirection to Story Page when going back from Media Viewer
        dispatch({
          type: FEATURED_STORY_ID_REDIRECT,
          payload: data.get("storyId"),
        });
      } else if (ref === 5) {
        callback();
      } else {
        history.push("/");
      }
    }
  }, 1500);
};
export const addStory = ({ data, history, props, tree_id, person_id, submit, ref, mediaId, callback, viewTree }) => {
  return (dispatch, getState) => {
    let textVal = ref == 5 ? getValue(data, data.get("storyId"), history) : getCta(data, data.get("storyId"), history);
    let url = API_URLS.saveStoryApi,
      staticHeader = createMultipartHeader();
    submit(true);
    dispatch(actionCreator(CONSTANTS.POSTSTORY.REQUEST));
    callApi(getState, "POST", url, data, false, staticHeader)
      .then((res) => {
        submit(false);
        // dispatch(apiDelay())
        if (data.get("status") === "Draft") {
          setTimeout(() => {
            dispatch(addMessage("Your draft is saved for later in your stories", "success"));
            viewTree ? history.replace(viewTree) : history.replace(`/stories/edit/${ref}/${data.get("storyId")}`);
          }, 1000);
        } else {
          addStorySuccess({ dispatch, res, history, textVal, person_id, tree_id, ref, mediaId, callback, data });
        }
      })
      .catch((err) => {
        props.setStatus(undefined);
        submit(false);
        dispatch(actionCreator(CONSTANTS.POSTSTORY.FAILURE, err?.response?.data));
        dispatch(addMessage("Sorry, your story couldn't be saved. Please try again.", "error"));
      });
  };
};
export const deleteStoryPerson = (item, storyId, personDetail, removeIndex) => {
  return (dispatch, getState) => {
    let NewPrimaryPersonId = removeIndex === 0 ? personDetail[1].id : personDetail[0].id;
    const data = { storyId: storyId, personId: item.id, treeId: item.treeId, NewPrimaryPersonId };
    let url = API_URLS.deleteStoryPerson,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.REQUEST));
    callApi(getState, "PUT", url, data, false, staticHeader)
      .then((_res) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.SUCCESS, item));
        dispatch(addMessage("Person has been removed successfully in this story"));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.FAILURE, err.response.data));
        dispatch(addMessage("something went wrong", "error"));
      });
  };
};

export const resetViewData = () => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.VIEWSTORY.RESET));
  };
};
export const viewStory = (data, isView = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStory(data),
      staticHeader = createHeader();

    dispatch(actionCreator(CONSTANTS.VIEWSTORY.REQUEST));
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then(async (res) => {
        if (isView) {
          let userUrl = API_URLS.getADB2CUserInfo(res?.data?.authorId),
            folloInfoUrl = `${API_URLS.getFollowUnfollowDetail}/${res?.data?.authorId}`,
            followbool = await callApi(getState, "GET", folloInfoUrl, {}, false, staticHeader),
            authorData = await callApi(getState, "GET", userUrl, {}, false, staticHeader);
          res.data.author = authorData?.data;
          res.data.author.isFollow = followbool?.data;
        }
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.SUCCESS, res.data));
        return res.data;
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.FAILURE, err?.response));
      });
  };
};

export const emptyViewState = () => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.VIEWSTORYEMPTY));
  };
}

export const deleteStory = (data, params) => {
  return (dispatch, getState) => {
    let url = API_URLS.deleteStory(data.storyId),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.DELETESTORY.REQUEST));
    callApi(getState, "DELETE", url, {}, false, staticHeader)
      .then((res) => {
        setTimeout(() => {
          dispatch(actionCreator(CONSTANTS.DELETESTORY.SUCCESS, res.data));
          dispatch(addMessage("Story deleted successfully"));
          if (params.refType !== "1" && params.treeId && params.primaryPersonId) {
            params.history.push(`/family/person-page/${params.treeId}/${params.primaryPersonId}?tab=0`);
          } else {
            params.history.push(params.refType === "1" ? `/stories` : `/`);
          }
        }, 1500);
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORY.FAILURE, err.response));
        dispatch(addMessage("We are unable to delete this story at this time, please try again later.", "error"));
      });
  };
};

export const getLeftPanelDetails = (data) => {
  let requestData = { ...data, authorId: data?.authorId };
  return (dispatch, getState) => {
    let url = API_URLS.getLeftPanelDetailsOwner(),
      staticHeader = createHeader();
    if (requestData.treeId && requestData.personId) {
      url = API_URLS.getLeftPanelDetails(requestData);
    } else if (requestData.memberId) {
      url = API_URLS.getLeftPanelDetailsMember(requestData);
    }
    dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.REQUEST));
    setTimeout(
      () =>
        callApi(getState, "GET", url, requestData, false, staticHeader)
          .then((res) => {
            //  pass res.data instead of static json when API is up
            dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.SUCCESS, res.data?.resultData || {}));
          })
          .catch((_err) => {
            dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.FAILURE, {}));
          }),
      1000
    );
  };
};

export const getImmediateFamily = (data) => {
  let requestData = { ...data, authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getImmediateFamily(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.REQUEST));
    dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.REQUEST));
    setTimeout(
      () =>
        callApi(getState, "GET", url, requestData, false, staticHeader)
          .then((res) => {
            dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.SUCCESS, res.data || {}));
            dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.SUCCESS, res.data || {}));
          })
          .catch((_err) => {
            dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.FAILURE));
            dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.FAILURE));
          }),
      1000
    );
  };
};

export const updatePrivacyStatus = (storyId, privacyStatus) => {
  return (dispatch, getState) => {
    const data = { StoryId: storyId, privacy: privacyStatus };
    let url = API_URLS.updatePrivacyStatus,
      staticHeader = createMultipartHeader();
    dispatch(actionCreator(CONSTANTS.UPDATEPRIVACYSTATUS.REQUEST));
    callApi(getState, "PUT", url, data, false, staticHeader)
      .then((_res) => {
        dispatch(actionCreator(CONSTANTS.UPDATEPRIVACYSTATUS.SUCCESS, privacyStatus));
        dispatch(addMessage("Story has been updated succesfully", "success"));
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
        return err?.response?.data;
      });
  };
};

export const publishedTitleByGUID = async (publicationTitleId) => {
  if (!publicationTitleId) {
    return Promise.resolve("");
  }
  let url = API_URLS.GetPublishedTitleByGUID(publicationTitleId);
  return fetch(url)
    .then((response) => {
      return response.json().then(function (text) {
        return text ? text.PublicationTitle : "";
      });
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

export const updateViewStoryIsLiked = (storyId, isLiked) => {
  const requestData = { storyId: storyId, isLiked: isLiked };
  return (dispatch, getState) => {
    let url = API_URLS.updateStoryIsLiked(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.UPDATEVIEWSTORYISLIKED.REQUEST));
    callApi(getState, "POST", url, {}, false, staticHeader)
      .then((_res) => {
        dispatch(actionCreator(CONSTANTS.UPDATEVIEWSTORYISLIKED.SUCCESS, requestData));
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
        return err?.response?.data;
      });
  };
};

export const shareStoryViaEmail = (storyId, emails, formik, setShowModal) => {
  let formData = new FormData()
  formData.append("StoryId", storyId)
  emails.forEach(email => {
    formData.append("EmailIds", email)
  });
  return (dispatch, getState) => {
    let url = API_URLS.shareStoriesViaEmail,
      staticHeader = createMultipartHeader();
    callApi(getState, "POST", url, formData, false, staticHeader)
      .then((res) => {
        if (res.status === 200) {
          dispatch(addMessage("Email has been sent"));
          setShowModal(false)
        }
        formik.setSubmitting(false)
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be shared. Please try again.", "error"));
        formik.setSubmitting(false)
        return err?.response?.data;
      });
  };
};

export const getSharedStoryIDUsingInvitationID = (invitationId, visitorId) => {
  return (dispatch, getState) => {
    let url = API_URLS.shareStoryViewStatus(invitationId, visitorId),
      staticHeader = createHeader();
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        if (res.status === 200) {
          dispatch(actionCreator(CONSTANTS.SHARESTORYSTATUS.SUCCESS, res.data));
        } else {
          dispatch(actionCreator(CONSTANTS.SHARESTORYSTATUS.FAILURE));
        }
      })
      .catch((_err) => {
        dispatch(addMessage("Something went wrong!", "error"));
      })
  };
};

export const addPreviewerAPI = (formData) => {
  return (dispatch, getState) => {
    let url = API_URLS.addToStoryPreviewers,
      staticHeader = createHeader();
    return callApi(getState, "PUT", url, formData, false, staticHeader)
      .then((res) => {
        return res.status === 200
      })
      .catch((_err) => {
        dispatch(addMessage("Sorry, your story couldn't be updated. Please try again.", "error"));
        return false
      });
  };
};

export const previewStory = (data, view = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.previewStoryDetails(data),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.VIEWSTORY.REQUEST));
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then(async (res) => {
        if (view) {
          let userUrl = API_URLS.nonLoginUserDetails(res?.data?.authorId),
            authorData = await callApi(getState, "GET", userUrl, {}, false, staticHeader);
          res.data.author = authorData?.data;
        }
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.SUCCESS, res.data));
        return res.data;
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.FAILURE, err?.response));
      });
  };
};

export const userAssociationToStory = (storyID) => {
  return (dispatch, getState) => {
    let url = API_URLS.assignUserToStory(storyID),
      staticHeader = createHeader();
    return callApi(getState, "POST", url, storyID, false, staticHeader)
      .then((res) => {
        return res.status === 200
      })
      .catch((_err) => {
        dispatch(addMessage("Sorry, your story couldn't be associated. Please try again.", "error"));
        return false
      });
  };
};

export const addEmailsToWhiteList = (emails) => {
  let formData = new FormData()
  formData.append("emails", emails)
  return (dispatch, getState) => {
    let url = API_URLS.addEmailsToWhiteList,
      staticHeader = createMultipartHeader();
    return callApi(getState, "PUT", url, formData, false, staticHeader)
      .then((res) => {
        return res.status === 200
      })
      .catch(() => {
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};

export const checkVisitorStoryPermissionAPI = (formData) => {
  return (dispatch, getState) => {
    let url = API_URLS.checkVisitorStoryPermission(formData.visitorID, formData.storyID),
      staticHeader = createMultipartHeader();
    return callApi(getState, "GET", url, formData, false, staticHeader)
      .then((res) => {
        if (res.status === 200) {
          return res.data
        } else {
          return false
        }
      })
      .catch(() => {
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};
export const checkUserAssociationAPI = (storyId) => {
  return (dispatch, getState) => {
    let url = API_URLS.checkUserAssociation(storyId),
      staticHeader = createMultipartHeader();
    return callApi(getState, "GET", url, {}, false, staticHeader)
      .then((response) => {
        if (response.status === 200) {
          return response.data
        } else {
          return false
        }
      })
      .catch(() => {
        dispatch(addMessage("Something went wrong", "error"))
      });
  };
};

export const viewStoryViaInvitationAPI = (storyId, isView = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStoryViaInvitation(storyId),
      staticHeader = createMultipartHeader();
    dispatch(actionCreator(CONSTANTS.VIEWSTORY.REQUEST));
    return callApi(getState, "GET", url, {}, false, staticHeader)
      .then(async (response) => {
        if (isView) {
          let authorUrl = API_URLS.getADB2CUserInfo(response?.data?.authorId),
            followInfoUrl = `${API_URLS.getFollowUnfollowDetail}/${response?.data?.authorId}`,
            followboolData = await callApi(getState, "GET", followInfoUrl, {}, false, staticHeader),
            authorDetails = await callApi(getState, "GET", authorUrl, {}, false, staticHeader);
          response.data.author = authorDetails?.data;
          response.data.author.isFollow = followboolData?.data;
        }
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.SUCCESS, response.data));
        return response;
      })
      .catch((error) => {
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.FAILURE, error?.response));
      });
  };
};