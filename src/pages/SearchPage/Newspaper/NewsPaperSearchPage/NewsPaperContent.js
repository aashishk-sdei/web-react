import Typography from "./../../../../components/Typography";
import { useSelector } from "react-redux";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from "./../../../../components/Skeleton";
import { decodeJWTtoken, getSubscription, getSubscriptionDetails } from "./../../../../services";
import {useFeatureFlag} from './../../../../services/featureFlag'
import {
    userPayWallVaildation,
    newSubscriberCheck
} from "../../../../utils";
import { useHistory, useLocation } from "react-router-dom";
import {
    NEWSPAPER_URL,
    IMAGEPATH,
    BUNDLE_PLAN_ID_YEARLY,
    BUNDLE_PLAN_ID_HALF_YEARLY,
    BUNDLE_PLAN_ID_MONTHLY,
} from "../../../../utils/constant"
const getDate = (pubDate) => {
    const publicationDate = new Date(pubDate);
    let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(publicationDate);
    let mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(publicationDate);
    let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(publicationDate);
    return {
        ye,
        mo,
        da
    }
}
const generateImageUrl = (data) => {
    return `${NEWSPAPER_URL}${IMAGEPATH}${data.imageId}`
}
const getLocation = (location) => {
    let _loc = [];
    if (location.city) {
        _loc.push(location.city)
    }
    if (location.state) {
        _loc.push(location.state)
    }
    if (location.country) {
        _loc.push(location.country)
    }
    return _loc.join(', ')
}
const NewsPaperContent = ({ setOpenUpgradeModal }) => {
    const {
        list
    } = useSelector(state => state.publication)
    const {enabled:paywallFeatureFlag} =useFeatureFlag('Paywall')
    const location = useLocation();
    const history = useHistory();
    const getLink = (item) => {
        let expireVaild;
        if (getSubscription()) {
            let subdata = getSubscriptionDetails();
            if (subdata?.endDate) {
                expireVaild = newSubscriberCheck(subdata);
            }
        } else {
            expireVaild = userPayWallVaildation(decodeJWTtoken(),paywallFeatureFlag)
        }
        const viewCount = parseInt(localStorage.getItem("viewCount") || 0)
        const allocatedViews = parseInt(localStorage.getItem("allocatedViews") || 0)
        const _bool = [BUNDLE_PLAN_ID_YEARLY, BUNDLE_PLAN_ID_HALF_YEARLY, BUNDLE_PLAN_ID_MONTHLY].includes(expireVaild)
        if (_bool || (expireVaild && !_bool && viewCount < allocatedViews)) {
            const { ye, mo, da } = getDate(item.pubDate)
            const name = item.publicationTitle.toLowerCase().replace(/ /g, "-")
            history.push(`/search/newspaper/${name}-${mo.toLowerCase()}-${da}-${ye}-p-${item.pageNumber}${location.search}&imgId=${item.imageId}&loc=${getLocation(item.location)}`)
        } else {
            setOpenUpgradeModal(true)
        }
    }
    return <>
        {list.map((_list, index) => {
            const { ye, mo, da } = getDate(_list.pubDate)
            let array = new Uint8Array(1),
                crypt = window.crypto.getRandomValues(array);
            return <div key={index} onClick={getLink.bind(null, _list)} className="search-cards-wrap relative lg:mb-4">
                <div className={"lg:border-t-0 border-t border-gray-2 card sm:bg-white lg:rounded-xl md:shadow lg:p-1 sm:px-2 sm:py-3 px-3 py-6 cursor-pointer result-hover"}>
                    <div className="flex items-center">
                        <div className="listing-img w-full">
                            <div className="absolute lg:rounded-l-xl overflow-hidden"><Skeleton width={80} height={138} /></div>
                            <LazyLoadImage
                                key={crypt}
                                useIntersectionObserver={true}
                                threshold={10}
                                alt={"view records"}
                                effect="blur"
                                src={generateImageUrl(_list)}
                                index={index}
                                className="w-full lg:h-32 h-35 object-cover lg:rounded-l-xl"
                            />
                        </div>
                        <div className="content-block lg:flex items-center flex-grow md:px-6 pl-3">
                            <div className="head w-full mb-3 lg:mb-0 lg:mr-6 lg:pr-6 lg:border-r border-gray-3">
                                <h2 className="md:mb-1 break-words">
                                    <span className="text-2-line"><Typography size={14} text="secondary" weight="medium">
                                        {_list.publicationTitle}
                                    </Typography></span>
                                </h2>
                                <span className="lg:block text-sm text-gray-6">
                                    {`${da} ${mo} ${ye}`}
                                </span>
                                <span className="lg:block ml-1 lg:ml-0 text-sm text-gray-6">
                                    {getLocation(_list.location)}
                                </span>
                            </div>
                            <div className="search-detail w-full">
                                <Typography size={14} text="secondary">
                                    <span className="text-3-line" dangerouslySetInnerHTML={{ __html: _list.description }}>
                                    </span>
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        })
        }
    </>
}

export default NewsPaperContent;