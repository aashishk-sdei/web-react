import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getFixNumWithStr } from "shared-logics";
import AccountAvatar from "../../../components/AccountAvatar";
import Button from "../../../components/Button";
import Skeleton from "../../../components/Skeleton";
import Typography from "../../../components/Typography";
import { clearFollowedTopicList, followTopic, getTopicbyId, unFollowTopicModal } from "../../../redux/actions/topic";
import { getCustomImageUrl } from "../../../utils";

const TopicLoader = () => {
  return (
    <div className="head avatar-top border-b border-gray-2  mb-2 content-loader-wrap">
      <div className="flex items-center">
        <div className="mr-3.5 card-avatar rounded-full overflow-hidden w-10 h-10 flex items-center justify-center">
          <Skeleton variant="circular" width={40} height={40} />
        </div>
        <div className="flex-grow inside-span-block">
          <Skeleton variant="rectangular" width={113} height={14} />
        </div>
      </div>
    </div>
  );
};
const TopicComponent = ({ topic }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isFollowed, setIsFollowed] = useState(topic?.isFollowedByUser);

  useEffect(() => {
    if (typeof topic === "string") {
      dispatch(getTopicbyId(topic));
    }
  }, []);

  const setFollow = () => {
    setIsFollowed(!isFollowed);
  };

  const handleFollow = () => {
    if (!isFollowed) {
      dispatch(unFollowTopicModal(topic?.topicId, setFollow));
    } else {
      dispatch(followTopic(topic?.topicId, setFollow));
    }
  };

  const handleClickTopic = () => {
    if (topic?.primaryUrl) {
      history.push(`/explore/topic/${topic?.primaryUrl}`);
    }
  };

  return (
    <>
      {typeof topic === "string" ? (
        <TopicLoader />
      ) : (
        <div className="relative mb-4 flex items-center">
          <div className="flex flex-grow pr-3 items-center group">
            <div className="overflow-hidden mr-2.5 cursor-pointer" onClick={handleClickTopic}>
              <AccountAvatar avatarName={`${topic?.name}`} imgSrc={getCustomImageUrl("q=100,w=40,h=40", topic?.imageUrl)} bgColorCode={getFixNumWithStr(`${topic?.name}`)} />
            </div>
            <div className="media-info  avtar-circle-medium-name">
              <h3 className="title main-title">
                <Typography size={14} text="secondary" weight="medium">
                  <span className="cursor-pointer hover:text-blue-4 hover:underline" onClick={handleClickTopic}>
                    {topic?.name}{" "}
                  </span>
                </Typography>
              </h3>
            </div>
          </div>
          <div className="ml-auto">
            {!isFollowed && <Button onClick={handleFollow} type="default-dark" fontWeight="medium" className="btn btn-medium btn-default-dark w-24 flex justify-center" title={"Unfollow"} />}
            {isFollowed && <Button onClick={handleFollow} type="primary" fontWeight="medium" className="btn btn-medium btn-primary w-24 flex justify-center" title={"Follow"} />}
          </div>
        </div>
      )}
    </>
  );
};

const TopicsList = ({ tab, setTopicPageNumber, topicLoading }) => {
  const { followedTopics, followedTopicsLoading } = useSelector((state) => state.topic);

  const loadMoreTopics = () => {
    setTopicPageNumber((prevPageNumber) => prevPageNumber + 1);
  };
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearFollowedTopicList());
    };
  }, []);

  useEffect(() => {
    if (topicLoading && tab === 1) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      let observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreTopics();
        }
      }, options);
      observer.observe(topicpageEnd.current);
    }
  }, [topicLoading]);

  const topicpageEnd = useRef(null);
  return (
    <>
      {followedTopics && followedTopics?.map((item) => <TopicComponent topic={item} />)}
      <div ref={topicpageEnd}></div>
      {followedTopicsLoading &&
        [0, 1, 2].map((_item) => (
          <div key={_item}>
            <TopicLoader />
          </div>
        ))}
    </>
  );
};

export default TopicsList;
