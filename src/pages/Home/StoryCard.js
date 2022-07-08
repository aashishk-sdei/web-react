import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getImageSizeList, LAYOUT_ID, getWidgetClass, getLinkStory, getCustomImageUrl } from "../../utils";
import { isUserOwner, getOwner } from "../../services";
import { getDateString } from "../../components/utils";
import Typography from "./../../components/Typography";
import MyTooltip from "../../components/Tooltip";
import TailwindModal from "../../components/TailwindModal";
import { getPersonProfileUrl } from "../../components/utils/genderIcon";
import { updateStoryIsLiked, storylikespersons, getHomeStoryAndUpdateList } from "../../redux/actions/homepage";
import LikespersonsList from "./LikespersonsList";
import MiddleLoader from "./MiddleLoader";
import { apiRequest } from "../../redux/requests";
import { GET } from "../../redux/constants";
import defaultProfileImg from "./../../assets/images/otherVectoriconlg.svg";
import ReportStory from "./../ReportStory";
import StoryDropdown from "../Home/StoryDropdown";
const getImageUrlDetail = (story, imageProps1, imageProps2, mediaRef, cardWidth) => {
  return (
    <>
      {story.storyImages[0]?.url && (
        <div ref={mediaRef} className={`story-media bg-gray-3 flex ${story.storyImages[1]?.url ? "sth-two-images" : ""}`} style={story.storyImages[1]?.url ? { height: `${cardWidth / 2}px` } : {}}>
          <div className="flex justify-center sth-image items-center" style={story.storyImages[1]?.url ? { minHeight: `${cardWidth / 2}px`, maxHeight: `${cardWidth / 2}px` } : {}}>
            <img {...imageProps1} src={getImageUrl(story.storyImages[0])} alt="story" />
            <figure className="story-background zero" style={{ backgroundImage: "url(" + getImageUrl(story.storyImages[0]) + ")" }}>
              {" "}
            </figure>
          </div>
          {story.storyImages[1]?.url && (
            <div className="flex justify-center sth-image items-center" style={{ minHeight: `${cardWidth / 2}px`, maxHeight: `${cardWidth / 2}px` }}>
              <img {...imageProps2} src={getImageUrl(story.storyImages[1])} alt="story" />
              <figure className="story-background one" style={{ backgroundImage: "url(" + getImageUrl(story.storyImages[1]) + ")" }}>
                {" "}
              </figure>
            </div>
          )}
        </div>
      )}
      {story.storyExternalImages?.[0]?.storyImagePath && story.storyExternalImages?.[0]?.storyImagePath !== "null" && (
        <div ref={mediaRef} className="story-media bg-gray-3 flex">
          <div className="flex justify-center sth-image items-center">
            <img src={story.storyExternalImages[0].storyImagePath} alt="story" />
            <figure className="story-background zero" style={{ backgroundImage: "url(" + story.storyExternalImages[0].storyImagePath + ")" }}>
              {" "}
            </figure>
          </div>
        </div>
      )}
    </>
  );
};

const getPersonDetail = (storyPerson, isOwnerStory) => {
  return (
    storyPerson[0] &&
    getDateString(storyPerson[0], isOwnerStory) && (
      <p className="card-date-rel flex flex-wrap sub-title">
        <span className="date relative pr-2">
          <Typography size={10}>{storyPerson[0] && getDateString(storyPerson[0], isOwnerStory)}</Typography>
        </span>
      </p>
    )
  );
};

const handleLikeClick = (event, index, setCurrentLike, currentLike, isLiked, story, dispatch) => {
  event.stopPropagation();
  if (currentLike) return;
  let animateClass = document.querySelectorAll(".heart-animate");
  animateClass[index].classList.add("animate__pulse");
  setTimeout(() => {
    animateClass[index].classList.remove("animate__pulse");
  }, 1000);

  const likeStatus = isLiked ? "unlike" : "like";
  dispatch(updateStoryIsLiked(story?.storyId, likeStatus, index));
  setCurrentLike(true);
};

const getLabel = (option) => {
  const name = [];
  if (option?.givenName) {
    name.push(option?.givenName);
  }
  if (option?.surname) {
    name.push(option?.surname);
  }
  return name.join(" ");
};
const getImageUrl = (img) => {
  return getCustomImageUrl("q=100,w=640,h=640", img.croppedImageURL ? img.croppedImageURL : img.url);
};

const personUrl = (person, authorId) => {
  let Url = `/family/person-page/${person?.treeId}/${person?.id}`;
  const checkUserId = isUserOwner(authorId);
  if (!checkUserId) {
    Url += `/${authorId}`;
  }
  return Url;
};

const handlePersonUrl = (e, isOwnerStoryFlag, person, storyOwnerId, history) => {
  if ((isOwnerStoryFlag || (!isOwnerStoryFlag && !person[0]?.isLiving))) {
    e.stopPropagation()
    history.push(personUrl(person[0], storyOwnerId))
  }
}

const SecondPerson = ({ person, isOwnerStoryFlag, storyOwnerId, history }) => {
  return (
    <>
      <Typography size={14} text="secondary" weight="bold" type="text" >
        <span onClick={(e) => handlePersonUrl(e, isOwnerStoryFlag, person, storyOwnerId, history)} className={isOwnerStoryFlag || (!isOwnerStoryFlag && !person[1]?.isLiving) ? "text-gray-7 hover:text-blue-4 hover:underline" : "text-gray-7"}>
          {person[1]?.givenName} {person[1]?.surname}
        </span>
      </Typography>{" "}
    </>
  );
};

const TwoPersons = ({ person, isOwnerStoryFlag, storyOwnerId, history }) => {
  return (
    <>
      <Typography size={14} text="secondary" weight="bold" type="text" >
        <span onClick={(e) => handlePersonUrl(e, isOwnerStoryFlag, person, storyOwnerId, history)} className={isOwnerStoryFlag || (!isOwnerStoryFlag && !person[0]?.isLiving) ? "text-gray-7 hover:text-blue-4 hover:underline" : "text-gray-7"}>
          {person[0]?.givenName} {person[0]?.surname}
        </span>
      </Typography>{" "}
      <Typography size={14}>and</Typography> <SecondPerson person={person} isOwnerStoryFlag={isOwnerStoryFlag} storyOwnerId={storyOwnerId} history={history} />
      <Typography size={14}>are in this story</Typography>
    </>
  );
};

const MorethanTwoPersons = ({ person, isOwnerStoryFlag, storyOwnerId, setPersonModal, history }) => {
  return (
    <>
      <Typography size={14} text="secondary" weight="bold" type="text" >
        <span onClick={(e) => handlePersonUrl(e, isOwnerStoryFlag, person, storyOwnerId, history)} className={isOwnerStoryFlag || (!isOwnerStoryFlag && !person[0]?.isLiving) ? "text-gray-7 hover:text-blue-4 hover:underline" : "text-gray-7"}>
          {person[0]?.givenName} {person[0]?.surname}
        </span>
      </Typography>{" "}
      <Typography size={14}>and</Typography>{" "}
      <Typography size={14} weight="bold" text="secondary" type="link" href="javascript:void(0);">
        <span
          className="text-gray-7 hover:text-blue-4"
          onClick={(e) => {
            e.stopPropagation();
            setPersonModal(person);
            return false;
          }}
        >
          {person.length - 1} others{" "}
        </span>
      </Typography>{" "}
      <Typography size={14}>are in this story </Typography>
    </>
  );
};

const getPerson = (person, setPersonModal, isOwnerStoryFlag, storyOwnerId, history) => {
  if (person.length === 1) {
    return (
      <>
        <Typography size={14} text="secondary" weight="bold" type={"text"} >
          <span onClick={(e) => handlePersonUrl(e, isOwnerStoryFlag, person, storyOwnerId, history)} className={isOwnerStoryFlag || (!isOwnerStoryFlag && !person[0]?.isLiving) ? "text-gray-7 hover:text-blue-4 hover:underline" : "text-gray-7"}>
            {person[0]?.givenName} {person[0]?.surname}
          </span>
        </Typography>
        {" "}
        <Typography size={14}>is in this story</Typography>
      </>
    );
  } else if (person.length === 2) {
    return <TwoPersons person={person} isOwnerStoryFlag={isOwnerStoryFlag} storyOwnerId={storyOwnerId} history={history} />;
  } else if (person.length > 2) {
    return <MorethanTwoPersons person={person} isOwnerStoryFlag={isOwnerStoryFlag} storyOwnerId={storyOwnerId} setPersonModal={setPersonModal} history={history} />;
  }
};

const calculateHeightWidth = (actualWidth, actualHeight, width, height, story, cardWidth) => {
  let newWidth = width,
    newHeight = height;
  const cardWidthCalc = cardWidth / 2 - 1;
  if (story.layoutId === LAYOUT_ID.TWO_IMAGE) {
    if (actualWidth > cardWidthCalc && actualHeight > cardWidthCalc) {
      newWidth = "100%";
      newHeight = "100%";
    } else if (actualWidth < cardWidthCalc && actualHeight > cardWidthCalc) {
      newHeight = "auto";
    } else if (actualWidth > cardWidthCalc && actualHeight < cardWidthCalc) {
      newWidth = "auto";
    }
  }
  return { newWidth, newHeight };
};

const getAuthorName = (story) => `${story?.author?.givenName || ""} ${story?.author?.surname || ""}` || "A User";
const StoryCard = ({ story, storyIndex, showComment, showReport, featureCmtLoading,setPaymentModal,ViewStoryPaywall }) => {
  const [Img2smalClas, setImg2smalClas] = useState([false, false]);
  const [showModal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(story?.likes?.some((e) => e.userId === getOwner()));
  const [currentLike, setCurrentLike] = useState(false);
  const [showLikedByModal, setIsLikedByModal] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const pageSize = 30;
  const storyRef = useRef(null);
  const mediaRef = useRef(null);
  const ioRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const [topicDetails, setTopicDetails] = useState([]);
  const [memberDetails, setMemberDetails] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [showWidget, setShowWidget] = useState(false);
  const setPersonModal = (person) => {
    setModal(person);
  };
  const handleClick = (_e) => {
    handleViewAuthor(story?.author?.userId);
  };

  const handleLikesCount = (event) => {
    event.stopPropagation();
    dispatch(storylikespersons(story?.storyId, 1, pageSize));
    setIsLikedByModal(true);
  };

  const handleViewAuthor = (userId) => {
    if (userId) {
      history.push(`/person/profile/${userId}`);
    }
  };

  const getTopicDetails = () => {
    let topicsArr = [];
    if (story && story?.topics) {
      story?.topics.map(async (topicId) => {
        await apiRequest(GET, `TopicAuthority/id/${topicId}`).then((res) => {
          topicsArr.push(res.data);
        });
        topicsArr.sort(function (a, b) {
          return story.topics.indexOf(a.id) - story.topics.indexOf(b.id);
        });
        setTopicDetails([...topicsArr]);
      });
    }
  };

  const getMemberDetails = async (userId) => {
    await apiRequest(GET, `Users/${userId}/memberDetail`).then((res) => {
      setMemberDetails(res.data);
    });
  };

  useEffect(() => {
    if (story.authorId) {
      getMemberDetails(story?.authorId);
    }
  }, [story?.authorId]);

  useEffect(() => {
    getTopicDetails();
  }, [story?.topics]);

  useEffect(() => {
    setIsLiked(story?.likes?.some((e) => e.userId === getOwner()));
  }, [story?.likes]);

  useEffect(() => {
    setCurrentLike(false);
  }, [isLiked]);

  const loadMoreStory = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let storyId = typeof story === "string" ? story : story?.storyId;
        if (!featureCmtLoading) {
          dispatch(getHomeStoryAndUpdateList({ storyId: storyId, showComment }));
        }
        storyRef.current && ioRef.current.unobserve(storyRef.current);
      }
    });
  }, [showComment, featureCmtLoading]);
  useLayoutEffect(() => {
    setCardWidth(storyRef?.current?.clientWidth);
  }, [story, storyRef]);

  useEffect(() => {
    if (storyRef.current) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      ioRef.current = new IntersectionObserver(loadMoreStory, options);
      ioRef.current.observe(storyRef.current);
    }
    return () => {
      storyRef.current && ioRef.current.unobserve(storyRef.current);
    };
  }, [storyRef, loadMoreStory]);

  useEffect(() => {
    const updateState = () => {
      const boolTwo = story.layoutId === LAYOUT_ID.TWO_IMAGE;
      const heightStoryI = boolTwo ? 500 : 640;
      const widthStoryI = boolTwo ? 346 : 640;
      let img1 = new Image(),
        img2 = new Image();
      img1.src = getImageUrl(story.storyImages[0]);
      img1.onload = () => {
        const actualWidth = img1.naturalWidth;
        const actualHeight = img1.naturalHeight;
        let { width, height } = getImageSizeList(actualWidth, actualHeight, story.layoutId, { width: widthStoryI, height: heightStoryI });
        const { newWidth, newHeight } = calculateHeightWidth(actualWidth, actualHeight, width, height, story, cardWidth);
        setImg2smalClas((prev) => {
          prev[0] = {
            style: {
              width: newWidth,
              height: newHeight,
              objectFit: "cover",
            },
            width: actualWidth,
            height: actualHeight,
          };
          return [...prev];
        });
      };
      if (story.storyImages[1]) {
        img2.src = getImageUrl(story.storyImages[1]);
        img2.onload = () => {
          const actualWidth = img2.naturalWidth;
          const actualHeight = img2.naturalHeight;
          let { width, height } = getImageSizeList(actualWidth, actualHeight, story.layoutId, { width: widthStoryI, height: heightStoryI });
          const { newWidth, newHeight } = calculateHeightWidth(actualWidth, actualHeight, width, height, story, cardWidth);
          setImg2smalClas((prev) => {
            prev[1] = {
              style: {
                width: newWidth,
                height: newHeight,
                objectFit: "cover",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        };
      }
    };
    if (story?.storyImages?.length) {
      updateState();
    }
  }, [story, cardWidth]);
  let imageProps1 = {};
  if (Img2smalClas[0]) {
    imageProps1 = Img2smalClas[0];
  }
  let imageProps2 = {};
  if (Img2smalClas[1]) {
    imageProps2 = Img2smalClas[1];
  }
  const handleViewStory = (checkComment) => {

    if(ViewStoryPaywall){
    apiRequest(GET, `Story/checkstorypermission/${story.storyId}`).then((res) => {
      if(res.data){
        history.push(`/stories/view${getLinkStory({ refType: 0, storyId: story.storyId,checkComment})}`)
      }else{
        setPaymentModal(true)
      }
    })
  }else{
    history.push(`/stories/view${getLinkStory({ refType: 0, storyId: story.storyId,checkComment})}`)
  }
  };
  const personLink = (person, _story, e) => {
    e.stopPropagation();
    history.push(personUrl(person, _story.authorId));
  };
  const storyPerson = story?.personDetail;
  const { userProfileAccount } = useSelector((state) => state.user);
  const loggedinUserId = userProfileAccount?.id;
  const storyOwnerId = story?.authorId;
  let isOwnerStory = false;
  if (storyOwnerId !== undefined) {
    if (storyOwnerId === loggedinUserId) isOwnerStory = true;
  }

  const storyCardHtml = () => (
    <>
      <div onClick={handleViewStory} className={`bg-white card w-full cursor-pointer ${getWidgetClass(story.layoutId)}`}>
        <div className="card-content-wrap relative">
          <div className={`story-author-info px-6  ${(!!story.storyImages[0]?.url || story.storyExternalImages?.[0]?.storyImagePath) ? "border-b border-gray-2 py-4" : "pt-4 pb-0"}`}>
            <div className="title mb-2 capitalize pr-12">
              <Typography text="secondary" size={24} weight="lyon-medium">
                {story.title}
              </Typography>
            </div>
            {showReport && (
              <div className="absolute z-100 right-6 top-4 md:top-6 home-sc-dd" onClick={(e) => e.stopPropagation()}>
                <StoryDropdown view={story} showWidget={showWidget} setShowWidget={setShowWidget} setShowReportModal={setShowReportModal} showReportModal={showReportModal} />
              </div>
            )}
            <div className="story-card-persons-top mt-1">
              <div className="tags break-words" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-wrap">
                  <div className="mr-1.5 mb-2" style={{ marginTop: '-2px' }}>
                    <Typography size={14}>
                      added by
                    </Typography>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="mr-1.5 overflow-hidden bg-white flex items-center justify-center avtar-circle-small">
                      <img src={memberDetails.profileImageUrl ? memberDetails.profileImageUrl : defaultProfileImg} className="w-6 h-6 object-cover" alt="avtar" />
                    </div>
                    <Typography size={12} text="secondary" weight="medium" >
                      <span className="relative mr-2 capitalize">
                        {" "}
                        <span className="text-black hover:text-blue-4 hover:underline link-inline" onClick={handleClick}>
                          {getAuthorName(story)}{" "}
                        </span>
                      </span>
                    </Typography>
                  </div>
                  {topicDetails?.map((topic) => (
                    <div onClick={() => history.push(`/explore/topic/${topic.primaryUrl}`)} className="bg-gray-2 rounded px-2 mr-2 mb-2 inline-flex items-center">
                      <Typography size={12} text="black-color">
                        <span className="hover:text-blue-4 hover:underline">{topic.term}</span>
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {getImageUrlDetail(story, imageProps1, imageProps2, mediaRef, cardWidth)}
          <div className="story-detail-wrap pt-4 pb-8 px-6">
            <div className="story-detail-container mb-5">
              {story?.date && (
                <div className="location-date mb-2">
                  <Typography size={12} weight="medium">
                    <span className="date">{story?.date}</span>
                    {story?.location && <span className="location">{story?.location}</span>}
                  </Typography>
                </div>
              )}
              <div className="description mb-2">
                <p>
                  <Typography size={14} text="secondary">
                    {story.content}
                  </Typography>
                </p>
              </div>
              <div>{getPerson(storyPerson, setPersonModal, isOwnerStory, storyOwnerId, history)}</div>
            </div>
            {/* bottom start */}
            <div className="mt-6">
              <div className="flex feedcard-footer">
                <div className="pt-0.5">
                  <MyTooltip type="hover" arrow={false} open={true} placement="top" title="Like" fontWeight="400" padding="6">
                    <button className="heart-animate" onClick={(e) => handleLikeClick(e, storyIndex, setCurrentLike, currentLike, isLiked, story, dispatch)}>
                      {isLiked ? (
                        <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.9999 20.844L2.4119 10.844C1.56923 10.002 1.01306 8.91605 0.822258 7.7402C0.631457 6.56434 0.815714 5.35825 1.3489 4.293C1.75095 3.48912 2.33827 2.79227 3.06244 2.25988C3.78662 1.72749 4.62694 1.37479 5.51415 1.23085C6.40137 1.0869 7.31009 1.15583 8.16544 1.43194C9.0208 1.70806 9.7983 2.18347 10.4339 2.819L11.9999 4.384L13.5659 2.819C14.2015 2.18347 14.979 1.70806 15.8343 1.43194C16.6897 1.15583 17.5984 1.0869 18.4856 1.23085C19.3729 1.37479 20.2132 1.72749 20.9373 2.25988C21.6615 2.79227 22.2488 3.48912 22.6509 4.293C23.1834 5.35784 23.3673 6.56321 23.1767 7.7384C22.9861 8.91359 22.4306 9.99903 21.5889 10.841L11.9999 20.844Z" fill="#FC4040" stroke="#FC4040" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      ) : (
                        <svg className="without-stroke" width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.9999 20.844L2.4119 10.844C1.56923 10.002 1.01306 8.91605 0.822258 7.7402C0.631457 6.56434 0.815714 5.35825 1.3489 4.293V4.293C1.75095 3.48912 2.33827 2.79227 3.06244 2.25988C3.78662 1.72749 4.62694 1.37479 5.51415 1.23085C6.40137 1.0869 7.31009 1.15583 8.16544 1.43194C9.0208 1.70806 9.7983 2.18347 10.4339 2.819L11.9999 4.384L13.5659 2.819C14.2015 2.18347 14.979 1.70806 15.8343 1.43194C16.6897 1.15583 17.5984 1.0869 18.4856 1.23085C19.3729 1.37479 20.2132 1.72749 20.9374 2.25988C21.6615 2.79227 22.2488 3.48912 22.6509 4.293C23.1834 5.35784 23.3673 6.56321 23.1767 7.7384C22.9861 8.91359 22.4306 9.99903 21.5889 10.841L11.9999 20.844Z" stroke="#747578" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      )}
                    </button>
                  </MyTooltip>
                </div>
                {story?.likes?.length > 0 && (
                  <div className="ml-2">
                    <MyTooltip type="hover" arrow={false} open={true} placement="top" title={story?.likes?.length > 1 ? "View likes" : "View like"} fontWeight="400" padding="6">
                      <button onClick={handleLikesCount}>
                      <Typography>
                        <span className="hover:text-gray-7">
                          {story?.likes?.length} like{story?.likes?.length > 1 && "s"}
                        </span>
                        </Typography>
                      </button>
                    </MyTooltip>
                  </div>
                )}
                <div className="ml-6" onClick={(e) => e.stopPropagation()}>
                  <div onClick={() => handleViewStory("checkComment")}>
                    <MyTooltip type="hover" arrow={false} open={true} placement="top" title="Comment" fontWeight="400" padding="6">
                      <button className="flex">
                        <svg className="without-strokecomment" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.691 1.50001C10.946 1.4975 9.23202 1.9624 7.72708 2.84648C6.22213 3.73056 4.981 5.0016 4.1325 6.5277C3.28399 8.0538 2.85902 9.77935 2.90169 11.5253C2.94436 13.2712 3.45311 14.9739 4.37516 16.4567L1.5 22.5L7.53755 19.6225C8.82517 20.4237 10.2811 20.9148 11.7906 21.0569C13.3002 21.199 14.8221 20.9884 16.2364 20.4416C17.6508 19.8948 18.9189 19.0268 19.941 17.9059C20.963 16.7851 21.711 15.442 22.126 13.9825C22.541 12.523 22.6118 10.9871 22.3326 9.49558C22.0534 8.0041 21.432 6.59788 20.5173 5.3877C19.6026 4.17753 18.4195 3.19648 17.0614 2.52184C15.7033 1.8472 14.2072 1.4974 12.691 1.50001V1.50001Z" stroke="#747578" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {showComment && story?.isReportCount > 0 && (
                          <p className="ml-2 text-gray-5 text-base hover:text-gray-7">{story?.isReportCount} comment{story?.isReportCount > 1 && "s"}</p>
                        )}
                      </button>
                    </MyTooltip>
                  </div>
                </div>
              </div>
            </div>
            {/* bottom end */}
          </div>
        </div>
        <TailwindModal
          title={"People in this story"}
          showClose={true}
          innerClasses="max-w-errModal"
          content={
            <div className="story-prsns-list">
              {showModal &&
                showModal.map((_person, index) => (
                  <div key={index} className="persons-in-story relative mb-2.5">
                    <div className="flex items-center group  avtar-group">
                      <div className="media w-8 h-8 overflow-hidden mr-2 avtar-square-medium">
                        <img src={getPersonProfileUrl(_person)} className="object-cover w-8 h-8" alt="Profile Pic" />
                      </div>
                      <div className="media-info flex-grow avtar-square-medium-name">
                        <div>
                          <h3>
                            <Typography size={12} text="secondary" weight="medium">
                              <span className={isOwnerStory || (!isOwnerStory && !_person?.isLiving) ? "hover:text-blue-4 hover:underline cursor-pointer" : ""} {...((isOwnerStory || (!isOwnerStory && !_person?.isLiving)) && { onClick: personLink.bind(null, _person, story) })}>
                                {getLabel(_person)}
                              </span>
                            </Typography>
                          </h3>
                          {getDateString(_person, isOwnerStory) && (
                            <p className="date-tree flex flex-wrap sub-title">
                              <span className={isOwnerStory || (!isOwnerStory && !_person?.isLiving) ? "date relative pr-2 cursor-pointer" : "date relative pr-2 "} {...((isOwnerStory || (!isOwnerStory && !_person?.isLiving)) && { onClick: personLink.bind(null, _person, story) })}>
                                <Typography size={10}>{getDateString(_person, isOwnerStory)}</Typography>
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          }
          showModal={Boolean(showModal)}
          setShowModal={setModal}
        />
        {showLikedByModal && <LikespersonsList showLikedByModal={showLikedByModal} setIsLikedByModal={setIsLikedByModal} story={story} onPersonClick={(userId) => handleViewAuthor(userId)} />}
        <TailwindModal showModal={showReportModal} setShowModal={setShowReportModal} classes="inset-0" innerClasses="modal-sm" content={<ReportStory />} />
      </div>
    </>
  );
  return (
    <div ref={storyRef}>
      {typeof story === "string" ? (
        <div className="bg-white card w-full cursor-pointer">
          <MiddleLoader isStory={true} />
        </div>
      ) : (
        storyCardHtml()
      )}
    </div>
  );
};
export default StoryCard;