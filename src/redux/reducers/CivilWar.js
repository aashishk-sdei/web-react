import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  allegiance: [],
  miltaryRank: [],
  miltaryEnlistment: [],
  dropdownLoading: false,
  sQuery: null,
  civilWarList: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
};

const CivilWar = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.CIVILWARPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.CIVILWARPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.CIVILWARMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.CIVILWARMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.CIVILWAR.REQUEST:
      return {
        ...state,
        civilWarList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.CIVILWARSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.CIVILWAR.SUCCESS:
      return {
        ...state,
        civilWarList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.CIVILWAR.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.CIVILWARDROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.CIVILWARDROPDOWN.SUCCESS:
      return {
        ...state,
        allegiance: payload["MilitarySelfAllegiance_value_SearchableFilter.keyword"] || [],
        miltaryRank: payload["MilitarySelfRank_value_SearchableFilter.keyword"] || [],
        miltaryEnlistment: payload["Military_enlistmentSelfRank_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.CIVILWARDROPDOWN.FAILURE:
      return {
        ...state,
        dropdownLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CivilWar;
