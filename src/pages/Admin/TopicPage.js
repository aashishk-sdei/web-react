import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminStories, getAdminStoriesCount, getTopics } from "../../redux/actions/topic";
import NotFound from "../NotFound";
import TopicComponent from "./TopicComponent";
import { addFooterGray, addFooterWhite } from "../../redux/actions/layout";
import { BG_GRAY_1 } from "../../utils";

const TopicPage = () => {
  const { adminStories, storiesCount, forbidden } = useSelector((state) => state.topic);

  const getScrollTop = () => {
    return window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  };
  const getDocumentHeight = () => {
    const body = document.body;
    const html = document.documentElement;

    return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  };
  const topicPageRef = useRef();
  const pageNumber = useRef(1);
  const isPaginationLoadingRef = useRef(false);
  const [totalPages, setTotalPages] = useState(0);

  const getTotalPages = (total) => {
    if (total < pageSize) {
      return 1;
    } else {
      return Math.ceil(total / pageSize);
    }
  };
  const handleScroll = () => {
    const calHeight = getDocumentHeight() - window.innerHeight;
    if (topicPageRef?.current?.scrollHeight > window.innerHeight && getScrollTop() + topicPageRef?.current?.scrollHeight / 2 < calHeight) return;
    if (!isPaginationLoadingRef.current) {
      dispatch(getAdminStories({ pageNumber: pageNumber.current + 1, pageSize }, false, isPaginationLoadingRef));
      pageNumber.current = pageNumber.current + 1;
    }
  };

  const dispatch = useDispatch();
  const pageSize = 10;

  useEffect(() => {
    dispatch(addFooterGray(BG_GRAY_1));
    return () => {
      dispatch(addFooterWhite());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdminStories({ pageNumber: 1, pageSize }, true, {}));
    setTotalPages(getTotalPages(storiesCount));
  }, [dispatch, storiesCount]);

  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [dispatch, pageNumber, isPaginationLoadingRef, totalPages]);

  useEffect(() => {
    dispatch(getAdminStoriesCount());
    dispatch(getTopics());
  }, [dispatch]);

  return forbidden ? (
    <NotFound />
  ) : (
    <div className="bg-gray-1">
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
        <p className="text-xl text-black font-medium mb-5">Topics</p>
        <div ref={topicPageRef}>
          {adminStories &&
            adminStories.map((story, index) => (
              <div key={index}>
                <TopicComponent story={story} storyIndex={index} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopicPage;
