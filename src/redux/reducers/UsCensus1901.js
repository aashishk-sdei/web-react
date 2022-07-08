import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  maritalStatus: [],
  relationship: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  UsCensus1901List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
  fuzzyMatch : false
};

const UsCensus1901 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.USFEDERALCENSUS1901PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.USFEDERALCENSUS1901PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1901MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.USFEDERALCENSUS1901MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1901.REQUEST:
      return {
        ...state,
        UsCensus1901List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.USFEDERALCENSUS1901SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.USFEDERALCENSUS1901.SUCCESS:
      return {
        ...state,
        UsCensus1901List: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1901.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1901DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.USFEDERALCENSUS1901DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUS1901DROPDOWN.FAILURE:
      return {
        ...state,
        dropdownLoading: false,
      };
      case CONSTANTS.SET_FUZZY_MATCH : 
      return {
        ...state,
        fuzzyMatch : payload
      }
    default:
      return {
        ...state,
      };
  }
};

export default UsCensus1901;
