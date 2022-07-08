import { CURRENTTOPICCLEAR } from "../constants";
import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  isLoading: false,
  topicList: [],
  flattendTopicList: [],
  adminStories: [],
  storiesCount: 0,
  storiesLoading: false,
  isPaginationLoading: false,
  currentTopic: {},
  followedTopics: [],
  followedTopicsLoading: false,
  forbidden: false,
  isImgURLValid: true,
};
const adminForbidden = (payload) => (payload === 403 ? true : false);

const flattenTopics = (dataList) => {
  const renderTopic = (data, route) => {
    const hasChildren = data.childTopicId?.length > 0;

    const formatted = data.childTopicId.map((ch) => {
      return dataList.find((d) => d.topicId === ch);
    });
    return {
      ...data,
      route: `${route}/${data.seoName}`,
      children: hasChildren ? formatted.map((subChild) => renderTopic(subChild, `${route}/${data.seoName}`)) : [],
    };
  };

  let flattenned = [];
  dataList.forEach((element) => {
    if (element.featured === "No" && element.parentTopicId === null) {
      const newTopic = renderTopic(element, "");
      flattenned.push(newTopic);
    }
  });

  let nestedFlatten = [];

  const pushIntoArray = (data) => {
    nestedFlatten.push({ ...data });
    if (data.children?.length > 0) {
      data.children.forEach((c) => pushIntoArray(c));
    }
  };
  if (flattenned.length > 0) {
    flattenned.forEach((e) => pushIntoArray(e));
  }
  return nestedFlatten.filter((b, i, self) => self.findIndex((v) => v.seoName === b.seoName) === i);
};

const topic = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.TOPICS.REQUEST:
      return {
        ...state,
        isLoading: true,
        topicList: [],
        flattendTopicList: [],
      };
    case CONSTANTS.TOPICS.SUCCESS:
      return {
        ...state,
        topicList: payload,
        flattendTopicList: flattenTopics(payload),

        isLoading: false,
      };
    case CONSTANTS.TOPICS.FAILURE:
      return {
        ...state,
        topicList: [],
        flattendTopicList: [],
        isLoading: false,
      };
    case CONSTANTS.TOPICBYID.REQUEST:
      return {
        ...state,
        isLoading: true,
        currentTopic: {},
      };
    case CONSTANTS.TOPICBYID.SUCCESS:
      return {
        ...state,
        currentTopic: payload,
        isLoading: false,
      };
    case CONSTANTS.TOPICBYID.FAILURE:
      return {
        ...state,
        currentTopic: {},
        isLoading: false,
      };
    case CONSTANTS.GETADMINSTORIES.REQUEST:
      return {
        ...state,
        storiesLoading: true,
        error: false,
        forbidden: false,
      };
    case CONSTANTS.GETADMINSTORIES.SUCCESS: {
      return {
        ...state,
        storiesLoading: false,
        adminStories: payload,
        error: false,
        forbidden: false,
      };
    }
    case CONSTANTS.GETADMINSTORIES.FAILURE:
      return {
        ...state,
        storiesLoading: false,
        error: true,
        forbidden: adminForbidden(payload),
      };
    case CONSTANTS.ASSIGNTOPICTOSTORY.SUCCESS:
      return {
        ...state,
        adminStories: state.adminStories.map((item) => (item.storyId === payload.storyId ? { ...state.adminStories[payload.storyIndex], topics: payload.arr } : item)),
      };
    case CONSTANTS.REMOVETOPICFROMSTORY.SUCCESS:
      return {
        ...state,
        adminStories: state.adminStories.map((item) => (item.storyId === payload.storyId ? { ...state.adminStories[payload.storyIndex], topics: state.adminStories[payload.storyIndex].topics.filter((y) => y !== payload.topicId) } : item)),
      };
    case CONSTANTS.GETADMINSTORYANDUPDATELIST.SUCCESS:
      return {
        ...state,
        adminStories: state.adminStories.map((item) => (typeof item === "string" && item === payload.storyId ? payload : item)),
      };

    case CONSTANTS.GETADMINSTORIESPAGINATION.REQUEST:
      return {
        ...state,
        isPaginationLoading: true,
      };
    case CONSTANTS.GETADMINSTORIESPAGINATION.SUCCESS:
      return {
        ...state,
        adminStories: [...state.adminStories, ...payload],
        isPaginationLoading: false,
      };

    case CONSTANTS.GETADMINSTORIESPAGINATION.FAILURE:
      return {
        ...state,
        isPaginationLoading: false,
      };

    case CONSTANTS.GETADMINSTORIESCOUNT.REQUEST:
      return {
        ...state,
        error: false,
        isLoading: true,
      };

    case CONSTANTS.GETADMINSTORIESCOUNT.SUCCESS:
      return {
        ...state,
        isLoading: false,
        storiesCount: payload,
        error: false,
      };

    case CONSTANTS.GETFOLLOWEDTOPICS.REQUEST:
      return {
        ...state,
        followedTopicsLoading: true,
      };

    case CONSTANTS.GETFOLLOWEDTOPICS.SUCCESS:
      return {
        ...state,
        followedTopics: [...state?.followedTopics, ...payload],
        followedTopicsLoading: false,
      };

    case CONSTANTS.GETFOLLOWEDTOPICS.FAILURE:
      return {
        ...state,
        followedTopicsLoading: false,
      };

    case CONSTANTS.GETTOPICBYID.SUCCESS:
      return {
        ...state,
        followedTopics: state.followedTopics.map((item) => (typeof item === "string" && item === payload.topicId ? payload : item)),
      };

    case CONSTANTS.CLEARTOPICLIST.SUCCESS:
      return {
        ...state,
        followedTopics: [],
      };

    case CONSTANTS.ISIMGVALID.SUCCESS:
      return {
        ...state,
        isImgURLValid: payload,
      };
    
    case CURRENTTOPICCLEAR : {
      return {
        ...state,
        currentTopic : {}
      }
    }

    default:
      return {
        ...state,
      };
  }
};
export default topic;
