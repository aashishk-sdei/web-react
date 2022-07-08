import React from "react";
import DropdownArrow from "../../assets/images/dropdownarrow.svg";
import { useHistory, useLocation } from "react-router-dom";
import SearchTopics from "../SearchTopics";

const DropdownSidebar = React.memo(({ dataList, searchOptions }) => {
  const history = useHistory();

  const { pathname } = useLocation();

  const actualPathName = pathname.replace("/explore/topic", "");
  const paths = actualPathName.split("/");
  const lastpath = pathname.split("/").pop();

  const TopItem = ({ data, index, route }) => {
    const isActive = paths.includes(data.seoName);

    const hasChildren = data.childTopicId?.length > 0;

    const formatted = data.childTopicId.map((ch) => {
      return dataList.find((d) => d.topicId === ch);
    });

    const handleClick = () => {
      history.push(`/explore/topic${route}`);
    };

    return (
      <div key={index} style={{ marginLeft: `${index - 10}px` }}>
        <div className="flex">
          <div>
            <ul className="sub-menu">
              <li className={`cursor-pointer ${lastpath === data?.seoName ? "active " : ""}`} onClick={() => handleClick()}>
                {data?.childTopicId?.length > 0 && (
                  <div className="topic-dropdown">
                    <img className={`${isActive ? " " : "topicicon-left"}`} src={DropdownArrow} alt="" />
                  </div>
                )}
                <div>{data?.name}</div>
              </li>
            </ul>
          </div>
        </div>
        {isActive && hasChildren && formatted.map((f, fi) => <TopItem data={f} index={fi + index} route={`${route}/${f.seoName}`} />)}
      </div>
    );
  };

  return (
    <div>
      <div className="pt-20">
        <div className="mb-4">
          <div className={`search-bar-top max-w-xl mx-auto pr-3 pl-3 relative w-full topic-search`}>
            <SearchTopics
              leftIcon={
                <svg className="mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6.63899C1 8.13454 1.59413 9.56884 2.65169 10.6264C3.70924 11.6839 5.1436 12.278 6.63921 12.278C8.13482 12.278 9.56917 11.6839 10.6267 10.6264C11.6843 9.56884 12.2784 8.13454 12.2784 6.63899C12.2784 5.14343 11.6843 3.70914 10.6267 2.65162C9.56917 1.59411 8.13482 1 6.63921 1C5.1436 1 3.70924 1.59411 2.65169 2.65162C1.59413 3.70914 1 5.14343 1 6.63899V6.63899Z" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M10.626 10.626L14.9996 15" stroke="#747578" fill="red" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              }
              options={searchOptions}
            />
          </div>
        </div>

        <ul className="topic-listmain">
          {dataList.map((element, elementIndex) => {
            if (element.featured === "No" && element.parentTopicId === null) {
              return <TopItem data={element} index={elementIndex} route={`/${element.seoName}`} />;
            }
          })}
        </ul>
      </div>
    </div>
  );
});

export default DropdownSidebar;
