import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  maritalStatus: [],
  relationship: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  Ukcensus1841List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading1841: true,
  fuzzyMatch: false
};

const Ukcensus1841 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.UKFEDERALCENSUS1841PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.UKFEDERALCENSUS1841PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1841MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.UKFEDERALCENSUS1841MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1841.REQUEST:
      return {
        ...state,
        Ukcensus1841List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1841SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1841.SUCCESS:
      return {
        ...state,
        Ukcensus1841List: payload,
        loading: false,
        error: false,
        pageLoading1841: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1841.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading1841: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1841DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.UKFEDERALCENSUS1841DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1841DROPDOWN.FAILURE:
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

export default Ukcensus1841;
