import React, { useEffect, useState } from "react";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./index.css";
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import { EffectFade, Navigation } from "swiper";
import { useDispatch, useSelector } from "react-redux";
import { getTopics } from "../../redux/actions/topic";
import { addFooterGray, addFooterWhite } from "../../redux/actions/layout";
import Loader from "../../components/Loader";
import SearchTopics from "../../components/SearchTopics";
import RightArrow from "../../assets/images/rightarrow.svg";
import LeftArrow from "../../assets/images/leftarrow.svg";
import { getCustomImageUrl } from "../../utils";
import DropdownArrow from "../../assets/images/dropdownarrow.svg";

const Explore = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [mobileSubTopicsView, setMobileSubTopicsView] = useState(false);
  const [topicData, setTopicData] = useState({});
  const [topicHistory, setTopicHistory] = useState([]);

  const { isLoading, topicList, flattendTopicList } = useSelector((state) => state.topic);

  const formattedTopics = topicData?.childTopicId?.map((ch) => {
    return topicList?.find((d) => d.topicId === ch);
  });

  useEffect(() => {
    dispatch(addFooterWhite());
    return () => {
      dispatch(addFooterGray());
    };
  }, [dispatch]);
  useEffect(() => {
    dispatch(getTopics());
  }, [dispatch]);

  const handleNavigate = (route) => {
    history.push(`/explore/topic${route}`);
  };

  const handleBack = () => {
    if (topicHistory.length === 1) {
      setMobileSubTopicsView(false);
      setTopicData({});
      setTopicHistory([]);
    } else {
      setTopicData({ ...topicData, ...topicHistory[topicHistory.length - 2] });
      setTopicHistory([...topicHistory.slice(0, topicHistory.length - 1)]);
    }
  };

  const handleClickTopic = (data) => {
    const hasChildTopics = data?.childTopicId?.length > 0;

    if (hasChildTopics) {
      setTopicData(data);
      setTopicHistory([...topicHistory, data]);
    } else {
      handleNavigate(`${data.route}`);
    }
  };

  const OtherFeaturedTopic = () => (
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-8">
      {flattendTopicList
        .filter((item) => item.featured === "No" && item.parentTopicId === null)
        .map((item, index) => (
          <div onClick={() => handleNavigate(item?.route)} key={index} class="rounded-2xl browse-topic">
            <div class="relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
              <div className="browse-overlay"></div>
              <img class="object-cover w-full h-28" src={getCustomImageUrl("q=100", item.imageUrl)} alt={item.name} />
              <div class="browse-center px-6 py-4 z-50 w-full">
                <h4 class="text-lg text-white font-semibold break-all">{item.name}</h4>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="topic-wrapper main-wrapper mx-auto w-full">
      {isLoading ? (
        <div className="h-screen">
          <Loader color="primary" />
        </div>
      ) : (
        <>
          <div className="flex explore-main">
            {/* <div>
              <div className="pt-20">
                <div className="mb-4">
                  <div className={`search-bar-top max-w-xl mx-auto px-3 relative w-full topic-search`}>
                    <SearchTopics
                      leftIcon={
                        <svg className="mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 6.63899C1 8.13454 1.59413 9.56884 2.65169 10.6264C3.70924 11.6839 5.1436 12.278 6.63921 12.278C8.13482 12.278 9.56917 11.6839 10.6267 10.6264C11.6843 9.56884 12.2784 8.13454 12.2784 6.63899C12.2784 5.14343 11.6843 3.70914 10.6267 2.65162C9.56917 1.59411 8.13482 1 6.63921 1C5.1436 1 3.70924 1.59411 2.65169 2.65162C1.59413 3.70914 1 5.14343 1 6.63899V6.63899Z" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M10.626 10.626L14.9996 15" stroke="#747578" fill="red" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      }
                      options={flattendTopicList}
                    />
                  </div>
                </div>
              </div>
            </div> */}

            <div className="hidden lg:block lg:w-1/5">
              <div className="pt-20 pl-3 explore-sidebar">
                <div className="mb-4">
                  <div className={`search-bar-top max-w-xl mx-auto pr-3 relative w-full explore-search`}>
                    <SearchTopics
                      leftIcon={
                        <svg className="mt-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 6.63899C1 8.13454 1.59413 9.56884 2.65169 10.6264C3.70924 11.6839 5.1436 12.278 6.63921 12.278C8.13482 12.278 9.56917 11.6839 10.6267 10.6264C11.6843 9.56884 12.2784 8.13454 12.2784 6.63899C12.2784 5.14343 11.6843 3.70914 10.6267 2.65162C9.56917 1.59411 8.13482 1 6.63921 1C5.1436 1 3.70924 1.59411 2.65169 2.65162C1.59413 3.70914 1 5.14343 1 6.63899V6.63899Z" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                          <path d="M10.626 10.626L14.9996 15" stroke="#747578" fill="red" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      }
                      options={flattendTopicList}
                    />
                  </div>
                </div>
                {flattendTopicList
                  .filter((item) => item.featured === "No" && item.parentTopicId === null)
                  .map((item, index) => (
                    <div key={index} onClick={() => handleNavigate(item?.route)} className="flex mb-3 pl-2 cursor-pointer">
                      <div className="flex">
                        {item?.childTopicId?.length > 0 && (
                          <div className="pt-2 pr-2">
                            <img className="topicicon-left" src={DropdownArrow} alt="" />
                          </div>
                        )}
                        <h4 className="text-black text-sm">{item?.name}</h4>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="w-full lg:w-4/5">
              <div className="lg:hidden pt-10 lg:pt-22.5 all-stories-page-wrap mx-auto w-full explore-wrapper">
                {mobileSubTopicsView && (
                  <>
                    <div className="p-8">
                      <div className="flex">
                        <div className="pt-1.5" onClick={() => handleBack()}>
                          <img src={LeftArrow} alt="Left Arrow" />
                        </div>
                        <div className="pl-5">
                          <h4 className="text-black font-bold text-base">{topicData?.name}</h4>
                        </div>
                        <div className="ml-auto">
                          <button className="bg-blue-4 rounded-lg text-sm font-semibold text-white py-1.5 px-4" onClick={() => handleBack()}>
                            View All
                          </button>
                        </div>
                      </div>
                      <div className="py-5 mt-2 ml-7">
                        <div className="flex mb-6" onClick={() => handleNavigate(`/${topicData.seoName}`)}>
                          <div>
                            <h2 className="text-black text-sm font-semibold">View All {topicData?.name}</h2>
                          </div>
                          <div className="ml-auto pt-1">
                            <img src={RightArrow} />
                          </div>
                        </div>
                        {formattedTopics?.map((topic) => {
                          return (
                            <div
                              className="flex mb-6"
                              onClick={() =>
                                handleClickTopic({
                                  ...topic,

                                  route: `${topicData?.route}/${topic?.seoName}`,
                                })
                              }
                            >
                              <div>
                                <h2 className="text-black text-sm font-semibold">{topic?.name}</h2>
                                {topic?.childTopicId?.length > 0 && <p className="text-xs text-gray-5">{topic?.childTopicId?.length} Subtopics</p>}{" "}
                              </div>
                              <div className="ml-auto pt-3">
                                <img src={RightArrow} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
                {!mobileSubTopicsView && (
                  <>
                    <div className="lg:flex pt-3">
                      <div className="w-full">
                        <h3 className="hidden text-black text-xl font-semibold mb-3 mt-4">Featured topics</h3>
                        <div className="">
                          <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            navigation={true}
                            breakpoints={{
                              250: {
                                slidesPerView: 1,
                                spaceBetween: 0,
                              },
                              640: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                              },
                              1024: {
                                slidesPerView: 3,
                                spaceBetween: 10,
                              },
                              1200: {
                                slidesPerView: 3,
                              },
                            }}
                            modules={[EffectFade, Navigation]}
                            className="mySwiper"
                          >
                            {flattendTopicList
                              .filter((item) => item.featured === "Yes")
                              .map((item, index) => {
                                return (
                                  <SwiperSlide key={index}>
                                    <div className="rounded-none md:rounded-2xl overflow-hidden shadow-lg featured-topic" onClick={() => handleNavigate(item?.route)}>
                                      <div className="relative overflow-hidden rounded-none md:rounded-lg shadow-lg cursor-pointer">
                                        <div className="explore-overlay"></div>
                                        <img className="object-cover w-full h-48" src={getCustomImageUrl("q=100", item.imageUrl)} alt="" />
                                        <div className="absolute bottom-0 left-0 px-6 py-4 z-50 w-full">
                                          <p className="text-white text-base font-semibold mb-2">Featured</p>
                                          <h4 className="text-xl text-white font-semibold break-all text-center cursor-pointer">{item.name}</h4>
                                        </div>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                );
                              })}
                          </Swiper>
                        </div>
                      </div>
                    </div>
                    <div className="lg:flex pt-3">
                      <div className="w-full">
                        <h3 className="text-black text-xl font-semibold mb-3 mt-3 pb-6 text-center border-b border-solid border-gray-3">Browse our topic pages</h3>
                        <div className="explore-browsetopic">
                          {topicList
                            .filter((item) => item.featured === "No" && item.parentTopicId === null)
                            .map((item, index) => (
                              <div
                                onClick={() => {
                                  const data = { ...item, route: `/${item?.seoName}` };
                                  setTopicData(data);
                                  setTopicHistory([...topicHistory, data]);
                                  setMobileSubTopicsView(true);
                                }}
                                className="flex mb-7"
                                key={index}
                              >
                                <div>
                                  <h2 className="text-black text-sm font-semibold">{item?.name}</h2>
                                  <p className="text-xs text-gray-5">{item?.childTopicId?.length} Subtopics</p>
                                </div>
                                <div className="ml-auto pt-3">
                                  <img src={RightArrow} />
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="hidden lg:block pt-18 md:pt-12 all-stories-page-wrap w-full mx-auto px-7">
                <div className="flex justify-center hidden">
                  <div className={`search-bar-top explore-search max-w-xl mx-auto mb-4 px-3 relative w-full`}>
                    <SearchTopics options={flattendTopicList} />
                  </div>
                </div>
                <div className="lg:flex pt-3">
                  <div className="w-full">
                    <h3 className="text-black text-xl font-semibold mb-3 mt-4">Featured topics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
                      {flattendTopicList
                        .filter((item) => item.featured === "Yes")
                        .map((item, index) => {
                          return (
                            <div key={index} className="rounded-2xl overflow-hidden shadow-lg featured-topic" onClick={() => handleNavigate(item?.route)}>
                              <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
                                <div className="explore-overlay"></div>
                                <img className="object-cover w-full h-48" src={getCustomImageUrl("q=100", item.imageUrl)} alt="" />
                                <div className="absolute bottom-0 left-0 px-6 py-4 z-50 w-full">
                                  <h4 className="text-xl text-white font-semibold break-all cursor-pointer">{item.name}</h4>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="lg:flex pt-3">
                  <div className="w-full">
                    <h3 className="text-black text-xl font-semibold mb-3 mt-6">Browse our topic pages</h3>
                    <div className="w-full">
                      <OtherFeaturedTopic />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Explore;
