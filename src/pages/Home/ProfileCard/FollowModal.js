import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import TailwindModal from "../../../components/TailwindModal";
import AccountAvatar from "../../../components/AccountAvatar";
import { setFollowUnollow, getFollowers, getFollowings, getFollowUnfollowDetailClear } from "../../../redux/actions/follow";
import { getFixNumWithStr } from "shared-logics";
import PersonHeaderLoader from "./PersonHeaderLoader";
import TopicsList from "./TopicsList";
import { clearFollowedTopicList, getFollowedTopics } from "../../../redux/actions/topic";
import { useHistory } from "react-router-dom";

const FollowModal = ({ modalTitle, showModal, setShowModal, modalType }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { follower, following, loader } = useSelector((state) => state.follow);
  const data = modalType === "FOLLOWING" ? following : follower;
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(1);
  const [topicpageNumber, setTopicPageNumber] = useState(1);
  const [topicLoading, setTopicLoading] = useState(false);
  const pageEnd = useRef(null);

  const loadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const handleNavigate = (person) => {
    history.push(`/person/profile/${person.userId}`);
  };

  useEffect(() => {
    if (tab === 1) {
      if (modalType === "FOLLOWING") {
        dispatch(getFollowedTopics({ topicpageNumber, pageSize: 30 }));
      }
    }
    setTopicLoading(true);
  }, [dispatch, topicpageNumber, tab]);

  useEffect(() => {
    if (modalType === "FOLLOWER" || tab === 2) {
      if (modalType === "FOLLOWING") {
        dispatch(getFollowings({ pageNumber, pageSize: 30 }));
      } else {
        dispatch(getFollowers({ pageNumber, pageSize: 30 }));
      }
    }
    setLoading(true);
  }, [dispatch, pageNumber, tab]);

  useEffect(() => {
    if (loading && (modalType === "FOLLOWER" || tab === 2)) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      let observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loader) {
          loadMore();
        }
      }, options);
      observer.observe(pageEnd.current);
    }
  }, [loading, tab]);

  useEffect(() => {
    return () => {
      dispatch(getFollowUnfollowDetailClear());
      dispatch(clearFollowedTopicList());
    };
  }, []);

  const getButton = (item, isBidirectional, userId, index) => {
    return (
      <Button
        handleClick={() => {
          dispatch(setFollowUnollow(getUserName(item), userId, index, isBidirectional ? "UNFOLLOW" : "FOLLOW", "MODAL", modalType));
        }}
        title={isBidirectional ? "Unfollow" : "Follow"}
        type={isBidirectional ? "default-dark" : "primary"}
        fontWeight="medium"
        className={isBidirectional ? "btn btn-medium btn-default-dark" : "btn btn-medium btn-primary"}
      />
    );
  };

  const getUserName = (item) => `${item?.givenName} ${item?.surname}`;
  return (
    <TailwindModal
      title={modalTitle}
      showClose={true}
      innerClasses="modal-sm"
      content={
        <div className="follow-list-wrap">
          {modalType === "FOLLOWING" && (
            <div className="flex mb-8">
              <div onClick={() => setTab(1)} className={`cursor-pointer ${tab === 1 && "border-b-4"} border-red px-3 pb-3`}>
                <Typography size={14} text={tab === 1 ? "secondary" : "default"} weight="medium">
                  <span>Topics</span>
                </Typography>
              </div>
              <div
                onClick={() => {
                  setTab(2);
                  setTopicPageNumber(1);
                }}
                className={`cursor-pointer ${tab === 2 && "border-b-4"} border-red px-3 pb-3`}
              >
                <Typography size={14} text={tab === 2 ? "secondary" : "default"} weight="medium">
                  <span>People</span>
                </Typography>
              </div>
            </div>
          )}

          <div className="story-prsns-list">
            {modalType === "FOLLOWER" || tab === 2 ? (
              <>
                {data &&
                  data?.map((item, index) => (
                    <div key={index} className="relative mb-4 flex items-center">
                      <div className="flex flex-grow pr-3 items-center group ">
                        <span className="cursor-pointer" onClick={() => handleNavigate(item)}>
                          <AccountAvatar avatarName={`${item?.givenName?.[0]}${item?.surname?.[0]}`} imgSrc={item?.profileImageUrl} bgColorCode={getFixNumWithStr(`${item?.givenName?.[0]}${item?.surname?.[0]}`)} likedPersons />
                        </span>
                        <div className="media-info avtar-circle-medium-name ml-2.5">
                          <h3 className="title main-title tw-ellipsis-onel">
                            <Typography size={14} text="secondary" weight="medium">
                              <span className="hover:text-blue-4 hover:underline cursor-pointer" onClick={() => handleNavigate(item)}>{`${item?.givenName} ${item?.surname}`}</span>
                            </Typography>
                          </h3>
                        </div>
                      </div>
                      <div className="ml-auto">{getButton(item, item?.isBidirectional, item?.userId, index)}</div>
                    </div>
                  ))}
                <div ref={pageEnd}></div>
                {loader &&
                  [0, 1, 2].map((_item) => (
                    <div key={_item}>
                      <PersonHeaderLoader />
                    </div>
                  ))}
              </>
            ) : (
              <TopicsList tab={tab} setTopicPageNumber={setTopicPageNumber} topicLoading={topicLoading} />
            )}
          </div>
        </div>
      }
      showModal={showModal}
      setShowModal={setShowModal}
    />
  );
};
export default FollowModal;
