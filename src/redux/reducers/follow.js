import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  follower: [],
  following: [],
  count: {
    followingCount: 0,
    followerCount: 0,
  },
  loader: false,
  activePopover: {
    isFollowing: null,
  },
};

const follow = (state = initialState, { type = null, payload = null } = {}) => {
  const request = {
      ...state,
      loader: true,
    },
    failure = {
      ...state,
      loader: false,
    };

  switch (type) {
    case CONSTANTS.GETFOLLOWER.REQUEST:
      return request;
    case CONSTANTS.GETFOLLOWING.REQUEST:
      return request;
    case CONSTANTS.GETFOLLOWER.SUCCESS:
      return {
        ...state,
        follower: [...state?.follower, ...payload],
        loader: false,
      };
    case CONSTANTS.GETFOLLOWER.FAILURE:
      return failure;
    case CONSTANTS.GETFOLLOWING.SUCCESS:
      return {
        ...state,
        following: [...state?.following, ...payload],
        loader: false,
      };
    case CONSTANTS.GETFOLLOWUNFOLLOWCOUNT.SUCCESS:
      return {
        ...state,
        count: { ...state?.count, followingCount: payload.followingCount, followerCount: payload.followerCount },
        loader: false,
      };
    case CONSTANTS.GETFOLLOWUNFOLLOWDETAIL.SUCCESS:
      return {
        ...state,
        activePopover: { ...state.activePopover, isFollowing: payload },
        loader: false,
      };
    case CONSTANTS.SETFOLLOWUNFOLLOWMODAL.SUCCESS:
      if (payload.modalType === "FOLLOWING") {
        state.following[payload.index].isBidirectional = payload.isFollow;
      } else {
        state.follower[payload.index].isBidirectional = payload.isFollow;
      }
      return {
        ...state,
        loader: false,
      };
    case CONSTANTS.GETFOLLOWUNFOLLOWDETAILCLEAR:
      return {
        ...state,
        follower: [],
        following: [],
        activePopover: { ...state.activePopover, isFollowing: null },
        loader: false,
      };
    case CONSTANTS.SETFOLLOWUNFOLLOWCOUNTUPDATE.SUCCESS:
      return {
        ...state,
        count: { ...state?.count, followingCount: state?.count?.followingCount + payload },
        loader: false,
      };
    case CONSTANTS.GETFOLLOWING.FAILURE:
      return failure;
    default:
      return {
        ...state,
      };
  }
};
export default follow;
