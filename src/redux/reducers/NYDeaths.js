import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    NYDeathsList: [],
    maskingFields: [],
    NYDeathsPageLoading: true,
    gender: [],
    dropdownLoading: true,
    sQuery: null,
    loading: false,
    error: false,
    fuzzyMatch: false
};

const NYDEATHS = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.NYDEATHSPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.NYDEATHSPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.NYDEATHSMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.NYDEATHSMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.NYDEATHSSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.NYDEATHS.REQUEST:
            return {
                ...state,
                NYDeathsList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.NYDEATHS.SUCCESS:
            return {
                ...state,
                NYDeathsList: payload,
                loading: false,
                error: false,
                NYDeathsPageLoading: false,
            };
        case CONSTANTS.NYDEATHS.FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                NYDeathsPageLoading: false,
            };

        case CONSTANTS.NYDEATHSDROPDOWN.REQUEST:
            return {
                ...state,
                gender: [],
                dropdownLoading: true,
            };

        case CONSTANTS.NYDEATHSDROPDOWN.SUCCESS:
            return {
                ...state,
                gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
                dropdownLoading: false,
            };

        case CONSTANTS.NYDEATHSDROPDOWN.FAILURE:
            return {
                ...state,
                gender: [],
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

export default NYDEATHS;
