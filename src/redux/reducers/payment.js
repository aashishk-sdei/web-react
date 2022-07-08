import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  isLoading: false,
  isPaySuccess: false,
}

const payment = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.SUBMITCARDDETAILS.REQUEST:
        case CONSTANTS.TAXAPIDETAILS.REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case CONSTANTS.SUBMITCARDDETAILS.RESET:
            return {
                ...state,
                isPaySuccess: false
            }
        case CONSTANTS.SUBMITCARDDETAILS.SUCCESS:
            return {
                ...state,
                isLoading: false,
                isPaySuccess: true,
            }
        case CONSTANTS.SUBMITCARDDETAILS.FAILURE:
            return {
                ...state,
                isLoading: false,
                isPaySuccess: false,
            }
        case CONSTANTS.TAXAPIDETAILS.SUCCESS:
        case CONSTANTS.TAXAPIDETAILS.FAILURE:
            return {
                ...state,
                isLoading: false,
            }
        default:
            return {
                ...state,
            }
    }
}

export default payment
