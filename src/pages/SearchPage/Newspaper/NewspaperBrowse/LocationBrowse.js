import React, { useRef } from "react";
import { useSelector } from "react-redux";
import Typeahead from "../../../../components/Typeahead";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import Typography from "./../../../../components/Typography"
import className from "classnames";

const location = "location"
const publication = "publication"
const LocationBrowse = () => {
    const value = useRef("")
    const {
        locations,
        locationLoading
    } = useSelector((state) => state.browseLocation);
    const handleChange = (_val) => {
        value.current = _val.place
    }
    const renderOption = (option) => {
        const matches = match(option.place, value.current);
        const parts = parse(option.place, matches);
        return <React.Fragment>
            <div className="flex flex-col w-full pb-1">
                <div>
                    {option.type === "publication" ? publication : location}
                    {parts.map((part, index) => (
                        <Typography size={16} text="secondary">
                            <span key={index} className={className('', { "typo-font-bold": part.highlight, "typo-font-regular": !part.highlight })}>
                                {part.text}
                            </span>
                        </Typography>
                    ))}
                </div>
            </div>
        </React.Fragment>
    }
    return <div className="flex mt-0 w-full relative">
        <Typeahead
            id={"browse-location"}
            options={locations}
            optionLoading={locationLoading}
            renderOption={renderOption}
            getOptionLabel={(option) => {
                return option.place || ""
            }}
            getOptionSelected={(option, _value) => {
                return option.place === _value.place
            }}
            handleChange={handleChange}
            placeholder={"Search"}
        />
    </div>
}
export default LocationBrowse;