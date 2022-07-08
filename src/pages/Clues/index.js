import React, { useState } from "react";
import "./index.css";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ViewClue from "./ViewClue";
import SearchBar from "../Stories/SearchBar";
import { icons } from "./icons";
const Clues = () => {
  const [showClueView, setShowClueView] = useState(false);
  const [leftPanelValue] = useState({
    AllClues: 4,
    Records: 3,
    Stories: 1,
    Photos: 1,
  });
  return showClueView ? (
    <ViewClue setShowClueView={setShowClueView} />
  ) : (
    <div className="md:bg-gray-2 relative">
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full relative">        
        <div className="flex justify-center">
          <div className={`search-bar-top max-w-xl mx-auto mb-4 px-3 relative w-full`}>
            <SearchBar placeholder="Coming Soon" disabled={true} primaryPersonId={""} treePeople={[]} selectPeople={null} />
          </div>
        </div>
        <div className="lg:flex pt-3">
          <div className="w-full lg:w-1/4">
            <LeftPanel icons={icons} items={leftPanelValue} />
          </div>
          <div className="w-full lg:w-3/4">
            <RightPanel setShowClueView={setShowClueView} />
          </div>
        </div>
      </div>
      <div className="clue-overlay">
          <h3 className="text-4xl">Coming Soon</h3>
        </div>
    </div>
  );
};
export default Clues;
