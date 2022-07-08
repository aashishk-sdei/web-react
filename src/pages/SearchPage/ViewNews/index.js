import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
    useHistory,
    useLocation,
    useParams
} from 'react-router-dom'
import { useTranslation } from "react-i18next"
import {
    handleIframeMessage,
} from "./../../../components/utils/sidebar";
import { showFooter } from "../../../redux/actions/layout"
import { tr } from "../../../components/utils";
import { capitalFirst, getEmailDefaultValue } from "../../../utils/index"
import TailwindModal from "../../../components/TailwindModal";
import Button from "../../../components/Button";
import SendEmail from "../EmailSend/SendEmail";
import PaymentModal from "../Newspaper/PaymentModal"
import { BUNDLE_PLAN_ID_HALF_YEARLY, BUNDLE_PLAN_ID_MONTHLY, BUNDLE_PLAN_ID_YEARLY, NEWSPAPER_URL } from "../../../utils/constant"
import { useDispatch, useSelector } from "react-redux";
import { getOwner, decodeJWTtoken, getSubscriptionDetails, getSubscription } from "../../../services";
import {
    userPayWallVaildation, newSubscriberCheck
} from "./../../../utils";
import { updateNewsPaperViewPageUrl } from '../../../redux/actions/homepage';
import { useFeatureFlag } from './../../../services/featureFlag'
const ViewNews = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { recordId } = useParams();
    const history = useHistory();
    const { t } = useTranslation();
    const iframeDiv = useRef(null)
    const user = useSelector((state) => state.user);
    const defaultValues = getEmailDefaultValue();
    const [searchTerm, setSearchTerm] = useState(false);
    const [viewCount, setViewCount] = useState(parseInt(localStorage.getItem("viewCount") || 0));
    const title = 'Email';
    const [getCords, setCords] = useState("");
    const [startClipping, setStartClipping] = useState(false);
    const [openEmailModal, setOpenEmailModal] = useState(false);
    const imgId = new URLSearchParams(location.search).get("imgId");
    const { enabled: paywallFeatureFlag } = useFeatureFlag('Paywall')
    const isUpgrade = useMemo(() => {
        let expireVaild;
        if (getSubscription()) {
            let subdata = getSubscriptionDetails();
            if (subdata?.endDate) {
                expireVaild = newSubscriberCheck(subdata);
            }
        } else {
            expireVaild = userPayWallVaildation(decodeJWTtoken(), paywallFeatureFlag)
        }
        const _bool = [BUNDLE_PLAN_ID_YEARLY, BUNDLE_PLAN_ID_HALF_YEARLY, BUNDLE_PLAN_ID_MONTHLY].includes(expireVaild)
        return (!expireVaild || (expireVaild && !_bool))
    }, [paywallFeatureFlag])
    const setOpenShareModal = () => {
        return null
    };
    let userDetail = `userfn=${user.userFirstName}&userln=${user.userLastName}&useremail=${user.userEmail}&userguid=${getOwner()}`
    if (localStorage.getItem("NAUserId")) {
        userDetail = `nauserid=${localStorage.getItem("NAUserId")}`
    }

    useEffect(() => {
        dispatch(showFooter(false))
        return () => {
            dispatch(showFooter())
        }
    }, [dispatch])

    useEffect(() => {
        if (imgId && recordId) {
            let pageurl = encodeURIComponent(`https://imgwrapper.storied.com/${recordId}?imageId=${imgId}`);
            isUpgrade && dispatch(updateNewsPaperViewPageUrl(pageurl, setOpenUpgradeModal, setViewCount));
        }
    }, [recordId, isUpgrade]);

    useEffect(() => {
        if (!recordId) {
            history.push('/')
        }
        if (location.search) {
            let spiltName = recordId.split('-')
            const dateSting = spiltName.splice(spiltName.length - 5, 5);
            spiltName = spiltName.map((_name) => {
                return capitalFirst(_name)
            })
            const _title = `${spiltName.join(" ")} Newspaper Archives, ${capitalFirst(dateSting[0])} ${dateSting[1]}, ${dateSting[2]} p. ${dateSting[4]}`
            document.head.querySelector('meta[property="og:title"]').setAttribute("content", _title);
            document.head.querySelector('meta[property="og:description"]').setAttribute("content", `Read ${_title} with family history and genealogy records from `);
            document.head.querySelector('meta[property="og:url"]').setAttribute("content", window.location.href);
            let str = location.search

            if (str[0] === "?") str = str.substring(1);
            let queryParam = str.split('&');
            let _searchTerm = queryParam.map((_param) => {
                const value = _param.split('=')
                if (["fn", "ln", "kd[0].t", "kd[1].t", "kd[2].t", "kd[3].t", "kd[4].t"].includes(value[0])) {
                    return value[1]
                }
                if (value[0] === "imgId") {
                    document.head.querySelector('meta[property="og:url"]').setAttribute("content", value[1])
                }
                return false;
            }).filter((_param) => _param).join(" ")
            setSearchTerm(_searchTerm)
        }
    }, [history, recordId, location.search])

    const setHideIframeFun = (cords) => {
        const params = new URLSearchParams(location.search);
        params.delete('cords');
        history.push(`/stories/add/newspaper/${recordId}?${params.toString().replaceAll("+", " ")}&cords=${cords}`)
    }
    const hanlde = () => {
        setOpenEmailModal(false)
    }
    useEffect(() => {
        const cords = localStorage.getItem("Cords");
        if (cords) {
            setCords(`?cords=${cords}`)
            localStorage.removeItem("Cords");
        }
        const handleIframeMessageEvent = (e) => {
            handleIframeMessage(e)(setOpenEmailModal, setOpenShareModal, setHideIframeFun, setStartClipping, `${NEWSPAPER_URL}/${recordId}`, {
                recordId: recordId,
                search: location.search,
                history: history
            });
        }
        window.addEventListener('message', handleIframeMessageEvent)
        return () => window.removeEventListener('message', handleIframeMessageEvent)
    }, [recordId])
    const handleSubmit = () => {
        setOpenEmailModal(false)
    }
    let array = new Uint8Array(1),
        crypt = window.crypto.getRandomValues(array);
    const iframe = useMemo(() => {
        return <iframe key={crypt} src={`https://imgwrapper.storied.com/${recordId}${!getCords && searchTerm ? "?searchterm=" + searchTerm : ""}${getCords ? getCords : ""}&${userDetail}&isproduction=${process.env.REACT_APP_ENV.toLowerCase() === 'Production'}&imageId=${imgId}`} height={"100%"} width={"100%"} title="Iframe Image"></iframe>
    }, [recordId, searchTerm])
    const [show1, setshow1] = useState(false);
    const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
    const roundprogress = "234";
    const allocatedviewCount = parseInt(localStorage.getItem("allocatedViews") || 10);
    const circularactive = roundprogress - (roundprogress * 10 * viewCount) / 100;
    const progressactive = (viewCount * 10) + '%';
    return <>
        <div ref={iframeDiv} className={`w-full transform transition scale-auto`}>
            <div className={`h-screen transition-all duration-500`}>
                <div className="pt-16 w-full h-screen">
                    {isUpgrade && <div className={`view-tracker sm:w-full sm:shadow-lg fixed sm:bottom-0 sm:right-8 ${show1 ? "bottom-0 right-0" : "bottom-3 right-2.5"}`} style={{ maxWidth: 425 }}>
                        <div onClick={() => setshow1(!show1)} className={`w-full rounded-full cursor-pointer`}>
                            <div className={`bg-white w-full px-8 flex items-center justify-between w-full py-6 sm:rounded-t-xl rounded-tl-xl overflow-hidden relative ${show1 ? "flex" : "hidden sm:flex"}`}>
                                <span className="defaultText secondary-color text-2xl typo-font-bold">{viewCount}/{allocatedviewCount} Pages Used</span>
                                <span>
                                    <svg className={`fill-stroke ${show1 ? "block" : "hidden"}`} width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 1.27667L11.4711 10.8047C11.4093 10.8666 11.3358 10.9157 11.255 10.9492C11.1742 10.9827 11.0875 11 11 11C10.9125 11 10.8258 10.9827 10.745 10.9492C10.6642 10.9157 10.5907 10.8666 10.5289 10.8047L1 1.27666" stroke="#747578" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg className={`fill-stroke ${show1 ? "hidden" : "block"}`} width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 10.7233L10.5289 1.19534C10.5907 1.13341 10.6642 1.08429 10.745 1.05077C10.8258 1.01725 10.9125 1 11 1C11.0875 1 11.1742 1.01725 11.255 1.05077C11.3358 1.08429 11.4093 1.13341 11.4711 1.19534L21 10.7233" stroke="#747578" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </span>
                                <div className={`absolute w-full left-0 ${!show1 ? " top-0" : "bottom-0 px-8"}`}>
                                    <div className={`overflow-hidden h-1 flex rounded w-full bg-blue-1`}>
                                        <div style={{ width: progressactive }} className="duration-1000 rounded bg-blue-4"></div>
                                    </div>
                                </div>
                            </div>
                            <div className={`rounded-full items-center justify-center sm:hidden ${show1 ? "hidden" : "flex"}`}>
                                <svg className="h-20 w-20 transform -rotate-90 rounded-full shadow z-500">
                                    <circle cx="40" cy="40" r="37" fill="none" stroke-width="7" stroke="#DAE3EF"></circle>
                                    <circle className="duration-1000" cx="40" cy="40" r="37" fill="none" stroke-width="7" stroke="#295DA1" strokeLinecap="round" strokeDashoffset={circularactive} strokeDasharray={roundprogress}></circle>
                                </svg>
                                <div className="absolute bg-white rounded-full  h-18 w-18 flex justify-center items-center">
                                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.5 5.7V19C22.5 19.557 22.2788 20.0911 21.8849 20.4849C21.4911 20.8788 20.957 21.1 20.4 21.1C19.843 21.1 19.3089 20.8788 18.9151 20.4849C18.5212 20.0911 18.3 19.557 18.3 19V2.9C18.3 2.5287 18.1525 2.1726 17.8899 1.91005C17.6274 1.6475 17.2713 1.5 16.9 1.5H2.9C2.5287 1.5 2.1726 1.6475 1.91005 1.91005C1.6475 2.1726 1.5 2.5287 1.5 2.9V19C1.5 19.557 1.72125 20.0911 2.11508 20.4849C2.5089 20.8788 3.04305 21.1 3.6 21.1H20.4" stroke="#113362" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5 14.1001H14.8" stroke="#113362" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5 16.8999H10.6" stroke="#113362" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5 5H14.8V10.6H5V5Z" stroke="#113362" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={`bg-white p-8 ${show1 ? "block" : "hidden"}`}>
                            <div className="mb-6">
                                <span className="text-gray-7 flex mb-6">Your current subscription includes 10 free newspaper views.</span>
                                <span className="text-gray-5">Upgrade your subscription for unlimited access to more than 250 million newspaper pages.</span>
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    size="large"
                                    title="Upgrade"
                                    handleClick={() => setOpenUpgradeModal(true)}
                                    fontWeight="medium"
                                />
                            </div>
                        </div>
                    </div>}
                    {iframe}
                </div>
            </div>
        </div>
        {startClipping && <div class="bg-black inline-flex items-center text-white h-16 w-full absolute top-0 left-0 px-4 opacity-30 z-500"></div>}
        <TailwindModal
            title={title}
            showClose={true}
            innerClasses={"max-w-src-modal-w"}
            titleFontWeight={"typo-font-medium"}
            modalWrap={"p-0"}
            modalHead={"pb-3.5 pt-6 px-6 absolute w-full top-0 left-0 md:px-10"}
            modalPadding={"pt-20 px-6 pb-10 md:px-10"}
            content={
                <SendEmail
                    defaultValues={defaultValues}
                    WWIIIClear={true}
                    buttonTitle={tr(t, "Send")}
                    handleNewspapperSubmit={handleSubmit}
                    clearfun={hanlde}
                />
            }
            showModal={openEmailModal}
            setShowModal={setOpenEmailModal}
        />
        <PaymentModal
            openUpgradeModal={openUpgradeModal}
            setOpenUpgradeModal={setOpenUpgradeModal}
        />
    </>
}

export default ViewNews;