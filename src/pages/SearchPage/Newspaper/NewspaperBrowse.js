import React, { useMemo, useState, useEffect } from "react";
import Typography from "../../../components/Typography";
import Loader from "./../../../components/Loader";
import { Link } from "react-router-dom";
import {  useSelector} from "react-redux";
import className from "classnames";
import "./index.css";
import { useFeatureFlag } from "../../../services/featureFlag";

const getScreen = () => {
    const windowWidth = window.innerWidth;
    let count;
    if( windowWidth > 674) {
        count = 5
    } else if( windowWidth >= 506) {
        count = 4
    } else if( windowWidth >= 386) {
        count = 3
    } else {
        count = 2
    }
    return count;
}
const getName = (name) => {
    return name?name.toLowerCase().replace(/\s+/g, '-'):""
}
const NewspaperBrowse = () => {
    const { enabled: browseLocationPublicationFlag, flagLoading } = useFeatureFlag('BrowseLocationPublication');
    const { countyLoading, stateInitialLoading, counties, statesInitial } = useSelector((state) => state.location)
    const [ totalRow, setTotalRow ] = useState(getScreen())
    const {usaCountry, sepecialCountryies, otherCountries} = useMemo(()=>{
        let countryObj = {
            usaCountry: {
            },
            sepecialCountryies: [],
            otherCountries:[]
        }
        if(counties.length > 0) {
            counties.forEach(_country => {
                if(_country.id === 7) {
                    countryObj.usaCountry = {..._country, name: "United States"}
                } else if( [41, 2, 6].includes(_country.id)) {
                    countryObj.sepecialCountryies.push(_country)
                } else {
                    countryObj.otherCountries.push(_country)
                }
            });
        }
        return countryObj
    },[counties])
    const calCulateRowColum = (items) => {
        let _items = []
        if(items.length) {
            const perCloum = Math.ceil(items.length/totalRow);
            let currentRow = 1
            let temp = []
            items.forEach((_state, index)=>{
                temp.push(_state)
                if(index === (perCloum * currentRow - 1) ||  index === items.length -1 ) {
                    _items.push(temp)
                    temp = []
                    currentRow++
                }
            })
        }
        return _items
    }
    const stateArray = useMemo(()=>{
        return calCulateRowColum(statesInitial)
    }, [statesInitial, totalRow])
    const otherCountriesArray = useMemo(()=>{
        return calCulateRowColum(otherCountries)
    }, [otherCountries, totalRow])
    const sepecialCountryiesArray = useMemo(()=>{
        if(getScreen() === 2 && sepecialCountryies.length === 3) {
            return [sepecialCountryies[0], sepecialCountryies[2], sepecialCountryies[1]]
        } else {
            return sepecialCountryies
        }
    }, [sepecialCountryies, totalRow])
    useEffect(() => {
        const handleResize = () => {
            const _totalRow = getScreen()
            if(_totalRow !== totalRow){
                setTotalRow(_totalRow)
            }
        }
        window.addEventListener("resize", handleResize, false);
        return (_) => {
          window.removeEventListener("resize", handleResize);
        };
    }, [totalRow]);
    
    if((countyLoading && stateInitialLoading) || flagLoading) {
        return <Loader />
    }
    if(!browseLocationPublicationFlag) return null;
    return (
        <>
            <div className="px-6 md:px-9 max-w-src-modal-w w-full mx-auto mb-10">
                <div className="flex mb-6">
                    <Typography
                        text="secondary"
                        weight="medium"
                    >
                        Browse Newspapers by Location
                    </Typography>
                </div>
                <div className="CountryListing mb-3">
                    <Link to={`/search/location/${getName(usaCountry.name)}`} className="flex items-center mb-3">
                        <span className="typo-font-medium text-sm text-blue-5">{usaCountry.name}</span>
                    </Link>
                    <div className="flex border-b-1 border-t-1 text-sm border-gray-3 pt-3">
                        {stateArray.map((_stateArray, key)=><ul key={key} className="text-blue-5 w-full max-w-xss mr-3">
                            {_stateArray.map((_state, index)=><li  key={index}  className=" mb-3">
                                <Link to={`/search/location/${getName(usaCountry.name)}/${getName(_state.name)}`}>{_state.name}</Link>
                            </li>)}
                        </ul>)}
                    </div>
                </div>
                <div className="CountryListing mb-3">
                    <div className="SpecialCountry grid mb-3">
                        {sepecialCountryiesArray.map((_special, index)=>{
                            return <Link to={`/search/location/${getName(_special.name)}`} key ={index} className={className("scItem typo-font-medium text-blue-5 text-sm  w-full", {"mr-3": index !== sepecialCountryies.length-1})}>{_special.name}</Link>
                        })}
                    </div>
                    <div className="flex border-b-1 border-t-1 border-gray-3 text-sm pt-3">
                        {otherCountriesArray.map((_countryArray, key)=><ul key={key} className="text-blue-5 typo-font-medium w-full max-w-xss mr-3">
                            {_countryArray.map((_country, index)=><li key={index} className=" mb-3"><Link to={`/search/location/${getName(_country.name)}`}>{_country.name}</Link></li>)}
                        </ul>)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewspaperBrowse;
