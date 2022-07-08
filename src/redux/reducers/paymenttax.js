import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    isLoading: false,
    bilingLoading: false,
    data: 0,
    billingInfo: null
}

const paymenttax = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.TAXAPIDETAILS.REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case CONSTANTS.TAXAPIDETAILS.SUCCESS:
            return {
                ...state,
                isLoading: false,
                data: payload,
                value: true
            }
        case CONSTANTS.TAXAPIDETAILS.FAILURE:
            return {
                ...state,
                isLoading: false,
                value: false
            }
        case CONSTANTS.BILLINGDETAILS.REQUEST:
            return {
                ...state,
                bilingLoading: true,
                billingInfo: null
            }
        case CONSTANTS.BILLINGDETAILS.SUCCESS:
            return {
                ...state,
                bilingLoading: false,
                billingInfo: payload
            }
        case CONSTANTS.BILLINGDETAILS.FAILURE:
            return {
                ...state,
                bilingLoading: false,
            }
        default:
            return {
                ...state,
            }
    }
}

export default paymenttax
