import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { getAccessToken } from "../../services";
import "../Privacy/index.css";
import { useDispatch, useSelector } from "react-redux";
import { addEmailsToWhiteList, userAssociationToStory } from "../../redux/actions/story";
import Loader from "../../components/Loader";

const VerifyStoryPermission = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const isAccessTokenTerms = getAccessToken()
    const storyId = localStorage.getItem("storyPreviewId") || null;
    const loggedInViaStorypreview = localStorage.getItem("loggedInViaStoryPreview") || null;
    const viaWhitelist = localStorage.getItem("loggedInViaWhitelist") || null;
    const { userAccount } = useSelector(state => { return state.user });
    useEffect(() => {
        if (loggedInViaStorypreview && storyId && userAccount && isAccessTokenTerms && userAccount.email) {
            if (viaWhitelist) {
                localStorage.removeItem("storyPreviewId")
                localStorage.removeItem("loggedInViaStoryPreview")
                localStorage.removeItem("loggedInViaWhitelist")
                history.replace(`/stories/view/0/${storyId}`)
            } else {
                dispatch(addEmailsToWhiteList(userAccount.email)).then((_response) => {
                    dispatch(userAssociationToStory(storyId)).then((_res) => {
                        localStorage.removeItem("storyPreviewId")
                        localStorage.removeItem("loggedInViaStoryPreview")
                        history.replace(`/stories/view/0/${storyId}`)
                    })
                })
            }
        }
    }, [loggedInViaStorypreview, storyId, userAccount])
    return (
        <>
            <Loader />
        </>
    );
};

export default VerifyStoryPermission;