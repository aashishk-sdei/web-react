import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import StoryCard from "./../storyCard";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import GridLoader from "./contentLoader/GridLoader";
import StartTreeCardIcon from "./../../../../assets/images/start-tree-card-icon.svg";
import Skeleton from "./../../../../components/Skeleton";
import { getLinkStory } from "./../../../../utils";
import { useSelector } from "react-redux";
import { apiRequest } from "../../../../redux/requests";  
import { GET } from "../../../../redux/constants";
import { useFeatureFlag } from "../../../../services/featureFlag";
import PaymentModal from "../../../Payment/PaymentsModal";

const getLink = (storyId, treeId, primaryPersonId, storiesTab) => {
  let url = `/stories/view`;
  if (storiesTab) {
    url = `${url}${getLinkStory({ refType: "1", treeId, primaryPersonId, storyId })}`;
  } else {
    url = `${url}/2/${storyId}/${treeId}/${primaryPersonId}`;
  }
  return url;
};

const getUrl = (storiesTab, treeId, primaryPersonId) => {
  let url;
  if (storiesTab && treeId && primaryPersonId) {
    url = `/1/${treeId}/${primaryPersonId}`;
  } else if (treeId && primaryPersonId) {
    url = `/2/${treeId}/${primaryPersonId}`;
  } else {
    url = `/1/`;
  }
  return url;
};

const noStoriesTag = (currentTopic) => {
  return (
    <Typography text="black-color">
      <p className="leading-loose">
        No stories have been written and tagged to this {currentTopic?.categoryType === "Location" ? "location" : "topic"} yet.
        <br />
        Be the first to add your own.
      </p>
    </Typography>
  );
};

const NoDataLoader = ({ treeId, primaryPersonId, history, noTree, personView, storiesTab, isOwner, currentTopic, personalInfo, fromTopicPage }) => {
  let html = null;
  if (personView) {
    if (noTree) {
      html = (
        <div className={`no-record-card-solid mt-3 border border-gray-3 text-center bg-gray-1 overflow-hidden relative px-5 py-7 flex items-center flex-col`}>
          <div className="mb-5">
            <img src={StartTreeCardIcon} alt="start a tree" />
          </div>
          <div className="head mb-5">
            <Typography text="secondary">
              Before you start telling stories we need to know a little bit more about <span className="sml:block"></span>you and your family. Continue by starting a tree.
            </Typography>
          </div>
          <div className="button-wrap">
            <Button
              handleClick={() => {
                let url = `/family`;
                history.push(url);
              }}
              title="Start a tree"
              fontWeight="medium"
            />
          </div>
        </div>
      );
    } else {
      html = (
        <div className={`${fromTopicPage && "topic-placeholder"} no-record-card-solid mt-3 border border-gray-3 text-center bg-gray-1 overflow-hidden relative rounded-lg px-5 py-7 flex items-center flex-col mx-3 lg:mx-0`}>
          <div className="mb-5">{noStoriesTag(currentTopic)}</div>
          <div className="button-wrap">
            <Button
              handleClick={() => {
                let url = `/stories/add`;
                if (treeId && primaryPersonId) {
                  url = `${url}/2/${treeId}/${primaryPersonId}`;
                } else {
                  url = `${url}/1`;
                }
                history.push(url);
              }}
              title="Add Story"
              fontWeight="medium"
            />
          </div>
        </div>
      );
    }
  } else {
    html = (
      <div className={`no-record-card text-center bg-gray-1 overflow-hidden relative rounded-lg px-5 py-11 flex items-center flex-col`}>
        <div className="head mb-7">{isOwner ? <Typography text="secondary">What do you know about this person? Add a photo, or write down any memory to get started.</Typography> : <Typography text="secondary">There are no stories yet for {`${personalInfo?.givenName?.givenName} ${personalInfo?.surname?.surname}`}</Typography>}</div>
        {isOwner && (
          <div className="button-wrap">
            <Button
              size="large"
              handleClick={() => {
                let url = `/stories/add`;
                history.push(`${url}${getUrl(storiesTab, treeId, primaryPersonId)}`);
              }}
              title="Add Story"
            />
          </div>
        )}
      </div>
    );
  }
  return html;
};
const getdraftLink = (story, storytab) => {
  let link = "#";
  let ref = storytab ? 1 : 2;
  if (story.status === "Draft" && story?.storyId) {
    link = `/stories/edit/${ref}/${story?.storyId}`;
  }
  return link
}
const handleLink=({story,history,storiesTab,treeId,primaryPersonId,ViewStoryPaywall,setPaymentModal})=>{
if(story?.storyId && story?.status === "Published" ){
  if(ViewStoryPaywall){
    apiRequest(GET, `Story/checkstorypermission/${story.storyId}`).then((res) => {
      if(res.data){
        history.push(getLink(story.storyId, treeId, primaryPersonId, storiesTab))
      }else{
        setPaymentModal(true)
      }
    })
  }else{
    history.push(getLink(story.storyId, treeId, primaryPersonId, storiesTab))

  }
}else{
  history.push(getdraftLink(story, storiesTab))
}
}
const StoryData = ({
  stories,
  isStoryEmpty,
  treeId,
  primaryPersonId,
  history,
  paginationLoader,
 ViewStoryPaywall ,
 setPaymentModal,
  columnsCountBreakPoints,
  noTree = false,
  personView = false,
  storiesTab = false,
  exploreTab,
  isOwner,
  currentTopic,
  fromTopicPage = false,
  noDataCard = false,
  ...props
}) => {
  let html = null;
  if (stories?.length === 0 && !isStoryEmpty ) {
    html = noDataCard?noDataCard:NoDataLoader({
      treeId,
      primaryPersonId,
      history,
      noTree,
      personView,
      storiesTab,
      isOwner,
      currentTopic,
      personalInfo: props.person?.personalInfo,
      fromTopicPage,
    });
  } else {
    html = (
      <div className="added-stories flex flex-wrap w-full">
        <ResponsiveMasonry className="w-full relative" columnsCountBreakPoints={columnsCountBreakPoints}>
          <Masonry>
            {stories &&
              stories.map((story, index) => (
                <div className="story-card hover:bg-gray-1 rounded-lg" key={index}>
                  <span className="cursor-pointer" onClick={()=>handleLink({story,history,storiesTab,treeId,primaryPersonId,ViewStoryPaywall,setPaymentModal})} >
                    <StoryCard personView={personView} item={story} index={index} exploreTab={exploreTab} />
                  </span>
                </div>
              ))}
            {paginationLoader &&
              [1, 2].map((item) => (
                <div className="single-story-loader loader-grid w-full rounded-lg" key={item}>
                  <div className="img-loader-area rounded-lg overflow-hidden">
                    <Skeleton variant={"rect"} width={"100%"} height={"100%"} />
                  </div>
                  <div className="story-info-loader">
                    <Skeleton variant={"text"} width={"46%"} />
                    <Skeleton variant={"text"} width={"100%"} />
                    <Skeleton variant={"text"} width={"100%"} />
                    <Skeleton variant={"text"} width={"80%"} />
                  </div>
                </div>
              ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    );
  }
  return html;
};

const AllStories = ({ stories, isStoryEmpty, paginationLoader, columnsCountBreakPoints, noTree, storiesTab = false, personView = false, grid = 3, exploreTab, isOwner, fromTopicPage, ...props }) => {
  const { treeId, primaryPersonId } = useParams();
  const history = useHistory();
  const { currentTopic } = useSelector((state) => state.topic);
  const { enabled: ViewStoryPaywall } = useFeatureFlag("ViewStory");
  const [showPaymentModal,setPaymentModal]=useState(false)
  return (
    <>
      {isStoryEmpty ? (
        <div className="flex flex-grow flex-wrap flex-shrink-0">
          <GridLoader grid={grid} />
        </div>
      ) : (
        StoryData({
          stories,
          isStoryEmpty,
          treeId,
          primaryPersonId,
          history,
          showPaymentModal,
          setPaymentModal,
          paginationLoader,
          columnsCountBreakPoints,
          noTree,
          personView,
          ViewStoryPaywall,
          grid,
          storiesTab,
          exploreTab,
          isOwner,
          currentTopic,
          fromTopicPage,
          ...props,
        })
      )}
      <PaymentModal
            setPaymentModal={setPaymentModal}
            showPaymentModal={showPaymentModal}
            canClose={true}
          />
    </>
  );
};
export default AllStories;
