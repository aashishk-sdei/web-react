import React from 'react';

//Components
import HeroImageUploader from "../../components/HeroImageUploader";
import HeroImagePopover from '../../components/HeroImagePopover';

const HeroImage = ({
    imgSrc,
    saveImageFile,
    setSelectedHeroFile,
    selectedHeroFile,
    onTargetClick,
    heroImageRef,
    imageLoading,
    heroPhotoMenu,
    handleSelect,
    selectShowImage,
    setCropState,
    setMousePosition,
    dispatch,
    isImgURLValid,
    isTopicPage,
    ...props
}) => {
    const defaultClasses = {
        root: "upload-img",
        upload: "file-drop"
    }

    const customizeMenu = heroPhotoMenu && heroPhotoMenu.filter((e, idx) => {
        if (props.isOwner) return e;
        else if (idx === 0) return e;
    })

    return (
        <>
            {
                props.isPrivate ?
                    <div className="hero-placeholder" style={{ cursor: "default" }}>
                        <div class="upload-img" />
                    </div> : (
                        <>
                            {imgSrc ?
                                (
                                    <div className="cursor-pointer z-10">
                                        <HeroImagePopover
                                            type="image"
                                            imgSrc={imgSrc}
                                            menu={customizeMenu}
                                            handleMenu={handleSelect}
                                            getMousePosition={props.getMousePosition}
                                            mousePosition={props.mousePosition}
                                            setCompState={props.setCompState}
                                            setMousePosition={setMousePosition}
                                            dispatch={dispatch}
                                            isImgURLValid={isImgURLValid}
                                            isTopicPage={isTopicPage}
                                        />
                                    </div>
                                )
                                :
                                (
                                    <HeroImageUploader
                                        saveImageFile={saveImageFile}
                                        selectedHeroFile={selectedHeroFile}
                                        setSelectedHeroFile={setSelectedHeroFile}
                                        onTargetClick={onTargetClick}
                                        heroImageRef={heroImageRef}
                                        imageLoading={imageLoading}
                                        selectShowImage={selectShowImage}
                                        className={defaultClasses}
                                        setCropState={setCropState}
                                        isOwner={props.isOwner}
                                    />
                                )
                            }
                        </>
                    )
            }
        </>

    );
}

export default HeroImage;