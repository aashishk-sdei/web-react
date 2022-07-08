import React from "react";
import Button from "./../../components/Button";
import { isUserOwner } from "../../services";
import Icon from "./../../components/Icon";

const StoryDropdown = ({ view, setShowReportModal,  setShowWidget, showWidget }) => {
  const HandleDropdown = (e) => {
    e.stopPropagation();
    setShowWidget((prev) => !prev);
  };
  return (
    <>
      {!isUserOwner(view?.authorId) && (
        <div>
          <Button onClick={(e) => HandleDropdown(e)} icon="reportstorydropdown" size="small" title="" type="default" />
          {showWidget && (
            <div class="story-dropdown">
              <div class="dropdown-content">
                <button className="flex items-center" onClick={() => setShowReportModal(true)}>
                  <Icon type="storyreport" />
                  <span class="defaultText secondary-color text-sm typo-font-regular">Report story</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default StoryDropdown;