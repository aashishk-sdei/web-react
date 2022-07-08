import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { decodeJWTtoken, getAccessToken, getSubscription, getSubscriptionDetails, getVisitorIDCookie } from "../../services";
import "../Privacy/index.css";
import { useMsal } from "@azure/msal-react";
import ViewStories from "../PersonViewPage/stories/ViewStories";
import FreeAccountModal from "./FreeAccountModal";
import { useDispatch } from "react-redux";
import Waitlist from "../LoggedOutHomepage/WaitList";
import { checkUserAssociationAPI, checkVisitorStoryPermissionAPI } from "../../redux/actions/story";
import { setStoryDetailsFunc, handleStoryLogin, handleStorySignup } from "./Common";
import CommonHeader from "../../components/Header/CommonHeader";
import { newSubscriberCheck, userPayWallVaildation } from "../../utils";
import { useFeatureFlag } from "../../services/featureFlag";
import storyblurred from "../../assets/images/storyblurred.jpg";

const StoryPreview = () => {
    const { instance } = useMsal();
    const { storyId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const isAccessTokenTerms = getAccessToken()
    const { enabled: paywallFeatureFlag, flagLoading } = useFeatureFlag('Paywall');
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showStory, setShowStory] = useState(false);
    const [openWaitListModal, setOpenWaitListModal] = useState(false)
    const [step, setStep] = useState(1)
    let visitorID = getVisitorIDCookie()

    useEffect(() => {
        localStorage.removeItem("storyPreviewId")
        localStorage.removeItem("loggedInViaStoryPreview")
    }, [])
    
    const userPlanExists = useMemo(() => {
        if (isAccessTokenTerms && decodeJWTtoken()) {
            if (getSubscription()) {
                let subdata = getSubscriptionDetails();
                if (subdata?.endDate) {
                    return newSubscriberCheck(subdata);
                }
            } else {
                return userPayWallVaildation(decodeJWTtoken(), paywallFeatureFlag)
            }
        }
        return ""
    }, [paywallFeatureFlag])

    const associationAPIFunc = () => {
        dispatch(checkUserAssociationAPI(storyId)).then((response) => {
            if (response) {
                history.replace(`/stories/view/0/${storyId}`)
            } else {
                history.replace(`/payment?redirect=/stories/view/0/${storyId}`)
            }
        })
    }
    useEffect(() => {
        if (visitorID) {
            if (!isAccessTokenTerms) {
                let formData = {
                    "storyID": storyId,
                    "visitorID": visitorID
                }
                dispatch(checkVisitorStoryPermissionAPI(formData)).then((response) => {
                    if (response === true) {
                        setShowStory(true)
                    } else {
                        setOpenWaitListModal(true)
                    }
                })
            } else {
                if (!userPlanExists && !flagLoading && paywallFeatureFlag) {
                    associationAPIFunc()
                } else {
                    history.replace(`/stories/view/0/${storyId}`)
                }
            }
        } else {
            history.replace(`/`)
        }
    }, [storyId, visitorID])

    const handleModal = () => {
        if (!isAccessTokenTerms) {
            setShowAccountModal(true);
            return false
        }
        return true
    }

    const setStepFunction = (data) => {
        if (data) {
            setStep(data)
        } else {
            setOpenWaitListModal(false)
            setStep(0)
        }
    }
    const handleLoginPreview = () => {
        setStoryDetailsFunc(storyId)
        handleStoryLogin(instance)
    }
    const handleSignupPreview = () => {
        setStoryDetailsFunc(storyId)
        handleStorySignup(instance)
    }
    return (
        <>
            {!isAccessTokenTerms && (
                <CommonHeader handleLogin={handleLoginPreview} handleSignup={handleSignupPreview} />
            )}
            {openWaitListModal &&
                <>
                    <div className="absolute top-0 left-0 w-full h-full bg-white z-50 mt-12">
                        <img src={storyblurred} />
                    </div>
                    <Waitlist alreadyViewed={true} setStepFunction={setStepFunction} step={step} handleLogin={handleLoginPreview} handleSignup={handleSignupPreview} openWaitList={openWaitListModal} setOpenWaitList={setOpenWaitListModal} />
                </>
            }
            {showStory &&
                <ViewStories handleModal={handleModal} tweaks={true} previewStoryBool={true} />
            }
            {showAccountModal &&
                <FreeAccountModal setShowAccountModal={setShowAccountModal} show={showAccountModal} handleLogin={handleLoginPreview} handleSignup={handleSignupPreview} />
            }

        </>
    );
};

export default StoryPreview;