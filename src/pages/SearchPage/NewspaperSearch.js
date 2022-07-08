import React, { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { tr } from "../../components/utils";
import "./index.css";
import {
    getNewspapperDefaultValue
} from "../../utils";
import { useTranslation } from "react-i18next";
import HistoricalNewspapers from "./HistoricalNewspapers";
import NewspaperForm from "./Newspaper/NewspaperForm"
import Banner from "../../assets/images/newspaper-premium.jpg";
import { getCountries, getStates } from "../../redux/actions/location";
import NewspaperBrowse from "./Newspaper/NewspaperBrowse";
const NewspaperSearch = () => {
	const dispatch = useDispatch();
    const defaultValues = getNewspapperDefaultValue();
    const { countryRequest, stateRequest, countyLoading, stateLoading } = useSelector((state) => state.location)
    const { t } = useTranslation();
    useEffect(() => {
        !countryRequest && !countyLoading && dispatch(getCountries())
        !stateRequest && !stateLoading && dispatch(getStates(7, true, true))
    }, [dispatch, countryRequest, countyLoading, stateRequest, stateLoading]);
    return (
        <>
            <div className="main-container bg-white md:bg-gray-2">
                <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
                   <HistoricalNewspapers imageBackground={Banner} />
                    <div className="bg-white tw-search-form-card md:rounded-2xl py-5 px-4 md:p-10 md:shadow-search-modal md:mt-0 mb-6 max-w-src-modal-w w-full mx-auto relative sm:border-b border-gray-3">
                        <NewspaperForm
                            title={"Search"}
                            defaultValues={{...defaultValues, cu: 7}}
                            WWIIIClear={true}
                            buttonTitle={tr(t, "search.ww1.form.btn.search")}
                        />
                    </div>
                    <NewspaperBrowse />
                </div>
            </div>
        </>
    );
};

export default NewspaperSearch;
