import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  maritalStatus: [],
  relationship: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  ukcensus1851List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading1851: true,
  fuzzyMatch : false
};

const ukcensus1851 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.UKFEDERALCENSUS1851PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.UKFEDERALCENSUS1851PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1851MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.UKFEDERALCENSUS1851MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1851.REQUEST:
      return {
        ...state,
        ukcensus1851List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1851SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1851.SUCCESS:
      return {
        ...state,
        ukcensus1851List: payload,
        loading: false,
        error: false,
        pageLoading1851: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1851.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading1851: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1851DROPDOWN.FAILURE:
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

export default ukcensus1851;
