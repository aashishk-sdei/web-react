import React, { useState } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "../../components/Typography";
const LeftPanel = ({ icons, items }) => {
  const [viewDropdown, setViewDropdown] = useState(false);
  return (
    <div>
      <div className="tw-stories-left-panel pt-2 lg:pt-0">
        <div className="tw-left-side-content flex w-full lg:block">
          <div className="tw-sidebar-items-wrap w-full relative ">
            <div className="device-cat-dd lg:hidden mb-5 lg:mb-0">
              <ClickAwayListener onClickAway={() => setViewDropdown(false)}>
                <div className={`tw-sidebar-items-wrap md:w-full relative ${viewDropdown ? "dd-open" : ""}`}>
                  <div className="device-cat-dd">
                    <div className="active-cat-item is-relative flex md:w-full items-center" onClick={() => setViewDropdown((prev) => !prev)}>
                      <span className="icon w-8 mr-0.5 ml-1.5">{icons.AllClues}</span>
                      <Typography size={14} weight="medium">
                        All Clues
                      </Typography>
                      <span className="absolute right-4 top-4">
                        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 1.13833L6.23556 5.90233C6.20464 5.93329 6.16792 5.95786 6.1275 5.97461C6.08708 5.99137 6.04376 6 6 6C5.95624 6 5.91292 5.99137 5.8725 5.97461C5.83208 5.95786 5.79536 5.93329 5.76444 5.90233L1 1.13833" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className={`w-full dd-content absolute overflow-visible bg-white z-10 shadow lg:shadow-none rounded-lg w-full py-2 lg:py-1 ${!viewDropdown ? "hidden" : ""} block`}>
                    <div className="tw-sidebar-list-items clue-item">
                      {items &&
                        Object.entries(items).map(([key, value], i) => (
                          <button key={i} disabled={items && items.AllStories < 1 ? true : false} className={`tw-list-item rounded-full btn flex  w-full pr-1 `}>
                            {Object.entries(icons).map(([iconKey, iconValue]) => {
                              if (iconKey === key) {
                                return (
                                  <span key={iconKey} className={`icon flex justify-center mr-4 ml-1.5`}>
                                    {iconValue}
                                  </span>
                                );
                              }
                            })}
                            <Typography weight="medium" text={"default"} size={14}>
                              {key}
                            </Typography>
                            <Typography text={"default"} size={14}>
                              <span className={`count pl-2`}>({value})</span>
                            </Typography>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </ClickAwayListener>
            </div>
            <div className="w-full dd-content absolute overflow-visible lg:relative z-10 shadow lg:shadow-none rounded-lg w-full py-2 lg:py-1 hidden lg:block">
              <div className="tw-sidebar-list-items clue-item">
                {items &&
                  Object.entries(items).map(([key, value], i) => (
                    <button key={i} className={`tw-list-item  rounded-full btn flex  w-full pr-1 ${i === 0 ? "is-active" : ""}`}>
                      {Object.entries(icons).map(([iconKey, iconValue]) => {
                        if (iconKey === key) {
                          return (
                            <span key={iconKey} className="icon flex justify-center mr-4 ml-1.5">
                              {iconValue}
                            </span>
                          );
                        }
                      })}
                      <span className="defaultText text-blue-5 text-sm typo-font-medium">{key}</span>
                      <span className="defaultText text-blue-5 text-sm typo-font-regular">
                        <span className="count pl-2">({value})</span>
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LeftPanel;
