import React, { useEffect, useMemo, useState, useRef } from "react";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import Icon from "./../../../../components/Icon";
import AccountAvatar from "../../../../components/AccountAvatar";
import MyTooltip from "../../../../components/Tooltip";
import PermissionCard from "./../../../../components/PermissionCard";
import "./../addStories/index.css";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import ClassNames from "classnames";
import { publishedTitleByGUID, viewStory, updateViewStoryIsLiked, deleteStory, emptyViewState, previewStory, viewStoryViaInvitationAPI } from "../../../../redux/actions/story";
import { storylikespersons } from "../../../../redux/actions/homepage";
import { countComments, addComments } from "../../../../redux/actions/comments";
import { showFooter } from "../../../../redux/actions/layout";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Loader from "./../../../../components/Loader";
import StoryDropdownWidget from "./StoryDropdownWidget";
import { v4 as uuidv4 } from "uuid";
import { LAYOUT_ID, getImageSize, getScreen, getFullWidthHeight, getWidgetClass, getStoryRedirectUrl, getImageProps, getCustomImageUrl, getAvatarName } from "../../../../utils";
import { getAccessToken, getOwner, isUserOwner } from "../../../../services";
import ShareModal from "../../../Home/StoryCard/ShareModal";
import Details from "./Details";
import Comments from "./Comments";
import LikespersonsList from "../../../Home/LikespersonsList";
import TailwindModalDialog from "./../../../../components/TailwindModalDialog";
import TailwindModal from "./../../../../components/TailwindModal";
import ReportStory from "./../../../ReportStory";
import UseWindowDimensions from "../../../../pages/SearchPage/WindowDimensions";
import { useFeatureFlag } from "./../../../../services/featureFlag";
import { getFixNumWithStr } from "shared-logics";
import queryString from "query-string";

const defaultStyle = {
  display: "block",
  overflow: "hidden"
};

const AutoHeightTextarea = ({ story, user, style = defaultStyle, isSidebarOpen, ...etc }) => {
  const textareaRef = useRef(null);
  const [commentValue, setCommentValue] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight <= 120) {
        textareaRef.current.style.height = scrollHeight + "px";
      } else {
        textareaRef.current.style.height = 120 + "px";
      }
    }
  }, [textareaRef.current, commentValue]);

  useEffect(() => {
    textareaRef.current.focus()
  }, [isSidebarOpen])

  const HandleComments = () => {
    if (commentValue) {
      let commentobj = {
        content: commentValue,
        commenterName: `${user.userFirstName} ${user.userLastName}`,
        storyId: story.view.storyId,
        commenterId: user.userId,
        commentId: uuidv4(),
        commenterProfileImageUrl: user.imgSrc,
        createdDate: new Date().toISOString(),
      };
      dispatch(addComments(commentobj));
      setCommentValue("")
    }
  };
  return (
    <div>
      <textarea
        ref={textareaRef}
        style={style}
        {...etc}
        value={commentValue}
        onChange={(e) => {
          setCommentValue(e.target.value);
        }}
        maxLength={500}
        onInput={(e) => {
          if (e.which === 13) {
            return false;
          }
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.key === "Enter") {
            e.preventDefault();
            HandleComments();
          }
        }}
        tabIndex="1"
        className="comments-input-text w-full mb-2 resize-none"
        placeholder="Add a comment..."
      />
      {commentValue && (
        <div className="flex w-full justify-end pt-2">
          <div className="mr-2">
            <Button type="default-dark" tabindex="3" fontWeight="medium" title="Cancel" handleClick={() => setCommentValue("")} />
          </div>
          <Button buttonType="submit" tabindex="2" fontWeight="medium" title="Comment" handleClick={HandleComments} />
        </div>
      )}
    </div>
  );
};

const getContentNew = (string) => {
  let strArr = string?.split(/\r\n/g) || [];
  return strArr.map((item) =>
    item ? (
      <Typography size={14} text="secondary">
        {item}
        <br />
      </Typography>
    ) : (
      <br />
    )
  );
};

const showExternalMedia = (item, history, handleOnClickPreviewImage) => {
  let html = null;
  let image = "";
  if (item && item.storyExternalImages?.[0]?.storyImagePath) {
    image = item.storyExternalImages[0].storyImagePath;
    html = (
      <div className={ClassNames(`main-stroy-img  ${getWidgetClass(item?.layoutId)}`)}>
        <div className="image-container relative w-full h-full">
          <div className={`image-cont w-full h-full`}>
            <img
              onClick={() => {
                if (handleOnClickPreviewImage()) {
                  history.push(`/media/view-image/${item?.storyExternalImages[0].mediaId}/newspaper`)
                }
              }} src={image} className="h-full w-full cursor-pointer" />
          </div>
        </div>
      </div>
    );
  }
  return html;
};
const getImage = (item, selectedFile, history, handleOnClickPreviewImage) => {
  let html = null;
  if (item?.storyImages?.length) {
    html = (
      <div className={ClassNames(`main-stroy-img  ${getWidgetClass(item?.layoutId)}`)}>
        <div className="image-container relative">
          <div style={{ ...(item?.layoutId !== LAYOUT_ID.TWO_IMAGE && selectedFile[0]?.calculate && getFullWidthHeight(selectedFile[0]?.calculate)) }} className={`single-img image-cont ${getSmallImgClass(item?.layoutId, selectedFile[0]?.calculate)}`}>
            <img {...getImageProps(selectedFile[0], item?.layoutId)} onClick={() => {
              if (handleOnClickPreviewImage()) {
                history.push(`/media/view-image/${item?.storyImages[0].mediaId}`)
              }
            }}
              src={getImageUrl(item?.storyImages[0])} className="object-cover cursor-pointer" />
          </div>
          {item?.storyImages[1]?.url && (
            <div className={`second-image image-cont relative ${getSmallImgClass(item?.layoutId, selectedFile[1]?.calculate)}`}>
              <img {...getImageProps(selectedFile[1], item?.layoutId)} onClick={() => {
                if (handleOnClickPreviewImage()) {
                  history.push(`/media/view-image/${item?.storyImages[1].mediaId}`)
                }
              }} src={getImageUrl(item?.storyImages[1])} className="object-cover cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return html;
};

const getSmallImgClass = (type, file) => {
  let str = "";
  if ((type === LAYOUT_ID.TWO_IMAGE && file?.height < 287) || file?.width < 400) {
    str += " sm-item";
  }
  return str;
};

const getImageUrl = (img) => {
  return getCustomImageUrl("q=100,w=500,h=700", img?.url);
};

const showPublicationTitle = (newspaperStory, publication_title) => {
  let htmlPublication = null;
  if (newspaperStory && publication_title) {
    htmlPublication = (
      <div className="mb-1 relative location-field flex items-center">
        <span className="mr-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
            <path d="M15 3.8V12.6667C15 13.038 14.8525 13.3941 14.5899 13.6566C14.3274 13.9192 13.9713 14.0667 13.6 14.0667C13.2287 14.0667 12.8726 13.9192 12.6101 13.6566C12.3475 13.3941 12.2 13.038 12.2 12.6667V1.93333C12.2 1.6858 12.1017 1.4484 11.9266 1.27337C11.7516 1.09833 11.5142 1 11.2667 1H1.93333C1.6858 1 1.4484 1.09833 1.27337 1.27337C1.09833 1.4484 1 1.6858 1 1.93333V12.6667C1 13.038 1.1475 13.3941 1.41005 13.6566C1.6726 13.9192 2.0287 14.0667 2.4 14.0667H13.6" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.33337 9.40002H9.86671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.33337 11.2667H7.06671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.33337 3.33331H9.86671V7.06665H3.33337V3.33331Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span className="leading-6 text-xs w-full bg-transparent text-gray-6 focus:outline-none capitalize">{publication_title} </span>
      </div>
    );
  }
  return htmlPublication;
};

const getImageClass = (view) => `saved-story-wrap ${view?.storyImages?.length || view?.storyExternalImages?.length ? "has-image" : "has-long-text"} w-full mx-auto`;
const calculateCropImageSize = (imgCrop, calculateImageSize, layout) => {
  const { width: _width, height: _height, widthActual: _widthActual, heightActual: _heightActual } = getImageSize(imgCrop.naturalWidth, imgCrop.naturalHeight, layout, getScreen());
  calculateImageSize[layout] = {};
  calculateImageSize[layout].calculate = {
    width: _width,
    height: _height,
    widthActual: _widthActual,
    heightActual: _heightActual,
  };
  return calculateImageSize;
};
const updateState = (view, setValidSelectedFileObj) => {
  let img1 = new Image(),
    img2 = new Image();
  img1.src = getImageUrl(view?.storyImages[0]);
  img2.src = getImageUrl(view?.storyImages[1]);
  img1.onload = () => {
    let layout = view.layoutId;
    let calculateImageSize = { calculate: {} };
    const { width, height, widthActual, heightActual } = getImageSize(img1.naturalWidth, img1.naturalHeight, layout, getScreen());
    calculateImageSize.calculate = {
      width: width,
      height: height,
      widthActual: widthActual,
      heightActual: heightActual,
    };
    if (view?.storyImages[0]?.url) {
      let imgCrop = new Image();
      imgCrop.src = view?.storyImages[0].url;
      imgCrop.onload = () => {
        calculateCropImageSize(imgCrop, calculateImageSize, layout);
      };
    }
    setValidSelectedFileObj((prev) => {
      prev[0] = {
        calculate: calculateImageSize?.calculate,
      };
      return [...prev];
    });
  };
  img2.onload = () => {
    let layout = view.layoutId;
    let calculateImageSize = { calculate: {} };
    const { width, height, widthActual, heightActual } = getImageSize(img2.naturalWidth, img2.naturalHeight, layout, getScreen());
    calculateImageSize.calculate = {
      width: width,
      height: height,
      widthActual: widthActual,
      heightActual: heightActual,
    };
    if (view?.storyImages[1]?.url) {
      let imgCrop = new Image();
      imgCrop.src = view?.storyImages[1].url;
      imgCrop.onload = () => {
        calculateCropImageSize(imgCrop, calculateImageSize, layout);
      };
    }

    setValidSelectedFileObj((prev) => {
      prev[1] = {
        calculate: calculateImageSize?.calculate,
      };
      return [...prev];
    });
  };
};
const _handleback = (history, mediaId, refType, treeId, primaryPersonId, newspaperStory) => {
  if (history.action === "POP") {
    let url;
    if (mediaId) {
      url = `/media/view-image/${mediaId}${newspaperStory ? "/newspaper" : ""}`;
    } else {
      url = getStoryRedirectUrl({ refType, treeId, primaryPersonId });
    }
    return history.push(url);
  } else {
    return history.goBack();
  }
};
const setPublicationTitle = (view) => {
  return publishedTitleByGUID(view?.storyExternalImages?.[0]?.publicationTitleId);
};
const setImage = (newspaperStory, view, history, selectedFile, handleOnClickPreviewImage) => {
  return newspaperStory ? showExternalMedia(view, history, handleOnClickPreviewImage) : getImage(view, selectedFile, history, handleOnClickPreviewImage);
};

const handleViewAuthor = (userId, history) => {
  if (userId) {
    history.push(`/person/profile/${userId}`);
  }
};
const getAvatarDetails = ({ view, handlePopoverClick }) => {
  return (
    <div className="flex v-head-avatar items-center">
      <div className="mr-2.5 cursor-pointer" onClick={handlePopoverClick}>
        <AccountAvatar avatarName={`${view?.author?.givenName?.[0]}${view?.author?.surname?.[0] || ""}`} imgSrc={view?.author?.profileImageUrl} />
      </div>
      <div className="flex-grow avtar-square-large-name avtar-group cursor-pointer">
        <h3 className="main-title">
          <Typography size={14} text="secondary" weight="bold">
            <span onClick={handlePopoverClick} className="hover:text-blue-4 hover:underline link-inline view-hoverink">
              {view?.author && (
                <>
                  {view?.author?.givenName} {view?.author?.surname}
                </>
              )}
            </span>
          </Typography>
        </h3>
        {view?.author?.isFollow && (
          <p className="card-date-rel flex flex-wrap sub-title">
            <span className="date relative pr-2">
              <Typography size={10}>Following</Typography>
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

const handleLikeClick = (event, setCurrentLike, currentLike, isLiked, view, dispatch) => {
  event.stopPropagation();
  if (currentLike) return;
  let animateClass = document.querySelectorAll(".heart-animate");
  animateClass[0].classList.add("animate__pulse");
  setTimeout(() => {
    animateClass[0].classList.remove("animate__pulse");
  }, 1000);

  const likeStatus = isLiked ? "unlike" : "like";
  dispatch(updateViewStoryIsLiked(view?.storyId, likeStatus));
  setCurrentLike(true);
};
const getLikeSvgFill = (bool) => (bool ? "#FC4040" : "none");
const getLikeSvgStroke = (bool) => (bool ? "#FC4040" : "#747578");

const handleScroll = () => {
  const railRight = document.querySelector(".rail-right");
  const onScrollToggle = document.querySelector(".onScollToggle");
  const divWrapper = document.querySelector(".bg-white.flex-auto.mt-8.w-full.h-full");
  if (divWrapper.getBoundingClientRect().y >= 0) {
    railRight?.classList?.add("absolute");
    railRight?.classList?.remove("fixed");
  } else {
    railRight?.classList?.add("fixed");
    railRight?.classList?.remove("absolute");
  }
  if (divWrapper.getBoundingClientRect().y >= -75) {
    onScrollToggle?.classList?.add("hidden");
  } else {
    onScrollToggle?.classList?.remove("hidden");
  }
};

const getLikeLength = (isSidebarOpen, view, handleLikesCount) => {
  return (
    <>
      {isSidebarOpen && (
        <div className="cursor-pointer flex inline-flex group items-center mb-4 ml-4 rail-r-top-like-btn">
          {!!view?.likes?.length && (
            <span className="mr-4">
              <Typography size={14} weight="medium">
                <span className={`group-hover:underline group-hover:text-blue-3 text liked-btn`}>{view?.likes?.length}</span>
              </Typography>
            </span>
          )}
          <div className="btn btn-default justify-center">
            {!!view?.likes?.length ? (
              <span onClick={handleLikesCount}>
                <span className="icon">
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00027 13.25L2.03464 7.02742C1.51033 6.50348 1.16428 5.82775 1.04557 5.09606C0.92685 4.36437 1.04149 3.61387 1.37324 2.95101C1.6234 2.45079 1.98882 2.01717 2.43941 1.68589C2.88999 1.35461 3.41283 1.13514 3.96486 1.04556C4.51688 0.955993 5.08228 0.998882 5.61449 1.1707C6.14669 1.34252 6.63045 1.63834 7.02591 2.0338L8.00027 3.00764L8.97464 2.0338C9.3701 1.63834 9.85386 1.34252 10.3861 1.1707C10.9183 0.998882 11.4837 0.955993 12.0357 1.04556C12.5877 1.13514 13.1106 1.35461 13.5611 1.68589C14.0117 2.01717 14.3772 2.45079 14.6273 2.95101C14.9586 3.61362 15.0731 4.36367 14.9545 5.09494C14.8359 5.82621 14.4903 6.50163 13.9665 7.02556L8.00027 13.25Z" fill="#FC4040" stroke="#FC4040" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </span>
            ) : (
              <span>
                <span className="icon">
                  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.00027 13.25L2.03464 7.02743C1.51033 6.50348 1.16428 5.82775 1.04557 5.09606C0.92685 4.36437 1.04149 3.61388 1.37324 2.95101V2.95101C1.6234 2.45079 1.98882 2.01718 2.43941 1.68589C2.88999 1.35461 3.41283 1.13514 3.96486 1.04557C4.51688 0.955997 5.08228 0.998886 5.61449 1.1707C6.14669 1.34252 6.63045 1.63835 7.02591 2.03381L8.00027 3.00764L8.97464 2.03381C9.3701 1.63835 9.85386 1.34252 10.3861 1.1707C10.9183 0.998886 11.4837 0.955997 12.0357 1.04557C12.5877 1.13514 13.1106 1.35461 13.5611 1.68589C14.0117 2.01718 14.3772 2.45079 14.6273 2.95101C14.9586 3.61362 15.0731 4.36367 14.9545 5.09494C14.8359 5.82621 14.4903 6.50164 13.9665 7.02556L8.00027 13.25Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const getStoryWidget = (_view, setShowDialog, setShowReportModal) => {
  return (
    <>
      {isUserOwner(_view?.authorId) && (
        <div className="mb-4 ml-4 relative z-10 icon-btn">
          <StoryDropdownWidget setShowDialog={setShowDialog} setShowReportModal={setShowReportModal} />
        </div>
      )}
    </>
  );
};

const getLikeButton = (handleModal, setCurrentLike, currentLike, isLiked, view, dispatch, text = true) => {
  return (
    <button className="btn btn-default btn-large" onClick={(e) => {
      if (handleModal()) {
        handleLikeClick(e, setCurrentLike, currentLike, isLiked, view, dispatch)
      }
    }
    }
    >
      <span className="heart-animate icon mt-0.5">
        <svg className={`${isLiked && "fill_color"}`} width="16" height="15" viewBox="0 0 16 15" fill={`${getLikeSvgFill(isLiked)}`} xmlns="http://www.w3.org/2000/svg">
          <path d="M8.00006 14.0627L1.60806 7.39606C1.04629 6.83472 0.675505 6.11076 0.548304 5.32686C0.421104 4.54295 0.543942 3.7389 0.899397 3.02873V3.02873C1.16743 2.49281 1.55898 2.02824 2.04176 1.67332C2.52455 1.31839 3.08476 1.08326 3.67623 0.987293C4.26771 0.891329 4.87353 0.937279 5.44376 1.12136C6.014 1.30544 6.53233 1.62237 6.95606 2.04606L8.00006 3.08939L9.04406 2.04606C9.46779 1.62237 9.98613 1.30544 10.5564 1.12136C11.1266 0.937279 11.7324 0.891329 12.3239 0.987293C12.9154 1.08326 13.4756 1.31839 13.9584 1.67332C14.4412 2.02824 14.8327 2.49281 15.1007 3.02873C15.4557 3.73862 15.5783 4.5422 15.4513 5.32566C15.3242 6.10912 14.9539 6.83275 14.3927 7.39406L8.00006 14.0627Z" stroke={`${getLikeSvgStroke(isLiked)}`} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="ml-2 like-btn-txt">
        {text && (
          <Typography size={16} weight="medium">
            <span className={ClassNames(`text block`, { "liked-btn": isLiked })}>Like</span>
          </Typography>
        )}
      </span>
    </button>
  );
};

const loadingCondition = ({ view, isLoading, setValidSelectedFileObj, set_publication_title, setLoading }) => {
  if (!isLoading) {
    if (view?.storyImages?.length) {
      updateState(view, setValidSelectedFileObj);
    }
    if (view?.storyExternalImages?.[0]?.publicationTitleId) {
      setPublicationTitle(view).then((response) => {
        set_publication_title(response);
        setLoading(false);
      });
    } else if (view) {
      setLoading(false);
    }
  }
};

const chunkDisplayCondition = (view, chunk) => {
  let cond = view?.storyImages?.length || view?.storyExternalImages?.length ? 1 : 2;
  return chunk?.length ? [...chunk]?.splice(cond) : [];
};

const isThereImage = (view) => {
  return view?.storyImages?.length || view?.storyExternalImages?.length;
};

const renderChunks = (item, key) => {
  return item ? (
    <span key={key}>
      <Typography size={14} text="secondary">
        {item}
      </Typography>
      <br />
    </span>
  ) : (
    <br key={key} />
  );
};

const getChunksContentPerWidth = (width, view, chunk) => {
  return width > 547 ? (
    <Typography size={14} text="secondary">
      <span className="display-linebreak">{getContentNew(chunk[0]?.join(" "))}</span>
    </Typography>
  ) : (
    <Typography size={14} text="secondary">
      <span className="display-linebreak">{getContentNew(view.content)}</span>
    </Typography>
  );
};

const storyTitleWidth = (view) => {
  const titleMargin = 24;
  let titleHeight = titleMargin + 40;
  let textWidth = getTextWidth(view?.title);
  if (textWidth > 115) {
    titleHeight = titleMargin + 80;
  }
  if (view?.location) {
    titleHeight = titleHeight + 30;
  }
  if (view?.date) {
    titleHeight = titleHeight + 30;
  }
  return titleHeight;
};

const getTextWidth = (text) => {
  let canvas = document.createElement("canvas"),
    context = canvas.getContext("2d");
  context.font = "lyon-font-medium font-semibold";
  return context.measureText(text).actualBoundingBoxRight;
};

const getCommentHtml = (flag, isSidebarOpen, activeTab) => {
  if (flag) {
    return <Comments isSidebarOpen={isSidebarOpen} activeTab={activeTab} />;
  }
  return <div class="p-6">Coming Soon</div>;
};
const viewShareButton = (StoryShareFlag, handleModal, setShowShareModal) => {
  return (
    StoryShareFlag ?
      <>
        <div className="btn btn-default btn-large cursor-pointer" onClick={() => {
          if (handleModal()) {
            setShowShareModal(true)
          }
        }}>
          <Icon color="secondary" id='"icon-" + crypt' icon="share" type="share" />
          <div class="ml-2 typo-font-light ml-swapper typo-font-medium">Share</div>
        </div>
      </>
      :
      <>
        <MyTooltip type="hover" open={true} placement="top" title="Coming Soon" fontWeight="400" padding="6">
          <div className="btn btn-default btn-large cursor-pointer">
            <Icon color="secondary" id='"icon-" + crypt' icon="share" type="share" />
            <div class="ml-2 typo-font-light ml-swapper typo-font-medium">Share</div>
          </div>
        </MyTooltip>
      </>
  )
}

function ViewStories({ tweaks = false, handleModal = () => true, previewStoryBool = false }) {
  const { enabled: ViewStoryFlag, flagLoading } = useFeatureFlag('ViewStory');
  const { width } = UseWindowDimensions();
  const location = useLocation().search;
  const { view, isLoading, viewPermission } = useSelector((state) => state.story);
  const { count } = useSelector((state) => state.comments);
  const { refType, storyId, treeId, primaryPersonId } = useParams();
  const checkcmt = queryString.parse(location)?.comment ? true : false
  const [isSidebarOpen, setIsSidebarOpen] = useState(checkcmt);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiked, setIsLiked] = useState(view?.likes?.some((e) => e.userId === getOwner()));
  const [currentLike, setCurrentLike] = useState(false);
  const [isStoryLoading, setLoading] = useState(true);
  const [selectedFile, setValidSelectedFileObj] = useState([{}, {}]);
  const [activeTab, setActiveTab] = useState("tab1");
  const [chunk, setChunk] = React.useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const mediaId = new URLSearchParams(location).get("mediaId");
  const [publication_title, set_publication_title] = useState("");
  const [showLikedByModal, setIsLikedByModal] = useState(false);
  const renderCounter = React.useRef(0);
  const { enabled: showComment } = useFeatureFlag("StoryComment");
  const pageSize = 30;
  const story = useSelector((state) => state.story);
  const user = useSelector((state) => state.user);
  const isAccessTokenTerms = getAccessToken()
  const { enabled: StoryShareFlag } = useFeatureFlag('StoryShare');
  const [showDiloge, setShowDialog] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleDelete = () => {
    dispatch(deleteStory({ storyId, userId: story?.view?.authorId }, { treeId, primaryPersonId, history, refType }));
  };

  const newspaperStory = useMemo(() => {
    return view && view.storyImages?.length === 0 && view.storyExternalImages?.length;
  }, [view]);

  const handleBack = () => {
    _handleback(history, mediaId, refType, treeId, primaryPersonId, newspaperStory);
  };

  const handlePopoverClick = (_e) => {
    handleViewAuthor(view?.author?.userId, history);
  };

  const handleLikesCount = (event) => {
    event.stopPropagation();
    dispatch(storylikespersons(view?.storyId, 1, pageSize));
    setIsLikedByModal(true);
  };

  const handleModalFunc = () => {
    if (handleModal()) {
      setIsSidebarOpen(true);
      setActiveTab("tab1");
    }
  }

  const handleOnClickPreviewImage = () => {
    if (isAccessTokenTerms) {
      return true
    }
    return !tweaks ? true : false
  }

  useEffect(() => {
    if (!flagLoading) {
      if (isAccessTokenTerms) {
        if (ViewStoryFlag) {
          dispatch(viewStoryViaInvitationAPI(storyId)).then((response) => {
            if (response.status === 401 || response.status === 403) {
              history.replace(`/payment?redirect=/stories/view/0/${storyId}`)
            }
          })
        } else {
          dispatch(viewStory({ storyId }))
        }
      } else {
        if (previewStoryBool) {
          dispatch(previewStory(storyId, true));
        }
      }
    }
  }, [ViewStoryFlag, flagLoading])

  useEffect(() => {
    dispatch(showFooter(false));
    return () => {
      dispatch(showFooter());
      dispatch(emptyViewState());
    };
  }, [dispatch]);

  useEffect(() => {
    setIsLiked(view?.likes?.some((e) => e.userId === getOwner()));
  }, [view?.likes]);

  useEffect(() => {
    setCurrentLike(false);
  }, [isLiked]);

  useEffect(() => {
    loadingCondition({ view, isLoading, setValidSelectedFileObj, set_publication_title, setLoading });
  }, [view, isLoading]);

  useEffect(() => {
    if (showComment && !previewStoryBool) {
      return dispatch(countComments(storyId));
    }
  }, [showComment, isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      handleScroll();
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const chunks = [];
    const dataArr = view?.content.split(" ");
    const test = document.getElementById("Test");
    const contentWrapper = document.getElementById("newChunkContainer");
    const padding = 50;
    const lineHeight = 20;
    const actualContainerHeight = (contentWrapper?.clientHeight - 2 * padding) | 0;
    const actualContainerWidth = (contentWrapper?.clientWidth - 2 * padding) | 0;
    const titleHeight = storyTitleWidth(view)

    if (test && view?.content && renderCounter.current === 0) {
      let spanCount = 0;
      let nextLine = false;
      let textSpan;
      let lastIndex = 0;
      let brCount = 0
      dataArr?.map((e, i, a) => {
        const spanExist = document.getElementById(`textSpan${spanCount}`);
        if ((spanCount === 0 && nextLine === false) || (spanCount > 0 && nextLine === true)) {
          if (!spanExist) {
            textSpan = document.createElement("span");
            textSpan.setAttribute("id", `textSpan${spanCount}`);
            textSpan.style.display = "inline-block";
            if (spanCount > 0 && nextLine === true) {
              textSpan.appendChild(document.createTextNode(a[i - 1]));
              textSpan.appendChild(document.createTextNode(" "));
            }
          }
        }
        if (textSpan && view?.content) {
          textSpan.appendChild(document.createTextNode(e));
          textSpan.appendChild(document.createTextNode(" "));
          if (textSpan.clientWidth > actualContainerWidth || e?.includes("\r\n")) {
            nextLine = true;
            spanCount++;
            textSpan.childNodes[textSpan.childNodes.length - 2].nodeValue = "";
            textSpan.childNodes[textSpan.childNodes.length - 1].nodeValue = "";
            test?.appendChild(textSpan);
            test?.appendChild(document.createElement("br"));
            if (e?.includes("\r\n")) {
              const nextLineLength = e.split(/\r\n|\r|\n/).length;
              brCount = brCount + (nextLineLength - 2) * 20;
            }
            if ((lastIndex === 0 && test?.clientHeight - 2 * padding > actualContainerHeight - titleHeight - lineHeight - brCount) || (lastIndex > 0 && test?.clientHeight - 2 * padding > actualContainerHeight - lineHeight - brCount)) {
              chunks.push(dataArr.slice(lastIndex, i));
              brCount = 0;
              lastIndex = i;
              nextLine = false;
              spanCount = 0;
              test.innerHTML = "";
            }
          } else if (!spanExist) {
            test?.appendChild(textSpan);
          }
        }
      });
      chunks.push(dataArr?.slice(lastIndex, dataArr?.length));
      setChunk(chunks);
    }
    if (view) {
      renderCounter.current = renderCounter.current + 1;
    }
  }, [view?.content]);

  const ViewStoryHtml = (
    <div className={ClassNames(`view-story story-page-wrap`, { "clipping-story": newspaperStory, "z-500": !tweaks, "z-50": tweaks })} id="person-page">
      <div className={ClassNames(`rail-right absolute right-0 z-500 overflow-hidden`, { open: isSidebarOpen })}>
        <div className="rail-right-content-wrap">
          <div id="longStorycontainer">
            <span id="text"></span>
          </div>
          <div className="rail-head flex relative justify-end z-10">
            <div className={ClassNames(`ml-6 icon-btn mr-auto close-rail`, { hidden: !isSidebarOpen })}>
              <Button handleClick={() => setIsSidebarOpen(false)} icon="collapse" title="" type="default" />
            </div>
            <div className="rail-v-buttons">
              {getLikeLength(isSidebarOpen, view, handleLikesCount)}
              {isSidebarOpen === false && (
                <>
                  <div className="mb-4 ml-4 icon-btn">
                    <Button
                      handleClick={() => {
                        handleModalFunc()
                      }}
                      icon="comment"
                      title=""
                      type="default"
                    />
                    {showComment && count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white border border-gray pointer-events-none text-center nfc-count">
                        <Typography weight="medium" size={10}>
                          <span className="block">{count}</span>
                        </Typography>
                      </span>
                    )}
                  </div>
                  <div className="mb-4 ml-4 icon-btn">
                    <Button
                      handleClick={() => {
                        if (handleModal()) {
                          setIsSidebarOpen(true);
                          setActiveTab("tab2");
                        }
                      }}
                      icon="info"
                      title=""
                      type="default"
                    />
                    {count > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white border border-gray pointer-events-none text-center nfc-count">
                        <Typography weight="medium" size={10}>
                          <span className="block">{count}</span>
                        </Typography>
                      </span>
                    )}
                  </div>
                </>
              )}
              <div className="mb-4 ml-4 icon-btn">
                <Button handleClick={() => {
                  if (handleModal()) {
                    setIsSidebarOpen(true)
                  }
                }} icon="share" title="" type="default" />
              </div>
              {getStoryWidget(view, setShowDialog, setShowReportModal)}
              {isSidebarOpen === false && (
                <span className="onScollToggle hidden">
                  <div className="mb-4 ml-4 relative icon-btn">
                    <Button icon="folder" title="" type="default" />
                  </div>
                  <div className="mb-4 ml-4 relative icon-btn">{getLikeButton(handleModal, setCurrentLike, currentLike, isLiked, view, dispatch, false)}</div>
                </span>
              )}
            </div>
          </div>
          <div className="tabs flex px-6 w-full border-b border-gray-2 mt-8 mb-5">
            <div className={ClassNames(`comment-tab flex cursor-pointer justify-center items-center py-2`, { "border-b-3 border-black active-tab": activeTab === "tab1", "border-b-3 border-white": activeTab !== "tab1" })} onClick={() =>
              setActiveTab("tab1")}>
              <span className="mr-2  relative top-0.5">
                <Icon id='"icon-" + crypt' type="comment" />
              </span>
              <Typography weight="medium"> Comments</Typography>
            </div>
            <div className={ClassNames(`detail-tab flex cursor-pointer justify-center items-center py-2`, { "border-b-3 border-black active-tab": activeTab === "tab2", "border-b-3 border-white": activeTab !== "tab2" })} onClick={() =>
              setActiveTab("tab2")}>
              <span className="mr-2  relative top-0.5">
                <Icon id='"icon-" + crypt' type="info" />
              </span>
              <Typography weight="medium"> Details</Typography>
            </div>
          </div>
          {activeTab === "tab1" && showComment && (
            <>
              <div className="comment-form mb-4">
                <div className="flex w-full px-6">
                  <div className="mt-1.5">
                    {user.imgSrc ? (
                      <AccountAvatar avatarName={`${user?.userFirstName?.[0]}`} bgColorCode={getFixNumWithStr(getAvatarName(`${user?.userFirstName}`))} imgSrc={`${user?.imgSrc} `} />
                    ) : (
                      <>
                        <AccountAvatar avatarName={`${user?.userFirstName?.[0]}${user?.userLastName?.[0]}`} bgColorCode={getFixNumWithStr(getAvatarName(`${user?.userFirstName?.[0]}${user?.userLastName?.[0]}`))} />
                      </>
                    )}
                  </div>
                  <div className="flex-grow ml-3 pl-0.5">
                    <AutoHeightTextarea story={story} user={user} isSidebarOpen={isSidebarOpen} />
                  </div>
                </div>
              </div>
            </>
          )}
          <div className={ClassNames(`rail-content w-full`, { hidden: !isSidebarOpen })}>{activeTab === "tab1" ? getCommentHtml(showComment, isSidebarOpen, activeTab) : <Details view={view} />}</div>
        </div>
      </div>

      <TailwindModal showModal={showReportModal} setShowModal={setShowReportModal} title={"Report Story"} classes="inset-0" innerClasses="modal-sm" content={<ReportStory />} />
      <div class={tweaks ? `hidden` : `story-page-overlay fixed left-0 w-full h-20 bg-black opacity-60`}></div>
      <div className="z-500 flex flex-col w-full h-full">
        <div className={ClassNames(`bg-white flex-auto w-full h-full relative `, { "rail-opened": isSidebarOpen, "mt-16": tweaks, "rounded-t-2xl mt-8": !tweaks })}>
          <div id="view-story-header" className="create-story-header flex justify-between top-3 smm:top-6 px-4 smm:px-6 w-full absolute">
            {!tweaks &&
              <div className="story-header-left-items">
                <div className="flex items-center">
                  <button onClick={handleBack} type="button" className="bg-gray-1 rounded-lg px-3 py-3 hover:bg-gray-2 focus:outline-none focus:ring-2 focus:ring-inset">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 0.999999L0.999999 13" stroke="#212122" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M0.999999 0.999999L13 13" stroke="#212122" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
          <div className="relative main-wrapper mx-auto mt-16 smm:mt-12 pt-1">

            {isLoading || isStoryLoading ? (
              <div className="text-center mt-20">
                <Loader />
              </div>
            ) : (
              <>
                <div className="view-options-wrap relative w-full mb-6">
                  <div className="flex w-full justify-between v-top-container items-center">
                    {getAvatarDetails({ view, handlePopoverClick })}
                    <div className="flex vew-btns-block">
                      <div className="view-state-like-btn">{getLikeButton(handleModal, setCurrentLike, currentLike, isLiked, view, dispatch)}</div>
                      <div className="view-state-btns">
                        <MyTooltip type="hover" open={true} placement="top" title="Coming Soon" fontWeight="400" padding="6">
                          <div className="btn btn-default btn-large cursor-pointer">
                            <Icon color="secondary" handleClick={() => {
                              if (handleModal()) {
                                console.log("folder")
                              }
                            }
                            } id='"icon-" + crypt' type="folder" />
                            <div class="ml-2 typo-font-light ml-swapper typo-font-medium">Save</div>
                          </div>
                        </MyTooltip>
                      </div>
                      <div className="view-state-btns">
                        {viewShareButton(StoryShareFlag, handleModal, setShowShareModal)}
                      </div>
                      <div className="ml-4 view-top-icon head-comment-icon relative">
                        <Button
                          handleClick={() => {
                            handleModalFunc()
                          }}
                          icon="comment"
                          title=""
                          size="large"
                          type="default"
                        />
                        <span className="absolute -top-2 -right-2 bg-white border border-gray pointer-events-none text-center nfc-count">
                          <Typography weight="medium" size={10}>
                            <span className="block">{count}</span>
                          </Typography>
                        </span>
                      </div>
                      <div className="ml-4 view-top-icon">
                        <Button
                          handleClick={() => {
                            setIsSidebarOpen(true);
                            setActiveTab("tab2");
                          }}
                          icon="info"
                          title=""
                          size="large"
                          type="default"
                        />
                      </div>
                      <div className="view-top-icon top-edit-btn relative z-10">
                        {getStoryWidget(view, setShowDialog, setShowReportModal)}
                        {/* <StoryDropdownWidget /> */}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full">
                  <div className={getImageClass(view)}>
                    <div className="story-box relative">
                      <div className="my-story-area w-full">
                        {setImage(newspaperStory, view, history, selectedFile, handleOnClickPreviewImage)}
                        <div className="story-body flex">
                          <div className="story-content flex flex-col">
                            <div className="head mb-6">
                              <div className="story-title">
                                <h2>
                                  <Typography size={32} text="secondary" weight="lyon-medium">
                                    {view?.title}
                                  </Typography>
                                </h2>
                              </div>
                              {showPublicationTitle(newspaperStory, publication_title)}
                              <p className="mb-1.5">
                                <Typography weight="medium" size={12}>
                                  {view?.location}
                                </Typography>
                              </p>
                              <p>
                                <Typography weight="medium" size={12}>
                                  {view?.date}
                                </Typography>
                              </p>
                            </div>
                            <div className="mb-9">{getChunksContentPerWidth
                              (width, view, chunk)}
                            </div>
                          </div>
                        </div>
                        {!isThereImage(view) && <div className="story-body-r">{getContentNew(chunk[1]?.join(" "))}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 sb-newpage mx-auto">
                    {width > 547 && (
                      <div id="contentWrapper">
                        {chunkDisplayCondition(view, chunk)?.map((e, i) => {
                          const stringData = e?.join(" ");
                          return (
                            <div className="longStorycontainer-block mb-6" key={i}>
                              <div
                                className={ClassNames(`longStorycontainer`, {
                                  left: i % 2 === 0,
                                  right: i % 2 !== 0,
                                })}
                                key={i}
                              >
                                {getContentNew(stringData)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <TailwindModalDialog showModal={showDiloge} setShowModal={setShowDialog} title={"Are you sure?"} content={"Are you sure you want to delete this story?"} handleAction={handleDelete} />
      {showLikedByModal && <LikespersonsList showLikedByModal={showLikedByModal} setIsLikedByModal={setIsLikedByModal} story={view} onPersonClick={(userId) => handleViewAuthor(userId, history)} />}
      {showShareModal && <ShareModal story={view} showModal={showShareModal} setShowModal={setShowShareModal} storyTitle={view.title} personalDetails={""} storyImage={view.storyImages[0]?.url ? getImageUrl(view.storyImages[0]) : null} />}
      <div id="Test"></div>
      <div id="newChunkContainer"></div>
    </div >
  );
  return viewPermission ? ViewStoryHtml : <PermissionCard />;
}
export default ViewStories;