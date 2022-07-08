import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tr } from "../../../components/utils";
import {
    getNewspapperDefaultValue,
    numToLocaleString,
    capitalFirst
} from "../../../utils";
import { useTranslation } from "react-i18next";
import className from "classnames";
import Typography from "../../../components/Typography";
import Button from "../../../components/Button";
import TailwindModal from "../../../components/TailwindModal";
import NewspaperForm from "./NewspaperForm"
import "./index.css";
import { getCountries, getStates, getCities, getPublication, getDatesRanges } from "../../../redux/actions/location";
import { publicationsandnewspapercount, publicationYears, publicationYearsMonth, publicationYearsMonthDate } from "../../../redux/actions/browseLocation";
import { useLocation, Link, useHistory, useParams } from "react-router-dom";
import Skeleton from "../../../components/Skeleton";
import Loader from "../../../components/Loader";
import CalenderHtml from "./NewspaperBrowse/CalenderHtml";
import BreadCrumb from "./NewspaperBrowse/BreadCrumb";
const getBold = (screenMobile) => {
    return screenMobile ? { weight: "bold" } : {}
}
const getMedium = (screenMobile) => {
    return screenMobile ? { weight: "medium" } : {}
}
const getName = (name) => {
    if (!name) {
        return ""
    }
    const _name = name.split('-')
    const nameArr = _name.map((_name1) => {
        return capitalFirst(_name1)
    })
    return nameArr.join(" ")
}
const getFilterObj = (cu, st, ci, pu) => {
    let obj = {}
    if (cu) {
        obj.CountryId = cu
    }
    if (st) {
        obj.StateId = st
    }
    if (ci) {
        obj.CityId = ci
    }
    if (pu) {
        obj.PublicationId = pu
    }
    return obj
}
const getFilterObjName = (countryName, stateName, cityName, publicationName) => {
    let obj = {
        CountryName: "",
        StateName: "",
        CityName: "",
        PublicationName: ""
    }
    if (countryName) {
        obj.CountryName = countryName
    }
    if (stateName) {
        obj.StateName = stateName
    }
    if (cityName) {
        obj.CityName = cityName
    }
    if (publicationName) {
        obj.PublicationName = publicationName
    }
    return obj
}
const getRedirectLink = (cu, st, ci, pu, history) => {
    let _url = `/search/location`
    if (pu) {
        _url = `/search/location/${cu}/${st}/${ci}`
    } else if (ci) {
        _url = `/search/location/${cu}/${st}`
    } else if (st) {
        _url = `/search/location/${cu}`
    }
    return history.push(_url)
}
const getAnotherParams = (cu, st, ci, pu) => {
    return {
        cu: cu || "",
        st: st || "",
        ci: ci || "",
        pu: pu || ""
    }
}
const NewspaperDetails = () => {
    const {
        countryName: _countryName,
        stateName: _stateName,
        cityName: _cityName,
        publicationName: _publicationName } = useParams()
    const [openTab, setOpenTab] = useState(1);
    const [openRightSide, setOpenRightSide] = useState(true);
    const [openNewspaperModal, setNewspaperModalFn] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const getQueryParams = new URLSearchParams(location.search);
    const allCountry = getQueryParams.get("allCountry");
    const defaultLocationId = {
        cu: null,
        st: null,
        ci: null,
        pu: null
    }
    const [screenMobile, setScreenMobile] = useState(window.innerWidth <= 767)
    const [locationId, setLocationId] = useState(defaultLocationId)
    const { cu, st, ci, pu } = locationId
    const countryName = getName(_countryName)
    const stateName = getName(_stateName)
    const cityName = getName(_cityName)
    const publicationName = getName(_publicationName)
    const queryParams = useMemo(() => {
        let _query = {}
        getQueryParams.forEach((value, key) => {
            _query[key] = value
        })

        return _query
    }, [location.search])
    const defaultValues = { ...getNewspapperDefaultValue(), ...queryParams, ...getAnotherParams(cu, st, ci, pu) };
    const [valuesForm, setValues] = useState(defaultValues)
    const {
        countyLoading,
        counties
    } = useSelector((state) => state.location)
    const {
        stateLoading,
        cityLoadig,
        yearLoading,
        publicationLoading,
        newsPaperLoading,
        states,
        city,
        publication,
        minYear,
        maxYear,
        publicationCount,
        newsPaperCount,
        years,
        cYear,
        cMonth
    } = useSelector((state) => state.browseLocation);
    const { t } = useTranslation();
    const level = useMemo(() => {
        let _level = 1
        if (publicationName) {
            _level = 5
        } else if (cityName) {
            _level = 4
        } else if (stateName) {
            _level = 3
        } else if (countryName) {
            _level = 2
        }
        return _level
    }, [countryName, stateName, cityName, publicationName])
    const setNewspaperModal = (bool, valuesObj = {}) => {
        if (bool) {
            setValues({ ...defaultValues, ...valuesObj })
        }
        setNewspaperModalFn(bool)
    }
    useEffect(() => {
        dispatch(getCountries())
    }, [])
    useEffect(() => {
        cu && dispatch(getStates(cu, true, false, true))
    }, [cu])
    useEffect(() => {
        st && dispatch(getCities(st, true, true))
    }, [st])
    useEffect(() => {
        ci && dispatch(getPublication(ci, st, true, true))
    }, [ci, st])
    useEffect(() => {
        if (pu) {
            dispatch(publicationYears(pu)).then((data) => {
                if (data?.[0]) {
                    dispatch(publicationYearsMonth(pu, data[0])).then((data1) => {
                        if (data1?.[0]) {
                            const month = `${data1[0]}`.padStart(2, '0');
                            dispatch(publicationYearsMonthDate(pu, data[0], month));
                        }
                    })
                }
            })
        }
    }, [pu])
    const handleResize = () => {
        setScreenMobile(window.innerWidth <= 767)
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize, true);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [
    ]);
    useEffect(() => {
        const obj = getFilterObjName(_countryName, _stateName, _cityName, _publicationName)
        dispatch(publicationsandnewspapercount(obj)).then((data) => {
            const resObj = {
                cu: data.countryId || "",
                st: data.stateId || "",
                ci: data.cityId || "",
                pu: data.publicationId || ""
            }
            setLocationId(resObj)
        })
    }, [_countryName, _stateName, _cityName, _publicationName])
    useEffect(() => {
        let countryLength = counties.length
        let stateLength = countryLength && states.length
        let cityLength = stateLength && city.length
        let publicationLength = cityLength && publication.length
        if ((_publicationName && publicationLength) ||
            (_cityName && cityLength) ||
            (_stateName && stateLength) ||
            (_countryName && countryLength)) {
            const _obj = getFilterObj(cu, st, ci, pu)
            dispatch(getDatesRanges(_obj, true))
        }
    }, [_countryName, _stateName, _cityName, _publicationName, counties, states, city, publication])
    const loading = (_class) => {
        return <span className={className(`tw-list-item rounded-full flex items-center w-full p-1.5 ${_class}`)}>
            <Skeleton />
        </span>
    }
    const unsetValue = (name, obj) => {
        if (obj[name]) {
            delete obj[name]
        }
        return obj
    }
    const getCountryLink = (name) => {
        let _queryParams = { ...queryParams }
        _queryParams = unsetValue('allCountry', _queryParams)
        let params = new URLSearchParams("");
        Object.entries(_queryParams).forEach((_param) => {
            params.append(_param[0], _param[1])
        })
        let url = `/${name.toLowerCase().replace(/\s+/g, '-')}`
        if (params.toString()) {
            url = `${url}?${params.toString()}`
        }
        return url
    }
    const getStateLink = (name) => {
        let _queryParams = { ...queryParams }
        _queryParams = unsetValue('allCountry', _queryParams)
        let params = new URLSearchParams("");
        Object.entries(_queryParams).forEach((_param) => {
            params.append(_param[0], _param[1])
        })
        let url = `/${_countryName}/${name.toLowerCase().replace(/\s+/g, '-')}`
        if (params.toString()) {
            url = `${url}?${params.toString()}`
        }
        return url
    }
    const getCityLink = (name) => {
        let _queryParams = { ...queryParams }
        _queryParams = unsetValue('allCountry', _queryParams)
        let params = new URLSearchParams("");
        Object.entries(_queryParams).forEach((_param) => {
            params.append(_param[0], _param[1])
        })
        let url = `/${_countryName}/${_stateName}/${name.toLowerCase().replace(/\s+/g, '-')}`
        if (params.toString()) {
            url = `${url}?${params.toString()}`
        }
        return url
    }
    const getPublicationLink = (name) => {
        let _queryParams = { ...queryParams }
        _queryParams = unsetValue('pu', _queryParams)
        _queryParams = unsetValue('allCountry', _queryParams)
        let params = new URLSearchParams("");
        Object.entries(_queryParams).forEach((_param) => {
            params.append(_param[0], _param[1])
        })
        let url = `/${_countryName}/${_stateName}/${_cityName}/${name.toLowerCase().replace(/\s+/g, '-')}`
        if (params.toString()) {
            url = `${url}?${params.toString()}`
        }
        return url
    }
    const getAllCountryLink = () => {
        let _queryParams = { ...queryParams }
        let params = new URLSearchParams("");
        Object.entries(_queryParams).forEach((_param) => {
            params.append(_param[0], _param[1])
        })
        let url = ``;
        return `${url}?${params.toString()}`
    }
    const getButtonORLink = (name, link, _class, bool) => {
        return bool ? <>
            <div className="flex flex-wrap items-center relative ">
                <button className={className(`tw-list-item rounded-full md:flex inline-flex items-center md:w-full p-1.5 text-left active-tab ${_class}`)}>
                    <span className="mr-1.5 LinkIco" onClick={() => {
                        if (window.innerWidth <= 767) {
                            getRedirectLink(_countryName, _stateName, _cityName, _publicationName, history)
                        }
                    }}>
                        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.125 1.21146L4.14722 4.18896C4.1279 4.20831 4.10495 4.22366 4.07969 4.23413C4.05443 4.24461 4.02735 4.25 4 4.25C3.97265 4.25 3.94557 4.24461 3.92031 4.23413C3.89505 4.22366 3.8721 4.20831 3.85278 4.18896L0.875 1.21146" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </span>
                    <Typography
                        size={14}
                        text="secondary"
                        {...getBold(screenMobile)}
                    >
                        {name}
                    </Typography>
                </button>
                <div className="absolute right-5 md:hidden block">
                    <Button
                        handleClick={() => setOpenRightSide(true)}
                        size="large"
                        title="View"
                        fontWeight="medium"
                    />
                </div>
            </div>
        </>
            : <Link to={`/search/location${link}`} className={className(`tw-list-item rounded-full text-left flex items-center w-full p-1.5 ${_class}`)}>
                <span className="mr-1.5 LinkIco">
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.125 1.21146L4.14722 4.18896C4.1279 4.20831 4.10495 4.22366 4.07969 4.23413C4.05443 4.24461 4.02735 4.25 4 4.25C3.97265 4.25 3.94557 4.24461 3.92031 4.23413C3.89505 4.22366 3.8721 4.20831 3.85278 4.18896L0.875 1.21146" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <Typography
                    size={14}
                    text="secondary"
                    {...getBold(screenMobile)}
                >
                    {name}
                </Typography>
            </Link>
    }
    const getCountriesHtml = useMemo(() => {
        if (countyLoading) return loading("pl-4 countryHead")
        if (!counties.length) return null
        if (level >= 2 && !allCountry) {
            return getButtonORLink(countryName, getCountryLink(countryName), "pl-4 countryHead", level === 2)
        } else {
            let specialCountry = []
            let otherCountry = []
            counties.forEach((_country) => {
                const tempCountryName = (_country.id === 7) ? "United States" : _country.name
                if ([7, 41, 2, 6].includes(_country.id)) {
                    specialCountry.push(
                        <Link to={`/search/location${getCountryLink(tempCountryName)}`} key={_country.id} className="tw-list-item rounded-full flex items-center w-full p-1.5 text-left pl-6">
                            <Typography
                                size={14}
                                text="secondary"
                                {...getMedium(screenMobile)}
                            >
                                {tempCountryName}
                            </Typography>
                        </Link>
                    )
                } else {
                    otherCountry.push(<Link to={`/search/location${getCountryLink(_country.name)}`} key={`country-${_country.id}`} className="tw-list-item rounded-full flex items-center w-full md:px-1.5 md:py-1.5 py-4 px-6 text-left md:pl-4 countryHead">
                        <Typography
                            size={14}
                            text="secondary"
                            {...getMedium(screenMobile)}
                        >
                            {_country.name}
                        </Typography>
                    </Link>)
                }
            })
            return <>
                <div className="rounded-full flex items-center w-full p-1.5 text-left md:pl-4 pl-6">
                    <span className="text-gray-5 uppercase text-vs">Suggested Countries</span>
                </div>
                {specialCountry}
                <div className="rounded-full flex items-center w-full mt-3 text-left md:pl-4 pl-6">
                    <span className="text-gray-5 uppercase text-vs">All Countries</span>
                </div>
                {otherCountry}
            </>

        }
    }, [level, counties, countryName, countyLoading, allCountry, screenMobile])
    const getStatesHtml = useMemo(() => {
        if (stateLoading) return loading("pl-6 cityState")
        if (allCountry || level < 2) {
            return null
        }
        if (level >= 3) {
            return getButtonORLink(stateName, getStateLink(stateName), "pl-6 cityState", level === 3)
        } else {
            return states.map((_state) => <Link to={`/search/location${getStateLink(_state.name)}`} key={`state-${_state.id}`} className="tw-list-item rounded-full flex items-center w-full p-1.5 text-left md:pl-10 pl-10  cityState">
                <Typography
                    size={14}
                    text="secondary"
                    {...getMedium(screenMobile)}
                >
                    {_state.name}
                </Typography>
            </Link>);
        }
    }, [level, states, stateName, countryName, stateLoading, allCountry, screenMobile])
    const getCityHtml = useMemo(() => {
        if (cityLoadig && st) return loading("pl-10 cityHead")
        if (!city.length || allCountry || level < 3) {
            return null
        }
        if (level >= 4) {
            return getButtonORLink(cityName, getCityLink(cityName), "pl-10 cityHead", level === 4)
        } else {
            return city.map((_city) => <Link to={`/search/location${getCityLink(_city.name)}`} key={`cu-${_city.id}`} className="tw-list-item rounded-full flex items-center w-full p-1.5 text-left md:pl-12 pl-10 cityHead">
                <Typography
                    size={14}
                    text="secondary"
                    {...getMedium(screenMobile)}
                >
                    {_city.name}
                </Typography>
            </Link>);
        }
    }, [level, city, ci, st, cu, cityLoadig, stateLoading, allCountry, screenMobile])
    const calenderHtml = () => {
        if (yearLoading || !(cYear && cMonth)) {
            return <Loader />
        } else {
            return <CalenderHtml pu={pu} publicationName={publicationName} />
        }
    }
    const getPublicationHtml = useMemo(() => {
        if (publicationLoading && ci) return loading("pl-14 cityHead")
        if (level >= 4 && !allCountry) {
            return publication.map((_publication) => {
                return <Link onClick={() =>
                    window.innerWidth <= 767 && setOpenRightSide(true)
                } to={`/search/location${getPublicationLink(_publication.name)}`} key={`pu-${_publication.id}`} className={className("tw-list-item rounded-full flex items-center w-full p-1.5 text-left md:pl-16 pl-10 cityHead", { "active-tab": level === 5 && pu === _publication.id && !getQueryParams.get('allCountry') })}>
                    <Typography
                        size={14}
                        text="secondary"
                        {...getMedium(screenMobile)}
                    >
                        {_publication.name}
                    </Typography>
                </Link>
            })
        }
    }, [level, publication, pu, ci, st, cu, allCountry, screenMobile])
    const allCountryText = (fun) => <>
        <span className="mr-1.5 LinkIco">
            <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.125 1.21146L4.14722 4.18896C4.1279 4.20831 4.10495 4.22366 4.07969 4.23413C4.05443 4.24461 4.02735 4.25 4 4.25C3.97265 4.25 3.94557 4.24461 3.92031 4.23413C3.89505 4.22366 3.8721 4.20831 3.85278 4.18896L0.875 1.21146" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
        <Typography
            size={14}
            text="secondary"
            {...fun(screenMobile)}
        >
            All Countries
        </Typography>
    </>
    const getAllCounryHtml = !_countryName ? <button className={className("tw-list-item rounded-full flex items-center justify-start w-full md:px-1.5 md:py-1.5 px-6 py-3  countryTitle active-tab")}>
        {allCountryText(getBold)}
        <div className="absolute right-5 md:hidden block">
            <Button
                handleClick={() => setOpenRightSide(true)}
                size="large"
                title="View"
                fontWeight="medium"
            />
        </div>
    </button> : <Link to={`/search/location${getAllCountryLink()}`} className={className("tw-list-item rounded-full flex items-center justify-start w-full p-1.5 countryTitle")}>
        {allCountryText(getMedium)}
    </Link>
    const getLevelName = () => {
        switch (level) {
            case 5: return publicationName;
            case 4: return cityName;
            case 3: return stateName;
            case 2: return countryName;
            case 1: return "All Countries";
        }
    }
    const newspaperForm = useMemo(() => {
        if (level === 5) {
            return <>
                <div className="flex lg:flex-row flex-col-reverse">
                    <div className="w-full bg-white py-10 md:py-8 px-4 md:rounded-xl md:shadow-lg mb-4 md:hidden block">
                        <div className="flex flex-wrap">
                            <div className="w-full">
                                <ul
                                    className="flex mb-0 list-none flex-wrap mb-8"
                                    role="tablist"
                                >
                                    <li>
                                        <span
                                            className={
                                                "text-md cursor-pointer md:py-1.5 py-2.5 px-3 typo-font-bold " +
                                                (openTab === 1
                                                    ? "text-black border-b-3 border-red"
                                                    : "text-gray-6")
                                            }
                                            onClick={e => {
                                                e.preventDefault();
                                                setOpenTab(1);
                                            }}
                                            data-toggle="tab"
                                            role="tablist"
                                        >
                                            Search
                                        </span>
                                    </li>
                                    <li>
                                        <span
                                            className={
                                                "text-md cursor-pointer md:py-1.5 py-2.5 px-3 typo-font-bold " +
                                                (openTab === 2
                                                    ? "text-black border-b-3 border-red"
                                                    : "text-gray-6")
                                            }
                                            onClick={e => {
                                                e.preventDefault();
                                                setOpenTab(2);
                                            }}
                                            data-toggle="tab"
                                            role="tablist"
                                        >
                                            Browse by Date
                                        </span>
                                    </li>
                                </ul>
                                <div className="tab-content tab-space">
                                    <div className={openTab === 1 ? "block" : "hidden"}>
                                        <div className="mb-4">
                                            <Typography
                                                size={14}
                                                text="secondary"
                                                weight="bold"
                                            >
                                                Advanced Search
                                            </Typography>
                                        </div>
                                        <NewspaperForm
                                            title={"Search"}
                                            defaultValues={{ ...defaultValues }}
                                            WWIIIClear={true}
                                            buttonTitle={tr(t, "search.ww1.form.btn.search")}
                                        />
                                    </div>
                                    <div className={openTab === 2 ? "block" : "hidden"}>
                                        <div className="mb-4">
                                            <Typography
                                                size={14}
                                                text="secondary"
                                                weight="bold"
                                            >
                                                Browse by Date
                                            </Typography>
                                        </div>
                                        {calenderHtml()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-8/12 bg-white py-10 md:py-8 px-4 md:rounded-xl md:shadow-lg mb-4 md:block hidden">
                        <NewspaperForm
                            title={"Search"}
                            defaultValues={{ ...defaultValues }}
                            WWIIIClear={true}
                            buttonTitle={tr(t, "search.ww1.form.btn.search")}
                        />
                    </div>
                    <div className="lg:w-4/12 md:block hidden">
                        <div className="grid md:gap-x-6 gap-x-2 sm:grid-cols-2 lg:block lg:pl-6">
                            <div className="bg-white py-4 md:py-8 px-4 md:rounded-xl md:shadow-lg md:mb-4 mb-2">
                                <div className="mb-4">
                                    <Typography
                                        size={14}
                                        text="secondary"
                                        weight="bold"
                                    >
                                        Browse by Date
                                    </Typography>
                                </div>
                                {calenderHtml()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        } else {
            return <div className="bg-white py-10 md:py-4 px-6 md:rounded-xl md:shadow-lg mb-4">
                <NewspaperForm
                    title={"Search"}
                    defaultValues={{ ...defaultValues }}
                    WWIIIClear={true}
                    buttonTitle={tr(t, "search.ww1.form.btn.search")}
                />
            </div>

        }
    }, [openTab, level, cYear, cMonth, years, cu, st, ci, pu, level])
    return (
        <>
            <div className="main-wrapper mx-auto bg-gray-2 md:bg-transparent pl-0 md:pr-6 pr-0">
                <div className="md:flex justify-center">
                    <div className={className("largeDesktop:w-2/12 xl:w-3/12 md:w-3/12 w-full md:mr-2  md:block", { "hidden": openRightSide })}>
                        <div className="lg:max-w-vxs md:max-w-45 w-full md:h-screen md:pb-10 md:fixed top-14 left-0 block bg-white dd-content overflow-visible z-40 md:shadow py-6 px-1">
                            <div className="px-3 md:mb-4 mb-2">
                            </div>
                            <div className="tw-sidebar-list-items CountrySidebar overflow-y-auto h-full md:pb-20">
                                {getAllCounryHtml}
                                {getCountriesHtml}
                                {getStatesHtml}
                                {getCityHtml}
                                {getPublicationHtml}
                            </div>
                        </div>
                    </div>
                    <div className={className("largeDesktop:w-10/12 xl:w-9/12 md:w-9/12 md:ml-2  md:block", { "hidden": !openRightSide })}>
                        <div className="mtop-header md:hidden flex items-center z-1000 sticky top-0 h-16 bg-white px-4 -mt-12">
                            <div className="icon-menu">
                                <div id="&quot;icon-&quot; + crypt" className="icon icon-medium icon-bgColor " onClick={() => setOpenRightSide(false)}>
                                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.5 8L1.5 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={`w-full ${level === 5 ? "max-w-full" : "max-w-cus-card desktop:mx-auto"}`}>
                            <BreadCrumb {...{
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
                            }} />
                            <div className="SearchTitle bg-white py-4 px-6 md:rounded-xl md:shadow-lg md:mb-4 mb-2">
                                <div className="mb-1">
                                    <h3 className="typo-font-bold text-8 lg:inline leading-10 md-2.5 mb-1 lg:mr-2.5">{getLevelName() ? getLevelName() : <><Skeleton width={160} height={36} /></>}</h3>
                                    <Typography size={24}>
                                        {minYear ? <>({minYear}-</> : <><Skeleton width={30} height={18} /></>}{maxYear ? <>{maxYear})</> : <><Skeleton width={30} height={18} /></>}
                                    </Typography>
                                </div>
                                <div className="pubNumber text-gray-6 text-sm">
                                    <span className="pubCount relative pr-2 mr-1 inline-flex items-center">{publicationCount ? <>{numToLocaleString(publicationCount)} Publication</> : <><Skeleton width={30} height={18} /></>} </span><span className="inline-flex items-center">{newsPaperCount ? <>{numToLocaleString(newsPaperCount)} Pages</> : <><Skeleton width={30} height={18} /></>} </span>
                                </div>
                            </div>
                            {(countyLoading || stateLoading || cityLoadig || publicationLoading || newsPaperLoading) ? <Loader /> : newspaperForm}
                        </div>
                    </div>

                    <TailwindModal
                        title="Advanced Search"
                        showClose={true}
                        innerClasses={"max-w-src-modal-w"}
                        titleFontWeight={"typo-font-medium"}
                        modalWrap={"md:p-10 p-6"}
                        modalHead={"pb-3.5"}
                        modalPadding={"p-0"}
                        content={
                            <NewspaperForm
                                title={"Search"}
                                defaultValues={{ ...valuesForm }}
                                WWIIIClear={true}
                                buttonTitle={tr(t, "search.ww1.form.btn.search")}
                            />
                        }
                        showModal={openNewspaperModal}
                        setShowModal={setNewspaperModal}
                    />

                </div>
            </div>
        </>
    );
};

export default NewspaperDetails;
