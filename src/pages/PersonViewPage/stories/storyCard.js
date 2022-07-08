import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import Typography from "./../../../components/Typography";
import { getPersonProfileUrl } from "./../../../components/utils/genderIcon";
import "./../index.css";
import { LAYOUT_ID, getWidgetClass, getCustomImageUrl } from "./../../../utils";
import { getHomeStoryAndUpdateList } from "../../../redux/actions/homepage";
import { getStoryAndUpdateList } from "../../../redux/actions/story";
import GridLoader from "./StoriesPage/contentLoader/GridLoader";
const getPersonMore = (person) => {
  if (person.length > 1) {
    return (
      <div className="flex items-center ml-8">
        <div className="media-info flex-grow avtar-square-small-name">
          <h4 className="main-title">
            <Typography size={14} text="secondary">
              +{person.length - 1} more {person.length === 2 ? "person" : "people"}
            </Typography>
          </h4>
        </div>
      </div>
    );
  }
  return null;
};
const getImageUrl = (img) => {
  return getCustomImageUrl("q=100,w=244", img?.url);
};
const DrfatUI = (item, withImg) => {
  let html = null;
  if (item.status === "Draft") {
    html = (
      <div className={`${!withImg && "bg-gray-3 h-24"} ${item.layoutId !== LAYOUT_ID.TWO_IMAGE && "w-full"} rounded-lg`}>
        <div className="draft-label absolute left-2/4 top-2/4 transform  -translate-x-2/4 -translate-y-2/4">
          <div className="flex py-1.5 px-3 bg-gray-2 items-center rounded-lg">
            <span className="mr-1.5">
              {" "}
              <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.44299 9.83182L6.1333 10.1616L6.46308 7.84942L12.4028 1.90969C12.533 1.77969 12.6875 1.67659 12.8575 1.6063C13.0275 1.53601 13.2097 1.49988 13.3936 1.5C13.5776 1.50012 13.7598 1.53647 13.9297 1.60697C14.0996 1.67748 14.254 1.78077 14.384 1.91093C14.514 2.0411 14.6171 2.1956 14.6874 2.36561C14.7577 2.53561 14.7938 2.7178 14.7937 2.90177C14.7935 3.08574 14.7572 3.26788 14.6867 3.4378C14.6162 3.60772 14.5129 3.76209 14.3827 3.89209L8.44299 9.83182Z" stroke="#204A82" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.8 8.96924H1.93333C1.6858 8.96924 1.4484 9.06757 1.27337 9.24261C1.09833 9.41764 1 9.65504 1 9.90257V11.7692C1 12.0168 1.09833 12.2542 1.27337 12.4292C1.4484 12.6042 1.6858 12.7026 1.93333 12.7026H14.0667C14.3142 12.7026 14.5516 12.6042 14.7266 12.4292C14.9017 12.2542 15 12.0168 15 11.7692V9.90257C15 9.65504 14.9017 9.41764 14.7266 9.24261C14.5516 9.06757 14.3142 8.96924 14.0667 8.96924H12.2" stroke="#204A82" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
            <Typography size={14} text="primary" weight="medium">
              <span className="block">Draft</span>
            </Typography>
          </div>
        </div>
      </div>
    );
  }
  return html;
};
const getImage = (item, Img2smalClas) => {
  let html = null;
  let imageProps1 = {};
  let imageProps2 = {};
  if (Img2smalClas[0]) {
    imageProps1 = Img2smalClas[0];
  }
  if (Img2smalClas[1]) {
    imageProps2 = Img2smalClas[1];
  }

  if (item?.storyImages?.length) {
    html = (
      <div className="added-story-img w-full mb-2 relative">
        {DrfatUI(item, true)}
        <div className={`story-img-container ${Img2smalClas[0] ? "st-sm-img" : ""}`}>
          <img {...imageProps1} src={getImageUrl(item.storyImages[0])} className="rounded-lg" alt="img" />
        </div>
        {item.layoutId === LAYOUT_ID.TWO_IMAGE && <div className={`story-img-container ${!item.storyImages[1] && "bg-gray-3 rounded-r-lg filter blur-sm"} ${Img2smalClas[1] ? "st-sm-img" : ""}`}>{item.storyImages[1] && <img {...imageProps2} src={getImageUrl(item.storyImages[1])} className="rounded-lg" alt="img" />}</div>}
      </div>
    );
  } else if (item?.storyExternalImages?.length) {
    html = (
      <div className="added-story-img w-full mb-2 relative">
        {DrfatUI(item, true)}
        <div className={`story-img-container`}>
          <img src={item.storyExternalImages[0].storyImagePath} className="rounded-lg" alt="img" />
        </div>
      </div>
    );
  } else {
    html = <div className="added-story-img w-full mb-2 relative">{DrfatUI(item, false)}</div>;
  }
  return html;
};
const getMenu = (item, key, clas, TypoProps = {}) => {
  let html = null;
  if (item) {
    if (key === "place" || key === "date") {
      html = (
        <span className={clas}>
          <Typography {...TypoProps} size={12}>
            {item}
          </Typography>
        </span>
      );
    } else {
      html = (
        <p className={clas}>
          <Typography {...TypoProps} size={14}>
            {item}
          </Typography>
        </p>
      );
    }
  }
  return html;
};

const getContentClass = (item) => {
  let clas = "story-text ";
  if (item?.storyImages?.length) {
    clas += "three-lines";
  }
  return clas;
};
const getMenuValue = (item) => {
  let html = [];
  if (item["date"]) {
    html.push(item["date"]);
  }
  if (item["place"]) {
    html.push(item["place"]);
  }
  return html.map((_html) => _html).reduce((acc, x) => (acc === null ? [x] : [acc, <span className="dot-seprator"></span>, x]), null);
};
const StoryCard = ({ item = { title: "Painting & Auto Body", place: "California, USA", date: "1932", content: "Upon returning to California from Carthage Missouri, in 1932, the first job that Roy Franklin Walker could get was this is" }, _index, personView = false, exploreTab = { exploreTab } }) => {
  const dispatch = useDispatch();
  const storyRef = useRef(null);
  const io = useRef(null);
  const [Img2smalClas, setImg2smalClas] = useState([false, false]);
  const loadMore = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let storyId = typeof item === "string" ? item : item?.storyId;
        if (personView) {
          dispatch(getHomeStoryAndUpdateList({ storyId: storyId }));
        } else {
          setTimeout(() => {
            dispatch(getStoryAndUpdateList({ storyId: storyId }));
          }, 1000);
        }
        storyRef.current && io.current.unobserve(storyRef.current);
      }
    });
  }, []);
  useEffect(() => {
    if (storyRef.current) {
      const options = {
        root: null, // window by default
        rootMargin: "50px",
        threshold: 0,
      };
      io.current = new IntersectionObserver(loadMore, options);
      io.current.observe(storyRef.current);
    }
    return () => {
      storyRef.current && io.current.unobserve(storyRef.current);
    };
  }, [storyRef, loadMore]);
  useEffect(() => {
    const updateState = () => {
      let img1 = new Image(),
        img2 = new Image();
      img1.src = getImageUrl(item.storyImages[0]);
      img2.src = getImageUrl(item.storyImages[1]);
      img1.onload = () => {
        const actualWidth = Math.round(img1.naturalWidth / 1.5444);
        const actualHeight = Math.round(img1.naturalHeight / 1.5444);
        if (actualWidth < 259 || actualHeight < 186) {
          setImg2smalClas((prev) => {
            prev[0] = {
              style: {
                width: "100%",
                height: "130px",
                objectFit: "cover",
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        }
      };
      img2.onload = () => {
        const actualWidth = Math.round(img2.naturalWidth / 1.5444);
        const actualHeight = Math.round(img2.naturalHeight / 1.5444);
        if (actualWidth < 259 || actualHeight < 186) {
          setImg2smalClas((prev) => {
            prev[1] = {
              style: {
                width: "100%",
                height: "130px",
                objectFit: "cover",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        }
      };
    };
    if (item.layoutId === LAYOUT_ID.TWO_IMAGE && item?.storyImages?.length) {
      updateState();
    }
  }, [item]);
  return (
    <div ref={storyRef}>
      {typeof item === "string" ? (
        <div className="flex flex-grow flex-wrap flex-shrink-0">
          <GridLoader grid={1} isStory={true} />
        </div>
      ) : (
        <div className={`story-card-content ${item.status === "Draft" && "s-draft"} ${getWidgetClass(item.layoutId)}`}>
          {getImage(item, Img2smalClas)}
          <div className="added-story-text px-1">
            <div className="head mb-2">
              <h3 className="title-story">
                <Typography size={24} text="secondary" weight="lyon-medium">
                  {item?.title}
                </Typography>
              </h3>
            </div>
            <div className="added-story-desc">
              <div className="flex mb-2 date-place-wrap">{getMenu(getMenuValue(item), "date", "")}</div>
              {getMenu(item["content"], "content", getContentClass(item), { text: "secondary" })}
            </div>
            {!exploreTab && personView && !!item.personDetail.length && (
              <div className="added-prsns-in-sc mt-2.5">
                <div className="flex items-center mb-1">
                  <div className="media w-6 h-6 overflow-hidden mr-2.5 avtar-square-small">
                    <img src={getPersonProfileUrl(item.personDetail[0])} className="object-cover w-6 h-6 rounded-md" alt="Profile Pic" />
                  </div>
                  <div className="media-info flex-grow avtar-square-small-name">
                    <h4 className="main-title">
                      <Typography size={14} text="secondary">
                        {item.personDetail[0]?.givenName} {item.personDetail[0]?.surname}
                      </Typography>
                    </h4>
                  </div>
                </div>
                {getPersonMore(item.personDetail)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default StoryCard;
