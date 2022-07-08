import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   race: [],
   dropdownLoading: false,
   sQuery: null,
   usFederal1840List: [],
   maskingFields: [],
   UFC1840pageLoading: true,
   loading: false,
   error: false,
   fuzzyMatch: false
}

const usCensus1840 = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.USFEDERALCENSUS1840PAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.USFEDERALCENSUS1840PAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1840MASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.USFEDERALCENSUS1840MASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1840.REQUEST:
         return {
            ...state,
            usFederal1840List: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.USFEDERALCENSUS1840SEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.USFEDERALCENSUS1840.SUCCESS:
         return {
            ...state,
            usFederal1840List: payload,
            loading: false,
            error: false,
            UFC1840pageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1840.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            UFC1840pageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1840DROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.USFEDERALCENSUS1840DROPDOWN.SUCCESS:
         return {
            ...state,
            race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.USFEDERALCENSUS1840DROPDOWN.FAILURE:
         return {
            ...state,
            dropdownLoading: false,
         }
      case CONSTANTS.SET_FUZZY_MATCH:
         return {
            ...state,
            fuzzyMatch: payload
         }
      default:
         return {
            ...state,
         }
   }
}

export default usCensus1840