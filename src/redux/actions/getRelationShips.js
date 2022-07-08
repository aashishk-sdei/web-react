import {
    GET_RELATIONSHIP,
    RELATIONSHIP_ERROR,
    GET
} from "../constants";
import { apiRequest } from "../requests";
import { getOwner } from "../../services/index"

export const getRelationShips = (data) => async (dispatch) => {
    try {
        let newDataJson = {
            personId: data.personId,
            contributorId: getOwner()
        }
        const res = await apiRequest(GET, `Persons/nonfamilyrelationships?personId=${newDataJson.personId}&contributorId=${newDataJson.contributorId}`);
        dispatch({
            type: GET_RELATIONSHIP,
            payload: (res.data?.nonFamilyRelationships)?res.data.nonFamilyRelationships:[]
        })
    } catch (err) {
        dispatch({
            type: RELATIONSHIP_ERROR,
            payload: { msg: err }
        })
    }
}

