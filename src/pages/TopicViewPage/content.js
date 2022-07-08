import React from "react";
import Stories from "./Stories";
const Content = (props) => {
  const getTabs = () => {
    switch (props.tab) {
      case 0:
        return <Stories {...props} />;
      case 1:
        return <div>
          <div className="mx-auto w-full px-4 lg:px-28">
            <div className="cards-wrap cards-wrap1">
              <>
                <div className="bg-white border-t border-b border-gray-2 sm:border-b-0 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 my-5 text-center">
                  <div className="max-w-lg mx-auto py-6">
                    <h2 className="font-semibold mb-2 break-words overflow-ellipsis overflow-hidden ">
                      Coming Soon
                    </h2>
                  </div>
                </div>
              </>
            </div>
          </div>
        </div>;
      default:
        return <div></div>;
    }
  };
  return getTabs();
};
export default Content;
