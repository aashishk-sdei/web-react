import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../../../components/Skeleton";
const levelType = {
    "countryName": 2,
    "stateName": 3,
    "cityName": 4,
    "publicationName": 5
}
const getLocationWidth = (obj, level, name, lengthCal, lengthCalLoaded, number, type) => {
    if (level >= number) {
        lengthCal++
        if (name) {
            lengthCalLoaded++
            obj[type] = {
                width: getTextWidth(name, getCanvasFont()),
                name: name
            }
        }
    }
    return {
        lengthCal,
        lengthCalLoaded,
        obj
    }
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}
function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
    const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
    const fontSize = getCssStyle(el, 'font-size') || '16px';
    const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

    return `${fontWeight} ${fontSize} ${fontFamily}`;
}
const BreadCrumb = ({
    getAllCountryLink,
    countryName,
    stateName,
    cityName,
    publicationName,
    level,
    cu,
    st,
    ci,
    pu,
    getCountryLink,
    getStateLink,
    getCityLink,
    getPublicationLink
}) => {
    const [selectedDrop, setSelectedDrop] = useState([])
    useEffect(() => {
        window.addEventListener("resize", handleResize, true);
        handleResize()
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [
        countryName,
        stateName,
        cityName,
        publicationName,
        cu,
        st,
        ci,
        pu
    ]);
    const getLink = (type) => {
        let fun = null
        let val = ""
        switch (type) {
            case "countryName":
                fun = getCountryLink
                val = countryName
                break;
            case "stateName":
                fun = getStateLink
                val = stateName
                break;
            case "cityName":
                fun = getCityLink
                val = cityName
                break;
            case "publicationName":
                fun = getPublicationLink
                val = publicationName
                break;
        }
        return { fun, val }
    }
    const handleResize = () => {
        const windoWidth = window.innerWidth
        if (windoWidth <= 767) {
            let lengthCal = 0
            let lengthCalLoaded = 0
            let obj = {}
            
            let resObj = getLocationWidth(obj, level, publicationName, lengthCal, lengthCalLoaded, 5, 'publicationName')
            lengthCal = resObj.lengthCal
            lengthCalLoaded = resObj.lengthCalLoaded
            obj = resObj.obj

            resObj = getLocationWidth(obj, level, cityName, lengthCal, lengthCalLoaded, 4, 'cityName')
            lengthCal = resObj.lengthCal
            lengthCalLoaded = resObj.lengthCalLoaded
            obj = resObj.obj

            resObj = getLocationWidth(obj, level, stateName, lengthCal, lengthCalLoaded, 3, 'stateName')
            lengthCal = resObj.lengthCal
            lengthCalLoaded = resObj.lengthCalLoaded
            obj = resObj.obj

            resObj = getLocationWidth(obj, level, countryName, lengthCal, lengthCalLoaded, 2, 'countryName')
            lengthCal = resObj.lengthCal
            lengthCalLoaded = resObj.lengthCalLoaded
            obj = resObj.obj          
            if (lengthCal === lengthCalLoaded && lengthCal > 1) {
                let inialLength = 72
                let _ob = []
                const objectEnties = Object.entries(obj)
                inialLength = inialLength + objectEnties[0][1].width
                objectEnties.splice(0, 1)
                objectEnties.forEach((value) => {
                    if ((windoWidth - 100) < (inialLength + value[1].width)) {
                        _ob.push({ ...value[1], type: value[0] })
                    } else {
                        inialLength = inialLength + value[1].width
                    }
                })
                _ob.reverse()
                setSelectedDrop(_ob)
            } else {
                setSelectedDrop([])
            }
        } else {
            setSelectedDrop([])
        }
    }
    const getBreadCrumb = (_level, name, link, typeName, arraySelectedDrop = []) => {
        if (arraySelectedDrop.includes(typeName)) return null
        const _nameHtml = name ? name : <><Skeleton width={20} /></>
        if (_level === level) {
            return <>
                <span className="whitespace-nowrap truncate">{_nameHtml}</span>
            </>
        } else {
            return <>
                <span><Link to={`/search/location${link}`} className="text-gray-5 whitespace-nowrap">{_nameHtml}</Link></span>
            </>
        }
    }
    const getBreadCrumbDrop = (_level, name, link) => {
        return <>
            <span><Link onClick={() => setOpenBread(false)} to={`/search/location${link}`} className="text-gray-5 whitespace-nowrap">{name}</Link></span>
        </>
    }
    const [openBread, setOpenBread] = useState(false);
    const getBreadCrumbLevel = () => {
        const arraySelectedDrop = selectedDrop.map((_name) => {
            return _name.type
        })
        return <>
            {level >= 2 && getBreadCrumb(2, countryName, getCountryLink(countryName), 'countryName', arraySelectedDrop)}
            {level >= 3 && getBreadCrumb(3, stateName, getStateLink(stateName), 'stateName', arraySelectedDrop)}
            {level >= 4 && getBreadCrumb(4, cityName, getCityLink(cityName), 'cityName', arraySelectedDrop)}
            {level >= 5 && getBreadCrumb(5, publicationName, getPublicationLink(publicationName), 'publicationName', arraySelectedDrop)}
        </>
    }
    return <>
        <div className="z-40 sticky md:relative top-16 md:top-auto">
            <div className="PubBreadcrumb shadow shadow-md md:shadow-none flex items-center overflow-hidden text-sm text-gray-7 bg-gray-1 md:bg-transparent px-5 md:py-0 py-2 md:mt-6 md:mb-3 mb-2">
                <span>
                    <Link to={`/search/location${getAllCountryLink()}`} className="text-gray-5 whitespace-nowrap">Browse All</Link>
                </span>
                {selectedDrop.length > 0 && <span className="dotIco md:hidden inlne-flex">
                    <div id="&quot;icon-&quot; + crypt" className="icon icon-medium icon-bgColor "
                        onClick={() => setOpenBread(true)}
                    >
                        <svg width="16" height="5" viewBox="0 0 16 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7422 4.25195C14.2063 4.25195 14.6514 4.06758 14.9796 3.73939C15.3078 3.4112 15.4922 2.96608 15.4922 2.50195C15.4922 2.03782 15.3078 1.59271 14.9796 1.26452C14.6514 0.936328 14.2063 0.751953 13.7422 0.751953C13.2781 0.751953 12.8329 0.936328 12.5048 1.26452C12.1766 1.59271 11.9922 2.03782 11.9922 2.50195C11.9922 2.96608 12.1766 3.4112 12.5048 3.73939C12.8329 4.06758 13.2781 4.25195 13.7422 4.25195Z" fill="#747578" />
                            <path d="M2.24219 4.25195C2.70632 4.25195 3.15144 4.06758 3.47962 3.73939C3.80781 3.4112 3.99219 2.96608 3.99219 2.50195C3.99219 2.03782 3.80781 1.59271 3.47962 1.26452C3.15144 0.936328 2.70632 0.751953 2.24219 0.751953C1.77806 0.751953 1.33294 0.936328 1.00475 1.26452C0.676562 1.59271 0.492188 2.03782 0.492188 2.50195C0.492188 2.96608 0.676562 3.4112 1.00475 3.73939C1.33294 4.06758 1.77806 4.25195 2.24219 4.25195Z" fill="#747578" />
                            <path d="M7.99219 4.25195C8.45632 4.25195 8.90144 4.06758 9.22962 3.73939C9.55781 3.4112 9.74219 2.96608 9.74219 2.50195C9.74219 2.03782 9.55781 1.59271 9.22962 1.26452C8.90144 0.936328 8.45632 0.751953 7.99219 0.751953C7.52806 0.751953 7.08294 0.936328 6.75475 1.26452C6.42656 1.59271 6.24219 2.03782 6.24219 2.50195C6.24219 2.96608 6.42656 3.4112 6.75475 3.73939C7.08294 4.06758 7.52806 4.25195 7.99219 4.25195Z" fill="#747578" />
                        </svg>
                    </div>
                </span>}
                {getBreadCrumbLevel()}
            </div>
            {selectedDrop.length > 0 && <div
                className={
                    (openBread? "block " : "hidden ") +
                    "md:hidden text-sm text-gray-7 z-50 py-2 max-w-xssl absolute left-0 right-0 md:ml-3 mx-auto text-left rounded shadow-lg bg-white"
                }
            >
                {selectedDrop.map((_objname, index) => {
                    const { fun, val } = getLink(_objname.type)
                    return val && <span key={index} className="py-2.5 px-4 block w-full whitespace-nowrap hover:bg-gray-1" >
                        {getBreadCrumbDrop(levelType[_objname.type], _objname.name, fun(val))}
                    </span>
                })}
            </div>}
        </div>
    </>
}
export default BreadCrumb