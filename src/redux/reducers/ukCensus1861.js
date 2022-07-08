import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  maritalStatus: [],
  relationship: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  ukcensus1861List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading1861: true,
  fuzzyMatch : false
};

const ukcensus1861 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.UKFEDERALCENSUS1861PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.UKFEDERALCENSUS1861PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1861MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.UKFEDERALCENSUS1861MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1861.REQUEST:
      return {
        ...state,
        ukcensus1861List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1861SEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.UKFEDERALCENSUS1861.SUCCESS:
      return {
        ...state,
        ukcensus1861List: payload,
        loading: false,
        error: false,
        pageLoading1861: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1861.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading1861: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1861DROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.UKFEDERALCENSUS1861DROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.UKFEDERALCENSUS1861DROPDOWN.FAILURE:
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

export default ukcensus1861;
