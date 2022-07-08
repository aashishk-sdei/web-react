import React, { useState, useEffect } from "react";
import "./../PersonViewPage/personal-header.css";
import Icon from "../../components/Icon";
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import IconMenu from "../../components/IconMenu";
import UseWindowDimensions from "./../SearchPage/WindowDimensions";
import Tabs from "./tabs";
import HeroImage from "./../PersonViewPage/heroImage";
import { stickyHeaderMenu } from "./../PersonViewPage/menus";
import { removeHiddenHeader } from "./../PersonViewPage/services";
import { getCustomImageUrl, getDate } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { followTopic, unFollowTopic } from "../../redux/actions/topic";

const NewHeader = ({ currentTopic, fromTopicPage, ...props }) => {
  const { width, height } = UseWindowDimensions();
  const [scroll, setScroll] = useState(false);
  const dispatch = useDispatch();
  const { isImgURLValid } = useSelector((state) => state.topic);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isFollowed, setIsFollowed] = useState(currentTopic?.isFollowedByUser);
  const topicId = currentTopic?.topicId;
  const heroImageSrc = currentTopic?.imageUrl;
  const removeSt184 = () => {
    if (document.getElementsByClassName("sticky-top-184").length > 0) {
      document.querySelector(".person-detail-page").classList.remove("sticky-top-184");
    }
  };
  const removeSt235 = () => {
    if (document.getElementsByClassName("sticky-top-235").length > 0) {
      document.querySelector(".person-detail-page").classList.remove("sticky-top-235");
    }
  };
  const removeSt386 = () => {
    if (document.getElementsByClassName("sticky-top-386").length > 0) {
      document.querySelector(".person-detail-page").classList.remove("sticky-top-386");
    }
  };
  const headerInTabView = (windowHeight, personPageHeight) => {
    if (heroImageSrc != "") {
      if (windowHeight + 450 < personPageHeight) {
        removeSt184();
        removeSt235();
        setScroll(window.scrollY > 386);
        if (window.scrollY > 386) {
          document.querySelector(".person-detail-page").classList.add("sticky-top-386");
        } else {
          removeSt386();
        }
      }
    } else {
      if (windowHeight + 280 < personPageHeight) {
        removeSt235();
        removeSt386();
        setScroll(window.scrollY > 184);
        if (window.scrollY > 184) {
          document.querySelector(".person-detail-page").classList.add("sticky-top-184");
        } else {
          removeSt184();
        }
      }
    }
  };
  const headerFunction = (windowWidth, windowHeight, personPageHeight) => {
    if (windowWidth > 767) {
      headerInTabView(windowHeight, personPageHeight);
    } else {
      if (windowHeight + 280 < personPageHeight) {
        removeSt184();
        removeSt386();
        setScroll(window.scrollY > 235);
        if (window.scrollY > 235) {
          document.querySelector(".person-detail-page").classList.add("sticky-top-235");
        } else {
          removeSt235();
        }
      }
    }
  };
  useEffect(() => {
    document.querySelector(".main-wrapper").parentNode.classList.add("person-main-wrapper");
    document.querySelector(".person-detail-page").classList.add("person-detail-top");
    if (heroImageSrc) {
      document.querySelector(".person-detail-top").classList.add("person-hero-image");
    }
    let windowHeight = height,
      windowWidth = width;
    window.addEventListener("scroll", () => {
      let headerHeightOne = document.getElementById("person-page");
      const personPage = headerHeightOne?.getBoundingClientRect();
      const personPageHeight = personPage?.height;
      headerFunction(windowWidth, windowHeight, personPageHeight);
      window.addEventListener("resize", () => {
        headerFunction(windowWidth, windowHeight, personPageHeight);
      });
      if (window.scrollY == 0) {
        setScroll(false);
        removeSt184();
        removeSt386();
        removeSt235();
      }
    });
    return () => {
      removeHiddenHeader();
    };
  }, []);
  useEffect(() => {
    const ismobile = width < 768;
    if (ismobile !== isMobile) {
      setScroll(false);
      setIsMobile(ismobile);
      window.scroll(0, 0);
    }
  }, [width, height]);
  const ProfileWrapperComponent = () => (
    <div className="profile-card-wrapper topic-card-wrapper mb-topic">
      <div className="profile-card-wrapper-inner">
        <img className="block md:hidden" src={heroImageSrc} alt="" />
        <div className="profile-card topic-card">
          <div className="profile-details typo-font-regular">
            <h1 className="typo-font-bold">
              <Typography fontFamily="primaryFont" size={32} weight="medium" variant="h1" className="text-xl typo-font-bold">
                {currentTopic.name}
              </Typography>
            </h1>
            {currentTopic?.startDate?.rawDate && (
              <div className="dob-detail block text-center">
                <Typography text="secondary" font="text-sm" weight="regular">
                  {currentTopic.startDate && getDate(currentTopic.startDate)} - {currentTopic.endDate && getDate(currentTopic.endDate)}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const setFollowBool = () => {
    setIsFollowed(!isFollowed);
  };

  const handleClick = () => {
    if (!isFollowed) {
      dispatch(followTopic(topicId, setFollowBool));
    } else {
      dispatch(unFollowTopic(topicId, setFollowBool));
    }
  };

  const RightNavComponent = () => (
    <div className="right-nav topic-rightnav">
      {!scroll && <Button type={!isFollowed ? "primary" : "default-dark"} fontWeight={isFollowed && "medium"} className={!isFollowed ? "btn btn-medium btn-primary" : "btn btn-medium btn-default-dark"} title={`${!isFollowed ? "Follow Topic" : "Unfollow Topic"}`} handleClick={handleClick} />}

      {!fromTopicPage && (
        <button className="icon-menu more-menu relative hidden">
          <IconMenu type="menuHorizontal" background popperPlacement="bottom-end" rootClass="rootHorizontalPaper" menu={stickyHeaderMenu} handleMenu={null} />
        </button>
      )}
    </div>
  );
  const goToPreviousPage = () => {
    window.history.go(-1);
    removeHiddenHeader();
  };
  return (
    <>
      <header className={`personal-header topic-header ${scroll ? "sticky" : "unsticky"}`}>
        <div className="mtop-header z-20">
          <div className="back-placeholder">
            <div className="icon-menu">
              <Icon background color="secondary" id='"icon-" + crypt' size="medium" type="arrowLeft" handleClick={() => goToPreviousPage()} />
            </div>
          </div>
          <div className={scroll ? "userinfo-placeholder" : "userinfo-placeholder hidden"}>
            <h2 className="typo-font-medium"> {currentTopic.name}</h2>
            <div className="xs-dob-detail">
              {currentTopic.startDate && getDate(currentTopic.startDate)} - {currentTopic.endDate && getDate(currentTopic.endDate)}
            </div>
          </div>
          {isMobile && <RightNavComponent />}
        </div>
        <div className="pr-container" id="pr-header">
          <figure className={heroImageSrc ? `topic-wrap hero-placeholder up-hero-image ${!isImgURLValid && "h-32"}` : "topic-wrap hero-placeholder"}>
            <HeroImage isTopicPage={true} dispatch={dispatch} isImgURLValid={isImgURLValid} imgSrc={getCustomImageUrl("q=100", heroImageSrc)} heroImageRef={props.heroImageRef} {...props} />
          </figure>
          {!scroll && <ProfileWrapperComponent />}
          <nav className="topic-menu profile-menu relative">
            {scroll && <ProfileWrapperComponent />}
            <div className="left-nav">
              <Tabs tab={props.tab} handleTab={props.handleTab} />
            </div>
            {!isMobile && <RightNavComponent />}
          </nav>
        </div>
      </header>
    </>
  );
};
export default NewHeader;
