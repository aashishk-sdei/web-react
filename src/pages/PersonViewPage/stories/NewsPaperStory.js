import React, { useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Field, Formik } from "formik";
import Title from "./NewsPaperStories/title";
import Button from "../../../components/Button";
import Category from "./addStories/category";
import Person from "./addStories/person";
import { getRecentTree, getOwner } from "../../../services";
import { v4 as uuidv4 } from "uuid";
import { addStory } from "../../../redux/actions/story";
import { getTreesListAsync } from "../../../redux/actions/homepage";
import { capitalFirst, decodeDataToURL, LAYOUT_ID } from "../../../utils";
import { NEWSPAPER_URL, IMAGEPATH } from "../../../utils/constant";

const getTreeRedirect = (treeId, primaryPersonId) => {
  return !treeId && !primaryPersonId;
};

const handleSubmit = ({ dispatch, history, recordId, location }, values, { setSubmitting }) => {
  const params = new URLSearchParams(location.search);
  const imgId = params.get("imgId");
  const cords = params.get("cords");
  let formData = new FormData();
  formData.append("privacy", values.privacy || "Public");
  formData.append("authorId", getOwner());
  if (values.place?.id) {
    formData.append("locationId", values.place.id);
    formData.append("location", values.place.name);
  } else if (values.place.name) {
    formData.append("location", values.place.name);
  }
  values.person[0]?.id && formData.append("PrimaryPersonId", values.person[0]?.id);
  formData.append("storyId", uuidv4());
  formData.append("title", values.title);
  formData.append("date", values.date);
  formData.append("content", values.content);
  formData.append("layoutId", LAYOUT_ID.FIT);
  if (values.storyCategories) {
    values.storyCategories.forEach((_category, index) => {
      formData.append(`storyCategories[${index}]`, _category);
    });
  } else {
    formData.append("storyCategories", []);
  }
  if (values.person) {
    values.person.forEach((_person, index) => {
      formData.append(`peopleInStory[${index}].ContributorId`, getOwner());
      formData.append(`peopleInStory[${index}].PersonId`, _person.id);
    });
  } else {
    formData.append("peopleInStory", []);
  }
  const prefixName = "StoryExternalImages";
  formData.append(`${prefixName}[0].ownerId`, getOwner());
  formData.append(`${prefixName}[0].mediaId`, uuidv4());
  formData.append(`${prefixName}[0].orderNumber`, 1);
  formData.append(`${prefixName}[0].fullImagePath`, localStorage.getItem("Clip"));
  formData.append(`${prefixName}[0].thumbnailImagePath`, localStorage.getItem("HighlightedThumb"));
  formData.append(`${prefixName}[0].storyImagePath`, localStorage.getItem("ClipThumbnail"));
  formData.append(`${prefixName}[0].redirectionPath`, `https://imgwrapper.storied.com/${recordId}?cords=${cords}&imageId=${imgId}`);
  formData.append(`${prefixName}[0].mediaSource`, "NAclipping");
  dispatch(
    addStory({
      data: formData,
      history,
      submit: setSubmitting,
      ref: 5,
      callback: () => {
        history.push(`/search/newspaper/${recordId}${location.search}`);
      },
    })
  );
};

const TitleVailed = (formikProp) => {
  let vaild = false;
  if (formikProp?.values?.title && formikProp?.values?.content) {
    vaild = true;
  }
  if (formikProp?.values?.content.length > 500) {
    vaild = false;
  }
  return vaild;
};

const getWidget = ({ step, setStep, formik, treeProfileId, urlImage, localImage }) => {
  switch (step) {
    case 1:
      return (
        <div className="md:p-0 pl-4 pr-4 w-full flex justify-center">
          <Field treeProfileId={treeProfileId} component={Person} setStep={setStep} name="person" />
        </div>
      );
    case 2:
      return (
        <div className="md:p-0 pl-4 pr-4 w-full flex justify-center">
          <Category setStep={setStep} formik={formik} />
        </div>
      );
    default:
      return <Title formik={formik} setStep={setStep} TitleVailed={TitleVailed} urlImage={urlImage} localImage={localImage} />;
  }
};

const redirectToHomeFunc = async ({ treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading, setTreeId }) => {
  if (getTreeRedirect(treeId, primaryPersonId) && !treeIdUser && !primaryPersonIdUser) {
    setIsLoading(true);
    const trees = await getTreesListAsync(userProfileAccount.id);
    setIsLoading(false);
    if (trees.length) {
      setTreeId(trees[0].treeId);
    }
  }
};

const backRedirect = ({ location, step, setStep, history, recordId }) => {
  switch (step) {
    case 0:
      const params = new URLSearchParams(location.search);
      const cords = params.get("cords");
      params.delete("cords");
      localStorage.setItem("Cords", cords || "");
      history.action === "POP" ? history.push(`/search/newspaper/${recordId}?${params.toString().replaceAll("+", " ")}`) : history.goBack();
      break;
    case 1:
      setStep(0);
      break;
    case 2:
      setStep(1);
      break;
    default:
      break;
  }
};

const PublisherTitle = () => {
  let { recordId } = useParams();
  let spiltName = recordId?.split("-");
  const dateParems = spiltName.splice(spiltName.length - 5, 5);
  const publication_title = spiltName.join(" ");
  const publication_date = `${dateParems[1]} ${capitalFirst(dateParems[0])}, ${dateParems[2]}`;
  return { publication_title, publication_date };
};

const NewsPaperStory = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const { recordId } = useParams();
  const urlParams = decodeDataToURL(location.search);
  const [step, setStep] = useState(0);
  const { userProfileAccount } = useSelector((state) => state.user);
  const [treeProfileId, setTreeId] = useState(null);
  const urlImage = urlParams.imgId ? `${NEWSPAPER_URL}${IMAGEPATH}${urlParams.imgId}` : "";
  const localImage = localStorage.getItem("ClipThumbnail");
  const treeId = null;
  const primaryPersonId = null;
  const { publication_title, publication_date } = PublisherTitle();
  const initialValues = {
    storyId: "",
    authorId: "",
    title: "",
    placeId: "",
    date: publication_date,
    content: "",
    layoutId: "",
    storyCategories: [],
    person: [],
    place: { id: "", name: decodeURIComponent(urlParams.loc).replaceAll("+", " ") ? decodeURIComponent(urlParams.loc).replaceAll("+", " ") : "" },
    imageChange: false,
    privacy: "",
    publisher_title: publication_title,
  };

  useEffect(() => {
    const obj = getRecentTree();
    let treeIdUser = null;
    let primaryPersonIdUser = null;
    if (obj) {
      treeIdUser = obj.treeId;
      setTreeId(treeIdUser);
      primaryPersonIdUser = obj.primaryPersonId;
    }
    userProfileAccount && redirectToHomeFunc({ history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading: undefined, setTreeId, dispatch });
  }, [treeId, primaryPersonId, userProfileAccount]);
  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit.bind(null, { dispatch, history, mediaId: null, recordId, location })} enableReinitialize={true}>
        {(formik) => {
          return (
            <>
              <div className="h-full page-wrap-bg-dk story-page-wrap newspaper-story">
                <div className="relative main-wrapper mx-auto md:pt-10 pt-2 px-0">
                  <div className="buton-wrap-top md:mt-2 fixed lg:absolute left-0 lg:left-4 top-0 lg:top-8 z-9999 bg-white lg:bg-transparent w-full lg:w-auto flex justify-between px-4 py-3 lg:p-0 shadow-md md:shadow-none">
                    <button onClick={() => backRedirect({ location, step, setStep, history, recordId })} type="button" className="bg-gray-1 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
                      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.5 8L1.5 8" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8.5 1L1.5 8L8.5 15" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {step === 0 && (
                      <div className="lg:hidden">
                        <Button disabled={!TitleVailed(formik)} handleClick={() => setStep(1)} size="large" title="Next" fontWeight="medium"/>
                      </div>
                    )}
                  </div>
                  <div className="page-box-wrap clip-story flex w-full justify-center">{getWidget({ step, setStep, formik, treeProfileId, urlImage, localImage })}</div>
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default NewsPaperStory;
