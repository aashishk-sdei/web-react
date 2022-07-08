import { v4 as uuidv4 } from "uuid";
import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import {
    callApi,
    actionCreator
} from "../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
    return {
        "wa-clientId": CLIENT_ID,
        "wa-requestId": uuidv4(),
    };
};
export const publicationsandnewspapercount = (ob) => {
    ob.CountryName = (ob.CountryName === "united-states")?"united-states-of-america":ob.CountryName
    return (dispatch, getState) => {
        let url = `${API_URLS.publicationCount}?${new URLSearchParams(ob).toString()}`,
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.LOCATION.BROWSECOUNT.REQUEST));
        dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEAR.REQUEST));
        dispatch(actionCreator(CONSTANTS.LOCATION.DATERANGEBROWSE.REQUEST));
        return callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                const data = res.data
                dispatch(actionCreator(CONSTANTS.LOCATION.BROWSECOUNT.SUCCESS, data));
                return data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.BROWSECOUNT.FAILURE, err));
            });
    }
}
export const publicationYears = (pubId) => {
    return (dispatch, getState) => {
        let url = `${API_URLS.publicationYears}/${pubId}`,
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEAR.REQUEST));
        return callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                const data = res.data;
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEAR.SUCCESS, data));
                return data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEAR.FAILURE, err));
                return []
            });
    }
}
export const publicationYearsMonth = (pubId, year) => {
    return (dispatch, getState) => {
        let url = `${API_URLS.publicationYearsMonth}/${pubId}/${year}`,
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.REQUEST));
        return callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                const data = res.data;
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.SUCCESS, data));
                return data;
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTH.FAILURE, err));
                return []
            });
    }
}
export const publicationYearsMonthDate = (pubId, year, month) => {
    return (dispatch, getState) => {
        let url = `${API_URLS.publicationYearsMonthDate}/${pubId}/${year}/${month}`,
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.REQUEST));
        return callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                const data = res.data;
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.SUCCESS, data));
                return data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATIONYEARMONTHDATE.FAILURE, err));
                return []
            });
    }
}