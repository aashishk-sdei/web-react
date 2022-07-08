import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
    stateLoading: false,
    cityLoadig: false,
    publicationLoading: false,
    counties: [],
    states: [],
    statesInitial: [],
    city: [],
    publication: [],
    minYear: null,
    maxYear: null,
    rangeYearLoading: false,
    publicationCount: 0,
    newsPaperCount: 0,
    newsPaperLoading: false,
    years: [],
    yearLoading: false,
    yearMonth: [],
    yearMonthLoading: false,
    dates: [],
    datesLoading: true,
    cYear: "",
    cMonth: "",
    locations: [],
    locationLoading: false,
};

const browseLocation = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.LOCATION.STATEBROWSE.REQUEST:
            return {
                ...state,
                states: [],
                city: [],
                publication: [],
                stateLoading: true,
            };
        case CONSTANTS.LOCATION.STATEBROWSE.SUCCESS:
            return {
                ...state,
                states: payload,
                stateLoading: false
            };

        case CONSTANTS.LOCATION.STATEBROWSE.FAILURE:
            return {
                ...state,
                stateLoading: false
            };
        case CONSTANTS.LOCATION.CITYBROWSE.REQUEST:
            return {
                ...state,
                city: [],
                publication: [],
                cityLoadig: payload
            };
        case CONSTANTS.LOCATION.CITYBROWSE.SUCCESS:
            return {
                ...state,
                city: payload,
                cityLoadig: false,
            };
        case CONSTANTS.LOCATION.CITYBROWSE.FAILURE:
            return {
                ...state,
                cityLoadig: false,
            };
        case CONSTANTS.LOCATION.PUBLICATIONBROWSE.REQUEST:
            return {
                ...state,
                publication: [],
                publicationLoading: payload,
            };
        case CONSTANTS.LOCATION.PUBLICATIONBROWSE.SUCCESS:
            return {
                ...state,
                publication: payload,
                publicationLoading: false,
            };
        case CONSTANTS.LOCATION.PUBLICATIONBROWSE.FAILURE:
            return {
                ...state,
                publicationLoading: false,
            };
        case CONSTANTS.LOCATION.DATERANGEBROWSE.REQUEST:
            return {
                ...state,
                minYear: null,
                maxYear: null,
                rangeYearLoading: payload,
            };
        case CONSTANTS.LOCATION.DATERANGEBROWSE.SUCCESS:
            return {
                ...state,
                minYear: payload.minYear,
                maxYear: payload.maxYear,
                rangeYearLoading: false,
            };
        case CONSTANTS.LOCATION.DATERANGEBROWSE.FAILURE:
            return {
                ...state,
                rangeYearLoading: false,
            };
        case CONSTANTS.LOCATION.BROWSECOUNT.REQUEST:
            return {
                ...state,
                publicationCount: 0,
                newsPaperCount: 0,
                newsPaperLoading: true
            };
        case CONSTANTS.LOCATION.BROWSECOUNT.SUCCESS:
            return {
                ...state,
                publicationCount: payload.publicationCount,
                newsPaperCount: payload.newsPaperCount,
                newsPaperLoading: false
            };
        case CONSTANTS.LOCATION.BROWSECOUNT.FAILURE:
            return {
                ...state,
                newsPaperLoading: false,
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEAR.REQUEST:
            return {
                ...state,
                years: [],
                yearLoading: true,
                cYear: "",
                cMonth: ""
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEAR.SUCCESS:
            return {
                ...state,
                years: payload,
                cYear: payload?.[0] ? `${payload[0]}` : "",
                yearLoading: false
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEAR.FAILURE:
            return {
                ...state,
                yearLoading: false
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.REQUEST:
            return {
                ...state,
                yearMonth: [],
                yearMonthLoading: true
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.SUCCESS:
            return {
                ...state,
                yearMonth: payload,
                cMonth: (payload?.[0]) ? `${payload[0]}`.padStart(2, '0') : "",
                yearMonthLoading: false,
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.FAILURE:
            return {
                ...state,
                yearMonthLoading: false
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.REQUEST:
            return {
                ...state,
                dates: [],
                datesLoading: true
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.SUCCESS:
            return {
                ...state,
                dates: payload,
                datesLoading: false
            };
        case CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.FAILURE:
            return {
                ...state,
                datesLoading: false
            };

        default:
            return {
                ...state,
            };
    }
};
export default browseLocation;
