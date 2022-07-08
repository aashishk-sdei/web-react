import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getImmediateFamily } from "../../../../redux/actions/story";
import Typography from "./../../../../components/Typography";
import RightLoader from "./contentLoader/Right";
import { tr } from "./../../../../components/utils";
import { showBirthandDeath } from "shared-logics";
import { getPersonProfileUrl } from "./../../../../components/utils/genderIcon";

const RightPanel = ({ isOwner }) => {
  const { rightPanelDetails, isLoading, spousesnchildren } = useSelector((state) => state.story);
  const { treeId, primaryPersonId,authorId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const childrenArray = spousesnchildren && spousesnchildren?.children;

  useEffect(() => {
    dispatch(getImmediateFamily({ personId: primaryPersonId, treeId }));
  }, [dispatch, primaryPersonId, treeId]);

  const getUsersLifeSpan = (content) => {
    const startDate = new Date(content.birthDate || content.birth?.date);
    const endDate = new Date(content.deathDate || content.death?.date);
    let birthDate = startDate.getFullYear();
    let deathDate = endDate.getFullYear();
    if (isNaN(birthDate)) birthDate = "";
    if (isNaN(deathDate)) deathDate = "";
    return showBirthandDeath(birthDate, deathDate, content.isLiving, isOwner);
  };
  const getlink = (person) => {
   authorId ?  history.push(`/family/person-page/${treeId}/${person.id}/${authorId}?tab=0`) : history.push(`/family/person-page/${treeId}/${person.id}?tab=0`)
  }
  const getAvatarCard = (person, unknown) => {
    if (isOwner || (!isOwner && !person.isLiving)) {
      return (
        <div onClick={() => getlink(person)} key={person.id} className="rel-list-item cursor-pointer">
          <div className="rel-item flex w-full items-center avtar-group">
            <div className="rel-media mr-2 avtar-square-medium ">{person.imgsrc ? <img src={person.imgsrc} className="object-cover" alt="avatar" /> : <img src={getPersonProfileUrl(person)} alt={person.Gender} />}</div>
            <div className="rel-info avtar-square-medium-name">
              <h5 className="main-title">
                <Typography size={14} text="secondary" weight="medium">
                  {person.firstName?.givenName || person.lastName?.surname ? `${person.firstName?.givenName} ${person.lastName?.surname}` : unknown}
                </Typography>
              </h5>
              <p className="sub-title">
                <Typography size={10}>{getUsersLifeSpan(person)}</Typography>
              </p>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div key={person.id} className="rel-list-item">
        <div className="rel-item flex w-full items-center avtar-group">
          <div className="rel-media mr-2 avtar-square-medium ">
            <img src={getPersonProfileUrl()} alt={person.Gender} />
          </div>
          <div className="rel-info avtar-square-medium-name">
            <h5 className="main-title main-title-living">
              <Typography size={14} text="secondary" weight="medium">
                Living
              </Typography>
            </h5>
          </div>
        </div>
      </div>
    )
  }

  const getParentAvatarCard = (parent) => {
    if (isOwner || (!isOwner && !parent.isLiving)) {
      return (
        <div onClick={() => getlink(parent)} key={parent.id} className="rel-list-item cursor-pointer">
          <div className="rel-item flex w-full items-center avtar-group">
            <div className="rel-media mr-2 avtar-square-medium ">{parent.imgsrc ? <img src={parent.imgsrc} className="object-cover" alt="avatar" /> : <img src={getPersonProfileUrl(parent)} alt={parent.gender.gender} />}</div>
            <div className="rel-info avtar-square-medium-name">
              <h5 className="main-title">
                <Typography size={14} text="secondary" weight="medium">{`${parent.firstName.givenName} ${parent.lastName.surname}`}</Typography>
              </h5>
              <p className="sub-title">
                <Typography size={10}>{getUsersLifeSpan(parent)}</Typography>
              </p>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div key={parent.id} className="rel-list-item">
        <div className="rel-item flex w-full items-center avtar-group">
          <div className="rel-media mr-2 avtar-square-medium ">
            <img src={getPersonProfileUrl()} alt={parent.Gender} />
          </div>
          <div className="rel-info avtar-square-medium-name">
            <h5 className="main-title main-title-living">
              <Typography size={14} text="secondary" weight="medium">
                Living
              </Typography>
            </h5>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="tw-stories-right-panel ml-auto">
        <div className="story-relations w-full">
          {isLoading ? (
            <RightLoader />
          ) : (
            <>
              <div className="rel-list-items mb-5">
                {rightPanelDetails?.parents && (
                  <h3 className="mb-3">
                    <Typography size={12}>Parents</Typography>
                  </h3>
                )}
                {rightPanelDetails?.parents.map((parent) => (
                  <>{getParentAvatarCard(parent)}</>
                ))}
              </div>
              <div className="rel-list-items mb-5">
                {spousesnchildren && !!spousesnchildren.spouses && !!spousesnchildren.spouses.length && (
                  <h3 className="mb-3">
                    <Typography size={12}>{tr(t, "person.table.spousechildren.spouse")}</Typography>
                  </h3>
                )}
                {spousesnchildren &&
                  spousesnchildren.spouses &&
                  spousesnchildren.spouses.map((spouse) => (
                    <>{getAvatarCard(spouse, tr(t, "person.unknownSpouse"))}</>
                  ))}
              </div>
              <div className="rel-list-items mb-5">
                {childrenArray && !!childrenArray.length && (
                  <h3 className="mb-3">
                    <Typography size={12}>{tr(t, "person.table.spousechildren.children")}</Typography>
                  </h3>
                )}
                {childrenArray &&
                  childrenArray.map((child) => (
                    <>{getAvatarCard(child, tr(t, "person.unknownChildren"))}</>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RightPanel;
