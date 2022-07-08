import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Loader from "../../components/Loader";
import { useFeatureFlag } from "../../services/featureFlag";
import "./index.css";
import NewspaperDetails from "./Newspaper/NewspaperDetails"
const NewspapperSearchBrowse = () => {
    const { enabled: browseLocationPublicationFlag, flagLoading } = useFeatureFlag('BrowseLocationPublication');
    const history = useHistory()
    useEffect(() => {
        if (!flagLoading && !browseLocationPublicationFlag) {
            return history.replace("/search/newspapers")
        }
    }, [browseLocationPublicationFlag, flagLoading])
    if (flagLoading || !browseLocationPublicationFlag) return <Loader />
    return (
        <>
            <div className="main-container bg-white md:bg-gray-2">
                <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
                    <NewspaperDetails />
                </div>
            </div>
        </>
    );
};

export default NewspapperSearchBrowse;
