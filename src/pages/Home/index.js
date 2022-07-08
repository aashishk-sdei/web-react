import ProfileCard from "./ProfileCard";
import RecentPeople from "./RecentPeople";
import HomeRightSidebar from "./HomeRightSidebar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStories, getStoriesCount, getTreesList } from "../../redux/actions/homepage";
import { showFooter } from "../../redux/actions/layout"
import WelcomeCard from "./WelcomeCard";
import StoryCard from "./StoryCard";
import NoTree from "./NoTree";
import Loader from "../../components/Loader";
import UseWindowDimensions from "./../SearchPage/WindowDimensions";
import TellStory from "./TellStory";
import MiddleLoader from "./MiddleLoader";
import TellAStoryLoader from "./TellAStoryLoader";
import FollowModal from "./ProfileCard/FollowModal";
import PaymentModal from "../Payment/PaymentsModal"
import { useFeatureFlag } from "../../services/featureFlag";
const headerWidth = 96; 
const sideBarCard = (winHeight, winWidth) => {
  let profileCard = document.getElementById("profile-card"),
    recentCard = document.getElementById("recent-card"),
    storyCard = document.getElementById("story-card"),
    footerCard = document.getElementById("footer"),
    posProfileCard = profileCard?.getBoundingClientRect().bottom,
    posStoryCard = storyCard?.getBoundingClientRect().bottom;
  if (winHeight + headerWidth > 440 && winWidth > 1200) {
    if (posProfileCard < 56) {
      recentCard?.classList.add("top-20", "fixed");
    } else {
      recentCard?.classList.remove("top-20", "fixed");
    }
    if (posStoryCard < 56 && footerCard?.classList) {
      footerCard?.classList.add("bottom-0", "fixed", "right-7");
    } else {
      footerCard?.classList?.remove("bottom-0", "fixed", "right-7");
    }
  } else if (winHeight + headerWidth > 440 && winWidth > 511 && winWidth < 1200) {
    if (posStoryCard < 56 && footerCard?.classList) {
      footerCard?.classList.add("bottom-0", "fixed");
    } else {
      footerCard?.classList?.remove("bottom-0", "fixed");
    }
  }
};
const sidebarWheel = (_e, sideBarHeight, width, height) => {
  const winHeight = height - headerWidth;
  let sidebarL = document.getElementById("sidebar-left"),
    sidebarR = document.getElementById("sidebar-right");
  sideBarCard(winHeight, width);
  if (winHeight > 440 && winHeight > sideBarHeight) {
    sidebarL?.classList.add("sticky-sidebar");
    sidebarR?.classList?.add("sticky-sidebar");
  } else {
    sidebarL?.classList.remove("sticky-sidebar");
    sidebarR?.classList?.remove("sticky-sidebar");
  }
};
const centerWheel = (e, sideBarHeight, width, height) => {
  e.stopPropagation();
  const _winHeight = height - headerWidth;
  let sidebarL = document.getElementById("sidebar-left"),
    sidebarR = document.getElementById("sidebar-right");
  sideBarCard(_winHeight, width);
  if (_winHeight > 440 && _winHeight > sideBarHeight) {
    sidebarL?.classList.add("sticky-sidebar");
    sidebarR?.classList?.add("sticky-sidebar");
  } else {
    sidebarL?.classList.remove("sticky-sidebar");
    sidebarR?.classList?.remove("sticky-sidebar");
  }
};

const GetRightBar = (userProfileAccount, width, placeRight, sideBarRRef, isMiloModalOpen) => {
  let html = null;
  if (width > 512) {
    if (width > 1200) {
      if (placeRight) {
        html = (
          <div className={`sidebar sb-right ${isMiloModalOpen ? "z-100" : ""}`}>
            <div id="sidebar-right" ref={sideBarRRef} className="hm-sidebar-in">
              <HomeRightSidebar user={userProfileAccount} />
            </div>
          </div>
        );
      }
    } else {
      if (!placeRight) {
        html = <HomeRightSidebar user={userProfileAccount} />;
      }
    }
  }
  return html;
};

const Home = () => {
  const dispatch = useDispatch();
  const { userProfileAccount } = useSelector((state) => state.user);
  const { count } = useSelector((state) => state.follow);
  const { stories, isLoading, storiesCount, trees, treesLoading, isPaginationLoading, isMiloModalOpen } = useSelector((state) => state.homepage);

  const [showFollowerModal, setShowFollowerModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showPaymentModal, setPaymentModal] = useState(false);

  const pageSize = 10;
  const getScrollTop = () => {
    return window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  };
  const getDocumentHeight = () => {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  };
  const { width, height } = UseWindowDimensions();
  const homePageRef = useRef();
  const pageNumber = useRef(1);
  const isPaginationLoadingRef = useRef(false);
  const moreDataAvail = useRef(true);
  const [totalPages, setTotalPages] = useState(0);
  const sideBarLRef = useRef(null);
  const sideBarRRef = useRef(null);
  const [sideBarHeight, setSideBarHeight] = useState(0);
  const { enabled: showReport } = useFeatureFlag("StoryReport");
  const { enabled: showComment ,flagLoading:featureCmtLoading} = useFeatureFlag("StoryComment");
  const { enabled: ViewStoryPaywall } = useFeatureFlag("ViewStory");
  const handleScroll = () => {
    const calHeight = getDocumentHeight() - window.innerHeight;
    if (homePageRef?.current?.scrollHeight > window.innerHeight && getScrollTop() + homePageRef?.current?.scrollHeight / 2 < calHeight) return;
    if (!isPaginationLoadingRef.current && moreDataAvail.current) {
      dispatch(getStories({ pageNumber: pageNumber.current + 1, pageSize }, false, isPaginationLoadingRef, true, moreDataAvail));
      pageNumber.current = pageNumber.current + 1;
    }
  };

  const getTotalPages = (total) => {
    if (total < pageSize) {
      return 1;
    } else {
      return Math.ceil(total / pageSize);
    }
  };
  useEffect(() => {
    dispatch(showFooter(false))
    return () => {
      dispatch(showFooter())
    }
  }, [dispatch])
  useEffect(() => {
    if (userProfileAccount) {
      dispatch(getStories({ pageNumber: 1, pageSize }, true, {}, true));
    }
  }, [dispatch, userProfileAccount]);
  useEffect(() => {
    if (userProfileAccount) {
      setTotalPages(getTotalPages(storiesCount));
    }
  }, [dispatch, storiesCount, userProfileAccount]);
  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [dispatch, pageNumber, isPaginationLoadingRef, totalPages]);

  useEffect(() => {
    if (userProfileAccount) {
      dispatch(getTreesList(userProfileAccount.id));
      dispatch(getStoriesCount());
    }
  }, [userProfileAccount, dispatch]);

  const loading = () => {
    let bool = false;
    if (isLoading) {
      bool = true;
    }
    if (treesLoading) {
      bool = true;
    }
    return bool;
  };
  useEffect(() => {
    if (sideBarLRef?.current?.offsetHeight > sideBarRRef?.current?.offsetHeight) {
      setSideBarHeight(sideBarLRef?.current?.offsetHeight);
    } else {
      setSideBarHeight(sideBarRRef?.current?.offsetHeight);
    }
  }, [sideBarLRef?.current, sideBarRRef?.current, loading(), width, height]);

  useEffect(() => {
    let _sidebarL = document.getElementById("sidebar-left"),
      _sidebarR = document.getElementById("sidebar-right"),
      _recentCard = document.getElementById("recent-card"),
      _footerCard = document.getElementById("footer");
    _sidebarL?.classList?.remove("sticky-sidebar");
    _sidebarR?.classList?.remove("sticky-sidebar");
    _recentCard?.classList?.remove("top-20", "fixed");
    _footerCard?.classList?.remove("bottom-0", "fixed", "right-7");
    window.scroll(0, 0);
  }, [width, height]);

  const getTellStory = (widthCond) => {
    let html = null;
    if (widthCond && !isLoading && !treesLoading) {
      html = <TellStory />;
    }
    if (isLoading && treesLoading && widthCond) {
      html = <TellAStoryLoader />;
    }
    return html;
  };
  return (
    <div ref={homePageRef} className="homepage" onMouseOver={(e) => sidebarWheel(e, sideBarHeight, width, height)} onWheel={(e) => sidebarWheel(e, sideBarHeight, width, height)}>
      <div className="pt-18 md:pt-22.5 main-wrapper mx-auto">
        <div className={`flex home-sections-wrap w-full justify-between`}>
          <div className="sidebar">
            <div id="sidebar-left" ref={sideBarLRef} className="hm-sidebar-in">
              {getTellStory(width < 512)}
              <ProfileCard
                width={width}
                setFollowerModal={(e) => {
                  setShowFollowerModal(e);
                }}
                setFollowingModal={(e) => setShowFollowingModal(e)}
              />
              {width > 512 && <RecentPeople user={userProfileAccount} />}
              {GetRightBar(userProfileAccount, width, false)}
            </div>
          </div>
          {loading() && <MiddleLoader width={width} />}
          {!treesLoading && !isLoading && (
            <div className="middle-cards-section flex flex-col flex-grow" onMouseOver={(e) => e.stopPropagation()} onWheel={(e) => centerWheel(e, sideBarHeight, width, height)}>
              <div className="w-full">
                {getTellStory(width > 512)}
                {trees && trees.length === 0 && (
                  <div className="w-full mb-4 card home-no-tree-card">
                    <NoTree />
                  </div>
                )}
                {trees && trees.length > 0 && storiesCount === 0 && (
                  <div className="w-full mb-4">
                    <WelcomeCard />
                  </div>
                )}
                {trees && stories && stories.map((story, sIndex) => <StoryCard setPaymentModal={setPaymentModal}
                 story={story} 
                 key={sIndex} 
                 storyIndex={sIndex} 
                 showComment={showComment} 
                 showReport={showReport}
                  featureCmtLoading={featureCmtLoading}
                  ViewStoryPaywall={ViewStoryPaywall}
                  />)}
              </div>
              <div className="mb-4">{isPaginationLoading && <Loader />}</div>
            </div>
          )}
          {GetRightBar(userProfileAccount, width, true, sideBarRRef, isMiloModalOpen)}
          {showFollowerModal && <FollowModal modalTitle={count.followerCount === 1 ? `${count.followerCount} Follower` : `${count.followerCount} Followers`} showModal={showFollowerModal} setShowModal={setShowFollowerModal} modalType={"FOLLOWER"} />}
          {showFollowingModal && <FollowModal modalTitle={`Following`} showModal={showFollowingModal} setShowModal={setShowFollowingModal} modalType={"FOLLOWING"} />}

          <PaymentModal
            setPaymentModal={setPaymentModal}
            showPaymentModal={showPaymentModal}
            canClose={true}
          />
        </div>
      </div>
    </div>
  );
};
export default Home;
