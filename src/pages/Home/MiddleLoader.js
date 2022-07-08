import Skeleton from "./../../components/Skeleton";
import TellAStoryLoader from "./TellAStoryLoader";
import "./index.css";
const MiddleLoader = ({ width, isStory = false }) => {
    return <>
        <div className={`middle-cards-section flex flex-col flex-grow ${isStory ? 'card-padding' : ''}`}>
            <div className="w-full">
                {width > 512 && <TellAStoryLoader />}
                <div className={`bg-white card w-full content-loader-wrap ${isStory ? 'card-mb-0' : ''}`}>
                    <div className="card-content-wrap">
                        <div className="story-author-info py-4 px-6">
                            <div className="inline-flex items-center">
                                <div className="mr-2 card-avatar rounded-md overflow-hidden w-10 h-10 flex items-center justify-center avtar-square-large">
                                    <Skeleton variant="circular" width={40} height={40} />
                                </div>
                                <div className="flex-grow avtar-square-large-name">
                                    <div className="mb-1 main-title">
                                        <Skeleton variant="rectangular" width={127} height={14} />
                                    </div>
                                    <div className="mt-1">
                                        <Skeleton variant="rectangular" width={62} height={14} />
                                    </div>

                                </div>
                            </div>
                            <div className="story-card-persons-top mt-2">
                                <div className="tags break-words">
                                    <Skeleton variant="rectangular" width={296} height={14} />
                                </div>
                            </div>
                        </div>
                        <div className="story-media bg-gray-3 ">
                            <div className="w-full flex justify-center sth-image">
                                <Skeleton variant="rectangular" width="100%" height={427} />
                            </div>
                        </div>
                        <div className="story-detail-wrap pt-4 pb-8 px-6">
                            <div className="story-detail-container mb-5">
                                <div className="title mb-2">
                                    <Skeleton variant="rectangular" width={323} height={21} />
                                </div>
                                <div className="location-date mb-5">
                                    <Skeleton variant="rectangular" width={128} height={14} />
                                </div>
                                <div className="description mb-2">
                                    <div className="mb-2"><Skeleton variant="rectangular" width="100%" height={14} /></div>
                                    <div className="mb-2"><Skeleton variant="rectangular" width="100%" height={14} /></div>
                                    <div className="mb-2"><Skeleton variant="rectangular" width="96%" height={14} /></div>
                                </div>
                            </div>
                            <div className="flex feedcard-footer">
                                <div className="pt-0.5">
                                    <button>
                                        <svg className="without-stroke" width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.9999 20.844L2.4119 10.844C1.56923 10.002 1.01306 8.91605 0.822258 7.7402C0.631457 6.56434 0.815714 5.35825 1.3489 4.293V4.293C1.75095 3.48912 2.33827 2.79227 3.06244 2.25988C3.78662 1.72749 4.62694 1.37479 5.51415 1.23085C6.40137 1.0869 7.31009 1.15583 8.16544 1.43194C9.0208 1.70806 9.7983 2.18347 10.4339 2.819L11.9999 4.384L13.5659 2.819C14.2015 2.18347 14.979 1.70806 15.8343 1.43194C16.6897 1.15583 17.5984 1.0869 18.4856 1.23085C19.3729 1.37479 20.2132 1.72749 20.9374 2.25988C21.6615 2.79227 22.2488 3.48912 22.6509 4.293C23.1834 5.35784 23.3673 6.56321 23.1767 7.7384C22.9861 8.91359 22.4306 9.99903 21.5889 10.841L11.9999 20.844Z" stroke="#747578" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="ml-6">
                                    <button className="flex">
                                        <svg className="without-strokecomment" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.691 1.50001C10.946 1.4975 9.23202 1.9624 7.72708 2.84648C6.22213 3.73056 4.981 5.0016 4.1325 6.5277C3.28399 8.0538 2.85902 9.77935 2.90169 11.5253C2.94436 13.2712 3.45311 14.9739 4.37516 16.4567L1.5 22.5L7.53755 19.6225C8.82517 20.4237 10.2811 20.9148 11.7906 21.0569C13.3002 21.199 14.8221 20.9884 16.2364 20.4416C17.6508 19.8948 18.9189 19.0268 19.941 17.9059C20.963 16.7851 21.711 15.442 22.126 13.9825C22.541 12.523 22.6118 10.9871 22.3326 9.49558C22.0534 8.0041 21.432 6.59788 20.5173 5.3877C19.6026 4.17753 18.4195 3.19648 17.0614 2.52184C15.7033 1.8472 14.2072 1.4974 12.691 1.50001V1.50001Z" stroke="#747578" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>

}

export default MiddleLoader;