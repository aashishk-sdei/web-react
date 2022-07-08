import React, { useState } from "react";
import Typography from "./../../../../components/Typography";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
const ExploreLeftPanel = () => {
  const [MViewDropdown, setMViewDropdown] = useState(false);
  return (
    <div className="tw-stories-left-panel pt-2 lg:pt-0 hidden">
      <div className="tw-left-side-content flex w-full lg:block">
        <div className="add-story-top ml-4 lg:ml-0 lg:mb-3 flex lg:w-full order-2 whitespace-nowrap">
        </div>
        <ClickAwayListener onClickAway={() => setMViewDropdown(false)}>
          <div className={`tw-sidebar-items-wrap w-full relative ${MViewDropdown ? "dd-open" : ""}`}>
            <div className="device-cat-dd lg:hidden">
              <div className="active-cat-item is-relative flex w-full items-center" onClick={() => setMViewDropdown((prev) => !prev)}>
                <Typography size={14} weight="medium">
                  Submit Story
                </Typography>
                <span className="absolute right-4 top-4">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1.13833L6.23556 5.90233C6.20464 5.93329 6.16792 5.95786 6.1275 5.97461C6.08708 5.99137 6.04376 6 6 6C5.95624 6 5.91292 5.99137 5.8725 5.97461C5.83208 5.95786 5.79536 5.93329 5.76444 5.90233L1 1.13833" stroke="#747578" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div className={`w-full dd-content absolute overflow-visible lg:relative bg-white z-10 shadow lg:shadow-none rounded-lg w-full py-2 lg:py-1 ${!MViewDropdown ? "hidden" : ""} lg:block`}>
              <div className="tw-sidebar-list-items hidden">
                  <h4 className="text-black text-sm font-semibold py-3 md:py-5 px-2 md:px-0">Related Topics</h4>
                  <button className="text-sm text-blue-5 pb-3 block text-left px-2 md:px-0">First Bull Run</button>
                  <button className="text-sm text-blue-5 pb-3 block text-left px-2 md:px-0">Shiloh</button>
                  <button className="hidden md:block text-sm text-blue-5 pb-3 block text-left px-2 md:px-0">Antietam or the Battle of Sharpsburg</button>
                  <button className="text-sm text-blue-5 pb-3 block text-left px-2 md:px-0">Vicksburg</button>
              </div>
            </div>
          </div>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default ExploreLeftPanel;
