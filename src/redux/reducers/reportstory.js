import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  report: [],
  loading: false,
  error: false,
};

const Reportstory = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.REPORTSTORY.REQUEST:
      return {
        ...state,
        loading: true,
        error: false,
      };

    case CONSTANTS.REPORTSTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        report:payload,
      };

    case CONSTANTS.REPORTSTORY.FAILURE:
      return {
        ...state,
        loading: true,
        error: true,
      };
    default:
      return {
        ...state,
      };
  }
};

export default Reportstory;