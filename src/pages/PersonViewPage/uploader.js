import React from 'react';

//Components
import ImageUploader from "../../components/ImageUploader";
import ImagePopper from '../../components/ImagePopper';

const Uploader = ({
    imgSrc,
    saveImageFile,
    setSelectedFile,
    selectedFile,
    onTargetClick,
    fileInputRef,
    imageLoading,
    photoMenu,
    handleSelect,
    selectShowImage,
    setCropState,
    ...props
}) => {

    const defaultClasses = {
        root: "upload-img",
        upload: "file-drop"
    }

    const customizeMenu = photoMenu && photoMenu.filter((e, idx) => {
        if (props.isOwner) return e;
        else if (idx === 0) return e;
    })

    if (imgSrc && !props.isPrivate) {
        return (
            <div className="cursor-pointer z-10">
                <ImagePopper
                    type="image"
                    imgSrc={imgSrc}
                    menu={customizeMenu}
                    handleMenu={handleSelect}
                    hideFooter={true}
                />
            </div>
        )
    }
    else if (props.isOwner && !props.isPrivate) {
        return (
            <ImageUploader
                saveImageFile={saveImageFile}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onTargetClick={onTargetClick}
                fileInputRef={fileInputRef}
                imageLoading={imageLoading}
                selectShowImage={selectShowImage}
                className={defaultClasses}
                setCropState={setCropState}
            />
        )
    } else {
        return (
            <img src={props.placeholderImg} alt={props.placeholderImg} />
        )
    }
}

export default Uploader;