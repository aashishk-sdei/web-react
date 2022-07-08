import {
    GET_RELATIONSHIP,
    APPEND_RELATIONSHIP,
    GET_RELATIONSHIP_LIST,
} from "../constants";

const initialState = {
    relationship: [],
    relationshiplist: [],
}

const relationship = (state = initialState, action = {}) => {
  
    const { type, payload } = action;
    const mapping = {
        [GET_RELATIONSHIP]: {
            ...state,
            relationship: payload,
        },
        [GET_RELATIONSHIP_LIST]: {
            ...state,
            relationshiplist: payload,
        },
        [APPEND_RELATIONSHIP]: {
            ...state,
            relationship: [...state.relationship, payload],
        },
    };
    return mapping[type] || state;
}

export default relationship;