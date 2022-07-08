import React, { useState, useEffect, useRef } from "react";
import "./../PersonViewPage/index.css";
import "./index.css";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Loader";
import NewHeader from "./NewHeader";
import Content from "./content";
import Sidebar from "../../components/DropdownSidebar";
import { currentTopicClear, getTopicByName, getTopics } from "./../../redux/actions/topic";
import { addFooterGray, addFooterWhite } from "../../redux/actions/layout";
const TopicPage = () => {
  const { pathname } = useLocation();

  const actualPathName = pathname.replace("/explore/topic", "");
  const paths = actualPathName.split("/");

  const topicName = paths[paths.length - 1];

  const dispatch = useDispatch();
  const { isLoading, currentTopic, topicList, flattendTopicList } = useSelector((state) => state.topic);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tab, setTab] = useState(0);
  const heroImageRef = useRef(null);
  const getMousePosition = (e) => {
    setMousePosition({
      ...mousePosition,
      x: e.clientX,
      y: e.clientY,
    });
  };
  const handleTab = (selectedTab) => {
    setTab(selectedTab);
    window.scrollTo(0, 0);
  };
  const getPropsForHeader = () => {
    return {
      tab,
      handleTab,
      mousePosition,
      setMousePosition,
      heroImageRef,
      getMousePosition,
      currentTopic,
      fromTopicPage: true,
    };
  };
  const getPropsForContent = () => {
    return {
      topicId: currentTopic?.topicId,
    };
  };
  useEffect(() => {
    dispatch(addFooterWhite());
    return () => {
      dispatch(addFooterGray());
    };
  }, [dispatch]);
  useEffect(() => {
    dispatch(getTopics());
    return () => {
      dispatch(currentTopicClear());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTopicByName(topicName));
  }, [dispatch, topicName]);

  return (
    <>
      <div className="flex topic-main topic-wrapper main-wrapper mx-auto w-full">
        <div className="hidden lg:block lg:w-1/5 topic-sidebar">
          <Sidebar dataList={topicList} searchOptions={flattendTopicList} />
        </div>
        {isLoading && (
          <div className="h-screen mx-auto">
            <Loader color="primary" />
          </div>
        )}
        {!isLoading && (
          <div className="w-full lg:w-4/5">
            <div className="person-detail-page">
              <NewHeader {...getPropsForHeader()} />
              <div id="person-page" className="w-full">
                <div className="person-main-content mt-32 main-wrapper mx-auto px-6">
                  <Content tab={tab} {...getPropsForContent()} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default TopicPage;
