import LayoutWidgetbtn from "./layoutWidgetbtn";
import Button from "./../../../../components/Button";
import ImageUploader from "./../../../../components/ImageUploader";
import { LAYOUT_ID, getFullWidthHeight, getImageProps } from "../../../../utils";
import ClassNames from "classnames";

const ImagePanel = ({
  getWidgetClass,
  get2ImgTxt,
  deleteImage,
  getSelectedFile,
  handleChangeFile,
  getCropButton,
  imageExist,
  imageExistView,
  imageExistWidget,
  selectedFile,
  setSelectedFile,
  fileInputRef,
  setImageCropper,
  cropImgChoose,
  layoutIdData,
  setCropImgChoose,
  formik,
  setValidSelectedFile,
  moveImages,
  ipadView,
  setMviewSaveBtn,
  MviewSaveBtn,
  MviewSaveBtnFile,
  setMviewSaveBtnFile,
  setValidSelectedFileObj,
  getSmallImgClass,
  icon, mobileCropImgClick, getImageUrl, getTwoImageLayout, widgetShape, handlChangeWidget
}) => {
  return <div className={ClassNames(`main-stroy-img   ${getWidgetClass(layoutIdData, selectedFile)}`, { "choose-img": cropImgChoose, "tw-d-none": ipadView, "tw-slide-to-bottom": selectedFile[0].twoImageSwich })}>
    {get2ImgTxt(cropImgChoose)}
    {imageExistView && (
      <div className="delete-button-mobile lg:hidden">
        <button onClick={() => deleteImage({ files: selectedFile, index: 0, setValidSelectedFile, setMviewSaveBtn, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile, setValidSelectedFileObj, formik })} type="button" className="bg-gray-1 bg-opacity-90 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 14L14 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 14L2 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    )}
    <div className="main-image-uploader-wrap">
      <label htmlFor="no-upload-photo" className="tw-file-label">
        {!imageExist && (
          <ImageUploader fileInputRef={fileInputRef.current} setSelectedFile={({ file }) => { getSelectedFile(file, formik, setSelectedFile) }} className={{ root: "image-uploader-wrap", upload: "md:flex" }}>
            <input type="file" multiple={false} accept="image/*" onChange={(event) => {
              event.stopPropagation()
              handleChangeFile(event, 0)
            }} className="tw-file-input" name="photo" id="no-upload-photo" />
            {icon}
          </ImageUploader>
        )}
      </label>
    </div>

    <div className="image-container relative">
      <div style={{ ...(layoutIdData !== LAYOUT_ID.TWO_IMAGE && selectedFile[0].calculate && getFullWidthHeight(selectedFile[0].calculate)) }} className={`single-img image-cont ${getSmallImgClass(layoutIdData, selectedFile[0])}`}>
        <div className="images-actions">
          {layoutIdData === LAYOUT_ID.TWO_IMAGE && selectedFile[0].mediaId && selectedFile[1].mediaId && (
            <div className="mx-1">
              <Button handleClick={() => moveImages(selectedFile, 0, 1, setValidSelectedFile, formik)} title="Move to bottom" type="secondary" fontWeight="medium" />
            </div>
          )}
          {selectedFile[0].mediaId && selectedFile[0].isCrop && getCropButton({ selectedFile, formik, setImageCropper, setCropImgChoose, prop: { title: "Crop", type: "secondary" }, layoutIdData })}
        </div>
        {imageExist && (
          <div className="delete-button-container">
            <button onClick={() => deleteImage({ files: selectedFile, index: 0, setValidSelectedFile, setMviewSaveBtn, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile, setValidSelectedFileObj, formik })} type="button" className="bg-gray-1 bg-opacity-90 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 14L14 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 14L2 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
        {imageExist && <img {...getImageProps(selectedFile[0], layoutIdData)} alt="img" onClick={() => mobileCropImgClick(setImageCropper, selectedFile, formik, cropImgChoose, setMviewSaveBtn, layoutIdData)} src={getImageUrl(selectedFile[0], layoutIdData)} />}
      </div>
      {getTwoImageLayout({ currentLayout: layoutIdData, selectedFile, setSelectedFile, handleChangeFile, fileInputRef, setImageCropper, setValidSelectedFile, cropImgChoose, formik, setMviewSaveBtn, layoutIdData, MviewSaveBtn, MviewSaveBtnFile, setMviewSaveBtnFile })}
    </div>
    {imageExistWidget && <LayoutWidgetbtn widgetShape={widgetShape} handleChange={handlChangeWidget} />}
    {imageExist && (
      <div className="swap-button-mobile lg:hidden">
        {!cropImgChoose && layoutIdData === LAYOUT_ID.TWO_IMAGE && selectedFile[1].mediaId && selectedFile[0].mediaId && (
          <div className="mx-1">
            <Button handleClick={() => moveImages(selectedFile, 1, 0, setValidSelectedFile, formik)} size="large" title="Swap Photo Placement" type="default" fontWeight="medium" />
          </div>
        )}
      </div>
    )}
    {imageExist && <div className="mobile-crop-button lg:hidden">{getCropButton({ selectedFile, formik, setImageCropper, setCropImgChoose, prop: { title: "Crop", type: "default", size: "large" }, layoutIdData, mobileView: true, cropImgChoose })}</div>}
  </div>
}
export default ImagePanel
