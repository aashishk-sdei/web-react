import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../components/Typography";
import { getAvatarName, getLabel } from "../../utils";
import { getFixNumWithStr } from "shared-logics";
import TailwindModal from "../../components/TailwindModal";
import { storylikespersons, clearStorylikespersons } from "../../redux/actions/homepage";
import AccountAvatar from "./../../components/AccountAvatar";
import PersonHeaderLoader from "./ProfileCard/PersonHeaderLoader";
import Button from "./../../components/Button";
import { setFollowUnollow } from "./../../redux/actions/follow";

const getFollowButton = (_person, index, handleUnfollowClick) => {
  let html = null;
  if (_person.isFollowing === false) {
    html = <Button className={"btn btn-medium btn-primary"} type="primary" fontWeight="medium" title={"Follow"} handleClick={() => handleUnfollowClick("FOLLOW", _person, index)} />;
  } else if (_person.isFollowing) {
    html = <Button className={"btn btn-default-dark btn-medium"} fontWeight="medium" handleClick={() => handleUnfollowClick("UNFOLLOW", _person, index)} type="default" title={"Unfollow"} />;
  }

  return html;
};
const getAuthorName = (person) => `${person?.givenName || ""} ${person?.surname || ""}` || "A User";
const LikespersonsList = ({ showLikedByModal, setIsLikedByModal, story, onPersonClick }) => {
  const { storylikespersonsList, isLikesPageLoading } = useSelector((state) => state.homepage);

  const [totalPages, setTotalPages] = useState(story?.likes?.length);
  const pageNumber = useRef(1);
  const isPaginationLoadingRef = useRef(false);
  const dispatch = useDispatch();
  const pageSize = 30;

  const handleScroll = (event) => {
    if (totalPages <= pageNumber.current) return;
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
      if (!isPaginationLoadingRef.current) {
        dispatch(storylikespersons(story?.storyId, pageNumber.current + 1, pageSize, isPaginationLoadingRef));
        pageNumber.current = pageNumber.current + 1;
      }
    }
  };
  const handleUnfollowClick = (type, person, index) => {
    dispatch(setFollowUnollow(getAuthorName(person), person?.userId, index, type, "LIKEMOADL"));
  };
  const getTotalPages = (total) => {
    if (total < pageSize) {
      return 1;
    } else {
      return Math.ceil(total / pageSize);
    }
  };
  useEffect(() => {
    setTotalPages(getTotalPages(story?.likes?.length));
  }, [dispatch, story?.storyId, story?.likes?.length]);

  useEffect(() => {
    if (totalPages !== 0) {
      document?.querySelector("#twModal")?.addEventListener("scroll", handleScroll);

      return () => {
        document?.querySelector("#twModal")?.removeEventListener("scroll", handleScroll);
        dispatch(clearStorylikespersons());
      };
    }
  }, [totalPages]);

  return (
    <TailwindModal
      title="Liked by"
      showClose={true}
      innerClasses="max-w-errModal"
      content={
        <div className="story-prsns-list likes-persons-container">
          {storylikespersonsList &&
            storylikespersonsList.map((_person, index) => (
              <div key={index} className="persons-in-story relative mb-2.5">
                <div className="flex items-center">
                  <div className="flex items-center group pr-2 " onClick={() => onPersonClick(_person?.userId)}>
                    <AccountAvatar avatarName={getAvatarName(_person.givenName, _person.surname, true)} imgSrc={_person?.profileImageUrl} bgColorCode={getFixNumWithStr(getAvatarName(_person.givenName, _person.surname, true))} likedPersons />
                    <div className="media-info flex-grow avtar-circle-medium-name ml-2.5">
                      <h3 className="title main-title">
                        <Typography size={14} text="secondary" weight="medium">
                          <span className="hover:text-blue-4 hover:underline cursor-pointer tw-ellipsis-onel">{getLabel(_person)}</span>
                        </Typography>
                      </h3>
                    </div>
                  </div>
                  <div className="ml-auto">{getFollowButton(_person, index, handleUnfollowClick)}</div>
                </div>
              </div>
            ))}
          {isLikesPageLoading && [0, 1, 2].map((_item) => <PersonHeaderLoader />)}
        </div>
      }
      showModal={showLikedByModal}
      setShowModal={setIsLikedByModal}
    />
  );
};
export default LikespersonsList;
