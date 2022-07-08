export const handleResize = (profilediv, treeDiv, clueValue, setScreenDropDown, treeFamily, profile, recordId) => {
    if (profilediv.current && treeDiv.current) {
        const totalHeight = window.innerHeight,
        profileObj = Object.keys(profile).filter(function(key) {
            return profile[key];
          }),
        profileHeight = profileObj.length > 6 && recordId ? 50 : 0;
        profilediv.current.style.maxHeight = (totalHeight - profileHeight - (clueValue ? 340 : 305) - (treeFamily!==null?50:0)) + "px";
        const topOffset = treeDiv.current.getBoundingClientRect().top;
        if (topOffset + 150 >= totalHeight) {
          setScreenDropDown("top");
        }
    }
}  

export const handleIframeClick = (e) => (setSaveButton) => {
    if (e.origin !== 'https://imgwrapper.storied.com') return;
    setSaveButton(e.data.AdjustVisible === 'false')
}

export const getSidebarTypeClass = (type) => {
    return type === 'ssdi' 
}

export const getFirstIndexClass = (indexKey) => {
    return indexKey !== 0;
}

export const getScreenDropDownClass = (screenDropDown) => {
    return screenDropDown === "top";
}

export const personGetTextBold = (compare,Item,val) => {
    return compare&& Item.restrict && Item.field.includes(val);
}
export const handleIframeMessage = (e) => (setOpenEmailModal, setOpenShareModal, setHideIframeFun, setStartClipping, posturl, actionObj) => {
    if (e.origin !== 'https://imgwrapper.storied.com') return;
    let data = e.data;
    if(data.StartClipping) {
        data.StartClipping === 'true' ?setTimeout(()=>setStartClipping(true), 170): setStartClipping(false)
    } else if(data.StartStory) {
        localStorage.setItem("ClipThumbnail", data.ClipWB);
        localStorage.setItem("Clip", data.Clip);
        localStorage.setItem("HighlightedThumb", data.HighlightedThumb);
        localStorage.setItem("PublicationTitleId", data.PublicationTitleId);
        localStorage.setItem("LocationId", data.LocationId);
        if(data.ImageBase64) {
            localStorage.setItem("base64Image", data.ImageBase64);
        } else {
            localStorage.removeItem("base64Image")
        }
        setHideIframeFun(data.Cords) 
    } else if(data.ShareTo) {
        if(data.ShareTo === 'Email') { 
            setOpenEmailModal(data.ShareTo === 'Email');
        } else if(data.ShareTo === 'Facebook') {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(posturl)}`)
        } else if (data.ShareTo === 'Twitter') {
            setOpenShareModal(data.ShareTo)
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(posturl)}&via=NewspaperArchive`)
        }
    } else if(data.NAUserId) {
        localStorage.setItem("NAUserId", data.NAUserId);
    } else if(data.PageChanged === "true") {
        const spiltName = actionObj.recordId.split('-')
        spiltName.splice(spiltName.length - 1, 1)
        let recordId = `${spiltName.join("-")}-${data.ChangedPageNo}`
        const params = new URLSearchParams(actionObj.search);
        params.delete('imgId');
        actionObj.history.replace({ pathname: `/search/newspaper/${recordId}`, search:  `?${params.toString().replaceAll("+", " ")}&imgId=${data.ImageId}`})
    }
}