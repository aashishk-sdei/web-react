import React, { useEffect, useState, useRef } from "react";
import Typography from "./../../../../components/Typography";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getComments, clearComments } from "../../../../redux/actions/comments";
import Commentdropdown from "./commentdropdown";
import AccountAvatar from "../../../../components/AccountAvatar";
import { TimeSince } from "../../../../utils/index";
import CommentLoader from "./commentLoader";
import { getFixNumWithStr } from "shared-logics";
import { getAvatarName } from "../../../../utils";
import "./index.css";
import { getAccessToken } from "../../../../services";

const Comments = ({ isSidebarOpen, activeTab }) => {
  const [datediff, setDateDiff] = useState([]);
  const dispatch = useDispatch();
  const { storyId } = useParams();
  const isAccessTokenTerms = getAccessToken()
  const { list, isListLoading } = useSelector((state) => state.comments);
  const [pageNumber, setPageNumber] = useState(1);
  const pageEnd = useRef(null);
  const loadMordata = useRef(true);
  const [loading, setLoading] = useState(false);
  const loadMore = () => {
    if (loadMordata.current) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };
  useEffect(() => {
    if (storyId && isAccessTokenTerms) {
      dispatch(getComments({ pageNumber, pageSize: 20, storyId, loadMordata }));
    }
    setLoading(true);
  }, [isSidebarOpen,dispatch, pageNumber]);

  useEffect(() => {
    return () => {
      loadMordata.current = true;
      setPageNumber(1);
      dispatch(clearComments());
    };
  }, [isSidebarOpen, dispatch]);

  useEffect(() => {
    let observer;
    if (loading && pageEnd.current) {
      const options = {
        root: document.getElementsByClassName("rail-content w-full")[0],
        rootMargin: "50px",
        threshold: 0,
      };
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      }, options);
      observer.observe(pageEnd.current);
    }
    return () => {
      pageEnd.current && pageEnd.current.unobserve && pageEnd.current.unobserve(pageEnd.current);
      dispatch(clearComments());
    };
  }, [loading, pageEnd,activeTab]);

  const getdate = () => {
    const listnew = list.map((getdates) => TimeSince(getdates.createdDate));
    setDateDiff(listnew);
  };
  useEffect(() => {
    getdate();
  }, [list]);

  const getStoryWidget = () => {
    return (
      <>
        <div className="mb-4 ml-4 relative z-10 icon-btn">
          <Commentdropdown />
        </div>
      </>
    );
  };
  return (
    <>
      {list &&
        list?.map((viewallcmt, i) => {
          let splitCommenterName = viewallcmt.commenterName.split(' ')
          return (
            <div className="px-6">
              <div className="drawer-comments">
                <div className="mb-5 pr-0 relative">
                  <div className="absolute hidden right-0 top-2">{getStoryWidget()}</div>
                  <div className="flex">
                    <div className="mt-2">{viewallcmt?.commenterProfileImageUrl ? <AccountAvatar avatarName={`${viewallcmt?.commenterName}`} bgColorCode={getFixNumWithStr(getAvatarName(`${viewallcmt?.commenterName}`))} imgSrc={`${viewallcmt?.commenterProfileImageUrl} `} /> : <AccountAvatar avatarName=
                      {`${splitCommenterName[0][0]}${splitCommenterName[1][0]}`} bgColorCode={getFixNumWithStr(getAvatarName(`${splitCommenterName[0][0]}${splitCommenterName[1][0]}`))} />}</div>
                    <div className="ml-3 pl-0.5">
                      <h5>
                        <Typography size={12} text="secondary" weight="bold">
                          {viewallcmt?.commenterName}
                        </Typography>
                        <Typography size={12}>
                          <span className="ml-1">{datediff[i]}</span>
                        </Typography>
                        <p>
                          <Typography size={14} text="secondary">
                            <span className="block">{viewallcmt?.content}</span>
                          </Typography>
                        </p>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={pageEnd}></div>
      {isListLoading &&
        [0, 1, 2].map((_item) => (
          <div key={_item}>
            <CommentLoader />
          </div>
        ))}
    </>
  );
};
export default Comments;
