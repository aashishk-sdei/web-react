import React, { useState } from "react";
import { FileDrop } from "react-file-drop";
import "./index.css";
import Translator from "../Translator";
// Components
import Icon from "../Icon";

const defaultClasses = {
  root: "upload-img",
  upload: "file-drop"
}
const ImageUploader = ({
  selectShowImage,
  selectedFile,
  setSelectedFile,
  imageLoading,
  children,
  setCropState,
  className = defaultClasses }) => {
  const _className = Object.assign(defaultClasses, className)
  const [iconColor, setIconColor] = useState("default");

  const fileSelector = document.createElement('input');
  fileSelector.setAttribute('type', 'file');
  fileSelector.accept = 'image/*';
  fileSelector.addEventListener("change", handleFiles, false);

  function handleFiles() {
    const fileList = this.files;
    const file = fileList[0]; /* now you can work with the file list */
    setCropState && setCropState('create');
    setSelectedFile({
      ...selectedFile,
      file: file
    });
    selectShowImage && selectShowImage();
  }

  // Select/Drag/Drop Image
  const handleDrop = (files) => {
    handleFile(files);
  };

  const handleFile = (files) => {
    if (files[0] && files[0].name !== undefined) {
      const file = files[0];
      setCropState && setCropState('create');
      setSelectedFile({
        ...selectedFile,
        file: file
      });
      selectShowImage && selectShowImage();
    }
  }

  const handleMouseOver = () => {
    setIconColor("primary");
  }

  const handleMouseLeave = () => {
    setIconColor("default");
  }

  const onTargetClick = (e) => {
    e.preventDefault()
    fileSelector.click();
  }

  return (
    <div className={_className.root} onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave}>
      <FileDrop className={_className.upload} onDrop={handleDrop} onTargetClick={onTargetClick}>
        {children ? children : <><div className="add-photo-uploader">
          <div>
            <Icon type="addPhoto" size="large" color={iconColor} />
          </div>
          <div className="addPhoto-txt">
            {((selectedFile && selectedFile.file === null) || selectedFile === null) && !imageLoading && <Translator tkey="person.header.imgupload" />}
            {imageLoading && "Loading..."}
          </div>
        </div>
        </>}
      </FileDrop>
    </div>
  );
};

export default ImageUploader;
