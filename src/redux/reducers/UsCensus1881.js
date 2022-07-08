import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  maritalStatus: [],
  relationship: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  usCensus1881List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
  fuzzyMatch : false
};

const UsCensus1881 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.USFEDERALCENSUS1881PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.USFEDERALCENSUS1881PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1881MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.USFEDERALCENSUS1881MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1881.REQUEST:
      return {
        ...state,
        usCensus1881List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.USFEDERALCENSUS1881SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1881.SUCCESS:
      return {
        ...state,
        usCensus1881List: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1881.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1881DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.USFEDERALCENSUS1881DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1881DROPDOWN.FAILURE:
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

export default UsCensus1881;
