import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { isUserOwner } from "../../services";
import { addFooterGray, addFooterWhite } from "../../redux/actions/layout";
import StoriesPage from "./../PersonViewPage/stories/StoriesPage";
import "./index.css";

import { getMemberDetails } from "../../redux/actions/person";
import { getCustomImageUrl } from "../../utils";
import { getStory } from "../../redux/actions/story";
import { setFollowUnollow } from "../../redux/actions/follow";
import Loader from "../../components/Loader";
import other from "./../../assets/images/otherVectoriconlg.svg";
import Button from "../../components/Button";

const memberPageSize = 10;
const getMemberScrollTopStories = () => {
  return window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
};
const getMemberDocumentHeightStories = () => {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};
const getMemberTotalPagesStories = (categoryName, leftPanelDetails) => {
  const total = categoryName ? leftPanelDetails[categoryName] : leftPanelDetails["AllStories"];
  if (!total || total < memberPageSize) {
    return 1;
  } else {
    return Math.max(Math.ceil(total / memberPageSize) - 1, 1);
  }
};

const getMemberUserName = (item) => `${item?.givenName} ${item?.surname}`;

const PersonProfilePage = () => {
  const { personalInfo, loading: isPersonLoading } = useSelector((state) => state.person);

  const isMemberOwner = isUserOwner(personalInfo?.userId);

  const memberStoriesPageRef = useRef();
  const pageNumber = useRef(1);
  const isPagintionLoading = useRef(false);
  const getQueryParams = new URLSearchParams(window.location.search);
  const categoryName = getQueryParams.get("categoryName");

  const { isLoading: isStoryLoading, list, isListEmpty, isPaginationLoading: isPagintionLoadingR, leftPanelDetails } = useSelector((state) => state.story);

  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const { primaryPersonId } = useParams();

  const handleMemberPageScroll = () => {
    if (totalPages < pageNumber.current) return;
    const calHeight = getMemberDocumentHeightStories() - window.innerHeight;
    if (memberStoriesPageRef.current.scrollHeight > window.innerHeight && getMemberScrollTopStories() + memberStoriesPageRef.current.scrollHeight / 2 < calHeight) return;
    if (!isPagintionLoading.current) {
      dispatch(getStory({ personId: primaryPersonId, categoryName, pageNumber: pageNumber.current + 1, memberPageSize }, false, isPagintionLoading, true));
      pageNumber.current = pageNumber.current + 1;
    }
  };

  const handleMemberFollowUnfollow = () => {
    dispatch(setFollowUnollow(getMemberUserName(personalInfo), personalInfo?.userId, 0, personalInfo?.isMemberFollowed ? "UNFOLLOW" : "FOLLOW", "MEMBER", ""));
  };

  useEffect(() => {
    dispatch(addFooterWhite());
    return () => {
      dispatch(addFooterGray());
    };
  }, [dispatch]);

  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener("scroll", handleMemberPageScroll);
      return () => {
        window.removeEventListener("scroll", handleMemberPageScroll);
      };
    }
  }, [dispatch, categoryName, pageNumber, isPagintionLoading, totalPages]);

  useEffect(() => {
    dispatch(getStory({ personId: primaryPersonId, categoryName }, true, {}, true));
    dispatch(getMemberDetails(primaryPersonId));
  }, [dispatch, primaryPersonId]);

  useEffect(() => {
    if (categoryName) {
      dispatch(getStory({ personId: primaryPersonId, categoryName }, true, {}, true));
    }
  }, [categoryName]);
  useEffect(() => {
    if (leftPanelDetails) {
      setTotalPages(getMemberTotalPagesStories(categoryName, leftPanelDetails));
    }
  }, [dispatch, categoryName, leftPanelDetails]);

  const getMemberFollowBtn = () => {
    const isFollowed = personalInfo?.isMemberFollowed;

    return (
      <>
        <Button title={isFollowed ? "Unfollow" : "Follow"} type={isFollowed ? "default-dark" : "primary"} size="large" handleClick={handleMemberFollowUnfollow} />
      </>
    );
  };
  const getMemberProfileImage = () => {
    return <>{personalInfo?.profileImageUrl === "" ? <img className="rounded-full object-cover" src={other} alt={personalInfo?.givenName} /> : <img className="rounded-full object-cover" src={getCustomImageUrl("q=100", personalInfo?.profileImageUrl)} alt={personalInfo?.givenName} />}</>;
  };
  return (
    <>
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
        {isPersonLoading ? (
          <div>
            <Loader color="primary" />
          </div>
        ) : (
          <div className={`search-bar-top md:max-w-xl mx-auto mb-4 px-3 md:px-3 relative`}>
            <div className="w-full flex justify-center align-center prerson-profile mb-5">
              <div className="mr-5">{getMemberProfileImage()}</div>
              <div className="mt-4">
                <h3 className="text-black font-bold mb-2">
                  {personalInfo?.givenName} {personalInfo?.surname}
                </h3>
                {!isMemberOwner && getMemberFollowBtn()}
              </div>
            </div>
          </div>
        )}
        <div className="all-stories-page" ref={memberStoriesPageRef}>
          <StoriesPage hideStarterStories={true} memberId={primaryPersonId} storiesTab={true} noTree={false} personView={false} grid={4} midleClass="stories-middle-content view-all-stories-page" columnsCountBreakPoints={{ 510: 1, 511: 3, 1280: 4 }} rightPanel={false} stories={list} isStoryEmpty={isListEmpty} isLoading={isStoryLoading} paginationLoader={isPagintionLoadingR} isMemberOwner={false} />
        </div>
      </div>
    </>
  );
};
export default PersonProfilePage;
