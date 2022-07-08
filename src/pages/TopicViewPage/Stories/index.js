import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStoriesByTopic } from "./../../../redux/actions/homepage";
import StoriesPage from "./../../PersonViewPage/stories/StoriesPage";
import { v4 as uuidv4 } from "uuid";

const pageSize = 10;
const getScrollTopStories = () => {
  return window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
};
const getDocumentHeightStories = () => {
  const body = document.body;
  const html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};
const getTotalPagesStories = (total) => {
  if (!total || total < pageSize) {
    return 1;
  } else {
    return Math.max(Math.ceil(total / pageSize) - 1, 1);
  }
};
const Stories = ({ topicId }) => {
  const storiesPageRef = useRef();
  const pageNumber = useRef(1);
  const isPagintionLoading = useRef(false);
  const { isLoading } = useSelector((state) => state.story);
  const { stories: list, isLoading: isListEmpty, isPaginationLoading: isPagintionLoadingR, storiesCount } = useSelector((state) => state.homepage);
  const dispatch = useDispatch();
  const requestId = uuidv4();
  const [totalPages, setTotalPages] = useState(0);
  const [noTree] = useState(false);
  const { treeId, primaryPersonId } = useParams();
  const handleScroll = () => {
    if (totalPages < pageNumber?.current) return;
    const calHeight = getDocumentHeightStories() - window.innerHeight;
    if (storiesPageRef?.current.scrollHeight > window.innerHeight && getScrollTopStories() + storiesPageRef?.current.scrollHeight / 2 < calHeight) return;
    if (!isPagintionLoading?.current) {
      dispatch(getStoriesByTopic({ topicId, requestId, pageNumber: pageNumber?.current + 1, pageSize }, false, isPagintionLoading));
      pageNumber.current = pageNumber?.current + 1;
    }
  };

  useEffect(() => {
    if (topicId) {
      dispatch(getStoriesByTopic({ topicId, requestId, pageNumber: 1, pageSize: pageSize * 2 }));
    }
    pageNumber.current = 2;
  }, [dispatch, treeId, primaryPersonId, topicId]);

  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [dispatch, pageNumber, isPagintionLoading, totalPages]);

  useEffect(() => {
    if (storiesCount > 0) {
      const totalCount = getTotalPagesStories(storiesCount);
      setTotalPages(totalCount);
    } else {
      setTotalPages(0);
    }
  }, [storiesCount]);
  return (
    <>
      <div className="all-stories-page-wrap mx-auto w-full">
        <div className="all-stories-page" ref={storiesPageRef}>
          <StoriesPage fromTopicPage={false} storiesTab={true} noTree={noTree} personView={true} grid={4} midleClass="stories-middle-content view-all-stories-page topics-page" columnsCountBreakPoints={{ 510: 1, 511: 3, 1280: 4 }} rightPanel={false} stories={list} isStoryEmpty={isListEmpty} isLoading={isLoading} paginationLoader={isPagintionLoadingR} exploreTab={true} />
        </div>
      </div>
    </>
  );
};
export default Stories;
