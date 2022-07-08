import React, { useState } from "react";
import "../index.css";
import "../../Clues/index.css";
import ClueLeftPanel from "../../Clues/LeftPanel";
import ClueRightPanel from "../../Clues/RightPanel";
import ViewClue from "../../Clues/ViewClue";
import StoryRightPanel from "../stories/StoriesPage/RightPanel";
import { icons } from "./icons";
const Clues = () => {
  const [showClueView, setShowClueView] = useState(false);
  const [leftPanelValue] = useState({
    NewClues: 4,
    Saved: 3,
    Unsure: 2,
    Rejected: 1,
  });
  const toggleClueView = () => {
    let profileHead = document.getElementById("pr-header");
    if (profileHead) {
      profileHead.style.display = "none";
    }
    setShowClueView(true);
  };
  return showClueView ? (
    <ViewClue setShowClueView={setShowClueView} isHeaderClass={true} />
  ) : (
    <div className="lg:flex justify-between clue-person">
      <div className="clue-left">
        <ClueLeftPanel icons={icons} items={leftPanelValue} />
      </div>
      <div className="all-stories-container flex flex-grow pt-6 lg:pt-0 ">
        <div className="middle-content-col flex flex-grow">
          <div className={`stories-middle-content`}>
            <ClueRightPanel setShowClueView={toggleClueView} />
          </div>
        </div>
        <div>
          <StoryRightPanel />
        </div>
      </div>
    </div>
  );
};
export default Clues;
