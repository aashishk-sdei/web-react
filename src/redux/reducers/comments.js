import * as CONSTANTS from "../constants/actionTypes";
import {CLEARCOMMENTS} from "../constants/index";

const initialState = {
  isLoading: false,
  isListLoading: false,
  list: [],
  error: false,
  count: 0,
};

const comments = (state = initialState, { type = null, payload = null } = {}) => {
  const request={
    ...state,
    isLoading: true,
    error: false,
  },failure={
    ...state,
    isLoading: false,
    error: true,
  };
  switch (type) {
    case CONSTANTS.GETCOMMENTS.REQUEST:
      return {
        ...state,
        isListLoading: true,
        error: false,
      };
    case CONSTANTS.GETCOMMENTS.SUCCESS:
      let previousId = [...state.list].map(item => item.commentId)
       payload = [...payload].filter(item => !previousId.includes(item.commentId))
      return {
        ...state,
        list: [...state?.list, ...payload],
        isListLoading: false,
      };
    case CLEARCOMMENTS:
      return {
        ...state,
        list: [],
      };
    case CONSTANTS.GETCOMMENTS.FAILURE:
      return {
        ...state,
        isListLoading: false,
        error: true,
      };
    case CONSTANTS.ADDCOMMENTS.REQUEST:
      return request;
    case CONSTANTS.ADDCOMMENTS.SUCCESS:
      return {
        ...state,
        list: [payload,...state?.list],
        isLoading: false,
      };
    case CONSTANTS.ADDCOMMENTS.FAILURE:
      return failure;
    case CONSTANTS.COUNTCOMMENTS.REQUEST:
      return request;
    case CONSTANTS.COUNTCOMMENTS.SUCCESS:
      return {
        ...state,
        count: payload,
        isLoading: false,
        error: false,
      };
    case CONSTANTS.COUNTCOMMENTS.FAILURE:
      return failure;

    default:
      return {
        ...state,
      };
  }
};

export default comments;
