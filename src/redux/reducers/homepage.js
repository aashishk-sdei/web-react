import * as CONSTANTS from "../constants/actionTypes";
import { getOwner } from "../../services";
import { CLEAR_STORY_LIKES_PERSONS, MILO_MODAL } from "../constants";
const initialState = {
  isLoading: true,
  stories: [],
  storiesCount: 0,
  isPaginationLoading: false,
  isLikesPaginationLoading: false,
  trees: [],
  treesUpdated: false,
  treesLoading: true,
  error: false,
  isRecentProple: true,
  recentProple: [],
  storylikespersonsList: [],
  isMiloModalOpen : false
};

const homepage = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.UPDATE_TREENAME_SUCCESS:
      return {
        ...state,
        trees: payload,
        treesUpdated: true
      };
    case CONSTANTS.UPDATE_TREENAME_FAILURE:
      return {
        ...state,
        error: payload,
        treesUpdated: true
      };
    case CONSTANTS.GETSTORIES.REQUEST:
      return {
        ...state,
        isLoading: true,
        stories: [],
        error: false,
      };
    case CONSTANTS.GETSTORIES.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        stories: payload,
        error: false,
      };
    }
    case CONSTANTS.GETSTORIES.FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true,
      };
    case CONSTANTS.GETHOMESTORYANDUPDATELIST.SUCCESS:
      return {
        ...state,
        stories: state.stories.map((item) => (typeof item === "string" && item === payload.storyId ? payload : item)),
      };
    case CONSTANTS.GETSTORIESCOUNT.REQUEST:
      return {
        ...state,
        error: false,
        isLoading: true,
      };

    case CONSTANTS.GETSTORIESCOUNT.SUCCESS:
      return {
        ...state,
        storiesCount: payload,
        error: false,
      };
    case CONSTANTS.GETSTORIESPAGINATION.REQUEST:
      return {
        ...state,
        isPaginationLoading: true,
      };
    case CONSTANTS.GETSTORIESPAGINATION.SUCCESS:
      return {
        ...state,
        stories: [...state.stories, ...payload],
        isPaginationLoading: false,
      };

    case CONSTANTS.GETSTORIESPAGINATION.FAILURE:
      return {
        ...state,
        isPaginationLoading: false,
      };

    case CONSTANTS.GETTREESLIST.REQUEST:
      return {
        ...state,
        error: false,
        treesLoading: true,
      };

    case CONSTANTS.GETTREESLIST.SUCCESS:
      return {
        ...state,
        treesLoading: false,
        trees: payload,
        error: false,
      };

    case CONSTANTS.GETTREESLIST.FAILURE:
      return {
        ...state,
        treesLoading: false,
        error: true,
      };
    case CONSTANTS.GETNEWSPAPERFREEVIEWSCOUNT.SUCCESS:
      return {
        ...state,
        newspaperviewcount: payload,
        error: false,
      };

    case CONSTANTS.GETNEWSPAPERFREEVIEWSCOUNT.FAILURE:
      return {
        ...state,
        error: true,
      };
    case CONSTANTS.UPDATENEWSPAPERVIEWSPAGEURL.SUCCESS:
      return {
        ...state,
        updateNewsView: true,
        error: false,
      };

    case CONSTANTS.UPDATENEWSPAPERVIEWSPAGEURL.FAILURE:
      return {
        ...state,
        updateNewsView: false,
        error: true,
      };
    case CONSTANTS.RECENTPEOPLE.REQUEST:
      return {
        ...state,
        isRecentProple: true,
      };
    case CONSTANTS.RECENTPEOPLE.SUCCESS:
      return {
        ...state,
        isRecentProple: false,
        recentProple: payload,
      };
    case CONSTANTS.RECENTPEOPLE.FAILURE:
      return {
        ...state,
        isRecentProple: false,
      };
    case CONSTANTS.UPDATESTORYISLIKED.SUCCESS: {
      let storyList;
      if (payload.isLiked === "like") {
        storyList = [...state?.stories];
        storyList[payload.storyIndex] = { ...storyList[payload.storyIndex], likes: [...storyList[payload.storyIndex]?.likes, { userId: getOwner() }] };
      } else if (payload.isLiked === "unlike") {
        storyList = [...state?.stories];
        storyList[payload.storyIndex] = { ...storyList[payload.storyIndex], likes: storyList[payload.storyIndex].likes.filter((value) => value.userId !== getOwner()) };
      }
      return {
        ...state,
        stories: [...storyList],
      };
    }
    case CONSTANTS.SETFOLLOWUNFOLLOWLIKE.SUCCESS :
      state.storylikespersonsList[payload.index].isFollowing=payload.isFollow
      return {
        ...state
      }
    case CLEAR_STORY_LIKES_PERSONS:
      return {
        ...state,
        storylikespersonsList: [],
      };
    case CONSTANTS.STORYLIKESPERSONS.REQUEST:
      return {
        ...state,
        isLikesPageLoading: true,
      };

    case CONSTANTS.STORYLIKESPERSONS.SUCCESS:
      return {
        ...state,
        isLikesPageLoading: false,
        storylikespersonsList: [...state.storylikespersonsList, ...payload?.data],
      };
    case CONSTANTS.SETFOLLOWUNFOLLOW.SUCCESS:
      state.stories[payload.index].isFollow = payload.isFollow;
      return {
        ...state,
      };

    case MILO_MODAL : {
      return {
        ...state,
        isMiloModalOpen : payload
      }
    }

    default:
      return {
        ...state,
      };
  }
};

export default homepage;
