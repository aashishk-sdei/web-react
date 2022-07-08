import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useHistory, useParams } from "react-router-dom";
import { getAccessToken, getVisitorIDCookie, setVisitorIDAccess } from "../../services";
import "../Privacy/index.css";
import { useMsal } from "@azure/msal-react";
import Waitlist from "../LoggedOutHomepage/WaitList";
import { useDispatch, useSelector } from "react-redux";
import { addPreviewerAPI, getSharedStoryIDUsingInvitationID, userAssociationToStory } from "../../redux/actions/story";
import FreeAccountModal from "./FreeAccountModal";
import Loader from "../../components/Loader";
import { handleStoryLogin, handleStorySignup, setStoryDetailsFunc } from "./Common";
import CommonHeader from "../../components/Header/CommonHeader";
import storyblurred from "../../assets/images/storyblurred.jpg";

const ShareStory = () => {
  const { instance } = useMsal();
  const history = useHistory();
  const dispatch = useDispatch();
  const { messageID } = useParams();
  const isAccessTokenTerms = getAccessToken()
  const [openWaitList, setOpenWaitList] = useState(false)
  const [step, setStep] = useState(1)
  const { sharedStory } = useSelector((state) => state.story);
  const [showAccountModal, setShowAccountModal] = useState(false);
  let visitorID = getVisitorIDCookie();
  
  useEffect(() => {
    localStorage.removeItem("loggedInViaStoryPreview")
    localStorage.removeItem("storyPreviewId")
  }, [])

  const setStepFunction = (data) => {
    if (data) {
      setStep(data)
    } else {
      setOpenWaitList(false)
      setStep(0)
    }
  }

  useEffect(() => {
    if (!visitorID) {
      visitorID = uuidv4()
      setVisitorIDAccess(visitorID)
    }
    if (visitorID && messageID) {
      dispatch(getSharedStoryIDUsingInvitationID(messageID, visitorID))
    }
  }, [])
  const userAssociationFunc = () => {
    if (isAccessTokenTerms) {
      dispatch(userAssociationToStory(sharedStory.storyId)).then((res) => {
        if (res) {
          history.replace(`/stories/view/0/${sharedStory.storyId}`)
        }
      })
    } else {
      history.replace(`/story-preview/${sharedStory.storyId}`)
    }
  }
  const previewStatusFuncOne = () => {
    if (visitorID && messageID && sharedStory) {
      const giveRightsAPIFormData = {
        "invitationId": messageID,
        "storyId": sharedStory.storyId,
        "visitorId": visitorID
      }
      dispatch(addPreviewerAPI(giveRightsAPIFormData)).then((response) => {
        if (response) {
          userAssociationFunc()
        }
      })
    }
  }
  const previewStatusFuncThree = () => {
    if (!isAccessTokenTerms) {
      setOpenWaitList(true)
    } else {
      if (sharedStory?.storyId) {
        history.replace(`/stories/view/0/${sharedStory.storyId}`)
      }
    }
  }
  useEffect(() => {
    if (sharedStory) {
      if (sharedStory?.storyPreviewStatusId === 1) {
        previewStatusFuncOne()
      }
      if (sharedStory?.storyPreviewStatusId === 2) {
        userAssociationFunc()
      }
      if (sharedStory?.storyPreviewStatusId === 3) {
        previewStatusFuncThree()
      }
    }
  }, [sharedStory])

  const handleLoginFunc = () => {
    setStoryDetailsFunc(sharedStory.storyId)
    handleStoryLogin(instance)
  }
  const handleSignupFunc = () => {
    setStoryDetailsFunc(sharedStory.storyId)
    handleStorySignup(instance)
  }

  return (
    <>
      <CommonHeader handleLogin={handleLoginFunc} handleSignup={handleSignupFunc} />
      <Loader />
      {openWaitList &&
        <>
          <div className="absolute top-0 left-0 w-full h-full bg-white z-50 mt-12">
            <img src={storyblurred} />
          </div>
          <Waitlist alreadyViewed={true} setStepFunction={setStepFunction} step={step} handleLogin={handleLoginFunc} handleSignup={handleSignupFunc} openWaitList={openWaitList} setOpenWaitList={setOpenWaitList} />
        </>
      }
      {showAccountModal === true &&
        <FreeAccountModal setShowAccountModal={setShowAccountModal} show={showAccountModal} handleLogin={handleLoginFunc} handleSignup={handleSignupFunc} />
      }
    </>
  );
};

export default ShareStory;
