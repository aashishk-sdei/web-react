import { Field, Form, Formik } from "formik";
import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.css";
import { assignTopicToStory, getAdminStoryAndUpdateList, removeTopicFromStory } from "../../redux/actions/topic";
import TopicLoader from "./TopicLoader";
import { getCustomImageUrl } from "../../utils";
import Typography from "../../components/Typography";
const TopicComponent = ({ story, storyIndex }) => {
  const storyRef = useRef(null);
  const ioRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const { topicList, isLoading } = useSelector((state) => state.topic);

  const loadMoreStory = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let storyId = typeof story === "string" ? story : story?.storyId;
        dispatch(getAdminStoryAndUpdateList({ storyId: storyId }));
        storyRef.current && ioRef.current.unobserve(storyRef.current);
      }
    });
  }, []);

  useEffect(() => {
    if (storyRef.current) {
      const topictopicoptions = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      ioRef.current = new IntersectionObserver(loadMoreStory, topictopicoptions);
      ioRef.current.observe(storyRef.current);
    }
    return () => {
      storyRef.current && ioRef.current.unobserve(storyRef.current);
    };
  }, [storyRef, loadMoreStory]);

  const selectedTopics = topicList.filter((element) => story?.topics?.includes(element.topicId));

  const getTopicDropDown = (data, dropdownLoading) => {
    let topicoptions = [];
    if (dropdownLoading) {
      topicoptions.push(
        <option value="" key={-1}>
          Loading..
        </option>
      );
    } else {
      topicoptions.push(
        <option selected hidden value="">
          Select
        </option>,
        <option value="" key={-1}>
          None
        </option>
      );
    }
    topicoptions = [
      ...topicoptions,
      ...data.map((_data, index) => (
        <option disabled={story?.topics?.includes(_data.topicId)} value={JSON.stringify(_data)} key={index}>
          {_data.name}
        </option>
      )),
    ];
    return topicoptions;
  };

  const getDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (imgSrc) => {
    return getCustomImageUrl("q=100", imgSrc);
  };

  const getOptionClass = (str) => { 
    return str ? 7 : 4;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{ tList: "" }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(false);
        if (values.tList) {
          const topicData = JSON.parse(values.tList);
          dispatch(assignTopicToStory(story, storyIndex, topicData, resetForm));
        }
      }}
      validate={(values) => {
        let error = {
          invalid: "Invalid",
        };
        if (values.tList === "") {
          error.invalid = "Invalid";
        } else {
          error = {};
        }

        return error;
      }}
    >
      {({ values, dirty, isSubmitting, isValid }) => (
        <>
          <div ref={storyRef}>
            {typeof story === "string" ? (
              <div>
                <TopicLoader />
              </div>
            ) : (
              <div className="bg-white w-full rounded-lg shadow-xl lg:flex mb-4 topic-flow admin-newtopic">
                <div className="w-full md:w-64 h-52 bg-gray-2 img-border relative">{story?.storyImages[0]?.url && <img onClick={() => history.push(`/stories/view/0/${story?.storyId}`)} src={getImageUrl(story?.storyImages[0].url)} />}</div>
                <div className="p-4 pl-6 w-full pt-3">
                  <h2 onClick={() => history.push(`/stories/view/0/${story?.storyId}`)} className="text-gray-7 text-2xl mb-1 cursor-pointer">
                    {story?.title}
                  </h2>
                  <div>
                    <span className="text-gray-5 text-sm mb-2">{getDate(story?.updatedDate)}</span>
                    {story?.location && <span className="px-1 text-gray-5">&#183;</span>}
                    <span className="text-gray-5 text-sm mb-2">{story?.location}</span>
                  </div>
                  <p className="text-gray-7 text-sm mt-2 mb-2 admin-text three-lines">{story?.content}</p>
                  <h5 className="text-gray-5 text-sm mb-0.5">Author: {story.author?.displayName}</h5>
                  <h5 className="text-gray-5 text-sm mb-0.5">Email: {story.author?.mail}</h5>
                </div>
                <div className="p-4 w-full md:w-2/6 mt-5 admintopic">
                  <Typography size={18} weight="medium"><span className="text-gray-7 mb-1">Topics(s)</span></Typography>
                  {selectedTopics?.map((topic, index) => (
                    <div className="text-gray-6 flex" key={index}>
                      <div>
                        <p className="text-gray-7 text-base">{topic.name}</p>
                      </div>
                      <div className="ml-auto">
                        <div onClick={() => dispatch(removeTopicFromStory({ storyId: story?.storyId, topicId: topic.topicId }, storyIndex))} className="cursor-pointer">
                          <svg className="mt-1" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 13L13 1" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 13L1 1" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Form className="w-full mt-3">
                    <div className="flex flex-wrap -mx-2 md:mb-2.5">
                      <div className={`w-full  px-2 mb-2.5`}>
                        <div className="relative">
                          <Field name={"tList"} className={`block appearance-none h-10 w-full border border-gray-3  tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-4 focus:border-transparent text-gray-${getOptionClass(values.tList)}`} id="dropdown" placeholder="Select" as="select">
                            {getTopicDropDown(topicList, isLoading)}
                          </Field>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-7">
                            <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <button className="disabled:opacity-50 bg-blue-4 active:bg-blue-5 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-1 sm:ml-2 mt-1 w-full sm:w-auto order-last" disabled={!dirty || isSubmitting || !isValid} type="submit">
                        Save
                      </button>
                    </div>
                  </Form>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </Formik>
  );
};

export default TopicComponent;
