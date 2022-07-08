import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  countyLoading: false,
  stateLoading: false,
  stateInitialLoading: false,
  cityLoadig: false,
  publicationLoading: false,
  countryRequest: false,
  stateRequest: false,
  cityRequest: false,
  publicationRequest: false,
  counties: [],
  states: [],
  statesInitial: [],
  city: [],
  publication: [],
  minDate: 0,
  maxDate: 0,
  elasticQuery: null,
  name : ""
};

const location = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.LOCATION.DATERANGE.REQUEST:
      return {
        ...state,
        minDate: 0,
        maxDate: 0,
      };
    case CONSTANTS.LOCATION.DATERANGE.SUCCESS:
      return {
        ...state,
        minDate: Math.max(payload.minYear, 1609),
        maxDate: payload.maxYear,
      };
    case CONSTANTS.LOCATION.COUNTY.REQUEST:
      return {
        ...state,
        counties: [],
        states: [],
        city: [],
        publication: [],
        countyLoading: payload,
        countryRequest: false,
        stateRequest: false,
        cityRequest: false,
        publicationRequest: false
      };
    case CONSTANTS.LOCATION.COUNTY.SUCCESS:
      return {
        ...state,
        counties: payload,
        countyLoading: false,
        countryRequest: true,
      };
    case CONSTANTS.LOCATION.COUNTY.FAILURE:
      return {
        ...state,
        countyLoading: false,
        countryRequest: true,
      };
    case CONSTANTS.LOCATION.STATEINITIAL.REQUEST:
      return {
        ...state,
        stateInitialLoading: payload,
      };
    case CONSTANTS.LOCATION.STATE.REQUEST:
      return {
        ...state,
        states: [],
        city: [],
        publication: [],
        stateLoading: payload,
        stateRequest: false,
      };
    case CONSTANTS.LOCATION.STATE.SUCCESS:
      return {
        ...state,
        states: payload,
        stateLoading: false,
        stateRequest: true,
      };
    case CONSTANTS.LOCATION.STATEINITIAL.SUCCESS:
      return {
        ...state,
        stateInitialLoading: false,
        statesInitial: payload,
      };
    case CONSTANTS.LOCATION.STATE.RESET:
      return {
        ...state,
        states: [],
        stateRequest: false,
      };
    case CONSTANTS.LOCATION.STATE.FAILURE:
      return {
        ...state,
        stateLoading: false,
        stateRequest: true,
        stateInitialLoading: false,
      };
    case CONSTANTS.LOCATION.CITY.REQUEST:
      return {
        ...state,
        city: [],
        publication: [],
        cityLoadig: payload,
        cityRequest: false,
      };
    case CONSTANTS.LOCATION.CITY.SUCCESS:
      return {
        ...state,
        city: payload,
        cityLoadig: false,
        cityRequest: true,
      };
    case CONSTANTS.LOCATION.CITY.RESET:
      return {
        ...state,
        cityRequest: false,
        city: [],
      };
    case CONSTANTS.LOCATION.CITY.FAILURE:
      return {
        ...state,
        cityLoadig: false,
        cityRequest: true,
      };
    case CONSTANTS.LOCATION.PUBLICATION.REQUEST:
      return {
        ...state,
        publication: [],
        publicationLoading: payload,
        publicationRequest: false,
      };
    case CONSTANTS.LOCATION.PUBLICATION.SUCCESS:
      return {
        ...state,
        publication: payload,
        publicationLoading: false,
        publicationRequest: true,
      };
    case CONSTANTS.LOCATION.PUBLICATION.RESET:
      return {
        ...state,
        publicationRequest: false,
        publication: [],
      };
    case CONSTANTS.LOCATION.PUBLICATION.FAILURE:
      return {
        ...state,
        publicationLoading: false,
        publicationRequest: true,
      };

    //temp elastic query

    case CONSTANTS.SET_ELASTIC_QUERY:
      return {
        ...state,

        elasticQuery: payload,
      };

    case CONSTANTS.REMOVE_ELASTIC_QUERY:
      return {
        ...state,

        elasticQuery: null,
      };
    case CONSTANTS.SET_COLLECTION_NAME:
      return {
        ...state,
        name: payload,
      };
    default:
      return {
        ...state,
      };
  }
};
export default location;
