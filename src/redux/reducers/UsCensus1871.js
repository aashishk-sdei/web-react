import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  relationship: [],
  dropdownLoading: false,
  sQuery: null,
  usCensus1871List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
  fuzzyMatch : false
};

const UsCensus1871 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.USFEDERALCENSUS1871PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.USFEDERALCENSUS1871PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1871MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.USFEDERALCENSUS1871MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1871.REQUEST:
      return {
        ...state,
        usCensus1871List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.USFEDERALCENSUS1871SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1871.SUCCESS:
      return {
        ...state,
        usCensus1871List: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1871.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1871DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.USFEDERALCENSUS1871DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1871DROPDOWN.FAILURE:
      return {
        ...state,
        dropdownLoading: false,
      };
    case CONSTANTS.SET_FUZZY_MATCH:
      return {
        ...state,
        fuzzyMatch: payload
      }
    default:
      return {
        ...state,
      };
  }
};

export default UsCensus1871;
