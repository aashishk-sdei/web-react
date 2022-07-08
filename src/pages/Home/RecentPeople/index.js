import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getRecentPeopleList } from "../../../redux/actions/homepage";
import Typography from "./../../../components/Typography";
import { tr, getDateString } from "../../../components/utils";
import { getPersonProfileUrl } from "./../../../components/utils/genderIcon";
import RecentLoader from "./RecentLoader";
import OtherImg from "../../../assets/images/otherVectoriconlg.svg";
import { isUserOwner } from "../../../services";

const RecentPeople = ({ user }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isRecentProple, recentProple } = useSelector(
    (state) => state.homepage
  );
  const goToPersonPage = (item) => {
    if(isUserOwner(item.contributorId)){
       history.push(`/family/person-page/${item.treeId}/${item.personId}`);
    }else{
      history.push(`/family/person-page/${item.treeId}/${item.personId}/${item.contributorId}`);
    }
  };
  const { userProfileAccount } = useSelector(state => state.user);
  const loggedinUserId = userProfileAccount?.id;
  
  useEffect(() => {
    if (user) dispatch(getRecentPeopleList());
  }, [user, dispatch]);
  const getRecentPeople = () => {
    
    let isOwnerStory = false
    return (
      <div className="recent-ppl-list">
        {recentProple.map((item, index) => {
          if(loggedinUserId === item.contributorId)
            isOwnerStory = true;
          return (
            <div
              className= {(isOwnerStory || (!isOwnerStory && !item?.isLiving))? "flex items-center mb-2 cursor-pointer avtar-group" : "flex items-center mb-2 avtar-group"}
              key={index}
              {...((isOwnerStory || (!isOwnerStory && !item?.isLiving)) && {onClick:(()=> goToPersonPage(item))})} 
            >
              <div className="media mr-2 avtar-square-medium">
                { (isOwnerStory || (!isOwnerStory && !item?.isLiving)) ? (
                  <>
                  {item.profileImageUrl !== "" ? (
                    <>
                    <img
                      src={item.profileImageUrl}
                      alt=""
                      className="w-8 h-8 object-cover"
                    />
                    </>
                  ) : (
                    <>
                    <img src={getPersonProfileUrl(item)} alt={item.Gender} />
                    </>
                  )}
                  </>
                  )
                : 
                (<img src={OtherImg} alt={item.Gender} />)
                }
              </div>
              <div className="media-info flex-grow avtar-square-medium-name">
                <div className="recent-user-info">
                  <p className={(isOwnerStory || (!isOwnerStory && !item?.isLiving)) ? "title main-title":"title"}>
                    <Typography size={12} text="secondary" weight="medium">
                      {`${item.givenName} ${item.surname}`}
                    </Typography>
                  </p>
                  <p className="date-tree flex flex-wrap sub-title">
                    <span className={`${(getDateString(item, isOwnerStory) && (isOwnerStory || (!isOwnerStory && !item?.isLiving)) && item.treeName) ? 'date relative pr-2' : "no-dot date relative pr-2"}`}>
                      <Typography size={10}>{getDateString(item, isOwnerStory)}</Typography>
                    </span>
                    {(isOwnerStory || (!isOwnerStory && !item?.isLiving)) && 
                      <Typography size={10}>{item.treeName}</Typography>
                      }
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      {recentProple.length === 0 ? (<div id="recent-card" className="bg-white card recent-people-card">
        {isRecentProple && <div className="card-content-wrap py-3 px-6">
          <div className="head flex justify-between items-center mb-4">
            <h3>
              <Typography size={14} text="secondary" weight="medium">
                {tr(t, "home.profile.recentlyViewed")}
              </Typography>
            </h3>
          </div>
          <div className="card-content pb-3">{<RecentLoader />}</div>
        </div>}
      </div>
      ) : (
        <div id="recent-card" className="bg-white card recent-people-card">
          <div className="card-content-wrap py-3 px-6">
            <div className="head flex justify-between items-center mb-4">
              <h3>
                <Typography size={14} text="secondary" weight="medium">
                  {tr(t, "home.profile.recentlyViewed")}
                </Typography>
              </h3>
            </div>
            <div className="card-content pb-3">{getRecentPeople()}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default RecentPeople;
