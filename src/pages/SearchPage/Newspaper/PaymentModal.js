import React, {useMemo} from 'react';
import TailwindModal from "../../../components/TailwindModal";
import Banner from "../../../assets/images/museums-victoria.jpg";
import Button from "../../../components/Button";
import { useHistory } from "react-router-dom";
import { decodeJWTtoken, getSubscription, getSubscriptionDetails } from '../../../services';
import { userPayWallDetail } from './../../../utils'
const PaymentModal = ({openUpgradeModal, setOpenUpgradeModal, canClose = false}) => {
    const expirypaywall = useMemo(() => {
        if (getSubscription()) {
            let subdata = getSubscriptionDetails();
            if (subdata?.endDate) {
                let expireDate = new Date(subdata.endDate).getTime(),
                today = new Date().getTime();
                if (expireDate > today) {
                    return subdata
                }
            }
        } else {
            let subdata = userPayWallDetail(decodeJWTtoken());
            if( subdata ) {
              return subdata
            } 
        }
    }, [])
    const text = expirypaywall?"Upgrade to unlock access":"Subscribe to unlock access"
    const history = useHistory();
    return <TailwindModal
    title={text}
    subTitle="Get Storied Ultimate and unlock access starting at $12.49/mo."
    showClose={canClose}
    clickAwayClose = {canClose}
    innerClasses={"modal-md px-4 md:p-0"}
    titleFontWeight={"typo-font-bold"}
    modalWrap={"md:p-0 overflow-hidden rounded-xl"}
    modalHead={"px-10 pt-8"}
    modalPadding={"p-0"}
    content={
        <>
            <div className="flex items-center flex-wrap md:flex-nowrap pt-8 px-10 sm:pb-14 pb-8 ">
                <div className="sm:w-7/12 w-full sm:pr-3">
                    <div className="text-gray-5 flex items-baseline mb-5">
                        <span className="mr-4">
                            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0.666748" y="0.833252" width="10.6667" height="13.3333" rx="1" stroke="#747578" stroke-width="1.25" />
                                <line x1="3.9585" y1="4.20825" x2="8.04183" y2="4.20825" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="3.9585" y1="6.875" x2="8.04183" y2="6.875" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                <line x1="3.9585" y1="9.5415" x2="6.7085" y2="9.5415" stroke="#747578" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <div><span className="text-gray-7 typo-font-bold">3 billion+ articles.</span> Birth, marriage, death, and more.</div>
                    </div>
                    <div className="text-gray-5 flex items-baseline mb-5">
                        <span className="mr-4">
                            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.40508 5.16675H6.60498" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.60498 3.30005H9.40508" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.2668 7.03345V14.5004" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.73315 14.5004V7.03345" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.59985 7.03345V14.5004" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.40015 7.03345V14.5004" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.88143 2.74568C3.11247 2.54885 3.4111 2.44975 3.71399 2.4694C3.90612 2.48135 4.09401 2.53111 4.26688 2.61582C4.43974 2.70053 4.59419 2.81853 4.72137 2.96304C4.84854 3.10756 4.94594 3.27576 5.00799 3.45799C5.07003 3.64023 5.09549 3.83291 5.08292 4.02501C5.06733 4.26458 5.0047 4.49872 4.89859 4.71407C4.79248 4.92943 4.64499 5.12176 4.46452 5.28009C4.28406 5.43842 4.07417 5.55964 3.84685 5.63683C3.61952 5.71402 3.37922 5.74567 3.13966 5.72996C2.84008 5.71095 2.54718 5.63309 2.27771 5.50082C2.00825 5.36854 1.76749 5.18446 1.56922 4.95908C1.37094 4.7337 1.21903 4.47145 1.12217 4.18732C1.02532 3.9032 0.985412 3.60277 1.00474 3.30321V3.3001C1.00474 2.55746 1.29975 1.84525 1.82487 1.32013C2.34999 0.795009 3.0622 0.5 3.80483 0.5H12.1952C12.9378 0.5 13.65 0.795009 14.1751 1.32013C14.7002 1.84525 14.9953 2.55746 14.9953 3.3001V3.30383C15.0146 3.60339 14.9747 3.90382 14.8778 4.18794C14.781 4.47207 14.6291 4.73432 14.4308 4.9597C14.2325 5.18508 13.9918 5.36917 13.7223 5.50144C13.4528 5.63371 13.1599 5.71158 12.8603 5.73058C12.6207 5.74594 12.3804 5.71391 12.1531 5.63633C11.9258 5.55876 11.7161 5.43715 11.5358 5.27846C11.3556 5.11977 11.2084 4.92712 11.1026 4.71151C10.9969 4.4959 10.9347 4.26156 10.9196 4.0219C10.9074 3.83005 10.9332 3.6377 10.9954 3.45582C11.0577 3.27395 11.1551 3.10612 11.2823 2.96194C11.4094 2.81776 11.5637 2.70005 11.7364 2.61553C11.909 2.53102 12.0966 2.48136 12.2885 2.4694C12.4419 2.4594 12.5957 2.47982 12.7411 2.52947C12.8866 2.57913 13.0208 2.65705 13.136 2.75874" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <div><span className="text-gray-7 typo-font-bold">400+ years of history.</span> Find stories from 1607 to today.</div>
                    </div>
                    <div className="text-gray-5 flex items-baseline mb-5">
                        <span className="mr-4">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" transform="translate(0 0.5)" fill="white" />
                                <path d="M3.38969 15.0889C3.12717 15.3514 2.77111 15.4989 2.39984 15.4989C2.02858 15.4989 1.67253 15.3514 1.41 15.0889C1.14748 14.8264 1 14.4703 1 14.099C1 13.7278 1.14748 13.3717 1.41 13.1092L5.36937 9.15234L7.34904 11.132L3.38969 15.0889Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.9671 4.49878L6.3584 10.1074" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.3499 4.4689C13.1749 4.64389 12.9375 4.74216 12.69 4.7421C12.4424 4.74204 12.205 4.64366 12.03 4.46859C11.8551 4.29351 11.7568 4.05611 11.7568 3.80858C11.7569 3.56105 11.8553 3.32368 12.0304 3.1487L13.6803 1.5L14.9999 2.81896L13.3499 4.4689Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.90419 6.08649L5.47948 4.65866C5.64532 4.2364 5.68438 3.77494 5.59189 3.33081C5.49939 2.88668 5.27936 2.47918 4.95874 2.15824C4.5834 1.78554 4.09138 1.55316 3.56513 1.5C3.78851 1.857 3.88428 2.27918 3.83682 2.69762C3.78935 3.11607 3.60144 3.50607 3.30377 3.80396C3.00609 4.10185 2.61623 4.29004 2.19782 4.33781C1.77941 4.38558 1.35716 4.29011 1 4.06699C1.03715 4.42244 1.15609 4.76447 1.34751 5.06629C1.53892 5.36809 1.79762 5.62148 2.10333 5.8066C2.40904 5.99173 2.75345 6.10356 3.10961 6.13333C3.46575 6.16311 3.82396 6.11003 4.15617 5.97823L5.13668 6.95874" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.38647 11.2105L10.4908 12.3142C10.295 12.8132 10.277 13.3644 10.4398 13.875C10.6026 14.3857 10.9363 14.8248 11.3847 15.1184C11.8332 15.412 12.369 15.5422 12.9022 15.4872C13.4354 15.4321 13.9333 15.1952 14.3124 14.8162C14.6914 14.4372 14.9283 13.9392 14.9834 13.406C15.0384 12.8728 14.9082 12.337 14.6146 11.8885C14.321 11.4401 13.8819 11.1064 13.3712 10.9436C12.8605 10.7808 12.3093 10.7989 11.8104 10.9946L10.2482 9.43237" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12.6612 13.398C12.5324 13.398 12.428 13.2936 12.428 13.1647C12.428 13.0359 12.5324 12.9314 12.6612 12.9314" stroke="#747578" />
                                <path d="M12.6611 13.398C12.79 13.398 12.8945 13.2935 12.8945 13.1647C12.8945 13.0359 12.79 12.9314 12.6611 12.9314" stroke="#747578" />
                            </svg>
                        </span>
                        <div><span className="text-gray-7 typo-font-bold">Powerful tools.</span> Access our easy-to-use tools for clipping and storing newspaper content.</div>
                    </div>
                    <div className="text-gray-5 flex items-baseline">
                        <span className="mr-4">
                            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" transform="translate(0 0.5)" fill="white" />
                                <path d="M8 15.5C11.866 15.5 15 12.366 15 8.5C15 4.63401 11.866 1.5 8 1.5C4.13401 1.5 1 4.63401 1 8.5C1 12.366 4.13401 15.5 8 15.5Z" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M3.64441 13.9757L4.26663 10.8334H4.93863C5.08054 10.8339 5.22065 10.8016 5.34802 10.739C5.47538 10.6764 5.58655 10.5852 5.67285 10.4725C5.76174 10.3625 5.82331 10.2329 5.85251 10.0945C5.88171 9.95607 5.87772 9.81269 5.84085 9.6761L5.37418 7.80943C5.32528 7.60707 5.20969 7.42705 5.04603 7.29838C4.88236 7.16971 4.68015 7.09986 4.47196 7.1001H1.15552" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M13.6001 4.30005H11.0614C10.8532 4.29981 10.651 4.36966 10.4873 4.49833C10.3237 4.627 10.2081 4.80702 10.1592 5.00938L9.69251 6.87605C9.65649 7.01312 9.6535 7.15678 9.68378 7.29524C9.71407 7.43369 9.77677 7.56298 9.86673 7.67249C9.95303 7.78516 10.0642 7.87635 10.1916 7.93895C10.3189 8.00155 10.459 8.03387 10.6009 8.03338H11.5841L12.0694 10.9889C12.1058 11.2044 12.2167 11.4003 12.3827 11.5424C12.5487 11.6846 12.7593 11.7639 12.9778 11.7667H14.2223" stroke="#747578" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                        <div><span className="text-gray-7 typo-font-bold">Global content.</span> Articles from 47 countries and all 50 US states.</div>
                    </div>
                </div>
                <div className="sm:w-5/12 w-full md:ml-3 hidden sm:block">
                    <img src={ Banner } className="rounded-xl h-70 object-cover" />
                </div>
            </div>
            <div className="md:flex items-center justify-between bg-gray-2 px-10 md:py-5 py-4">
                <div className="mb-3 md:mb-0">
                    <div className="text-sm typo-font-medium text-gray-6">Starting at</div>
                    <div className="text-2xl typo-font-bold"><sup className="text-gray-6 text-xs mr-1">$</sup>12.49<span className="text-gray-6 text-xs ml-1">/mo</span></div>
                </div>
                <div>
                    <Button
                        size="large"
                        handleClick={()=>history.push('/payment/bundle')}
                        title="Get Storied Ultimate"
                        class="btn btn-primary btn-large w-full md:w-auto flex justify-center"
                        fontWeight="medium"
                    />
                </div>
            </div>
        </>
    }
    showModal={openUpgradeModal}
    setShowModal={setOpenUpgradeModal}
/>
}
export default PaymentModal