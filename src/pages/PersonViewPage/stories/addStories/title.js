import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import ImageUploader from "./../../../../components/ImageUploader";
import ClassNames from "classnames";
import Textarea from "./../textArea";
import { Field } from "formik";
import SearchLocation from "./../../../../components/FWSearchLocation";
import { v4 as uuidv4 } from "uuid";
import ImageEdit from "../../../../components/ImageEdit";
import {
  getLayoutAspect, LAYOUT_ID, getWidgetOption, getImageSize,
  getScreen, getImageProps, getWindowWidth, getWidgetClass,
  getFieldName, getCustomImageUrl
} from "../../../../utils";
import ImagePanel from "./imagePanel";
import NewspaperImagePanel from "./newspaperImagePanel";

const TextAreaComp = (props) => {
  const [row, setRow] = useState(1);
  const getTextWidth = (text) => {
    let canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");
    context.font = "lyon-font-medium font-semibold";
    return context.measureText(text).actualBoundingBoxRight;
  };
  useEffect(() => {
    let textWidth = getTextWidth(props.field.value);
    if (textWidth > 115) {
      setRow(2);
    }
  }, []);

  const onTitleChange = (e) => {
    props.form.setFieldValue(props.field.name, e.target.value);
    let textWidth = getTextWidth(e.target.value);
    if (textWidth > 115) {
      setRow(2);
    } else {
      setRow(1);
    }
  };
  return <textarea {...props} rows={row} value={props.field.value} onChange={onTitleChange}></textarea>;
};
const icon = (
  <span className="file-cta">
    <span className="file-icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.00006 1H22.6425V23.4092H1.00006V1Z" fill="white" stroke="#9D9FA2" strokeLinejoin="round" />
        <path d="M3.59641 3.58496H20.045V18.2379H3.59641V3.58496Z" className="path-bg" fill="#D7D8D9" />
        <path d="M3.59641 3.58496H20.045V18.2379H3.59641V3.58496Z" stroke="#9D9FA2" strokeLinejoin="round" />
        <path d="M17.5172 18.2256C17.0579 16.931 16.2395 15.8162 15.1708 15.0295C14.1022 14.2427 12.834 13.8213 11.535 13.8213C10.236 13.8213 8.96786 14.2427 7.89922 15.0295C6.83058 15.8162 6.01216 16.931 5.55286 18.2256H17.5172Z" fill="white" stroke="#9D9FA2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8.64966" y="6.70117" width="5.89808" height="5.87235" rx="2.93618" fill="white" stroke="#9D9FA2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span className="file-label">Add Photo</span>
  </span>
);

const getClassImage = (_layoutClass, imageCropper) => {
  let obj = {};
  const classes = ["crop-top-img", "crop-bottom-img"];
  if (_layoutClass === "multiple-images" && imageCropper) {
    obj = { imageLayoutClass: classes[imageCropper.index] };
  }
  return obj;
};
const getCropSettings = (imageCropper, layoutId) => {
  let selectedFile = { ...imageCropper.selectedFile };
  if (selectedFile?.mediaObj?.[layoutId]) {
    let _layout = selectedFile.mediaObj[layoutId];
    selectedFile = {
      ...selectedFile,
      zoomLevel: _layout.zoomLevel,
      cropCordinates: _layout.cropCordinates,
      crop: _layout.crop,
    };
  } else {
    selectedFile = {
      ...selectedFile,
      zoomLevel: 1,
      cropCordinates: selectedFile.cropCordinates,
      crop: { x: 0, y: 0 },
    };
  }
  return { selectedFile: selectedFile, index: imageCropper.index };
};

const getSelectedFile = (file, formik, setSelectedFile) => {
  setSelectedFile(file, 0, false, formik);
};
const getImageUrl = (fileObj, layout) => {
  if (fileObj.mediaObj && fileObj.mediaObj[layout]) {
    if (!/https?:\/\//.test(fileObj.mediaObj[layout].url)) {
      return fileObj.mediaObj[layout].url;
    }
    return getCustomImageUrl("q=100", fileObj.mediaObj[layout].url);
  } else {
    return fileObj.url;
  }
};

const deleteImage = ({ files, index, setValidSelectedFile, setMviewSaveBtn, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile, setValidSelectedFileObj, formik }) => {
  let obj = MviewSaveBtn ? [...MviewSaveBtnFile] : [...files];
  if (index === 0) {
    obj[index] = obj[1];
    obj[1] = {};
  } else {
    obj[index] = {};
  }
  if (!obj[0].mediaId) {
    formik.setFieldValue("layoutId", LAYOUT_ID.DEFAULT);
  }
  if (!obj[0].mediaId && MviewSaveBtn) {
    setMviewSaveBtn(false);
    setValidSelectedFileObj && setValidSelectedFileObj([{}, {}]);
    setMviewSaveBtnFile([{}, {}]);
  } else {
    setValidSelectedFile(obj);
  }
};
const moveImages = (files, current, destination, setValidSelectedFile, formik) => {
  let sourceFile = files[current];
  let destinationFile = files[destination];
  let obj = { ...files };
  obj[current] = destinationFile;
  obj[destination] = sourceFile;
  setValidSelectedFile(Object.values(obj));
  formik.setFieldValue("imageChange", true);
};

const getTwoImageLayout = ({ currentLayout, selectedFile, setSelectedFile, handleChangeFile, fileInputRef, setImageCropper, setValidSelectedFile, cropImgChoose, formik, setMviewSaveBtn, layoutIdData, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile }) => {
  const getSelectedTwoFile = (file) => {
    setSelectedFile(file, 1, MviewSaveBtn ? layoutIdData : currentLayout, formik);
  };
  return currentLayout === LAYOUT_ID.TWO_IMAGE ? (
    <div className={`second-image image-cont relative ${getSmallImgClass(currentLayout, selectedFile[1])}`}>
      <div className="images-actions">
        {selectedFile[1].mediaId && selectedFile[0].mediaId && (
          <div className="mx-1">
            <Button handleClick={() => moveImages(selectedFile, 1, 0, setValidSelectedFile, formik)} title="Move to top" type="secondary" fontWeight="medium" />
          </div>
        )}
        {selectedFile[1].mediaId && selectedFile[1].isCrop && (
          <div className="mx-1">
            <Button handleClick={() => setImageCropper(getCropSettings({ selectedFile: selectedFile[1], index: 1 }, currentLayout))} title="Crop" type="secondary" fontWeight="medium" />
          </div>
        )}
      </div>
      {selectedFile[1].mediaId && (
        <>
          <div className="delete-button-container">
            <button onClick={() => deleteImage({ files: selectedFile, index: 1, setValidSelectedFile, setMviewSaveBtn, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile })} type="button" className="bg-gray-1 bg-opacity-90 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 14L14 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14L2 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <img {...getImageProps(selectedFile[1], layoutIdData)} onClick={() => mobileCropImgClick(setImageCropper, selectedFile, formik, cropImgChoose, setMviewSaveBtn, layoutIdData, 1)} src={getImageUrl(selectedFile[1], currentLayout)} alt="img" />{" "}
        </>
      )}
      {!selectedFile[1].mediaId && (
        <div className="tw-file-upload-full w-full h-full relative">
          <label htmlFor="add-photo" className="tw-file-label">
            <input type="file" multiple={false} accept="image/*" onChange={(event) => handleChangeFile(event, 1)} className="tw-file-input" id="add-photo" name="photo" />
            <ImageUploader fileInputRef={fileInputRef.current} setSelectedFile={({ file }) => getSelectedTwoFile(file)} className={{ root: "image-uploader-wrap", upload: "flex" }}>
              {icon}
            </ImageUploader>
          </label>
        </div>
      )}
    </div>
  ) : null;
};

const getSmallImgClass = (type, file) => {
  let str = "";
  if ((type === LAYOUT_ID.TWO_IMAGE && file?.height < 287) || file?.width < 400) {
    str += " sm-item";
  }
  return str;
};
const getCropButton = ({ selectedFile, _formik, setImageCropper, setCropImgChoose, prop, layoutIdData, mobileView = false, cropImgChoose = false }) => {
  const handleClick = () => {
    if (mobileView && layoutIdData === LAYOUT_ID.TWO_IMAGE && selectedFile[0].mediaId && selectedFile[1].mediaId && selectedFile[0].isCrop && selectedFile[1].isCrop) {
      setCropImgChoose(true);
    } else if (selectedFile[0].isCrop) {
      setImageCropper(getCropSettings({ selectedFile: selectedFile[0], index: 0 }, layoutIdData));
    } else if (selectedFile[1].isCrop) {
      setImageCropper(getCropSettings({ selectedFile: selectedFile[1], index: 1 }, layoutIdData));
    }
  };
  let html = null;
  if (cropImgChoose) {
    html = <Button handleClick={() => setCropImgChoose(false)} title="Cancel" size="large" type="default" />;
  } else if (selectedFile[0].isCrop || selectedFile[1].isCrop) {
    html = (
      <div className="mx-1">
        <Button handleClick={handleClick} fontWeight="medium" {...prop} />
      </div>
    );
  }
  return html;
};
const mobileCropImgClick = (setImageCropper, selectedFile, _formik, cropImgChoose, setMviewSaveBtn, layoutIdData, index = 0) => {
  if (cropImgChoose && selectedFile[0].mediaId && selectedFile[1].mediaId) {
    setImageCropper(getCropSettings({ selectedFile: selectedFile[index], index }, layoutIdData));
  }
  setMviewSaveBtn(getWindowWidth() <= 1023, layoutIdData);
};
const mobileViewClass = (selectedFile, MviewSaveBtn, ipadView) => {
  let str = "";
  if (selectedFile[0].mediaId || selectedFile[1].mediaId) {
    str = str + " has-image";
    if (MviewSaveBtn) {
      str = str + " add-story-view";
    }
  }
  if (ipadView) {
    str = str + " has-ipad-view";
  }
  return str;
};
const get2ImgTxt = (cropImgChoose) => (cropImgChoose ? <p className="text-white info">Which photo would you like to crop?</p> : null);
const handleResize = ({ currentState, selectedFile, formik, setValidSelectedFile, setCurrentState, ipadView, setIpadView }) => {
  const _currentState = getScreen();
  if (_currentState === "Desktop" && ipadView) {
    setIpadView(false);
  }
  if (_currentState !== currentState) {
    let obj = [...selectedFile];
    let objCurrent = obj.map((fileobj) => {
      const _file = { ...fileobj };
      if (_file.mediaId) {
        _file.calculate = {};
        const { width: calWidth, height: calHeight, widthActual, heightActual } = getImageSize(_file.width, _file.height, formik.values.layoutId, _currentState);
        _file.calculate = {
          width: calWidth,
          height: calHeight,
          widthActual: widthActual,
          heightActual: heightActual,
        };
      }
      return _file;
    });
    setValidSelectedFile(objCurrent);
    setCurrentState(_currentState);
  }
};

const setLayoutObj = (layoutRef, activeWidgetClass, MviewSaveBtn, setLayoutIdS, formik, obj) => {
  if (LAYOUT_ID.FIT in layoutRef.current) {
    obj = { ...obj, [LAYOUT_ID.FIT]: `${obj[LAYOUT_ID.FIT]} ${activeWidgetClass}` };
    MviewSaveBtn ? setLayoutIdS(LAYOUT_ID.FIT) : formik.setFieldValue("layoutId", LAYOUT_ID.FIT);
  } else {
    obj = { ...obj, [LAYOUT_ID.FILL]: `${obj[LAYOUT_ID.FILL]} ${activeWidgetClass}` };
    MviewSaveBtn ? setLayoutIdS(LAYOUT_ID.FILL) : formik.setFieldValue("layoutId", LAYOUT_ID.FILL);
  }
  return obj;
};
const getConditions = (selectedFile, MviewSaveBtn, MviewSaveBtnFile, recordId) => {
  const imageExist = selectedFile[0].mediaId || selectedFile[1].mediaId;
  const imageExistView = MviewSaveBtn && (MviewSaveBtnFile[0].mediaId || MviewSaveBtnFile[1].mediaId);
  const imageExistWidget = selectedFile[0].mediaId && !selectedFile[1].mediaId;
  const divVisible = getWindowWidth() >= 548 || selectedFile[0].mediaId || selectedFile[1].mediaId || recordId;
  return {
    imageExist,
    imageExistView,
    imageExistWidget,
    divVisible,
  };
};
const getTextField = (storyId, formik, ipadView) => {
  if (storyId) {
    if (formik.values.content) {
      return <Field name={getFieldName(ipadView, "content", "ModalContent")} as={Textarea} formik={formik} />
    }
  } else {
    return (
      <Field name={getFieldName(ipadView, "content", "ModalContent")} as={Textarea} formik={formik} />
    )
  }
}
const Title = ({ formik, selectedFile, MviewSaveBtn, setMviewSaveBtn, ipadView, setIpadView, setSelectedFile, handleSaveImages, fileInputRef, setValidSelectedFile, onMediaLoaded, layoutIdS, setLayoutIdS, MviewSaveBtnFile, setMviewSaveBtnFile, setValidSelectedFileObj, recordId, localImage }) => {
  const activeWidgetClass = "active";
  const [imageCropper, setImageCropper] = useState(false);
  const [currentState, setCurrentState] = useState(getScreen());
  const layoutRef = useRef({});
  const [cropImgChoose, setCropImgChoose] = useState(false);
  const [widgetShape, setWidgetShape] = useState(layoutRef.current);
  const layoutIdData = MviewSaveBtn ? layoutIdS : formik.values.layoutId;
  const { storyId } = useParams();
  const handleChangeFile = (event, index) => {
    const files = event.target.files;
    const file = files[0];
    setSelectedFile(file, index, layoutIdData, formik);
  };

  useEffect(() => {
    if (selectedFile[0].mediaId) {
      layoutRef.current = getWidgetOption(selectedFile[0]);
      let obj = { ...layoutRef.current };
      if (!layoutIdData) {
        obj = setLayoutObj(layoutRef, activeWidgetClass, MviewSaveBtn, setLayoutIdS, formik, obj);
      } else {
        obj = { ...obj, [layoutIdData]: `${obj[layoutIdData]} ${activeWidgetClass}` };
      }

      setWidgetShape(obj);
    }
  }, [selectedFile, formik]);
  useEffect(() => {
    window.addEventListener("resize", handleResize.bind(null, { currentState, selectedFile, formik, setValidSelectedFile, setCurrentState, ipadView, setIpadView }), false);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  }, [selectedFile, currentState, formik, setValidSelectedFile]);
  const handleSaveImagesTitle = (file, fileurl, index, settings) => {
    handleSaveImages(file, fileurl, index, settings, layoutIdData, formik);
    setImageCropper(false);
    setCropImgChoose(false);
  };

  const handlChangeWidget = (val) => {
    let twoImageSwich = false;
    if (layoutIdData === LAYOUT_ID.TWO_IMAGE) {
      twoImageSwich = true;
    }
    setWidgetShape({ ...layoutRef.current, [val]: `${layoutRef.current[val]} ${activeWidgetClass}` });
    MviewSaveBtn ? setLayoutIdS(val) : formik.setFieldValue("layoutId", val);
    let obj = [...selectedFile];
    let objCurrent = obj.map((fileobj) => {
      const _file = { ...fileobj };
      if (_file.mediaId) {
        const prop = onMediaLoaded(_file, val, getLayoutAspect(val));
        _file.maxZoom = prop.maxZoom;
        _file.isCrop = prop.isCrop;
        _file.twoImageSwich = twoImageSwich;
        _file.calculate = {};
        const { width, height, widthActual, heightActual } = getImageSize(_file.width, _file.height, val, currentState);
        _file.calculate = {
          width: width,
          height: height,
          widthActual: widthActual,
          heightActual: heightActual,
        };
      }
      return _file;
    });
    setValidSelectedFile(objCurrent);
  };



  const getHtml = () => {
    const { imageExist, imageExistView, imageExistWidget, divVisible } = getConditions(selectedFile, MviewSaveBtn, MviewSaveBtnFile, recordId);
    const imageHtml = recordId ? (
      <NewspaperImagePanel localImage={localImage} />
    ) : (
      <ImagePanel
        getWidgetClass={getWidgetClass}
        get2ImgTxt={get2ImgTxt}
        deleteImage={deleteImage}
        getSelectedFile={getSelectedFile}
        handleChangeFile={handleChangeFile}
        getCropButton={getCropButton}
        imageExist={imageExist}
        imageExistView={imageExistView}
        imageExistWidget={imageExistWidget}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef}
        setImageCropper={setImageCropper}
        cropImgChoose={cropImgChoose}
        layoutIdData={layoutIdData}
        setCropImgChoose={setCropImgChoose}
        formik={formik}
        setValidSelectedFile={setValidSelectedFile}
        moveImages={moveImages}
        {...{ ipadView, setMviewSaveBtn, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile, setValidSelectedFileObj, getSmallImgClass, icon, mobileCropImgClick, getImageUrl, getTwoImageLayout, widgetShape, handlChangeWidget }}
      />
    );
    return (
      <>
        {divVisible && imageHtml}
        <div className="story-body">
          <div className="story-content">
            <div className="story-title">
              <Field name={getFieldName(ipadView, "title", "ModalTitle")} component={TextAreaComp} maxLength="50" placeholder="Story Title" autoFocus className="lyon-font-medium font-semibold bg-transparent w-full focus:outline-none" />
            </div>
            <div>
              {recordId && (

                <div className="mb-1 relative location-field flex items-center">
                  <span className="mr-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                      <path d="M15 3.8V12.6667C15 13.038 14.8525 13.3941 14.5899 13.6566C14.3274 13.9192 13.9713 14.0667 13.6 14.0667C13.2287 14.0667 12.8726 13.9192 12.6101 13.6566C12.3475 13.3941 12.2 13.038 12.2 12.6667V1.93333C12.2 1.6858 12.1017 1.4484 11.9266 1.27337C11.7516 1.09833 11.5142 1 11.2667 1H1.93333C1.6858 1 1.4484 1.09833 1.27337 1.27337C1.09833 1.4484 1 1.6858 1 1.93333V12.6667C1 13.038 1.1475 13.3941 1.41005 13.6566C1.6726 13.9192 2.0287 14.0667 2.4 14.0667H13.6" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33337 9.40002H9.86671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33337 11.2667H7.06671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M3.33337 3.33331H9.86671V7.06665H3.33337V3.33331Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <Field name={"publisher_title"} readOnly className="leading-6 text-xs w-full bg-transparent text-gray-6 focus:outline-none capitalize" />
                </div>
              )}
              <div className="mb-1 relative">
                <Field
                  name={getFieldName(ipadView, "place", "ModalPlace")}
                  component={SearchLocation}
                  freeSolo={true}
                  popoverMt={25}
                  id={`locations-filter-${uuidv4()}`}
                  placeholder="Location"
                  highlight={true}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref} className="relative location-field">
                      <input {...params.inputProps} placeholder="Location" maxLength="50" className="text-xs w-full bg-transparent text-gray-5 focus:outline-none" />
                    </div>
                  )}
                />
              </div>
              <div className="date mb-6">
                <Field name={getFieldName(ipadView, "date", "ModalDate")} placeholder="Year or exact date" maxLength="50" className="text-xs text-gray-5 bg-transparent w-full focus:outline-none" />
              </div>
              <div className="story-description">
                {getTextField(storyId, formik, ipadView)}
              </div>
            </div>
            <div className="story-footer flex justify-between items-center flex-row-reverse smm:flex-row">
              {!selectedFile[0].mediaId && !recordId && (
                <div className="relative custom-file-upload add-img-mobile-btn add-img-btn w-full">
                  <label htmlFor="upload-photo" className="btn btn-default btn-large w-full justify-center text-blue-4 text-base cursor-pointer">
                    <span className="mr-2">
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V15C15 15.5523 14.5523 16 14 16H2C1.44772 16 1 15.5523 1 15V3Z" stroke="#295DA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4.49898 6.30769C4.44576 6.30784 4.39378 6.32375 4.3496 6.35342C4.30542 6.38309 4.27102 6.42518 4.25076 6.47439C4.23049 6.5236 4.22526 6.57771 4.23573 6.62989C4.2462 6.68207 4.2719 6.72997 4.30958 6.76755C4.34726 6.80513 4.39523 6.8307 4.44744 6.84103C4.49964 6.85136 4.55374 6.84599 4.60289 6.82559C4.65205 6.80519 4.69405 6.77069 4.72361 6.72643C4.75316 6.68217 4.76893 6.63014 4.76893 6.57692C4.76893 6.50552 4.74057 6.43704 4.69007 6.38655C4.63958 6.33606 4.5711 6.30769 4.4997 6.30769" stroke="#295DA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12.8457 12.7692L10.0672 8.57928C10.0185 8.50647 9.95269 8.44668 9.87556 8.40509C9.79844 8.36351 9.71232 8.34141 9.62471 8.3407C9.53709 8.33999 9.45063 8.3607 9.37285 8.40103C9.29506 8.44136 9.22831 8.50009 9.1784 8.5721L7.74609 10.6183L6.85799 9.9082C6.7997 9.86165 6.73237 9.82773 6.66027 9.80857C6.58817 9.78941 6.51288 9.78545 6.43917 9.79692C6.36545 9.8084 6.29493 9.83506 6.23207 9.87523C6.16921 9.9154 6.11538 9.96819 6.07399 10.0303L4.24609 12.7692H12.8457Z" stroke="#295DA1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <Typography text="primary" weight="medium">
                      Add an image
                    </Typography>
                  </label>
                  <input type="file" multiple={false} accept="image/*" onChange={(event) => handleChangeFile(event, 0)} className="opacity-0 absolute hidden" name="photo" id="upload-photo" />
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  const _layoutClass = getWidgetClass(layoutIdData);
  return (
    <>
      <div className={ClassNames(`${mobileViewClass(selectedFile, MviewSaveBtn, ipadView)}`, { "story-box relative": true })}>
        <div className={ClassNames("my-story-area")}>{getHtml()}</div>
      </div>
      <ImageEdit imageCropper={imageCropper} layout={_layoutClass} {...getClassImage(_layoutClass, imageCropper)} getStep={(minvalue) => Math.round(minvalue * 20) / 100} cropSize={getLayoutAspect(layoutIdData)} layoutId={layoutIdData} setImageCropper={setImageCropper} handleSaveImages={handleSaveImagesTitle} imageLoading={false} />
    </>
  );
};
export default Title;
