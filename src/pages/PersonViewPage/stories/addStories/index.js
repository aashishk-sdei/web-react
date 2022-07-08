import React, { useState, useRef, useEffect, useMemo } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Title from "./title";
import Person from "./person";
import Category from "./category";
import "./index.css";
import ClassNames from "classnames";
import { getRecentTree, getOwner, isUserOwner } from "../../../../services";
import { getTreesListAsync } from "../../../../redux/actions/homepage";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import { v4 as uuidv4 } from "uuid";
import { getLocationGUIDGetName } from "../../../../redux/actions/ww1";
import { addStory, viewStory, editStory, publishedTitleByGUID, resetViewData, emptyViewState } from "../../../../redux/actions/story";
import { showFooter } from "../../../../redux/actions/layout"
import Error from "./../../../../components/Sidebar/Components/Error";
import TailwindModal from "./../../../../components/TailwindModal";
import ErrImg from "./../../../../assets/images/fileErr.svg";
import Loader from "./../../../../components/Loader";
import PermissionCard from "./../../../../components/PermissionCard";
import { refetchPersonBasicInfo } from "./../../../../redux/actions/person";
import { getMedia, getExternalMedia } from "./../../../../redux/actions/media";
import { getLayoutAspect, LAYOUT_ID, getWidgetOption, getImageSize, getScreen, getFieldName, getStoryRedirectUrl, decodeDataToURL, capitalFirst, getCustomImageUrl } from "../../../../utils";
import { onMediaLoaded } from "shared-logics";
import PrivacyToggle from "../../../../components/PrivacyToggle";
import UseWindowDimensions from "./../../../SearchPage/WindowDimensions";

const getValueField = (value) => {
  return value || "";
};

const handleCancel = ({ location, recordId, refType, treeId, primaryPersonId, history }) => {
  let url = getStoryRedirectUrl({ location, recordId, refType, treeId, primaryPersonId });
  if (history.length <= 4) {
    history.push(url);
  } else {
    history.goBack();
  }
};

const TitleVailed = (formikProp, currentLayout, file) => {
  let vaild = false;
  if (formikProp?.values?.title && formikProp?.values?.content) {
    vaild = true;
  }
  if (currentLayout === LAYOUT_ID.TWO_IMAGE && !file[1].mediaId) {
    vaild = false;
  }
  return vaild;
};
const getSaveButton = ({ location, recordId, treeId, primaryPersonId, formik, storyId, refType, history, isLoading }) => {
  const disableBool = !formik.dirty || formik.values?.storyCategories?.length <= 0;
  if (storyId && disableBool && formik.values?.status === "Published") {
    return (
      <Button
        size="large"
        fontWeight="medium"
        title={"Save"}
        disabled={formik.values?.storyCategories?.length <= 0}
        handleClick={() => {
          const url = getStoryRedirectUrl({ location, recordId, refType, treeId, primaryPersonId });
          history.push(url);
        }}
      />
    );
  } else {
    return (
      <Button
        disabled={formik.values?.storyCategories?.length <= 0 || formik.isSubmitting || isLoading}
        handleClick={() => {
          formik.setFieldValue("status", "Published");
          formik.handleSubmit();
        }}
        size="large"
        fontWeight="medium"
        title={(formik.isSubmitting || isLoading) && formik.values.status === "Published" ? "Saving.." : "Save"}
      />
    );
  }
};
const globalButtonVaild = (step, formik, currentLayout, file) => {
  let vaild = false;
  if (step === 0) {
    vaild = !TitleVailed(formik, currentLayout, file);
  } else if (step === 1) {
    vaild = formik?.values?.person?.length <= 0;
  }
  return vaild;
};
const handleGlobalNext = ({ setStep }) => {
  setStep((prev) => {
    if (prev === 0) {
      return 1;
    } else if (prev === 1) {
      return 2;
    }
  });
};
const getGlobalButton = ({ location, recordId, step, formik, setStep, treeId, primaryPersonId, storyId, refType, history, isLoading, selectedFile, MviewSaveBtn, layoutIdS }) => {
  const layoutIdData = MviewSaveBtn ? layoutIdS : formik.values.layoutId;
  let html = <Button disabled={globalButtonVaild(step, formik, layoutIdData, selectedFile)} handleClick={() => handleGlobalNext({ setStep })} fontWeight="medium" size="large" title="Next" />;
  if (step === 2) {
    html = getSaveButton({ location, recordId, treeId, primaryPersonId, formik, storyId, refType, history, isLoading });
  }
  return html;
};
const getTreeRedirect = (treeId, primaryPersonId) => {
  return !treeId && !primaryPersonId;
};
const getFileCurrent = (selectedFile, MviewSaveBtnFile, MviewSaveBtn) => {
  return MviewSaveBtn ? [...MviewSaveBtnFile] : [...selectedFile];
};

const getFilePath = (file) => (file.fromMedia ? getCustomImageUrl("q=100", file.url) : getCustomImageUrl("q=100", file.originatingMediaURL));
const fileMediaData = (formData, file, _index, values, orderNumber, currentIndex, name = "storyImages") => {
  if (file.mediaId) {
    formData.append(`${name}[${currentIndex}].OriginatingMediaId`, file.mediaId);
    formData.append(`${name}[${currentIndex}].mediaId`, file.mediaId);
    formData.append(`${name}[${currentIndex}].orderNumber`, orderNumber);
    file.file && formData.append(`${name}[${currentIndex}].media`, file.file);
    file.imageURL && formData.append(`${name}[${currentIndex}].url`, file.imageURL);
    currentIndex += 1;
    if (file.mediaObj[values.layoutId]) {
      file.mediaObj[values.layoutId].croppedImageURL && formData.append(`${name}[${currentIndex}].croppedImageURL`, file.mediaObj[values.layoutId].croppedImageURL);
    }
    if (file.mediaObj[values.layoutId]) {
      file.mediaObj[values.layoutId].file && formData.append(`${name}[${currentIndex}].media`, file.mediaObj[values.layoutId].file);
      !file.mediaObj[values.layoutId].file && formData.append(`${name}[${currentIndex}].url`, file.mediaObj[values.layoutId].url);
      formData.append(`${name}[${currentIndex}].OriginatingMediaId`, file.mediaObj[values.layoutId].OriginateMediaId);
      formData.append(`${name}[${currentIndex}].orderNumber`, orderNumber);
      formData.append(`${name}[${currentIndex}].mediaId`, file.mediaObj[values.layoutId].MediaId);
      formData.append(`${name}[${currentIndex}].croppingInfo.cropX`, file.mediaObj[values.layoutId].cropCordinates.x);
      formData.append(`${name}[${currentIndex}].croppingInfo.cropY`, file.mediaObj[values.layoutId].cropCordinates.y);
      formData.append(`${name}[${currentIndex}].croppingInfo.height`, file.mediaObj[values.layoutId].cropCordinates.height);
      formData.append(`${name}[${currentIndex}].croppingInfo.width`, file.mediaObj[values.layoutId].cropCordinates.width);
      formData.append(`${name}[${currentIndex}].croppingInfo.ZoomAspect`, file.mediaObj[values.layoutId].zoomLevel);
      currentIndex += 1;
    }
  }
  return currentIndex;
};
const peopleStory = (formData, _existingPeople, currentPeople) => {
  currentPeople.forEach((_person, index) => {
    formData.append(`NewPeopleInStory[${index}].ContributorId`, getOwner());
    formData.append(`NewPeopleInStory[${index}].PersonId`, _person.id);
  });
};
const categoryStory = (formData, _existingCategory, currentCategory) => {
  currentCategory.forEach((_category, index) => {
    formData.append(`NewStoryCategories[${index}]`, _category);
  });
};
const placeStory = (formData, current) => {
  formData.append(`NewLocationId`, current.id);
  formData.append(`NewLocation`, current.name);
};
const singleValueStory = (formData, current, name) => {
  formData.append(`${name}`, current);
};
const imagesStory = (formData, existingImages, currentImages, values) => {
  let currentIndex = 0,
    isDeleted = existingImages.filter(({ mediaId: id1 }) => !currentImages.some(({ mediaId: id2 }) => id2 === id1));
  currentImages.forEach((_image, index) => {
    currentIndex = fileMediaData(formData, _image, index, values, index + 1, currentIndex, "NewStoryImages");
  });
  isDeleted.forEach((element, index) => {
    formData.append(`${"RemovedImages"}[${index}].mediaId`, element.mediaId);
    formData.append(`${"RemovedImages"}[${index}].IsCropped`, element.mediaId !== element.originatingMediaId);
  });
};
const getPlaceId = (placeId) => {
  return placeId !== "00000000-0000-0000-0000-000000000000" ? placeId : "";
};
const storyCategoryAppend = (formData, values) => {
  if (values.storyCategories) {
    values.storyCategories.forEach((_category, index) => {
      formData.append(`storyCategories[${index}]`, _category);
    });
  } else {
    formData.append("storyCategories", []);
  }
};
const withRecordId = (recordId, values, formData, location, mediaId) => {
  const prefixName = "StoryExternalImages";
  if (mediaId && values?.mediaData?.storyImagePath) {
    formData.append("layoutId", LAYOUT_ID.FIT);
    formData.append(`${prefixName}[0].mediaId`, mediaId);
    formData.append(`${prefixName}[0].orderNumber`, 1);
    formData.append(`${prefixName}[0].PublicationTitleId`, values.mediaData.publicationTitleId);
  } else if (recordId) {
    const params = new URLSearchParams(location.search);
    const imgId = params.get("imgId");
    formData.append("layoutId", LAYOUT_ID.FIT);
    formData.append(`${prefixName}[0].PublicationTitleId`, localStorage.getItem("PublicationTitleId"));
    formData.append(`${prefixName}[0].ownerId`, getOwner());
    formData.append(`${prefixName}[0].mediaId`, uuidv4());
    formData.append(`${prefixName}[0].orderNumber`, 1);
    formData.append(`${prefixName}[0].fullImagePath`, localStorage.getItem("Clip"));
    formData.append(`${prefixName}[0].thumbnailImagePath`, localStorage.getItem("HighlightedThumb"));
    formData.append(`${prefixName}[0].storyImagePath`, localStorage.getItem("ClipThumbnail"));
    formData.append(`${prefixName}[0].redirectionPath`, `https://imgwrapper.storied.com/${recordId}?imageId=${imgId}`);
    formData.append(`${prefixName}[0].mediaSource`, "NAclipping");
  } else {
    formData.append("layoutId", values.layoutId || LAYOUT_ID.DEFAULT);
  }
};
const externalMediaImages = (formData, view) => {
  const prefixName = "StoryExternalImages";
  if (view.storyExternalImages?.[0]?.storyImagePath) {
    formData.append(`${prefixName}[0].mediaId`, view.storyExternalImages[0].mediaId);
    formData.append(`${prefixName}[0].orderNumber`, 1);
    formData.append(`${prefixName}[0].PublicationTitleId`, view.storyExternalImages[0].publicationTitleId);
  }
};
const appendPeopleInStory = (formData, values) => {
  if (values.person) {
    values.person.forEach((_person, index) => {
      formData.append(`peopleInStory[${index}].ContributorId`, getOwner());
      formData.append(`peopleInStory[${index}].PersonId`, _person.id);
    });
  } else {
    formData.append("peopleInStory", []);
  }
};
const handlesubmit = ({ values, files, props, mediaId, dispatch, history, treeId, personId, setSubmitting, storyId, view, refType, recordId, location }) => {
  let formData = new FormData();
  if (storyId) {
    formData.append("storyId", storyId);
    formData.append("authorId", view.authorId);
    formData.append("privacy", values.privacy);
    formData.append("status", values.status);
    values.person[0]?.id && formData.append("NewPrimaryPersonId", values.person[0]?.id);
    peopleStory(formData, view.personDetail, values.person);
    categoryStory(formData, view.storyCategories, values.storyCategories);
    placeStory(formData, values.place);
    singleValueStory(formData, values.title, "NewTitle");
    singleValueStory(formData, values.date, "NewDate");
    singleValueStory(formData, values.layoutId, "NewLayoutId");
    singleValueStory(formData, values.content, "NewContent");
    externalMediaImages(formData, view);
    imagesStory(formData, view.storyImages, files, values);
    dispatch(editStory(formData, history, treeId, personId, setSubmitting, { ref: refType, ActionProps: props, values, viewTree: values.viewTree }));
  } else {
    formData.append("privacy", values.privacy || "Public");
    formData.append("storyId", uuidv4());
    formData.append("title", values.title);
    formData.append("authorId", getOwner());
    formData.append("status", values.status);
    values.person[0]?.id && formData.append("PrimaryPersonId", values.person[0]?.id);
    if (values.place?.id) {
      formData.append("locationId", values.place.id);
      formData.append("location", values.place.name);
    } else if (values.place.name) {
      formData.append("location", values.place.name);
    }
    formData.append("date", values.date);
    formData.append("content", values.content);
    withRecordId(recordId, values, formData, location, mediaId);
    storyCategoryAppend(formData, values);
    appendPeopleInStory(formData, values);

    if (files) {
      let currentIndex = 0;
      files.forEach((file, index) => {
        currentIndex = fileMediaData(formData, file, index, values, index + 1, currentIndex);
      });
    } else {
      formData.append("storyImages", []);
    }
    let paramObj = {
      ref: refType,
    };
    if (recordId && !mediaId) {
      paramObj = {
        ref: 5,
        callback: () => {
          history.goBack()
        },
      };
    }
    dispatch(addStory({ data: formData, props, history, tree_id: treeId, person_id: personId, submit: setSubmitting, mediaId: mediaId, ...paramObj, viewTree: values.viewTree }));
  }
};
const getRecordId = (recordId, view, storyId) => {
  if (recordId) {
    return recordId;
  } else if (storyId && view?.storyExternalImages?.[0]?.storyImagePath) {
    return true;
  }
  return null;
};
const getWidget = ({ step, formik, selectedFile, setMviewSaveBtn, setSelectedFile, handleSaveImages, fileInputRef, setValidSelectedFile, MviewSaveBtn, ipadView, setIpadView, MviewSaveBtnFile, setMviewSaveBtnFile, layoutIdS, setLayoutIdS, setValidSelectedFileObj, treeProfileId, recordId, localImage, view, storyId }) => {
  switch (step) {
    case 1:
      return <Field treeProfileId={treeProfileId} component={Person} name="person" handleSaveImages={handleSaveImages} handleDraftSave={handleDraftSave} preFormik={formik} />;
    case 2:
      return <Category />;
    default:
      return <Title onMediaLoaded={onMediaLoaded} recordId={getRecordId(recordId, view, storyId)} MviewSaveBtn={MviewSaveBtn} ipadView={ipadView} setIpadView={setIpadView} setMviewSaveBtn={setMviewSaveBtn} setValidSelectedFile={setValidSelectedFile} layoutIdS={layoutIdS} setLayoutIdS={setLayoutIdS} selectedFile={MviewSaveBtn ? MviewSaveBtnFile : selectedFile} setSelectedFile={setSelectedFile} formik={formik} fileInputRef={fileInputRef} handleSaveImages={handleSaveImages} MviewSaveBtnFile={MviewSaveBtnFile} setMviewSaveBtnFile={setMviewSaveBtnFile} setValidSelectedFileObj={setValidSelectedFileObj} localImage={localImage} />;
    //getTitleComp({selectedFile,setSelectedFile,formik,setStep,fileInputRef, setValidSelectedFile, handleSaveImages})
  }
};

const backRedirect = ({ step, setStep, history, mediaId, refType }, { treeId, primaryPersonId }) => {
  switch (step) {
    case 1:
      setStep(0);
      break;
    case 2:
      setStep(1);
      break;
    default:
      let url = getTreeRedirect(treeId, primaryPersonId) ? "/" : `/family/person-page/${treeId}/${primaryPersonId}?tab=0`;
      if (refType === "1") {
        url = "/stories";
      } else if (refType === "4" && mediaId) {
        url = `/media/view-image/${mediaId}`;
      }
      history.push(url);
  }
};

const isLoadingFn = (storyId, isLoading, recordId) => {
  if (storyId || recordId) {
    return isLoading;
  }
  return false;
};
const getPersonDetail = (data, personalInfo, primaryPersonId) => {
  let personArr = data?.personDetail;
  if (primaryPersonId) {
    personArr = data?.personDetail?.map((_person) => {
      if (personalInfo?.id === _person.id) {
        _person["defaultPerson"] = true;
      }
      return _person;
    });
  }
  return personArr;
};
const setFileStatus = ({ setValidSelectedFile, _files, setIsLoading, lengthSto, index, _initialValues, setInitialValues }) => {
  if (lengthSto - 1 === index) {
    setValidSelectedFile(_files);
    setIsLoading(false);
    if (_initialValues.layoutId === LAYOUT_ID.TWO_IMAGE && _files.length === 0) {
      _initialValues.layoutId = LAYOUT_ID.DEFAULT;
    }
    setInitialValues(_initialValues);
  }
};
const loadImages = ({ selectedFile, data, setIsLoading, setValidSelectedFile, _initialValues, setInitialValues }) => {
  let _files = [...selectedFile];
  if (data?.url) {
    data.storyImages = [
      {
        croppingInfo: null,
        mediaId: data.originatingMediaId,
        orderNumber: 1,
        originatingMediaId: data.originatingMediaId,
        url: data.url,
        fromMedia: true,
      },
    ];
  }
  if (data?.storyImages?.length === 0) {
    setIsLoading(false);
    setInitialValues(_initialValues);
  }
  data?.storyImages?.forEach((file, index) => {
    let img = new Image();
    img.src = getFilePath(file);
    img.onerror = () => {
      setFileStatus({ setValidSelectedFile, _files, setIsLoading, lengthSto: data.storyImages.length, index, _initialValues, setInitialValues });
    };
    img.onload = () => {
      let layout = data.layoutId;
      let calculateImageSize = { calculate: {} };
      const { width, height, widthActual, heightActual } = getImageSize(img.naturalWidth, img.naturalHeight, layout, getScreen());
      calculateImageSize.calculate = {
        width: width,
        height: height,
        widthActual: widthActual,
        heightActual: heightActual,
      };
      if (file.url && file.croppingInfo) {
        let imgCrop = new Image();
        imgCrop.src = getCustomImageUrl("q=100", file.url);
        const { width: _width, height: _height, widthActual: _widthActual, heightActual: _heightActual } = getImageSize(imgCrop.naturalWidth, imgCrop.naturalHeight, layout, getScreen());
        imgCrop.onload = () => {
          calculateImageSize[layout] = {};
          calculateImageSize[layout].calculate = {
            width: _width,
            height: _height,
            widthActual: _widthActual,
            heightActual: _heightActual,
          };
        };
      }
      const { maxZoom, isCrop } = onMediaLoaded({ height: img.naturalHeight, width: img.naturalWidth }, layout, getLayoutAspect(layout));
      _files[index] = {
        maxZoom: maxZoom,
        isCrop: isCrop,
        file: null,
        url: img.src,
        ...calculateImageSize,
        imageURL: file.url,

        ...(file.url && file.croppingInfo ? { croppedImageURL: file.url } : {}),
        cropCordinates: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
        mediaObj: {
          ...(file.url && file.croppingInfo
            ? {
              [layout]: {
                url: file.url,
                file: null,
                zoomLevel: file.croppingInfo.zoomAspect,
                MediaId: file.mediaId,
                OriginateMediaId: file.originatingMediaId,
                cropCordinates: { x: file.croppingInfo.cropX, y: file.croppingInfo.cropY, height: file.croppingInfo.height, width: file.croppingInfo.width },
                //crop: { x: img.naturalWidth - (2 * file.croppingInfo.cropX + file.croppingInfo.width), y: img.naturalHeight - (2 * file.croppingInfo.cropY + file.croppingInfo.height) },
                crop: { x: file.croppingInfo.cropX, y: file.croppingInfo.cropY },
              },
            }
            : {}),
        },
        height: img.naturalHeight,
        width: img.naturalWidth,
        mediaId: file.mediaId,
      };
      setFileStatus({ setValidSelectedFile, _files, setIsLoading, lengthSto: data.storyImages.length, index, _initialValues, setInitialValues });
    };
  });
};
const setinitialDataState = ({ data, setInitialValues, selectedFile, setIsLoading, setValidSelectedFile }) => {
  let img = new Image();
  if (data.url) {
    img.src = data.url;
    img.onload = () => {
      let layout = setLayoutObj(null, img);
      data.layoutId = layout;
    };
  }
  const placeId = getPlaceId(data?.mediaMetaData?.locationId);
  let _initialValues = {
    storyId: uuidv4(),
    authorId: data.ownerId,
    title: data?.mediaMetaData?.title,
    placeId: placeId,
    date: getValueField(data?.mediaMetaData?.date?.rawDate),
    content: "",
    storyCategories: [],
    person: [],
    layoutId: data.layoutId,
    place: { id: placeId, name: getValueField(data?.mediaMetaData?.location) },
    privacy: "Public",
    mediaData: data,
  };
  setInitialValues(_initialValues);
  loadImages({ selectedFile, data, setIsLoading, setValidSelectedFile, _initialValues, setInitialValues });
};
const mediaLoad = ({ newspaper, mediaId, dispatch, setLocalImage, setInitialValues, selectedFile, setIsLoading, setValidSelectedFile }) => {
  if (newspaper) {
    dispatch(getExternalMedia(mediaId)).then((data) => {
      data.storyImages = [];
      setLocalImage(data.storyImagePath);
      setinitialDataState({ data, setInitialValues, selectedFile, setIsLoading, setValidSelectedFile });
    });
  } else {
    dispatch(getMedia(mediaId)).then((data) => {
      setinitialDataState({ data, setInitialValues, selectedFile, setIsLoading, setValidSelectedFile });
    });
  }
};
const setLocalImageNewspaper = (setLocalImage, data) => {
  if (data?.storyExternalImages?.length > 0) {
    setLocalImage(data.storyExternalImages?.[0].storyImagePath);
  }
};

const viewStoryProp = ({ newspaper, personalInfo, primaryPersonId, storyId, mediaId, dispatch, setInitialValues, setIsLoading, setValidSelectedFile, selectedFile, setLocalImage, recordId }) => {
  dispatch(resetViewData());
  !personalInfo && primaryPersonId && dispatch(refetchPersonBasicInfo(primaryPersonId));
  if (storyId && (personalInfo || !primaryPersonId)) {
    dispatch(viewStory({ storyId })).then(async (data) => {
      let publication_title = await publishedTitleByGUID(data?.storyExternalImages?.[0]?.publicationTitleId)
      const placeId = getPlaceId(data?.locationId);
      let _initialValues = {
        storyId: data?.storyId,
        authorId: data?.authorId,
        title: getValueField(data?.title),
        placeId: placeId,
        date: getValueField(data?.date),
        publisher_title: publication_title,
        content: getValueField(data?.content),
        layoutId: data?.layoutId,
        storyCategories: data?.storyCategories,
        person: getPersonDetail(data, personalInfo, primaryPersonId),
        place: { id: placeId, name: data?.location ? data.location : "" },
        privacy: data?.privacy,
        status: data?.status,
      };
      setLocalImageNewspaper(setLocalImage, data);
      setInitialValues(_initialValues);
      loadImages({ selectedFile, data, setIsLoading, setValidSelectedFile, _initialValues, setInitialValues });
    });
  } else if (mediaId && (personalInfo || !primaryPersonId)) {
    mediaLoad({ newspaper, mediaId, dispatch, setLocalImage, setInitialValues, selectedFile, setIsLoading, setValidSelectedFile });
  } else if ((!storyId || !mediaId) && !recordId) {
    setIsLoading(false);
  }
};
const setLayoutObj = (layout, img) => {
  if (!layout || layout === LAYOUT_ID.DEFAULT) {
    layout = getWidgetOption({ height: img.naturalHeight, width: img.naturalWidth });
    layout = LAYOUT_ID.FIT in layout ? LAYOUT_ID.FIT : LAYOUT_ID.FILL;
  }
  return layout;
};
const setSelectedFilefn = ({ file, index, currentLayout, formik, setShowErrorModal, setValidSelectedFile, erroModalmsgs, selectedFile }) => {
  if (file) {
    const acceptedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    var sizeInMb = file.size / 1024;
    var sizeLimit = 1024 * 10; // if you want 10 MB
    if (!acceptedImageTypes.includes(file["type"])) {
      erroModalmsgs.current.msg = "Invaild File Type";
      erroModalmsgs.current.desc = "The image you're trying to use must be smaller than 10 MB. Resize your image or choose a different one.";
      setShowErrorModal(true);
    } else if (sizeInMb > sizeLimit) {
      erroModalmsgs.current.msg = "Image Is Too Large";
      erroModalmsgs.current.desc = "Images must be JPGs or PNGs. Maximum file size: 10 MB";
      setShowErrorModal(true);
    } else {
      let img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let layout = currentLayout;
        layout = setLayoutObj(layout, img);
        formik.setFieldValue("imageChange", true);
        let calculateImageSize = { calculate: {} };
        const { width, height, widthActual, heightActual } = getImageSize(img.naturalWidth, img.naturalHeight, layout, getScreen());
        calculateImageSize.calculate = {
          width: width,
          height: height,
          widthActual: widthActual,
          heightActual: heightActual,
        };
        const { maxZoom, isCrop } = onMediaLoaded({ height: img.naturalHeight, width: img.naturalWidth }, layout, getLayoutAspect(layout));
        let obj = {
          maxZoom: maxZoom,
          isCrop: isCrop,
          file: file,
          url: img.src,
          ...calculateImageSize,
          cropCordinates: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
          mediaObj: {},
          height: img.naturalHeight,
          width: img.naturalWidth,
          mediaId: uuidv4(),
        };
        let objarray = [...selectedFile];
        objarray[index] = obj;
        setValidSelectedFile(objarray);
        formik.setFieldValue("layoutId", layout);
      };
    }
  }
};
const redirectToHome = async ({ treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading, setTreeId }) => {
  if (getTreeRedirect(treeId, primaryPersonId) && !treeIdUser && !primaryPersonIdUser) {
    setIsLoading(true);
    const trees = await getTreesListAsync(userProfileAccount.id);
    setIsLoading(false);
    if (trees.length) {
      setTreeId(trees[0].treeId);
    }
  }
};
const setMviewSaveBtnFileCond = (state, MviewSaveBtn, setMviewSaveBtnFile, selectedFile) => {
  !state && !MviewSaveBtn && setMviewSaveBtnFile(selectedFile);
};
const _handleValidate = (e, step) => {
  if (step !== 2 && e.key === "Enter") {
    e.preventDefault();
  }
};
const _setMviewSaveBtn = ({ data, layout, setLayoutIdS, setMviewSaveBtnFile, selectedFile, state, MviewSaveBtn }) => {
  if (data) {
    setLayoutIdS(layout);
    setMviewSaveBtnFileCond(state, MviewSaveBtn, setMviewSaveBtnFile, selectedFile);
  } else {
    setMviewSaveBtnFile([{}, {}]);
    setLayoutIdS(null);
  }
};
const _setValidSelectedFile = ({ MviewSaveBtn, setMviewSaveBtnFile, setValidSelectedFileObj, data }) => {
  if (MviewSaveBtn) {
    setMviewSaveBtnFile(data);
  } else {
    setValidSelectedFileObj(data);
  }
};
const getPermissionCond = (storyId, view) => {
  let PermissionCond = false;
  if (storyId && view?.authorId) {
    if (!isUserOwner(view.authorId)) {
      PermissionCond = true;
    }
  }
  return PermissionCond;
};
const scrollpage = () => {
  let storyDiv = document.querySelector(".create-story.story-page-wrap"),
    cord = storyDiv.getBoundingClientRect(),
    storyWraper = document.getElementById("create-story-header");
  if (cord.y > -31) {
    storyWraper.classList.remove("fixed");
    storyWraper.classList.add("absolute");
  } else {
    storyWraper.classList.remove("absolute");
    storyWraper.classList.add("fixed");
  }
};
const getDisabledDraft = (formik) => {
  let vaild = false,
    cond = formik.values.title || formik.values.content;
  if (!formik.dirty || !cond || formik?.status == "draftClick") {
    vaild = true;
  }
  return vaild;
};
const handleDraftSave = (formik, viewTree = false) => {
  formik.setStatus("draftClick");
  if (viewTree) {
    formik.setFieldValue("viewTree", viewTree);
  }
  formik.setFieldValue("status", "Draft");
  formik.handleSubmit();
};
const publisherTitle = async ({ location, recordId, initialValues, setInitialValues, setLocalImage, setIsLoading }) => {
  const isAdd = !initialValues.storyId;
  const urlParams = isAdd && decodeDataToURL(location.search);
  const locationId = localStorage.getItem("LocationId");
  let publication_title = "";
  let publication_date = "";
  let placeName = { id: "", name: "" };
  if (recordId) {
    setIsLoading(true);
    const image = localStorage.getItem("base64Image") ? localStorage.getItem("base64Image") : localStorage.getItem("ClipThumbnail");
    setLocalImage(image);
    let spiltName = recordId?.split("-");
    const dateParems = spiltName.splice(spiltName.length - 5, 5);
    if (localStorage.getItem("PublicationTitleId")) {
      publication_title = await publishedTitleByGUID(localStorage.getItem("PublicationTitleId"));
    }
    publication_date = `${dateParems[1]} ${capitalFirst(dateParems[0])}, ${dateParems[2]}`;
    if (isAdd) {
      let obj = {
        publisher_title: publication_title,
        date: publication_date,
      };
      if (locationId) {
        getLocationGUIDGetName(locationId).then((data) => {
          obj["place"] = { id: locationId, name: data };
          setInitialValues({
            ...initialValues,
            ...obj,
          });
          setIsLoading(false);
        });
      } else if (urlParams.loc) {
        placeName = { id: "", name: decodeURIComponent(urlParams.loc).replaceAll("+", " ") };
        setInitialValues({
          ...initialValues,
          ...obj,
          place: placeName,
        });
        setIsLoading(false);
      } else {
        setInitialValues({
          ...initialValues,
          ...obj,
        });
        setIsLoading(false);
      }
    }
  }
};
const getDraftButton = (formik) => {
  let html = null;
  if (formik.values.status !== "Published") {
    html = (
      <div className="save-draft-button">
        <Button disabled={getDisabledDraft(formik)} handleClick={() => handleDraftSave(formik)} size="large" title="Save as Draft" fontWeight="medium" type="primary-inverted" />
      </div>
    );
  }
  return html;
};
const AddStories = ({ newspaper }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { width: windowWidth } = UseWindowDimensions();
  const { view, isLoading: storySaveLoading } = useSelector((state) => state.story);
  const { userProfileAccount } = useSelector((state) => state.user);
  const { storyId, treeId, primaryPersonId, refType, mediaId, recordId } = useParams();
  const [localImage, setLocalImage] = useState(null);
  useEffect(() => {
    dispatch(showFooter(false))
    return () => {
      dispatch(showFooter())
      dispatch(emptyViewState());
    }
  }, [dispatch])
  useEffect(() => {
    const obj = getRecentTree();
    let treeIdUser = null;
    let primaryPersonIdUser = null;
    if (obj) {
      treeIdUser = obj.treeId;
      setTreeId(treeIdUser);
      primaryPersonIdUser = obj.primaryPersonId;
    }
    userProfileAccount && redirectToHome({ history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading, setTreeId, dispatch });
  }, [treeId, primaryPersonId, userProfileAccount]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [selectedFile, setValidSelectedFileObj] = useState([{}, {}]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const erroModalmsgs = useRef({ msg: "", desc: "" });
  const fileInputRef = useRef();
  const addPageCheck = useRef(false);
  const [treeProfileId, setTreeId] = useState(null);
  const [MviewSaveBtn, setMviewSaveBtnBool] = useState(false);
  const [MviewSaveBtnFile, setMviewSaveBtnFile] = useState([{}, {}]);
  const [layoutIdS, setLayoutIdS] = useState(null);
  const [ipadView, setIpadView] = useState(false);
  const defaultValue = useMemo(() => {
    return {
      storyId: storyId,
      authorId: "",
      title: "",
      placeId: "",
      date: "",
      content: "",
      layoutId: "",
      storyCategories: [],
      person: [],
      place: { id: "", name: "" },
      publisher_title: "",
      status: "",
      imageChange: false,
      cropVal: {},
      privacy: "",
    };
  }, []);
  const [initialValues, setInitialValues] = useState(defaultValue);
  useEffect(() => {
    publisherTitle({ location, recordId, initialValues: defaultValue, setInitialValues, setLocalImage, setIsLoading });
  }, [location, recordId, defaultValue]);
  const { personalInfo } = useSelector((state) => {
    return state.person;
  });
  useEffect(() => {
    viewStoryProp({ newspaper, personalInfo, primaryPersonId, storyId, mediaId, dispatch, setInitialValues, setIsLoading, setValidSelectedFile, selectedFile: [{}, {}], setLocalImage, recordId });
  }, [dispatch, personalInfo, primaryPersonId, storyId, mediaId, recordId]);
  const setMviewSaveBtn = (data, layout = null, state = false) => {
    _setMviewSaveBtn({ data, layout, setLayoutIdS, setMviewSaveBtnFile, selectedFile, state, MviewSaveBtn });
    setMviewSaveBtnBool(data);
  };
  const _handlesubmit = (values, props) => {
    handlesubmit({ refType, values, mediaId, props, files: selectedFile, dispatch, history, treeId, personId: primaryPersonId, setSubmitting: props.setSubmitting, storyId, view, recordId, location });
  };
  const setSelectedFile = (file, index, currentLayout, formik) => {
    setSelectedFilefn({ file, index, currentLayout, formik, setShowErrorModal, setValidSelectedFile, erroModalmsgs, selectedFile });
  };
  const setValidSelectedFile = (data) => {
    _setValidSelectedFile({ MviewSaveBtn, setMviewSaveBtnFile, setValidSelectedFileObj, data });
  };
  useEffect(() => {
    window.addEventListener("scroll", scrollpage);
    return () => {
      window.removeEventListener("scroll", scrollpage);
    };
  });

  const handleSaveImages = (file, fileurl, index, cropSettings, _layout, formik) => {
    let objarray = getFileCurrent(selectedFile, MviewSaveBtnFile, MviewSaveBtn);
    objarray[index].mediaObj[_layout] = {
      OriginateMediaId: objarray[index].mediaId,
      MediaId: cropSettings.MediaId || uuidv4(),
      url: fileurl,
      file: file,
      zoomLevel: cropSettings.zoomLevel,
      cropCordinates: cropSettings.cropCordinates,
      crop: cropSettings.crop,
      calculate: cropSettings.calculate,
    };

    formik.setFieldValue("cropVal", { zoomLevel: cropSettings.zoomLevel, cropCordinates: cropSettings.cropCordinates });
    if (MviewSaveBtn) {
      setMviewSaveBtnFile(objarray);
    } else {
      setValidSelectedFile(objarray);
      formik.setFieldValue("imageChange", true);
    }
  };

  const pageHtmml = () => {
    return getPermissionCond(storyId, view) ? (
      <PermissionCard />
    ) : (
      <Formik initialValues={initialValues} onSubmit={_handlesubmit} enableReinitialize={true}>
        {(formik) => {
          return (
            <>
              <div className={ClassNames("create-story story-page-wrap z-500")}>
                <div className="story-page-overlay fixed left-0 w-full h-20 bg-black opacity-60"></div>
                <div className="z-500 flex flex-col w-full h-full">
                  <div className="bg-white flex-auto mt-8 w-full h-full relative rounded-t-2xl">
                    <Form onSubmit={formik.handleSubmit} onKeyDown={(e) => _handleValidate(e, step)}>
                      <div id="create-story-header" className="create-story-header flex justify-between top-3 smm:top-6 px-4 smm:px-6 w-full z-40 absolute">
                        <div className="story-header-left-items">
                          <div className="flex items-center">
                            {(windowWidth > 547 || step === 0) && (
                              <button onClick={() => handleCancel({ location, recordId, refType, treeId, primaryPersonId, history })} type="button" className="bg-gray-1 rounded-lg px-3 py-3 hover:bg-gray-2 focus:outline-none focus:ring-2 focus:ring-inset">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13 0.999999L0.999999 13" stroke="#212122" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M0.999999 0.999999L13 13" stroke="#212122" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </button>
                            )}

                            {windowWidth < 548 && step > 0 && (
                              <button onClick={() => backRedirect({ location, recordId, step, mediaId, setStep, history, refType }, { treeId, primaryPersonId })} type="button" className="bg-gray-1 rounded-lg px-3 py-3 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M14.5 8L0.499999 8" stroke="#212122" stroke-linecap="round" stroke-linejoin="round" />
                                  <path d="M7.0332 1L0.49987 8L7.0332 15" stroke="#212122" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                              </button>
                            )}
                            <div className="ml-3 relative">
                              <Field name={getFieldName(ipadView, "privacy", "ModalPrivacy")} as={PrivacyToggle} formik={formik} />
                            </div>
                          </div>
                        </div>
                        <div className="story-header-left-items">
                          <div className="flex items-center">
                            {getDraftButton(formik)}

                            {step > 0 && windowWidth > 547 && (
                              <div className="ml-2 md:ml-4 prev-stp-btn">
                                <Button handleClick={() => backRedirect({ location, recordId, step, mediaId, setStep, history, refType }, { treeId, primaryPersonId })} size="large" title="Previous" fontWeight="medium" type="primary-inverted" />
                              </div>
                            )}

                            <div className="ml-2 md:ml-4">{getGlobalButton({ location, recordId, step, formik, setStep, treeId, primaryPersonId, storyId, refType, history, isLoading: storySaveLoading, selectedFile, MviewSaveBtn, layoutIdS })}</div>
                          </div>
                        </div>
                      </div>
                      <div className="relative main-wrapper mx-auto mt-16 smm:mt-32">
                        {addPageCheck.current && (
                          <div className="limit-reached-alert mx-auto absolute w-full z-40 -bottom-0">
                            <div className="w-full mx-auto limit-alert-box bg-white p-4 rounded-lg">
                              <div className="flex">
                                <Typography size={12} text="secondary">
                                  <span className="block">Short stories are much more likely to be shared and read in their entirety, but we know there is often more to say. Feel free to revise, or add a page.</span>
                                </Typography>
                                <div className="ml-3 whitespace-nowrap">
                                  <Button handleClick={() => alert("under developemnt")} title="Add page" type="danger" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="page-box-wrap flex w-full justify-center pb-6">{getWidget({ step, formik, selectedFile, setSelectedFile, handleSaveImages, fileInputRef, setValidSelectedFile, MviewSaveBtn, setMviewSaveBtn, ipadView, setIpadView, MviewSaveBtnFile, setMviewSaveBtnFile, layoutIdS, setLayoutIdS, setValidSelectedFileObj, treeProfileId, recordId, localImage, view, storyId })}</div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
              <TailwindModal title={""} showClose={true} classes="top-2/4 left-2/4 transform  -translate-y-2/4 -translate-x-2/4" innerClasses="max-w-errModal" content={<Error modalState={setShowErrorModal} imgs={ErrImg} msg={erroModalmsgs.current.msg} btnText="Change Image" desc={erroModalmsgs.current.desc} />} showModal={showErrorModal} setShowModal={setShowErrorModal} />
            </>
          );
        }}
      </Formik>
    );
  };
  return isLoadingFn(storyId, isLoading, recordId) ? <Loader /> : pageHtmml();
};

export default AddStories;
